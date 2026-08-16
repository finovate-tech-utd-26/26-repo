package me.cire3.finnovate.proicio.service

import java.time.LocalDate
import java.util.UUID
import kotlin.random.Random
import me.cire3.finnovate.proicio.dto.ActivityItemResponse
import me.cire3.finnovate.proicio.dto.AdSlotResponse
import me.cire3.finnovate.proicio.dto.CreateSiteRequest
import me.cire3.finnovate.proicio.dto.PublisherOverviewResponse
import me.cire3.finnovate.proicio.dto.RevenuePointResponse
import me.cire3.finnovate.proicio.dto.SiteResponse
import me.cire3.finnovate.proicio.dto.UpdateSiteRequest
import me.cire3.finnovate.proicio.entity.ActivityLogEntry
import me.cire3.finnovate.proicio.entity.AdSlot
import me.cire3.finnovate.proicio.entity.RevenueStat
import me.cire3.finnovate.proicio.entity.Site
import me.cire3.finnovate.proicio.entity.SiteStatus
import me.cire3.finnovate.proicio.entity.SlotPosition
import me.cire3.finnovate.proicio.repository.ActivityLogRepository
import me.cire3.finnovate.proicio.repository.AdSlotRepository
import me.cire3.finnovate.proicio.repository.RevenueStatRepository
import me.cire3.finnovate.proicio.repository.SiteRepository
import me.cire3.finnovate.proicio.repository.UserRepository
import me.cire3.finnovate.proicio.util.CategoryMapper
import me.cire3.finnovate.proicio.util.RelativeTime
import me.cire3.finnovate.proicio.util.SyntheticSeries
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

private const val REVENUE_HISTORY_DAYS = 30

