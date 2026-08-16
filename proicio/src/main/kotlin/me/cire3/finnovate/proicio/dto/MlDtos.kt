package me.cire3.finnovate.proicio.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class MlPredictRequest(
    val metrics: Map<String, Double>,
)

data class MlRecommendation(
    val action: String,
    @param:JsonProperty("confidence_score") val confidenceScore: Double,
    @param:JsonProperty("target_component") val targetComponent: String? = null,
    @param:JsonProperty("css_selector") val cssSelector: String? = null,
    val rationale: String? = null,
    @param:JsonProperty("implementation_step") val implementationStep: String? = null,
)

data class MlPredictResponse(
    @param:JsonProperty("projected_net_cpm") val projectedNetCpm: Double,
    @param:JsonProperty("recommendations_count") val recommendationsCount: Int,
    val recommendations: List<MlRecommendation> = emptyList(),
)
