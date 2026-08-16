package me.cire3.finnovate.proicio.repository

import me.cire3.finnovate.proicio.entity.Campaign
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface CampaignRepository : JpaRepository<Campaign, UUID> {
    fun findByOwnerId(ownerId: UUID): List<Campaign>
    fun findByIdAndOwnerId(id: UUID, ownerId: UUID): Campaign?
}
