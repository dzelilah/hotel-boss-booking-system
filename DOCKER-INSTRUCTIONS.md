# Docker Instructions - Hotel Boss Booking System

## ✅ Status: Dockerization Complete!

Tvoj projekat je uspešno dockerizovan i radi sa sledećom konfigracijom:

### 📦 Docker Services

1. **Backend** (Node.js + Express)
   - Port: `5000`
   - Image: `hotel-booking-backend`
   - Health check: http://localhost:5000/health

2. **Frontend** (Static HTML + Nginx)
   - Port: `3000`
   - Image: `hotel-booking-frontend`
   - Website: http://localhost:3000

### 🚀 Quick Start Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### 🔧 Development Commands

```bash
# Development mode with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View specific service logs
docker-compose logs backend
docker-compose logs frontend

# Execute commands in running containers
docker-compose exec backend sh
docker-compose exec frontend sh
```

### 📊 Service Status Check

```bash
# Check container status
docker-compose ps

# Backend health check
curl http://localhost:5000/health

# Frontend check
curl http://localhost:3000
```

### 🌐 Access Points

- **Frontend Website**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/health](http://localhost:5000/health)
- **Booking API**: [http://localhost:5000/api/book](http://localhost:5000/api/book)

### 🛠️ Configuration Files

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development with volume mapping
- `backend/Dockerfile` - Backend container setup
- `frontend/Dockerfile` - Frontend container setup

### 📝 Features Included

✅ **Backend Services**:
- Express.js API server
- Email booking notifications
- CORS configured
- Security headers (Helmet)
- Rate limiting
- Request logging

✅ **Frontend Services**:
- Nginx static file server
- Responsive HTML/CSS/JS
- Bilingual support (BS/EN)
- Mobile-optimized design

✅ **Docker Configuration**:
- Multi-service setup
- Network isolation
- Security best practices
- Non-root user containers
- Optimized image sizes

### 🔒 Security Features

- Backend runs as non-root user
- Security headers enabled
- CORS properly configured
- Environment variables isolated
- Network segregation

### 📱 Testing

Backend API je testiran i vraća:
```json
{
  "status": "OK",
  "timestamp": "2025-11-07T23:01:54.491Z",
  "service": "Hotel Boss Booking API",
  "version": "1.0.0",
  "environment": "development"
}
```

Frontend je testiran i vraća kompletnu HTML stranicu sa:
- Responsivnim dizajnom
- Bilingual support
- Navigacijom na bosanskom jeziku

### 🎯 Next Steps

1. **Production Deployment**:
   - Konfigurisi production environment variables
   - Dodaj SSL certificates (Let's Encrypt)
   - Setup reverse proxy (nginx)

2. **Monitoring**:
   - Dodaj Docker health checks
   - Setup logging aggregation
   - Monitor resource usage

3. **CI/CD**:
   - GitHub Actions for automated builds
   - Automated testing pipeline
   - Deployment automation

Tvoj projekt je sada potpuno dockerizovan i spreman za production deployment! 🎉