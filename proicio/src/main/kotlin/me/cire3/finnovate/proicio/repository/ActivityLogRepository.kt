package me.cire3.finnovate.proicio.repository

import me.cire3.finnovate.proicio.entity.ActivityLogEntry
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface ActivityLogRepository : JpaRepository<ActivityLogEntry, UUID> {
    fun findTop10ByOwnerIdOrderByCreatedAtDesc(ownerId: UUID): List<ActivityLogEntry>
}
