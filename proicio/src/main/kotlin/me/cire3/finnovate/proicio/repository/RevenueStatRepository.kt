package me.cire3.finnovate.proicio.repository

import me.cire3.finnovate.proicio.entity.RevenueStat
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface RevenueStatRepository : JpaRepository<RevenueStat, UUID> {
    fun findBySiteIdOrderByDateAsc(siteId: UUID): List<RevenueStat>

    @Query("select r from RevenueStat r where r.site.owner.id = :ownerId order by r.date asc")
    fun findByOwnerIdOrderByDateAsc(@Param("ownerId") ownerId: UUID): List<RevenueStat>
}
