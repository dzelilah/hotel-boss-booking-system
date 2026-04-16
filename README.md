# 🏨 HotelBoss — Hotel Booking & Inventory Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen?logo=spring)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
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
│              Frontend — Next.js 14 (TypeScript)                   │
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
1. User logs in via Keycloak (PKCE OAuth2 flow)
2. Frontend sends `POST /api/reservations` with JWT
3. Backend validates JWT, checks room availability
4. Creates reservation in PostgreSQL (`@Transactional`)
5. Enqueues `BOOKING_CONFIRMATION` message to Azure Queue
6. Background worker (Azure Function / scheduler) processes queue → sends email

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
├── frontend/                   ← Next.js 14 (TypeScript, App Router)
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
| GET    | `/api/rooms?available=true` | Available rooms only |
| GET    | `/api/rooms/{id}` | Get room by ID       |

### Guest Endpoints (requires `GUEST` role)

| Method | Path                    | Description                   |
|--------|-------------------------|-------------------------------|
| POST   | `/api/reservations`     | Create a reservation          |
| GET    | `/api/reservations/my`  | Get current guest's reservations |

### Admin/Staff Endpoints (requires `ADMIN` or `STAFF` role)

| Method | Path                                | Description               |
|--------|-------------------------------------|---------------------------|
| GET    | `/api/admin/rooms`                  | List all rooms            |
| POST   | `/api/admin/rooms`                  | Create a room             |
| PUT    | `/api/admin/rooms/{id}`             | Update a room             |
| GET    | `/api/admin/reservations`           | List all reservations     |
| PUT    | `/api/admin/reservations/{id}/status` | Update reservation status |

---

## 🛠️ Local Development

### Backend (Spring Boot)

```bash
cd backend
# Requires PostgreSQL and Keycloak running (via Docker Compose)
./mvnw spring-boot:run
```

### Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

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
| Frontend    | Next.js 14, TypeScript, Tailwind CSS   |
| Database    | PostgreSQL 16, Spring Data JPA         |
| Auth        | Keycloak 23.0, OAuth2/JWT (PKCE)       |
| Messaging   | Azure Storage Queue (Azurite for dev)  |
| Container   | Docker, Docker Compose                 |
| API Docs    | SpringDoc OpenAPI (Swagger UI)         |
| Forms       | React Hook Form + Zod                  |
| State       | TanStack Query v5                      |
