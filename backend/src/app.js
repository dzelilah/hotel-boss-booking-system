import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bookingRoutes from './routes/index.js';
import EmailService from './services/emailService.js';

// Load environment variables
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const app = express();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://0.0.0.0:3000',
            'http://[::]:3000',
            'http://127.0.0.1:5500',
            'http://localhost:5500',
            'http://localhost:8080'
        ];
        
        console.log(`🌐 CORS request from origin: ${origin || 'null'}`);
        
        // Allow requests with no origin (mobile apps, file://, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.MAX_BOOKING_ATTEMPTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil((parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000) / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Hotel Boss Booking API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api', bookingRoutes);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method,
        availableEndpoints: {
            'GET /health': 'Health check',
            'POST /api/book': 'Create booking reservation',
            'GET /api/test-email': 'Test email configuration'
        }
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Error occurred:');
    console.error('Path:', req.path);
    console.error('Method:', req.method);
    console.error('Error:', err);
    
    // Don't leak error details in production
    const isDev = process.env.NODE_ENV === 'development';
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: isDev ? err.details : undefined
        });
    }
    
    if (err.message?.includes('CORS')) {
        return res.status(403).json({
            success: false,
            message: 'CORS policy violation'
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: isDev ? err.message : 'Internal server error',
        error: isDev ? {
            name: err.name,
            stack: err.stack
        } : undefined
    });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
    console.log('🚀 Hotel Boss Booking API Started');
    console.log('=================================');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📧 Booking API: http://localhost:${PORT}/api/book`);
    
    // Test email configuration on startup
    try {
        const emailService = new EmailService();
        
        // Give EmailService time to initialize
        setTimeout(async () => {
            try {
                const isEmailConnected = await emailService.testConnection();
                if (isEmailConnected) {
                    console.log('✅ Email service configured successfully');
                } else {
                    console.log('⚠️  Email service configuration failed - check your SMTP settings in .env');
                }
            } catch (error) {
                console.log('⚠️  Email service error:', error.message);
            }
        }, 1000);
        
    } catch (error) {
        console.log('⚠️  Email service initialization error:', error.message);
    }
    
    console.log('=================================');
});

export default app;