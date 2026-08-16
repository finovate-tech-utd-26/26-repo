package me.cire3.finnovate.proicio.service

import java.util.concurrent.atomic.AtomicInteger
import me.cire3.finnovate.proicio.repository.SiteRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class TickerScheduler(
    private val broadcaster: TickerBroadcaster,
    private val eventFactory: TickerEventFactory,
    private val siteRepository: SiteRepository,
) {
    private val tick = AtomicInteger(0)

    @Scheduled(fixedRate = 2500)
    fun emitEvent() {
        val current = tick.incrementAndGet()
        val event = when {
            current % 4 == 0 -> realMatchOrFallback()
            current % 2 == 0 -> eventFactory.auctionEvent()
            else -> eventFactory.embeddingEvent()
        }
        broadcaster.broadcast(event)
    }

    private fun realMatchOrFallback() =
        siteRepository.findAll().randomOrNull()
            ?.let { runCatching { eventFactory.realMatchEvent(it) }.getOrNull() }
            ?: eventFactory.syntheticMatchEvent()
}
