# 🏨 HotelBoss — Hotel Booking & Inventory Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![Keycloak](https://img.shields.io/badge/Keycloak-23.0-orange?logo=keycloak)](https://www.keycloak.org/)
[![Azure](https://img.shields.io/badge/Azure%20Queue-blue?logo=microsoftazure)](https://azure.microsoft.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)](https://www.docker.com/)
[![Java](https://img.shields.io/badge/Java-21-red?logo=openjdk)](https://openjdk.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

> A full-stack hotel management platform supporting guest reservations, room inventory tracking, and admin operations with role-based access control.

---

## 📐 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client Browser                            │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTP/HTTPS
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│              Frontend — Next.js 15 (TypeScript)                   │
│  • App Router pages (home, rooms, booking, admin dashboard)       │
│  • Keycloak-js for authentication (PKCE flow)                     │
│  • Axios with JWT token injection                                 │
│  • TanStack Query for server state                                │
│  • Role-based UI (GUEST / STAFF / ADMIN)                         │
└──────────────────────────┬───────────────────────────────────────┘
                           │ REST API calls with Bearer JWT
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│             Backend — Spring Boot 3.2 (Java 21)                   │
│  • JWT validation via Keycloak JWKS                               │
│  • Role-based endpoint security (@PreAuthorize)                   │
│  • Transactional room availability + reservation creation         │
│  • Azure Queue message publishing on booking                      │
│  • Swagger UI at /swagger-ui.html                                 │
└────────────┬──────────────────────────┬──────────────────────────┘
             │ JPA / SQL                │ Azure SDK
             ▼                         ▼
┌────────────────────┐      ┌──────────────────────────────────────┐
│  PostgreSQL 16     │      │  Azure Storage Queue                  │
│  • rooms           │      │  booking-confirmations queue          │
│  • reservations    │      │  (Azurite locally)                    │
└────────────────────┘      └──────────────────────────────────────┘
             │
             ▼
┌────────────────────┐
│  Keycloak 23.0     │
│  Realm: hotelboss  │
│  Roles: GUEST,     │
│  STAFF, ADMIN      │
└────────────────────┘
```

**Data flow for booking:**
1. Guest searches by dates and party size (`GET /api/rooms?checkIn=…&checkOut=…&guests=…`)
2. Guest logs in via Keycloak (PKCE OAuth2 flow) and confirms the booking
3. Frontend sends `POST /api/reservations` with JWT
4. Backend validates JWT, locks the room row and checks for overlapping stays
5. Creates reservation in PostgreSQL (`@Transactional`)
6. After the transaction commits, enqueues a `BOOKING_CONFIRMATION` message to Azure Queue
7. *(Not implemented yet)* a background worker (Azure Function / scheduler) would consume the queue and send the email

### Booking rules

- Availability is **per date range**: a room can be booked by anyone whose stay doesn't overlap an
  existing non-cancelled reservation. Stays are half-open, so check-out and the next check-in can
  fall on the same day.
- Concurrent bookings of the same room are serialized with a row lock, so double-booking is impossible.
- Check-in can't be in the past (hotel time zone, `HOTEL_TIMEZONE`, default `Europe/Sarajevo`);
  stays are 1–30 nights and at most a year ahead.
- Guests can cancel their own booking until the day before arrival. Staff can cancel or re-confirm
  any booking; re-confirming is refused if the room has been booked for those dates in the meantime.
- A room's `available` flag means "in service" (e.g. set it to false during renovation). It no longer
  flips when the room is booked.
- On first start the backend seeds the hotel's 16 rooms (8 Standard, 5 Deluxe, 3 Family Suite)
  if the `rooms` table is empty.

---

## 🗂 Folder Structure

```
/
├── backend/                    ← Spring Boot (Java 21, Maven)
│   ├── src/main/java/com/hotelboss/
│   │   ├── config/             ← SecurityConfig, AzureQueueConfig
│   │   ├── controller/         ← RoomController, ReservationController, AdminController
│   │   ├── dto/                ← Request/Response DTOs
│   │   ├── exception/          ← GlobalExceptionHandler, custom exceptions
│   │   ├── model/              ← JPA entities + enums
│   │   ├── repository/         ← Spring Data JPA repositories
│   │   └── service/            ← Business logic services
│   ├── src/main/resources/application.yml
│   ├── pom.xml
│   └── Dockerfile
├── frontend/                   ← Next.js 15 (TypeScript, App Router)
│   ├── app/                    ← Page routes
│   │   ├── page.tsx            ← Landing page
│   │   ├── rooms/              ← Room listings + detail
│   │   ├── booking/            ← Booking form + confirmation
│   │   ├── my-reservations/    ← Guest reservation history
│   │   └── admin/              ← Admin dashboard, rooms, reservations
│   ├── components/             ← Reusable React components
│   │   ├── auth/               ← KeycloakProvider, ProtectedRoute, RoleGuard
│   │   ├── ui/                 ← Navbar, Footer
│   │   ├── rooms/              ← RoomCard, RoomSearch
│   │   ├── booking/            ← BookingForm
│   │   └── admin/              ← StatCard, RoomTable, ReservationTable
│   ├── lib/                    ← keycloak.ts, api.ts, hooks/
│   └── Dockerfile
├── infra/
│   ├── keycloak/realm-export.json   ← Auto-imported Keycloak realm
│   └── azure/README.md              ← Azure Queue setup notes
├── docker-compose.yml          ← Full stack orchestration
├── docker-compose.dev.yml      ← Dev overrides with Azurite
├── .env.example                ← Environment variable documentation
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) & Docker Compose
- Java 21 (for local backend development)
- Node.js 20+ (for local frontend development)

### Run with Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/dzelilah/hotel-boss-booking-system.git
cd hotel-boss-booking-system

# 2. Copy environment variables
cp .env.example .env

# 3. Start all services (with Azurite for local Azure Queue)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Services will be available at:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Keycloak:  http://localhost:8180
# Swagger:   http://localhost:8080/swagger-ui.html
# Azurite:   http://localhost:10001 (queue)
```

---

## 🔐 Keycloak Setup

The Keycloak realm is **automatically imported** from `infra/keycloak/realm-export.json` on first startup.

### Test User Credentials

| Role  | Email               | Password   |
|-------|---------------------|------------|
| GUEST | guest@hotel.com     | guest123   |
| STAFF | staff@hotel.com     | staff123   |
| ADMIN | admin@hotel.com     | admin123   |

### Accessing Keycloak Admin Console

- URL: http://localhost:8180/admin
- Username: `admin`
- Password: `admin`

---

## 📡 API Endpoints

### Public Endpoints (no auth required)

| Method | Path              | Description          |
|--------|-------------------|----------------------|
| GET    | `/api/rooms`      | List all rooms       |
| GET    | `/api/rooms?checkIn=2026-12-01&checkOut=2026-12-04&guests=2` | Rooms free for the whole stay that fit the party |
| GET    | `/api/rooms?available=true` | Rooms currently in service |
| GET    | `/api/rooms/{id}` | Get room by ID       |
| GET    | `/api/rooms/{id}/availability?checkIn=…&checkOut=…` | `{"available": true}` if that room is free for the stay |

### Guest Endpoints (requires `GUEST` role)

| Method | Path                    | Description                   |
|--------|-------------------------|-------------------------------|
| POST   | `/api/reservations`     | Create a reservation          |
| GET    | `/api/reservations/my`  | Get current guest's reservations |
| PUT    | `/api/reservations/{id}/cancel` | Cancel own reservation (until the day before arrival) |

### Admin/Staff Endpoints (requires `ADMIN` or `STAFF` role)

| Method | Path                                | Description               |
|--------|-------------------------------------|---------------------------|
| GET    | `/api/admin/rooms`                  | List all rooms            |
| POST   | `/api/admin/rooms`                  | Create a room             |
| PUT    | `/api/admin/rooms/{id}`             | Update a room             |
| GET    | `/api/admin/reservations`           | List all reservations     |
| PUT    | `/api/admin/reservations/{id}/status?status=CANCELLED` | Update reservation status |

Errors always have the shape `{"timestamp", "status", "error", "message"}` (plus `errors` per field for
validation failures). Booking-rule messages are in Bosnian because the frontend shows them to guests as-is.

---

## 🛠️ Local Development

### Backend (Spring Boot)

```bash
cd backend
# Requires PostgreSQL and Keycloak running (via Docker Compose)
./mvnw spring-boot:run

# Tests (H2 in-memory, no other services needed). Requires Java 21; without it, use Docker:
./mvnw test
docker run --rm -v "$PWD:/app" -w /app maven:3.9-eclipse-temurin-21 mvn -q test
```

### Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

The frontend must run on **http://localhost:3000**: that's the only origin allowed by the Keycloak
client's redirect URIs and by the backend's CORS config. Stop the Docker `frontend` container first
(`docker compose stop frontend`) if it's running. If Windows locks `.next/trace`, use
`npm run dev:fresh`, which builds into `.next-devrun` instead.

---

## 🐳 Docker Details

- **Backend**: Multi-stage Maven build → Eclipse Temurin 21 JRE (Alpine)
- **Frontend**: Multi-stage npm build → Node.js 20 Alpine (standalone output)
- **Database**: PostgreSQL 16 with persistent volume
- **Auth**: Keycloak 23.0 with automatic realm import
- **Queue**: Azurite (dev) or Azure Storage (production)

---

## 🔧 Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Backend     | Spring Boot 3.2, Java 21, Maven        |
| Frontend    | Next.js 15, TypeScript, Tailwind CSS   |
| Database    | PostgreSQL 16, Spring Data JPA         |
| Auth        | Keycloak 23.0, OAuth2/JWT (PKCE)       |
| Messaging   | Azure Storage Queue (Azurite for dev)  |
| Container   | Docker, Docker Compose                 |
| API Docs    | SpringDoc OpenAPI (Swagger UI)         |
| Forms       | React Hook Form + Zod                  |
| State       | TanStack Query v5                      |
