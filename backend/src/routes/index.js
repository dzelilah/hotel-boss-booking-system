import express from 'express';
import bookingRoutes from './booking.js';
import EmailService from '../services/emailService.js';

const router = express.Router();

// Booking routes
router.use('/book', bookingRoutes);

// Test email endpoint (development only)
router.get('/test-email', async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ message: 'Endpoint not available in production' });
    }
    
    try {
        const emailService = new EmailService();
        const testResult = await emailService.testConnection();
        
        if (testResult) {
            res.json({
                success: true,
                message: 'Email configuration is working!',
                smtp: {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    user: process.env.SMTP_USER ? '***configured***' : 'not configured'
                }
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Email configuration failed',
                error: 'SMTP connection test failed'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Email test failed',
            error: error.message
        });
    }
});

export default router;