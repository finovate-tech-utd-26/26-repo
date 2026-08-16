package me.cire3.finnovate.proicio.repository

import me.cire3.finnovate.proicio.entity.Recommendation
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RecommendationRepository : JpaRepository<Recommendation, UUID> {
    fun findTopBySiteIdOrderByCreatedAtDesc(siteId: UUID): Recommendation?
}
