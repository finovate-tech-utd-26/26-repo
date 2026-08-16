package me.cire3.finnovate.proicio.repository

import me.cire3.finnovate.proicio.entity.SpendStat
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface SpendStatRepository : JpaRepository<SpendStat, UUID> {
    fun findByOwnerIdOrderByDateAsc(ownerId: UUID): List<SpendStat>
    fun existsByOwnerId(ownerId: UUID): Boolean
}
