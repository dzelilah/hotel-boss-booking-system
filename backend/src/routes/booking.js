import express from 'express';
import BookingController from '../controllers/bookingController.js';
import EmailService from '../services/emailService.js';
import { validateBookingData, rateLimitBooking } from '../middleware/validation.js';

const router = express.Router();

// Create instances
const emailService = new EmailService();
const bookingController = new BookingController(emailService);

// POST route for booking reservations
router.post('/', rateLimitBooking, validateBookingData, async (req, res) => {
    try {
        await bookingController.createBooking(req, res);
    } catch (error) {
        console.error('Booking route error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during booking process'
        });
    }
});

export default router;