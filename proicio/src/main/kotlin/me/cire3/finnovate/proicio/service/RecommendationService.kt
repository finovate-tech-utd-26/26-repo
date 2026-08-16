package me.cire3.finnovate.proicio.service

import java.time.Duration
import java.time.Instant
import java.util.UUID
import me.cire3.finnovate.proicio.dto.MlRecommendation
import me.cire3.finnovate.proicio.dto.RecommendationResponse
import me.cire3.finnovate.proicio.entity.ActivityLogEntry
import me.cire3.finnovate.proicio.entity.Recommendation
import me.cire3.finnovate.proicio.entity.Site
import me.cire3.finnovate.proicio.repository.ActivityLogRepository
import me.cire3.finnovate.proicio.repository.RecommendationRepository
import me.cire3.finnovate.proicio.repository.SiteRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

private val CACHE_TTL = Duration.ofHours(1)

@Service
class RecommendationService(
    private val siteRepository: SiteRepository,
    private val recommendationRepository: RecommendationRepository,
    private val siteMetricsService: SiteMetricsService,
    private val mlClient: MlClient,
    private val activityLogRepository: ActivityLogRepository,
) {
    @Transactional
    fun getRecommendation(ownerId: UUID, siteId: UUID): RecommendationResponse {
        val site = siteRepository.findByIdAndOwnerId(siteId, ownerId)
            ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "site not found")

        val existing = recommendationRepository.findTopBySiteIdOrderByCreatedAtDesc(siteId)
        if (existing != null && Duration.between(existing.createdAt, Instant.now()) < CACHE_TTL) {
            return existing.toResponse()
        }

        return generateRecommendation(site).toResponse()
    }

    private fun generateRecommendation(site: Site): Recommendation {
        val metrics = siteMetricsService.metricsFor(site)
        val prediction = mlClient.predict(metrics)
        val top = prediction.recommendations.maxByOrNull { it.confidenceScore }
            ?: MlRecommendation(
                action = "keep_optimal",
                confidenceScore = 1.0,
                rationale = "Metrics are within the optimal range — no change recommended.",
            )

        val saved = recommendationRepository.save(
            Recommendation(
                site = site,
                action = top.action,
                confidence = top.confidenceScore,
                projectedCpm = prediction.projectedNetCpm,
                rationale = top.rationale ?: "",
                tone = if (top.action == "keep_optimal") "good" else "warning",
            )
        )

        if (top.action != "keep_optimal") {
            activityLogRepository.save(
                ActivityLogEntry(
                    owner = site.owner,
                    text = "Proicio recommends \"${top.action.replace('_', ' ')}\" on \"${site.name}\" " +
                        "(projected CPM \$${"%.2f".format(prediction.projectedNetCpm)})",
                )
            )
        }

        return saved
    }
}

private fun Recommendation.toResponse() = RecommendationResponse(
    id = id,
    action = action,
    confidence = confidence,
    projectedCpm = projectedCpm,
    rationale = rationale,
    tone = tone,
    createdAt = createdAt,
)
