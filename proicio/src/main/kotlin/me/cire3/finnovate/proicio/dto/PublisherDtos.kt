package me.cire3.finnovate.proicio.dto

import java.time.LocalDate
import java.util.UUID

data class AdSlotResponse(
    val id: UUID,
    val name: String,
    val position: String,
    val enabled: Boolean,
)

data class SiteResponse(
    val id: UUID,
    val name: String,
    val url: String,
    val status: String,
    val category: String,
    val adsShownAvg: Double,
    val revenue: Double,
    val maxAdsPerSession: Int,
    val categories: List<String>,
    val slots: List<AdSlotResponse>,
    val connectedDate: LocalDate,
    val embedSnippet: String,
)

data class RevenuePointResponse(
    val date: String,
    val revenue: Double,
    val revenueWithoutSignal: Double,
    val adsShown: Double,
)

data class ActivityItemResponse(
    val id: UUID,
    val text: String,
    val time: String,
)

data class PublisherOverviewResponse(
    val revenueThisMonth: Double,
    val adsShownAvg: Double,
    val revenuePerAdShown: Double,
    val bounceRate: Double,
    val sitesConnected: Int,
    val sitesActive: Int,
    val sites: List<SiteResponse>,
    val activity: List<ActivityItemResponse>,
)

data class CreateSiteRequest(
    val name: String,
    val url: String,
    val category: String,
)

data class UpdateSiteRequest(
    val status: String? = null,
    val maxAdsPerSession: Int? = null,
    val category: String? = null,
)

data class UpdateSlotRequest(
    val enabled: Boolean,
)

data class RecommendationResponse(
    val id: UUID,
    val action: String,
    val confidence: Double,
    val projectedCpm: Double,
    val rationale: String,
    val tone: String,
    val createdAt: java.time.Instant,
)
