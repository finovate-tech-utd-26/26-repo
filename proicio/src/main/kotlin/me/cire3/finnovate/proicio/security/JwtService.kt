package me.cire3.finnovate.proicio.security

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import java.time.Instant
import java.util.Date
import java.util.UUID
import javax.crypto.SecretKey
import me.cire3.finnovate.proicio.entity.Role
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class JwtService(
    @Value("\${jwt.secret}") secret: String,
    @Value("\${jwt.expiration-minutes}") private val expirationMinutes: Long,
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(secret.toByteArray())

    fun issueToken(userId: UUID, email: String, role: Role): String {
        val now = Instant.now()
        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("role", role.name)
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(expirationMinutes * 60)))
            .signWith(key)
            .compact()
    }

    fun parseUserId(token: String): UUID {
        val claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
        return UUID.fromString(claims.subject)
    }

    fun parseRole(token: String): Role {
        val claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
        return Role.valueOf(claims.get("role", String::class.java))
    }
}
