package me.cire3.finnovate.proicio.entity

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant
import java.util.UUID

enum class Role {
    PUBLISHER,
    ADVERTISER;

    @JsonValue
    fun toWire(): String = name.lowercase()

    companion object {
        @JsonCreator
        @JvmStatic
        fun fromWire(value: String): Role = valueOf(value.uppercase())
    }
}

@Entity
@Table(name = "users")
class User(
    @Id
    val id: UUID = UUID.randomUUID(),

    var email: String,

    var passwordHash: String,

    @Enumerated(EnumType.STRING)
    var role: Role,

    var businessName: String? = null,

    var category: String? = null,

    var advertiserGoal: String? = null,

    var monthlyBudgetRange: Int? = null,

    var notifyOnActivity: Boolean = true,

    var notifyOnRecommendations: Boolean = true,

    val createdAt: Instant = Instant.now(),
)
