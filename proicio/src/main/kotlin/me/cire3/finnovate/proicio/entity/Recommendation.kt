package me.cire3.finnovate.proicio.entity

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "recommendations")
class Recommendation(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false, foreignKey = ForeignKey(name = "fk_recommendation_site"))
    val site: Site,

    val action: String,

    val confidence: Double,

    val projectedCpm: Double,

    val rationale: String,

    val tone: String,

    val createdAt: Instant = Instant.now(),
)
