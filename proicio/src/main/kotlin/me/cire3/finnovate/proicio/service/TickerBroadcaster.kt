package me.cire3.finnovate.proicio.service

import java.util.concurrent.CopyOnWriteArrayList
import me.cire3.finnovate.proicio.dto.TickerEventResponse
import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Component
class TickerBroadcaster {
    private val emitters = CopyOnWriteArrayList<SseEmitter>()

    fun register(): SseEmitter {
        val emitter = SseEmitter(0L)
        emitters.add(emitter)
        emitter.onCompletion { emitters.remove(emitter) }
        emitter.onTimeout { emitters.remove(emitter) }
        emitter.onError { emitters.remove(emitter) }
        return emitter
    }

    fun broadcast(event: TickerEventResponse) {
        emitters.forEach { emitter ->
            try {
                emitter.send(SseEmitter.event().name("event").data(event))
            } catch (e: Exception) {
                emitters.remove(emitter)
            }
        }
    }
}
