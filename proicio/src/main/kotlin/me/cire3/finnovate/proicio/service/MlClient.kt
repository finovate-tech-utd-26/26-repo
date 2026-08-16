package me.cire3.finnovate.proicio.service

import me.cire3.finnovate.proicio.dto.MlPredictRequest
import me.cire3.finnovate.proicio.dto.MlPredictResponse
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import org.springframework.web.server.ResponseStatusException

@Component
class MlClient(private val mlRestClient: RestClient) {
    fun predict(metrics: Map<String, Double>): MlPredictResponse =
        try {
            mlRestClient.post()
                .uri("/api/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .body(MlPredictRequest(metrics))
                .retrieve()
                .body<MlPredictResponse>()
                ?: throw ResponseStatusException(HttpStatus.BAD_GATEWAY, "empty response from ML service")
        } catch (e: Exception) {
            if (e is ResponseStatusException) throw e
            throw ResponseStatusException(HttpStatus.BAD_GATEWAY, "ML service unavailable: ${e.message}")
        }
}