@Service
class PublisherService(
    private val userRepository: UserRepository,
    private val siteRepository: SiteRepository,
    private val slotRepository: AdSlotRepository,
    private val revenueStatRepository: RevenueStatRepository,
    private val activityLogRepository: ActivityLogRepository,
) {
    @Transactional
    fun createSite(ownerId: UUID, request: CreateSiteRequest): SiteResponse {
        val owner = userRepository.findById(ownerId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "user not found") }

        val site = siteRepository.save(
            Site(
                owner = owner,
                name = request.name,
                url = request.url,
                category = request.category,
                bounceRatePercent = 15.0 + Random.nextDouble() * 20.0,
                contentCategories = CategoryMapper.relatedCategories(request.category).toMutableList(),
            )
        )

        defaultSlots(site).forEach { slotRepository.save(it) }
        seedRevenueHistory(site)

        activityLogRepository.save(
            ActivityLogEntry(owner = owner, text = "Connected new site \"${site.name}\"")
        )

        return toSiteResponse(site)
    }

    fun listSites(ownerId: UUID): List<SiteResponse> =
        siteRepository.findByOwnerId(ownerId).map { toSiteResponse(it) }

    fun getSite(ownerId: UUID, siteId: UUID): SiteResponse =
        toSiteResponse(requireOwnedSite(ownerId, siteId))

    @Transactional
    fun updateSite(ownerId: UUID, siteId: UUID, request: UpdateSiteRequest): SiteResponse {
        val site = requireOwnedSite(ownerId, siteId)
        request.status?.let { site.status = SiteStatus.valueOf(it.uppercase()) }
        request.maxAdsPerSession?.let { site.maxAdsPerSession = it }
        request.category?.let { site.category = it }
        return toSiteResponse(siteRepository.save(site))
    }

    @Transactional
    fun updateSlot(ownerId: UUID, siteId: UUID, slotId: UUID, enabled: Boolean): SiteResponse {
        val site = requireOwnedSite(ownerId, siteId)
        val slot = slotRepository.findByIdAndSiteId(slotId, siteId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "slot not found")
        if (slot.enabled != enabled) {
            slot.enabled = enabled
            slotRepository.save(slot)
            activityLogRepository.save(
                ActivityLogEntry(
                    owner = site.owner,
                    text = "${slot.name} slot ${if (enabled) "enabled" else "disabled"} on \"${site.name}\"",
                )
            )
        }
        return toSiteResponse(site)
    }

    fun getSiteRevenue(ownerId: UUID, siteId: UUID): List<RevenuePointResponse> {
        requireOwnedSite(ownerId, siteId)
        return revenueStatRepository.findBySiteIdOrderByDateAsc(siteId).map { it.toResponse() }
    }

    fun getAccountRevenue(ownerId: UUID): List<RevenuePointResponse> =
        revenueStatRepository.findByOwnerIdOrderByDateAsc(ownerId)
            .groupBy { it.date }
            .toSortedMap()
            .map { (date, stats) ->
                RevenuePointResponse(
                    date = date.toString(),
                    revenue = stats.sumOf { it.revenue }.round2(),
                    revenueWithoutSignal = stats.sumOf { it.revenueWithoutSignal }.round2(),
                    adsShown = stats.sumOf { it.adsShown }.round2(),
                )
            }

    fun getOverview(ownerId: UUID): PublisherOverviewResponse {
        val sites = siteRepository.findByOwnerId(ownerId)
        val revenue = getAccountRevenue(ownerId)
        val revenueThisMonth = revenue.sumOf { it.revenue }
        val adsShownTotal = revenue.sumOf { it.adsShown }
        val activity = activityLogRepository.findTop10ByOwnerIdOrderByCreatedAtDesc(ownerId)
            .map { ActivityItemResponse(it.id, it.text, RelativeTime.format(it.createdAt)) }

        return PublisherOverviewResponse(
            revenueThisMonth = revenueThisMonth.round2(),
            adsShownAvg = if (sites.isEmpty()) 0.0 else sites.map { avgAdsShown(it.id) }.average().round2(),
            revenuePerAdShown = if (adsShownTotal == 0.0) 0.0 else (revenueThisMonth / adsShownTotal).round2(),
            bounceRate = if (sites.isEmpty()) 0.0 else sites.map { it.bounceRatePercent }.average().round2(),
            sitesConnected = sites.size,
            sitesActive = sites.count { it.status == SiteStatus.ACTIVE },
            sites = sites.map { toSiteResponse(it) },
            activity = activity,
        )
    }

    private fun requireOwnedSite(ownerId: UUID, siteId: UUID): Site =
        siteRepository.findByIdAndOwnerId(siteId, ownerId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "site not found")

    private fun defaultSlots(site: Site): List<AdSlot> = listOf(
        AdSlot(site = site, name = "Header banner", position = SlotPosition.BANNER),
        AdSlot(site = site, name = "Sidebar top", position = SlotPosition.SIDEBAR),
        AdSlot(site = site, name = "Sidebar bottom", position = SlotPosition.SIDEBAR),
        AdSlot(site = site, name = "In-article #1", position = SlotPosition.IN_CONTENT),
        AdSlot(site = site, name = "In-article #2", position = SlotPosition.IN_CONTENT),
        AdSlot(site = site, name = "Footer", position = SlotPosition.FOOTER),
    )

    private fun seedRevenueHistory(site: Site) {
        val today = LocalDate.now()
        val revenue = SyntheticSeries.generate(REVENUE_HISTORY_DAYS, 220.0, 18.0, 0.6, Random.nextLong())
        val naive = SyntheticSeries.generate(REVENUE_HISTORY_DAYS, 190.0, 22.0, -0.1, Random.nextLong())
        val adsShown = SyntheticSeries.generate(REVENUE_HISTORY_DAYS, 2.2, 0.4, 0.0, Random.nextLong())

        (0 until REVENUE_HISTORY_DAYS).forEach { i ->
            revenueStatRepository.save(
                RevenueStat(
                    site = site,
                    date = today.minusDays((REVENUE_HISTORY_DAYS - 1 - i).toLong()),
                    revenue = revenue[i],
                    revenueWithoutSignal = naive[i],
                    adsShown = adsShown[i],
                )
            )
        }
    }

    private fun avgAdsShown(siteId: UUID): Double {
        val stats = revenueStatRepository.findBySiteIdOrderByDateAsc(siteId)
        return if (stats.isEmpty()) 0.0 else stats.map { it.adsShown }.average()
    }

    private fun toSiteResponse(site: Site): SiteResponse {
        val stats = revenueStatRepository.findBySiteIdOrderByDateAsc(site.id)
        val slots = slotRepository.findBySiteId(site.id).map { it.toResponse() }
        return SiteResponse(
            id = site.id,
            name = site.name,
            url = site.url,
            status = site.status.wire(),
            category = site.category,
            adsShownAvg = (if (stats.isEmpty()) 0.0 else stats.map { it.adsShown }.average()).round2(),
            revenue = stats.sumOf { it.revenue }.round2(),
            maxAdsPerSession = site.maxAdsPerSession,
            categories = site.contentCategories,
            slots = slots,
            connectedDate = site.connectedAt.atZone(java.time.ZoneOffset.UTC).toLocalDate(),
            embedSnippet = embedSnippet(site.id),
        )
    }
}

private fun RevenueStat.toResponse() = RevenuePointResponse(
    date = date.toString(),
    revenue = revenue,
    revenueWithoutSignal = revenueWithoutSignal,
    adsShown = adsShown,
)

private fun AdSlot.toResponse() = AdSlotResponse(
    id = id,
    name = name,
    position = position.wire(),
    enabled = enabled,
)

private fun SiteStatus.wire(): String = name.lowercase()

private fun SlotPosition.wire(): String = when (this) {
    SlotPosition.BANNER -> "banner"
    SlotPosition.SIDEBAR -> "sidebar"
    SlotPosition.IN_CONTENT -> "in-content"
    SlotPosition.FOOTER -> "footer"
}

private fun embedSnippet(siteId: UUID): String =
    "<script src=\"https://cdn.proicio.dev/embed.js\" data-site-id=\"$siteId\" async></script>"

private fun Double.round2(): Double = kotlin.math.round(this * 100.0) / 100.0
