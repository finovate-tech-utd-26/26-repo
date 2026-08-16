package me.cire3.finnovate.proicio.controller

import me.cire3.finnovate.proicio.dto.SimulateEventRequest
import me.cire3.finnovate.proicio.dto.TickerEventResponse
import me.cire3.finnovate.proicio.repository.SiteRepository
import me.cire3.finnovate.proicio.service.TickerBroadcaster
import me.cire3.finnovate.proicio.service.TickerEventFactory
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/api/marketplace")
class MarketplaceController(
    private val broadcaster: TickerBroadcaster,
    private val eventFactory: TickerEventFactory,
    private val siteRepository: SiteRepository,
) {
    @GetMapping("/events/stream", produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun stream(): SseEmitter = broadcaster.register()

    @PostMapping("/events/simulate")
    fun simulate(@RequestBody(required = false) request: SimulateEventRequest?): TickerEventResponse {
        val site = request?.siteId?.let { siteRepository.findById(it).orElse(null) }
            ?: siteRepository.findAll().randomOrNull()

        val event = site
            ?.let { runCatching { eventFactory.realMatchEvent(it) }.getOrNull() }
            ?: eventFactory.syntheticMatchEvent()

        broadcaster.broadcast(event)
        return event
    }
}
