package me.cire3.finnovate.proicio.service

import java.util.UUID
import me.cire3.finnovate.proicio.dto.AuthResponse
import me.cire3.finnovate.proicio.dto.LoginRequest
import me.cire3.finnovate.proicio.dto.RegisterRequest
import me.cire3.finnovate.proicio.dto.UpdateProfileRequest
import me.cire3.finnovate.proicio.dto.UserProfileResponse
import me.cire3.finnovate.proicio.entity.User
import me.cire3.finnovate.proicio.repository.UserRepository
import me.cire3.finnovate.proicio.security.JwtService
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
) {
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "email already registered")
        }
        val user = userRepository.save(
            User(
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password)!!,
                role = request.role,
                businessName = request.businessName,
                category = request.category,
            )
        )
        return AuthResponse(jwtService.issueToken(user.id, user.email, user.role), user.role)
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials")
        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials")
        }
        return AuthResponse(jwtService.issueToken(user.id, user.email, user.role), user.role)
    }

    fun getProfile(userId: UUID): UserProfileResponse = findUser(userId).toProfileResponse()

    fun updateProfile(userId: UUID, request: UpdateProfileRequest): UserProfileResponse {
        val user = findUser(userId)
        request.businessName?.let { user.businessName = it }
        request.category?.let { user.category = it }
        request.advertiserGoal?.let { user.advertiserGoal = it }
        request.monthlyBudgetRange?.let { user.monthlyBudgetRange = it }
        request.notifyOnActivity?.let { user.notifyOnActivity = it }
        request.notifyOnRecommendations?.let { user.notifyOnRecommendations = it }
        return userRepository.save(user).toProfileResponse()
    }

    private fun findUser(userId: UUID): User =
        userRepository.findById(userId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "user not found") }

    private fun User.toProfileResponse() = UserProfileResponse(
        id = id,
        email = email,
        role = role,
        businessName = businessName,
        category = category,
        advertiserGoal = advertiserGoal,
        monthlyBudgetRange = monthlyBudgetRange,
        notifyOnActivity = notifyOnActivity,
        notifyOnRecommendations = notifyOnRecommendations,
    )
}
