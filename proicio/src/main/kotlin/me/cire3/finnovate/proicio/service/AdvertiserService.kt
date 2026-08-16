package me.cire3.finnovate.proicio.service

import java.time.LocalDate
import java.time.format.TextStyle
import java.util.Locale
import java.util.UUID
import kotlin.random.Random
import me.cire3.finnovate.proicio.dto.AdvertiserOverviewResponse
import me.cire3.finnovate.proicio.dto.BudgetAllocationItemResponse
import me.cire3.finnovate.proicio.dto.BudgetDataResponse
import me.cire3.finnovate.proicio.dto.CampaignResponse
import me.cire3.finnovate.proicio.dto.CreateCampaignRequest
import me.cire3.finnovate.proicio.dto.CreativeResponse
import me.cire3.finnovate.proicio.dto.PacingDayResponse
import me.cire3.finnovate.proicio.dto.ReachItemResponse
import me.cire3.finnovate.proicio.dto.RecommendationItemResponse
import me.cire3.finnovate.proicio.dto.SpendPointResponse
import me.cire3.finnovate.proicio.dto.UpdateCampaignRequest
import me.cire3.finnovate.proicio.entity.Campaign
import me.cire3.finnovate.proicio.entity.CampaignStatus
import me.cire3.finnovate.proicio.entity.Pacing
import me.cire3.finnovate.proicio.entity.SpendStat
import me.cire3.finnovate.proicio.repository.CampaignRepository
import me.cire3.finnovate.proicio.repository.SpendStatRepository
import me.cire3.finnovate.proicio.repository.UserRepository
import me.cire3.finnovate.proicio.util.CategoryMapper
import me.cire3.finnovate.proicio.util.SyntheticSeries
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

private const val SPEND_HISTORY_DAYS = 30
private const val NAIVE_PREMIUM = 0.35

