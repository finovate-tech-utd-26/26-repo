# Proicio — backend

Kotlin + Spring Boot 4 API for Proicio: real accounts, publisher/advertiser dashboards, and a
live matching-engine ticker backed by the trained model in `../backend/model/`.

## Run

Requires JDK 21 and a Postgres instance (start one via `docker compose up -d postgres` from the
repo root, or point `DB_URL`/`DB_USER`/`DB_PASSWORD` at your own).

```bash
./gradlew bootRun
```

Also start the ML service (`../backend/model/`, see its own setup) — the API calls it over HTTP
for publisher recommendations and live "match" ticker events; without it those two features
degrade gracefully (recommendations 502, ticker falls back to templated events) but everything
else still works.

Config lives in `src/main/resources/application.properties`, all overridable via env vars
(`DB_URL`, `DB_USER`, `DB_PASSWORD`, `ML_SERVICE_URL`, `JWT_SECRET`, `JWT_EXPIRATION_MINUTES`,
`CORS_ALLOWED_ORIGIN`).

## Test

```bash
./gradlew test
```

`PublisherFlowIntegrationTest` runs the full register → connect site → toggle slot →
ML recommendation flow against an in-memory H2 database (see `src/test/resources/
application-test.properties`) — it still calls the real ML service if one is running on
`localhost:5000`.

## Structure

- `controller/` — REST endpoints (`AuthController`, `PublisherController`, `AdvertiserController`,
  `MarketplaceController`)
- `service/` — business logic, including `MlClient` (calls the Python ML service) and
  `TickerBroadcaster`/`TickerScheduler`/`TickerEventFactory` (the SSE live ticker)
- `entity/` / `repository/` — JPA (Postgres in prod, H2 in tests; `ddl-auto=update`, no
  migrations yet)
- `security/` — JWT issuing/parsing and the auth filter
- `dto/` — request/response shapes; enums serialize to lowercase wire values to match the
  frontend's TypeScript types
