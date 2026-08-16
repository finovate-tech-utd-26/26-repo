package me.cire3.finnovate.proicio.util

import kotlin.math.max
import kotlin.math.round
import kotlin.random.Random

object SyntheticSeries {
    fun generate(days: Int, base: Double, volatility: Double, drift: Double = 0.0, seed: Long): List<Double> {
        val random = Random(seed)
        var value = base
        return (0 until days).map {
            value += (random.nextDouble() * 2 - 1) * volatility + drift
            value = max(base * 0.4, value)
            round(value * 100.0) / 100.0
        }
    }
}
