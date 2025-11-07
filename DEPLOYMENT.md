# 🚀 Deployment Instructions

This document provides step-by-step instructions for deploying the Hotel Boss Booking System to various platforms.

## 📋 Prerequisites

- Git installed
- Docker and Docker Compose installed
- Node.js 18+ (for manual deployment)
- Domain name (for production)
- SSL certificate (recommended)

## 🐳 Docker Deployment (Recommended)

### Local Development
```bash
git clone https://github.com/dzelilah/hotel-boss-booking-system.git
cd hotel-boss-booking-system
docker-compose -f docker-compose.dev.yml up -d
```

### Production Deployment
```bash
git clone https://github.com/dzelilah/hotel-boss-booking-system.git
cd hotel-boss-booking-system
docker-compose up -d
```

## ☁️ Cloud Platform Deployments

### Heroku Deployment

1. **Install Heroku CLI**
2. **Login and create apps**:
```bash
heroku login
heroku create hotel-boss-frontend
heroku create hotel-boss-backend
```

3. **Deploy Backend**:
```bash
cd backend
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a hotel-boss-backend
git push heroku master
```

4. **Configure environment variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set SMTP_HOST=your-smtp-host
heroku config:set SMTP_USER=your-email
heroku config:set SMTP_PASS=your-password
```

### DigitalOcean Droplet

1. **Create Ubuntu droplet**
2. **Install Docker**:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER
```

3. **Deploy application**:
```bash
git clone https://github.com/dzelilah/hotel-boss-booking-system.git
cd hotel-boss-booking-system
docker-compose up -d
```

4. **Setup Nginx reverse proxy**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### AWS ECS Deployment

1. **Create ECS cluster**
2. **Build and push Docker images**:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker build -t hotel-boss-backend ./backend
docker tag hotel-boss-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/hotel-boss-backend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/hotel-boss-backend:latest

docker build -t hotel-boss-frontend ./frontend
docker tag hotel-boss-frontend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/hotel-boss-frontend:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/hotel-boss-frontend:latest
```

3. **Create ECS task definitions and services**

## 🔧 Manual Deployment (VPS)

### Ubuntu/Debian Server

1. **Update system**:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm nginx -y
```

2. **Clone and setup backend**:
```bash
git clone https://github.com/dzelilah/hotel-boss-booking-system.git
cd hotel-boss-booking-system/backend
npm install --production
```

3. **Create systemd service** (`/etc/systemd/system/hotel-boss.service`):
```ini
[Unit]
Description=Hotel Boss Booking System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/hotel-boss-booking-system/backend
ExecStart=/usr/bin/node src/app.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=5000

[Install]
WantedBy=multi-user.target
```

4. **Setup Nginx** (`/etc/nginx/sites-available/hotel-boss`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/hotel-boss-booking-system/frontend/public;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable and start services**:
```bash
sudo systemctl enable hotel-boss
sudo systemctl start hotel-boss
sudo ln -s /etc/nginx/sites-available/hotel-boss /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

## 🔒 SSL Setup with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
sudo systemctl enable certbot.timer
```

## 🔧 Environment Configuration

Create `.env` file in backend directory:

```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Hotel Information
HOTEL_NAME=Hotel Boss
HOTEL_EMAIL=info@yourdomain.com

# Email Service (Choose one)
# Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password

# Custom SMTP
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=booking@yourdomain.com
SMTP_PASS=your-secure-password
```

## 📊 Monitoring and Maintenance

### Health Checks
- Frontend: `http://yourdomain.com`
- Backend API: `http://yourdomain.com/api/health`

### Log Monitoring
```bash
# Docker logs
docker-compose logs -f

# Systemd logs
sudo journalctl -u hotel-boss -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup Strategy
```bash
# Backup configuration
tar -czf hotel-boss-backup-$(date +%Y%m%d).tar.gz /path/to/hotel-boss-booking-system

# Database backup (if using database)
# mysqldump or pg_dump commands here
```

## 🔄 Updates and Maintenance

### Docker Update
```bash
git pull origin master
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Manual Update
```bash
git pull origin master
cd backend && npm install --production
sudo systemctl restart hotel-boss
sudo systemctl reload nginx
```

## 🛡️ Security Checklist

- [ ] Use HTTPS/SSL certificates
- [ ] Configure firewall (UFW/iptables)
- [ ] Set up fail2ban for SSH protection
- [ ] Use strong passwords for SMTP
- [ ] Regular system updates
- [ ] Monitor logs for suspicious activity
- [ ] Backup data regularly
- [ ] Use environment variables for sensitive data

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**:
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

2. **Permission denied**:
```bash
sudo chown -R www-data:www-data /path/to/project
sudo chmod -R 755 /path/to/project
```

3. **Nginx configuration test**:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

4. **Check service status**:
```bash
sudo systemctl status hotel-boss
sudo systemctl status nginx
```

For more help, check the [GitHub Issues](https://github.com/dzelilah/hotel-boss-booking-system/issues) page.