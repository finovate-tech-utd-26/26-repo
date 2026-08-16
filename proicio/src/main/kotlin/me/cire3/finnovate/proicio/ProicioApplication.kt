package me.cire3.finnovate.proicio

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class ProicioApplication

fun main(args: Array<String>) {
	runApplication<ProicioApplication>(*args)
}
