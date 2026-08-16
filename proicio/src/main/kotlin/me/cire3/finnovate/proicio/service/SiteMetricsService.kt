package me.cire3.finnovate.proicio.service

import java.time.LocalDate
import kotlin.random.Random
import me.cire3.finnovate.proicio.entity.Site
import org.springframework.stereotype.Service

/**
 * There's no real ad-exchange telemetry backing these sites, so the 9 features the ML
 * model expects are synthesized here — seeded per site per day so they're stable within
 * a day rather than jittering on every call. The model and its output are real; only
 * this input is simulated.
 */
@Service
class SiteMetricsService {
    fun metricsFor(site: Site): Map<String, Double> {
        val seed = site.id.hashCode().toLong() * 31 + LocalDate.now().toEpochDay()
        val random = Random(seed)

        val pageviews = 5_000 + random.nextInt(195_000)
        val sessions = pageviews * (0.4 + random.nextDouble() * 0.3)
        val fillRate = 0.50 + random.nextDouble() * 0.49
        val unfilledImpressions = pageviews * (1 - fillRate)
        val grossCpm = 1.0 + random.nextDouble() * 7.0
        val netCpm = grossCpm * (0.70 + random.nextDouble() * 0.15)
        val ctr = 0.001 + random.nextDouble() * 0.034
        val viewablePercent = 0.30 + random.nextDouble() * 0.55
        val viewableTime = 2.0 + random.nextDouble() * 23.0

        return mapOf(
            "ctr" to ctr,
            "fill_rate" to fillRate,
            "gross_cpm" to grossCpm,
            "net_cpm" to netCpm,
            "pageviews" to pageviews.toDouble(),
            "sessions" to sessions,
            "unfilled_impressions" to unfilledImpressions,
            "viewable_percent" to viewablePercent,
            "viewable_time" to viewableTime,
        )
    }
}
