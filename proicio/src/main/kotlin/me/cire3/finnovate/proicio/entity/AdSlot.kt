package me.cire3.finnovate.proicio.entity

import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.ForeignKey
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.util.UUID

enum class SlotPosition { BANNER, SIDEBAR, IN_CONTENT, FOOTER }

@Entity
@Table(name = "ad_slots")
class AdSlot(
    @Id
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "site_id", nullable = false, foreignKey = ForeignKey(name = "fk_slot_site"))
    val site: Site,

    var name: String,

    @Enumerated(EnumType.STRING)
    var position: SlotPosition,

    var enabled: Boolean = true,
)
