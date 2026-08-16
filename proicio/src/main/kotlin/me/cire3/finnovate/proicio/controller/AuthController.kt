package me.cire3.finnovate.proicio.controller

import jakarta.validation.Valid
import java.util.UUID
import me.cire3.finnovate.proicio.dto.AuthResponse
import me.cire3.finnovate.proicio.dto.LoginRequest
import me.cire3.finnovate.proicio.dto.RegisterRequest
import me.cire3.finnovate.proicio.dto.UpdateProfileRequest
import me.cire3.finnovate.proicio.dto.UserProfileResponse
import me.cire3.finnovate.proicio.service.AuthService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {
    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): AuthResponse =
        authService.register(request)

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): AuthResponse =
        authService.login(request)

    @PostMapping("/logout")
    fun logout(): Map<String, String> = mapOf("status" to "logged out")

    @GetMapping("/me")
    fun me(@AuthenticationPrincipal userId: UUID): UserProfileResponse =
        authService.getProfile(userId)

    @PatchMapping("/me")
    fun updateMe(
        @AuthenticationPrincipal userId: UUID,
        @RequestBody request: UpdateProfileRequest,
    ): UserProfileResponse = authService.updateProfile(userId, request)
}
