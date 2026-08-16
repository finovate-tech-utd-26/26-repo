package me.cire3.finnovate.proicio.controller

import java.util.UUID
import me.cire3.finnovate.proicio.dto.CreateSiteRequest
import me.cire3.finnovate.proicio.dto.PublisherOverviewResponse
import me.cire3.finnovate.proicio.dto.RecommendationResponse
import me.cire3.finnovate.proicio.dto.RevenuePointResponse
import me.cire3.finnovate.proicio.dto.SiteResponse
import me.cire3.finnovate.proicio.dto.UpdateSiteRequest
import me.cire3.finnovate.proicio.dto.UpdateSlotRequest
import me.cire3.finnovate.proicio.service.PublisherService
import me.cire3.finnovate.proicio.service.RecommendationService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/publisher")
class PublisherController(
    private val publisherService: PublisherService,
    private val recommendationService: RecommendationService,
) {
    @GetMapping("/overview")
    fun overview(@AuthenticationPrincipal ownerId: UUID): PublisherOverviewResponse =
        publisherService.getOverview(ownerId)

    @GetMapping("/sites")
    fun listSites(@AuthenticationPrincipal ownerId: UUID): List<SiteResponse> =
        publisherService.listSites(ownerId)

    @PostMapping("/sites")
    fun createSite(
        @AuthenticationPrincipal ownerId: UUID,
        @RequestBody request: CreateSiteRequest,
    ): SiteResponse = publisherService.createSite(ownerId, request)

    @GetMapping("/sites/{siteId}")
    fun getSite(@AuthenticationPrincipal ownerId: UUID, @PathVariable siteId: UUID): SiteResponse =
        publisherService.getSite(ownerId, siteId)

    @PatchMapping("/sites/{siteId}")
    fun updateSite(
        @AuthenticationPrincipal ownerId: UUID,
        @PathVariable siteId: UUID,
        @RequestBody request: UpdateSiteRequest,
    ): SiteResponse = publisherService.updateSite(ownerId, siteId, request)

    @PatchMapping("/sites/{siteId}/slots/{slotId}")
    fun updateSlot(
        @AuthenticationPrincipal ownerId: UUID,
        @PathVariable siteId: UUID,
        @PathVariable slotId: UUID,
        @RequestBody request: UpdateSlotRequest,
    ): SiteResponse = publisherService.updateSlot(ownerId, siteId, slotId, request.enabled)

    @GetMapping("/sites/{siteId}/revenue")
    fun siteRevenue(
        @AuthenticationPrincipal ownerId: UUID,
        @PathVariable siteId: UUID,
    ): List<RevenuePointResponse> = publisherService.getSiteRevenue(ownerId, siteId)

    @GetMapping("/revenue")
    fun accountRevenue(@AuthenticationPrincipal ownerId: UUID): List<RevenuePointResponse> =
        publisherService.getAccountRevenue(ownerId)

    @GetMapping("/sites/{siteId}/recommendations")
    fun recommendation(
        @AuthenticationPrincipal ownerId: UUID,
        @PathVariable siteId: UUID,
    ): RecommendationResponse = recommendationService.getRecommendation(ownerId, siteId)
}
