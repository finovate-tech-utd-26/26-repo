package me.cire3.finnovate.proicio.service

import java.util.UUID
import java.util.concurrent.atomic.AtomicInteger
import kotlin.random.Random
import me.cire3.finnovate.proicio.dto.TickerEventResponse
import me.cire3.finnovate.proicio.entity.Site
import org.springframework.stereotype.Component

@Component
class TickerEventFactory(
    private val siteMetricsService: SiteMetricsService,
    private val mlClient: MlClient,
) {
    private val adNames = listOf(
        "Local Bakery",
        "Trailside Outfitters",
        "GreenThumb Landscaping",
        "Riverside Coffee Roasters",
    )
    private val contentSamples = listOf(
        "outdoor gear review" to "Sporting Goods",
        "sourdough recipe walkthrough" to "Food & Dining",
        "backyard patio renovation" to "Home & Garden",
        "farmers market roundup" to "Local News",
        "trail running shoe comparison" to "Outdoor & Recreation",
    )
    private val sessionCounter = AtomicInteger(4800)

    fun embeddingEvent(): TickerEventResponse {
        val (content, category) = contentSamples.random()
        return event("embedding", "Content embedding: \"$content\" -> matched category: $category")
    }

    fun auctionEvent(): TickerEventResponse {
        val bidders = Random.nextInt(2, 7)
        val price = 0.22 + Random.nextDouble() * 0.33
        return event("auction", "Auction: $bidders bidders, clearing price \$${"%.2f".format(price)} (2nd price)")
    }

    fun syntheticMatchEvent(): TickerEventResponse {
        val session = sessionCounter.addAndGet(Random.nextInt(1, 6))
        val ad = adNames.random()
        val bid = 0.28 + Random.nextDouble() * 0.34
        val cvr = 1.8 + Random.nextDouble() * 2.8
        val won = Random.nextDouble() > 0.25
        return event(
            "match",
            "Session #$session matched -> Ad \"$ad\" (bid \$${"%.2f".format(bid)}, " +
                "predicted CVR ${"%.1f".format(cvr)}%) - ${if (won) "WON" else "lost"}",
        )
    }

    fun realMatchEvent(site: Site): TickerEventResponse {
        val metrics = siteMetricsService.metricsFor(site)
        val prediction = mlClient.predict(metrics)
        val top = prediction.recommendations.maxByOrNull { it.confidenceScore }
        val actionText = top?.action?.replace('_', ' ') ?: "keep optimal"
        val confidencePct = ((top?.confidenceScore ?: 1.0) * 100)
        return event(
            "match",
            "\"${site.name}\" evaluated -> action: $actionText (confidence ${"%.0f".format(confidencePct)}%), " +
                "projected CPM \$${"%.2f".format(prediction.projectedNetCpm)}",
        )
    }

    private fun event(kind: String, text: String) = TickerEventResponse(
        id = UUID.randomUUID().toString(),
        timestamp = System.currentTimeMillis(),
        kind = kind,
        text = text,
    )
}
