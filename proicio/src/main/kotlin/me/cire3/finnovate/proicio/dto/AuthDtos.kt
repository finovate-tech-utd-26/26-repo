package me.cire3.finnovate.proicio.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import me.cire3.finnovate.proicio.entity.Role
import java.util.UUID

data class RegisterRequest(
    @field:Email val email: String,
    @field:Size(min = 8, message = "password must be at least 8 characters")
    val password: String,
    val role: Role,
    val businessName: String? = null,
    val category: String? = null,
)

data class LoginRequest(
    @field:Email val email: String,
    @field:NotBlank val password: String,
)

data class AuthResponse(
    val token: String,
    val role: Role,
)

data class UserProfileResponse(
    val id: UUID,
    val email: String,
    val role: Role,
    val businessName: String?,
    val category: String?,
    val advertiserGoal: String?,
    val monthlyBudgetRange: Int?,
    val notifyOnActivity: Boolean,
    val notifyOnRecommendations: Boolean,
)

data class UpdateProfileRequest(
    val businessName: String? = null,
    val category: String? = null,
    val advertiserGoal: String? = null,
    val monthlyBudgetRange: Int? = null,
    val notifyOnActivity: Boolean? = null,
    val notifyOnRecommendations: Boolean? = null,
)