@Service
class AdvertiserService(
    private val userRepository: UserRepository,
    private val campaignRepository: CampaignRepository,
    private val spendStatRepository: SpendStatRepository,
) {
    @Transactional
    fun createCampaign(ownerId: UUID, request: CreateCampaignRequest): CampaignResponse {
        val owner = userRepository.findById(ownerId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "user not found") }

        if (!spendStatRepository.existsByOwnerId(ownerId)) {
            seedSpendHistory(owner.id)
        }

        val targetCpa = maxOf(3.0, Math.round(request.dailyCap / 8.0).toDouble())
        val campaign = campaignRepository.save(
            Campaign(
                owner = owner,
                name = request.name,
                category = request.category,
                budget = request.budget,
                dailyCap = request.dailyCap,
                pacing = Pacing.valueOf(request.pacing.uppercase()),
                bidStrategy = "Auto-bid, targeting \$${targetCpa.toInt()} CPA",
                targeting = CategoryMapper.relatedCategories(request.category).toMutableList(),
                creativeHeadline = request.creative.headline,
                creativeCta = request.creative.cta,
                creativeColor = randomAccentColor(),
            )
        )
        return campaign.toResponse()
    }

    fun listCampaigns(ownerId: UUID): List<CampaignResponse> =
        campaignRepository.findByOwnerId(ownerId).map { it.toResponse() }

    fun getCampaign(ownerId: UUID, campaignId: UUID): CampaignResponse =
        requireOwnedCampaign(ownerId, campaignId).toResponse()

    @Transactional
    fun updateCampaign(ownerId: UUID, campaignId: UUID, request: UpdateCampaignRequest): CampaignResponse {
        val campaign = requireOwnedCampaign(ownerId, campaignId)
        request.status?.let { campaign.status = CampaignStatus.valueOf(it.uppercase()) }
        request.budget?.let { campaign.budget = it }
        request.dailyCap?.let { campaign.dailyCap = it }
        return campaignRepository.save(campaign).toResponse()
    }

    fun getSpendHistory(ownerId: UUID): List<SpendPointResponse> =
        spendStatRepository.findByOwnerIdOrderByDateAsc(ownerId).map {
            SpendPointResponse(it.date.toString(), it.spend, it.spendNaive)
        }

    fun getOverview(ownerId: UUID): AdvertiserOverviewResponse {
        val campaigns = campaignRepository.findByOwnerId(ownerId)
        val totalSpend = campaigns.sumOf { it.spend }
        val conversions = campaigns.sumOf { it.conversions }
        val estSavings = campaigns.filter { it.status != CampaignStatus.ENDED }
            .sumOf { it.spend * NAIVE_PREMIUM }

        return AdvertiserOverviewResponse(
            totalSpend = totalSpend.round2(),
            conversions = conversions,
            costPerConversion = (if (conversions == 0) 0.0 else totalSpend / conversions).round2(),
            estSavings = estSavings.round2(),
            campaigns = campaigns.map { it.toResponse() },
        )
    }

    fun getBudgetData(ownerId: UUID): BudgetDataResponse {
        val campaigns = campaignRepository.findByOwnerId(ownerId)
        val spendStats = spendStatRepository.findByOwnerIdOrderByDateAsc(ownerId)

        val pacingByDay = spendStats.groupBy { it.date.dayOfWeek }
            .toSortedMap()
            .map { (dayOfWeek, stats) ->
                PacingDayResponse(
                    day = dayOfWeek.getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
                    even = stats.map { it.spend }.average().round2(),
                    naive = stats.map { it.spendNaive }.average().round2(),
                )
            }

        val reachTally = linkedMapOf<String, Int>()
        campaigns.filter { it.status != CampaignStatus.ENDED }.forEach { campaign ->
            campaign.targeting.forEach { category ->
                reachTally[category] = (reachTally[category] ?: 0) + campaign.conversions * 33 + 400
            }
        }
        val reachBreakdown = reachTally.entries.sortedByDescending { it.value }
            .take(5)
            .map { ReachItemResponse(it.key, it.value) }

        val budgetAllocation = campaigns.filter { it.status != CampaignStatus.ENDED }
            .map { BudgetAllocationItemResponse(it.name, it.budget, it.creativeColor) }

        return BudgetDataResponse(
            pacingByDay = pacingByDay,
            reachBreakdown = reachBreakdown,
            budgetAllocation = budgetAllocation,
            recommendations = buildRecommendations(campaigns),
        )
    }

    private fun buildRecommendations(campaigns: List<Campaign>): List<RecommendationItemResponse> {
        val recommendations = mutableListOf<RecommendationItemResponse>()

        campaigns.firstOrNull { it.status == CampaignStatus.PAUSED && it.spend >= it.budget }?.let {
            recommendations.add(
                RecommendationItemResponse(
                    id = "paused-exhausted-${it.id}",
                    text = "${it.name} is paused with \$0 remaining — consider raising the budget to keep reaching its audience.",
                    tone = "warning",
                )
            )
        }

        campaigns.firstOrNull { it.status == CampaignStatus.ACTIVE && it.spend < it.budget * 0.6 }?.let {
            val pctUnder = (100 - (it.spend / it.budget * 100)).toInt()
            recommendations.add(
                RecommendationItemResponse(
                    id = "underpacing-${it.id}",
                    text = "${it.name} is pacing $pctUnder% under budget — there's room to increase reach without changing CPA.",
                    tone = "info",
                )
            )
        }

        campaigns.filter { it.status == CampaignStatus.ACTIVE && it.conversions > 0 }
            .minByOrNull { it.cpa }
            ?.let {
                recommendations.add(
                    RecommendationItemResponse(
                        id = "best-cpa-${it.id}",
                        text = "${it.name} is your most efficient campaign this month at \$${"%.2f".format(it.cpa)} CPA.",
                        tone = "success",
                    )
                )
            }

        return recommendations
    }

    private fun requireOwnedCampaign(ownerId: UUID, campaignId: UUID): Campaign =
        campaignRepository.findByIdAndOwnerId(campaignId, ownerId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "campaign not found")

    private fun seedSpendHistory(ownerId: UUID) {
        val owner = userRepository.findById(ownerId).orElseThrow {
            ResponseStatusException(HttpStatus.NOT_FOUND, "user not found")
        }
        val today = LocalDate.now()
        val spend = SyntheticSeries.generate(SPEND_HISTORY_DAYS, 32.0, 6.0, 0.15, Random.nextLong())
        val naive = SyntheticSeries.generate(SPEND_HISTORY_DAYS, 46.0, 9.0, 0.2, Random.nextLong())

        (0 until SPEND_HISTORY_DAYS).forEach { i ->
            spendStatRepository.save(
                SpendStat(
                    owner = owner,
                    date = today.minusDays((SPEND_HISTORY_DAYS - 1 - i).toLong()),
                    spend = spend[i],
                    spendNaive = naive[i],
                )
            )
        }
    }
}

private val accentColors = listOf(
    "var(--color-amber-500)",
    "var(--color-signal-500)",
    "var(--color-amber-400)",
    "var(--color-signal-400)",
)

private fun randomAccentColor(): String = accentColors.random()

private fun Campaign.toResponse() = CampaignResponse(
    id = id,
    name = name,
    status = status.wire(),
    category = category,
    budget = budget,
    dailyCap = dailyCap,
    spend = spend,
    conversions = conversions,
    cpa = cpa,
    pacing = pacing.wire(),
    bidStrategy = bidStrategy,
    targeting = targeting,
    creative = CreativeResponse(creativeHeadline, creativeCta, creativeColor),
    createdDate = createdAt.atZone(java.time.ZoneOffset.UTC).toLocalDate(),
)

private fun CampaignStatus.wire(): String = name.lowercase()
private fun Pacing.wire(): String = name.lowercase()

private fun Double.round2(): Double = kotlin.math.round(this * 100.0) / 100.0
