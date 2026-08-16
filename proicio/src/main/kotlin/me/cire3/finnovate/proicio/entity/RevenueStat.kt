package me.cire3.finnovate.proicio.entity

import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "revenue_stats")
class RevenueStat(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false, foreignKey = ForeignKey(name = "fk_revenue_site"))
    val site: Site,

    val date: LocalDate,

    val revenue: Double,

    val revenueWithoutSignal: Double,

    val adsShown: Double,
)
