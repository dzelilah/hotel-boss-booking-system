# 🏨 Hotel Boss - Booking System

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![HTML5](https://img.shields.io/badge/HTML5-Frontend-orange?logo=html5)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-Responsive-blue?logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A modern, fully responsive hotel booking website with bilingual support (Bosnian/English) and complete Docker deployment setup.

## 🌟 Features

- 🏨 **Modern Hotel Website** - Professional design with responsive layout
- 📧 **Email Booking System** - Automated email notifications for bookings
- 🌐 **Bilingual Support** - Seamless switching between Bosnian and English
- 📱 **Mobile Optimized** - Perfect experience on all devices
- 🎨 **Professional Gallery** - Image filtering and categorization
- 🐳 **Docker Ready** - Complete containerization for easy deployment
- 🔒 **Security Features** - CORS, Helmet, Rate limiting
- ⚡ **Performance Optimized** - Fast loading and smooth animations

## 🚀 Quick Start with Docker

### Prerequisites
- [Docker](https://www.docker.com/get-started) and Docker Compose installed

### Production Deployment
```bash
# Clone the repository
git clone https://github.com/dzelilah/hotel-boss-booking-system.git
cd hotel-boss-booking-system

# Build and run with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
```

### Development Setup
```bash
# Run development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## 🛠️ Manual Setup (Without Docker)

### Backend Setup
```bash
cd backend
npm install
# Configure your .env file (see Configuration section)
npm start
```

### Frontend Setup
```bash
cd frontend/public
# Serve static files using any web server
python -m http.server 3000
# or use live-server, nginx, apache, etc.
```

## ⚙️ Configuration

Create `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Hotel Configuration  
HOTEL_NAME=Hotel Boss
HOTEL_EMAIL=info@hotelboss.com

# SMTP Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

## 📡 API Endpoints

- `POST /api/booking` - Submit booking request
- `GET /health` - Health check endpoint

## 🏗️ Project Structure

```
hotel-boss-booking-system/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── app.js          # Main application file
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── tests/          # Test files
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Static frontend
│   ├── public/
│   │   ├── *.html          # HTML pages
│   │   └── assets/         # CSS, JS, images
│   └── Dockerfile
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
└── README.md
```

## 🎨 Features Showcase

### 🌐 Bilingual Support
- Instant language switching between Bosnian and English
- Persistent language selection using localStorage
- Complete translation coverage for all content

### 📱 Responsive Design
- Mobile-first approach
- Optimized navigation for touch devices
- Perfect scaling across all screen sizes

### 🎯 Professional Gallery
- Category-based image filtering
- Lightbox functionality for detailed viewing
- Optimized image loading and display

### 📧 Email Integration
- Automated booking confirmations
- Professional email templates
- SMTP configuration for reliable delivery

## 🐳 Docker Commands

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop services
docker-compose down

# Remove volumes (reset data)
docker-compose down -v

# Rebuild and restart
docker-compose up -d --build
```

## 🔧 Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with CSS Grid & Flexbox
- AOS animations library
- Custom bilingual language switcher

**Backend:**
- Node.js with Express.js
- Email notifications with Nodemailer
- Security: CORS, Helmet, Rate limiting
- Request logging with Morgan
- RESTful API architecture

**DevOps:**
- Docker & Docker Compose
- Multi-stage builds
- Production-ready containerization
- Environment-based configuration

## 🔒 Security Features

- Backend runs as non-root user in containers
- Security headers enabled (Helmet.js)
- CORS properly configured
- Rate limiting for API endpoints
- Environment variables for sensitive data

## 🚀 Deployment Options

### Cloud Platforms
- **Heroku**: Direct Docker deployment
- **DigitalOcean**: Docker droplets
- **AWS ECS**: Container service
- **Google Cloud Run**: Serverless containers

### VPS Deployment
1. Clone repository on your server
2. Configure environment variables
3. Run `docker-compose up -d`
4. Setup reverse proxy (nginx) for SSL

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

- **Website**: [Hotel Boss Demo](http://localhost:3000)
- **Repository**: [GitHub](https://github.com/dzelilah/hotel-boss-booking-system)
- **Issues**: [Report Bug](https://github.com/dzelilah/hotel-boss-booking-system/issues)

---

<p align="center">Made with ❤️ for modern hotel management</p>