package me.cire3.finnovate.proicio.repository

import me.cire3.finnovate.proicio.entity.Site
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SiteRepository : JpaRepository<Site, UUID> {
    fun findByOwnerId(ownerId: UUID): List<Site>
    fun findByIdAndOwnerId(id: UUID, ownerId: UUID): Site?
}
