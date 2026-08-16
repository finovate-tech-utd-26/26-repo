package me.cire3.finnovate.proicio.repository

import me.cire3.finnovate.proicio.entity.AdSlot
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface AdSlotRepository : JpaRepository<AdSlot, UUID> {
    fun findBySiteId(siteId: UUID): List<AdSlot>
    fun findByIdAndSiteId(id: UUID, siteId: UUID): AdSlot?
}
