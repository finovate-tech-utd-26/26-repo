package me.cire3.finnovate.proicio.controller

import java.util.UUID
import me.cire3.finnovate.proicio.dto.AdvertiserOverviewResponse
import me.cire3.finnovate.proicio.dto.BudgetDataResponse
import me.cire3.finnovate.proicio.dto.CampaignResponse
import me.cire3.finnovate.proicio.dto.CreateCampaignRequest
import me.cire3.finnovate.proicio.dto.SpendPointResponse
import me.cire3.finnovate.proicio.dto.UpdateCampaignRequest
import me.cire3.finnovate.proicio.service.AdvertiserService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/advertiser")
class AdvertiserController(private val advertiserService: AdvertiserService) {
    @GetMapping("/overview")
    fun overview(@AuthenticationPrincipal ownerId: UUID): AdvertiserOverviewResponse =
        advertiserService.getOverview(ownerId)

    @GetMapping("/campaigns")
    fun listCampaigns(@AuthenticationPrincipal ownerId: UUID): List<CampaignResponse> =
        advertiserService.listCampaigns(ownerId)

    @PostMapping("/campaigns")
    fun createCampaign(
        @AuthenticationPrincipal ownerId: UUID,
        @RequestBody request: CreateCampaignRequest,
    ): CampaignResponse = advertiserService.createCampaign(ownerId, request)

    @GetMapping("/campaigns/{campaignId}")
    fun getCampaign(@AuthenticationPrincipal ownerId: UUID, @PathVariable campaignId: UUID): CampaignResponse =
        advertiserService.getCampaign(ownerId, campaignId)

    @PatchMapping("/campaigns/{campaignId}")
    fun updateCampaign(
        @AuthenticationPrincipal ownerId: UUID,
        @PathVariable campaignId: UUID,
        @RequestBody request: UpdateCampaignRequest,
    ): CampaignResponse = advertiserService.updateCampaign(ownerId, campaignId, request)

    @GetMapping("/spend")
    fun spendHistory(@AuthenticationPrincipal ownerId: UUID): List<SpendPointResponse> =
        advertiserService.getSpendHistory(ownerId)

    @GetMapping("/budget")
    fun budgetData(@AuthenticationPrincipal ownerId: UUID): BudgetDataResponse =
        advertiserService.getBudgetData(ownerId)
}
