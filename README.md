# Hotel Boss - Booking System

A modern hotel booking website with email notifications built with Node.js backend and responsive HTML/CSS/JS frontend.

## Features

- 🏨 Modern hotel website with responsive design
- 📧 Email booking notifications
- 🌐 Bilingual support (Bosnian/English)
- 📱 Mobile-optimized interface
- 🎨 Professional gallery with image filtering
- 🔧 RESTful API backend

## Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive design
- AOS animations
- Bilingual language switcher

**Backend:**
- Node.js with Express
- Email notifications with Nodemailer
- CORS, Helmet, Rate limiting
- RESTful API architecture

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed

### Production Setup
```bash
# Clone the repository
git clone <repository-url>
cd hotel-booking

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

## Manual Setup (Without Docker)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm start
```

### Frontend Setup
```bash
cd frontend/public
python -m http.server 3000
# or use any static file server
```

## Environment Configuration

Create `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Hotel Configuration  
HOTEL_NAME=Hotel Boss
HOTEL_EMAIL=info@hoteleurope.com

# SMTP Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
```

## API Endpoints

- `POST /api/booking` - Submit booking request
- `GET /health` - Health check endpoint

## Project Structure

```
hotel-booking/
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

## Docker Commands

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

## Development

For local development with live reload:

1. Use `docker-compose.dev.yml` for containerized development
2. Or run services manually for faster iteration

## Production Deployment

1. Update environment variables in `.env`
2. Configure proper SMTP settings
3. Use `docker-compose.yml` for production
4. Consider using reverse proxy (nginx) for SSL termination

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is licensed under the MIT License.