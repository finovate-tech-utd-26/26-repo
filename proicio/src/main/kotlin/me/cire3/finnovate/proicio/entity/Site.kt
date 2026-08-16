package me.cire3.finnovate.proicio.entity

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

enum class SiteStatus { ACTIVE, PAUSED }

@Entity
@Table(name = "sites")
class Site(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false, foreignKey = ForeignKey(name = "fk_site_owner"))
    val owner: User,

    var name: String,

    var url: String,

    @Enumerated(EnumType.STRING)
    var status: SiteStatus = SiteStatus.ACTIVE,

    var category: String,

    var maxAdsPerSession: Int = 2,

    var bounceRatePercent: Double = 0.0,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "site_content_categories", joinColumns = [JoinColumn(name = "site_id")])
    @Column(name = "category")
    var contentCategories: MutableList<String> = mutableListOf(),

    val connectedAt: Instant = Instant.now(),
)
