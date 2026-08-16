plugins {
	kotlin("jvm") version "2.3.21"
	kotlin("plugin.spring") version "2.3.21"
	kotlin("plugin.jpa") version "2.3.21"
	id("org.springframework.boot") version "4.1.0"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "me.cire3.finnovate"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}

repositories {
	mavenCentral()
}

val jjwtVersion = "0.12.6"

dependencies {
	implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.jetbrains.kotlin:kotlin-reflect")

	runtimeOnly("org.postgresql:postgresql")

	implementation("io.jsonwebtoken:jjwt-api:$jjwtVersion")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:$jjwtVersion")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:$jjwtVersion")

	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	testRuntimeOnly("com.h2database:h2")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}

tasks.register<org.springframework.boot.gradle.tasks.run.BootRun>("bootRunH2") {
	group = "application"
	description = "Runs the app against in-memory H2 instead of Postgres (no Docker required)."
	classpath = sourceSets["main"].runtimeClasspath + sourceSets["test"].runtimeClasspath
	mainClass.set("me.cire3.finnovate.proicio.ProicioApplicationKt")
	systemProperty("spring.datasource.url", "jdbc:h2:mem:proicio-dev;MODE=PostgreSQL;DB_CLOSE_DELAY=-1")
	systemProperty("spring.datasource.driver-class-name", "org.h2.Driver")
	systemProperty("spring.datasource.username", "sa")
	systemProperty("spring.datasource.password", "")
}
