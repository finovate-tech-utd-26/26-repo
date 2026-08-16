package me.cire3.finnovate.proicio.dto

import java.time.LocalDate
import java.util.UUID

data class CreativeResponse(
    val headline: String,
    val cta: String,
    val color: String,
)

data class CampaignResponse(
    val id: UUID,
    val name: String,
    val status: String,
    val category: String,
    val budget: Double,
    val dailyCap: Double,
    val spend: Double,
    val conversions: Int,
    val cpa: Double,
    val pacing: String,
    val bidStrategy: String,
    val targeting: List<String>,
    val creative: CreativeResponse,
    val createdDate: LocalDate,
)

data class SpendPointResponse(
    val date: String,
    val spend: Double,
    val spendNaive: Double,
)

data class AdvertiserOverviewResponse(
    val totalSpend: Double,
    val conversions: Int,
    val costPerConversion: Double,
    val estSavings: Double,
    val campaigns: List<CampaignResponse>,
)

data class CreativeRequest(
    val headline: String,
    val cta: String,
)

data class CreateCampaignRequest(
    val name: String,
    val category: String,
    val budget: Double,
    val dailyCap: Double,
    val pacing: String,
    val creative: CreativeRequest,
)

data class UpdateCampaignRequest(
    val status: String? = null,
    val budget: Double? = null,
    val dailyCap: Double? = null,
)

data class PacingDayResponse(
    val day: String,
    val even: Double,
    val naive: Double,
)

data class ReachItemResponse(
    val category: String,
    val value: Int,
)

data class BudgetAllocationItemResponse(
    val name: String,
    val value: Double,
    val color: String,
)

data class RecommendationItemResponse(
    val id: String,
    val text: String,
    val tone: String,
)

data class BudgetDataResponse(
    val pacingByDay: List<PacingDayResponse>,
    val reachBreakdown: List<ReachItemResponse>,
    val budgetAllocation: List<BudgetAllocationItemResponse>,
    val recommendations: List<RecommendationItemResponse>,
)
