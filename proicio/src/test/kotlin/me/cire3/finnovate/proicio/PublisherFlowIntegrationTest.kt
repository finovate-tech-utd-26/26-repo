package me.cire3.finnovate.proicio

import java.util.UUID
import me.cire3.finnovate.proicio.dto.AuthResponse
import me.cire3.finnovate.proicio.dto.CreateSiteRequest
import me.cire3.finnovate.proicio.dto.RecommendationResponse
import me.cire3.finnovate.proicio.dto.RegisterRequest
import me.cire3.finnovate.proicio.dto.SiteResponse
import me.cire3.finnovate.proicio.dto.UpdateSlotRequest
import me.cire3.finnovate.proicio.entity.Role
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.web.WebAppConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.DefaultMockMvcBuilder
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import tools.jackson.databind.ObjectMapper

@SpringBootTest
@WebAppConfiguration
@ActiveProfiles("test")
class PublisherFlowIntegrationTest {

    @Autowired
    lateinit var webApplicationContext: WebApplicationContext

    @Autowired
    lateinit var objectMapper: ObjectMapper

    lateinit var mockMvc: MockMvc

    @BeforeEach
    fun setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
            .apply<DefaultMockMvcBuilder>(springSecurity())
            .build()
    }

    @Test
    fun `register, connect a site, toggle a slot, and get a real ML recommendation`() {
        val email = "publisher-${UUID.randomUUID()}@example.com"

        val registerJson = mockMvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        RegisterRequest(email = email, password = "password123", role = Role.PUBLISHER)
                    )
                )
        )
            .andExpect(status().isOk)
            .andReturn().response.contentAsString
        val token = objectMapper.readValue(registerJson, AuthResponse::class.java).token

        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer $token"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.email").value(email))

        val siteJson = mockMvc.perform(
            post("/api/publisher/sites")
                .header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        CreateSiteRequest(name = "Test Site", url = "example.com", category = "Technology")
                    )
                )
        )
            .andExpect(status().isOk)
            .andReturn().response.contentAsString
        val site = objectMapper.readValue(siteJson, SiteResponse::class.java)
        assertEquals(6, site.slots.size)
        assertTrue(site.embedSnippet.contains(site.id.toString()))

        val slot = site.slots.first()
        mockMvc.perform(
            patch("/api/publisher/sites/${site.id}/slots/${slot.id}")
                .header("Authorization", "Bearer $token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(UpdateSlotRequest(enabled = false)))
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.slots[?(@.id=='${slot.id}')].enabled").value(false))

        val recommendationJson = mockMvc.perform(
            get("/api/publisher/sites/${site.id}/recommendations")
                .header("Authorization", "Bearer $token")
        )
            .andExpect(status().isOk)
            .andReturn().response.contentAsString
        val recommendation = objectMapper.readValue(recommendationJson, RecommendationResponse::class.java)
        assertTrue(recommendation.action.isNotBlank())
        assertTrue(recommendation.projectedCpm >= 0.0)
        assertTrue(recommendation.confidence in 0.0..1.0)
    }

    @Test
    fun `advertiser cannot access publisher endpoints`() {
        val email = "advertiser-${UUID.randomUUID()}@example.com"
        val registerJson = mockMvc.perform(
            post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        RegisterRequest(email = email, password = "password123", role = Role.ADVERTISER)
                    )
                )
        )
            .andExpect(status().isOk)
            .andReturn().response.contentAsString
        val token = objectMapper.readValue(registerJson, AuthResponse::class.java).token

        mockMvc.perform(get("/api/publisher/sites").header("Authorization", "Bearer $token"))
            .andExpect(status().isForbidden)
    }
}
