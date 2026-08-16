package me.cire3.finnovate.proicio.dto

import java.util.UUID

data class TickerEventResponse(
    val id: String,
    val timestamp: Long,
    val kind: String,
    val text: String,
)

data class SimulateEventRequest(
    val siteId: UUID? = null,
)
