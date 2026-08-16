package me.cire3.finnovate.proicio.util

import java.time.Duration
import java.time.Instant

object RelativeTime {
    fun format(instant: Instant): String {
        val duration = Duration.between(instant, Instant.now())
        val minutes = duration.toMinutes()
        val hours = duration.toHours()
        val days = duration.toDays()
        return when {
            minutes < 1 -> "just now"
            minutes < 60 -> "$minutes minute${if (minutes == 1L) "" else "s"} ago"
            hours < 24 -> "$hours hour${if (hours == 1L) "" else "s"} ago"
            days == 1L -> "Yesterday"
            days < 7 -> "$days days ago"
            else -> "${days / 7} week${if (days / 7 == 1L) "" else "s"} ago"
        }
    }
}
