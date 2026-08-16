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

enum class CampaignStatus { ACTIVE, PAUSED, ENDED }
enum class Pacing { EVEN, ACCELERATED }

@Entity
@Table(name = "campaigns")
class Campaign(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false, foreignKey = ForeignKey(name = "fk_campaign_owner"))
    val owner: User,

    var name: String,

    @Enumerated(EnumType.STRING)
    var status: CampaignStatus = CampaignStatus.ACTIVE,

    var category: String,

    var budget: Double,

    var dailyCap: Double,

    var spend: Double = 0.0,

    var conversions: Int = 0,

    var cpa: Double = 0.0,

    @Enumerated(EnumType.STRING)
    var pacing: Pacing = Pacing.EVEN,

    var bidStrategy: String,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "campaign_targeting", joinColumns = [JoinColumn(name = "campaign_id")])
    @Column(name = "category")
    var targeting: MutableList<String> = mutableListOf(),

    var creativeHeadline: String,

    var creativeCta: String,

    var creativeColor: String,

    val createdAt: Instant = Instant.now(),
)
