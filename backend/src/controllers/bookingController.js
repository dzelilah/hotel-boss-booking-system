class BookingController {
    constructor(emailService) {
        this.emailService = emailService;
    }

    async createBooking(req, res) {
        const startTime = Date.now();
        const { name, email, arrivalDate, nights, roomType, phone, guests, specialRequests, newsletter } = req.body;

        console.log('📝 Processing new booking request:');
        console.log('Guest:', name, '|', 'Email:', email, '|', 'Dates:', arrivalDate, 'for', nights, 'nights');

        try {
            // In a real application, you would save to database here
            const bookingData = {
                name: name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone?.trim(),
                guests: parseInt(guests),
                arrivalDate,
                nights: parseInt(nights),
                roomType,
                specialRequests: specialRequests?.trim(),
                newsletter: Boolean(newsletter),
                bookingTime: new Date().toISOString(),
                ipAddress: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent')
            };

            // TODO: Save to database
            // const savedBooking = await this.saveBookingToDatabase(bookingData);

            // Send confirmation emails
            const emailResult = await this.emailService.sendBookingConfirmation(
                email, 
                name, 
                arrivalDate, 
                nights, 
                roomType, 
                bookingData
            );

            const processingTime = Date.now() - startTime;
            
            console.log(`✅ Booking processed successfully in ${processingTime}ms`);
            console.log('Booking ID:', emailResult.bookingId);

            // Success response
            return res.status(201).json({
                success: true,
                message: 'Booking created successfully! Confirmation email has been sent.',
                data: {
                    bookingId: emailResult.bookingId,
                    guest: {
                        name: bookingData.name,
                        email: bookingData.email
                    },
                    reservation: {
                        arrivalDate: bookingData.arrivalDate,
                        nights: bookingData.nights,
                        roomType: bookingData.roomType,
                        guests: bookingData.guests
                    },
                    emailSent: true,
                    messageId: emailResult.messageId
                },
                meta: {
                    processingTime: `${processingTime}ms`,
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            const processingTime = Date.now() - startTime;
            
            console.error('❌ Booking failed:');
            console.error('Error:', error.message);
            console.error('Processing time:', `${processingTime}ms`);

            // Determine error type and appropriate response
            let statusCode = 500;
            let errorMessage = 'An unexpected error occurred while processing your booking.';
            
            if (error.message.includes('Email could not be sent')) {
                statusCode = 503;
                errorMessage = 'Booking received but email confirmation failed. We will contact you shortly.';
            } else if (error.message.includes('SMTP')) {
                statusCode = 503;
                errorMessage = 'Email service temporarily unavailable. Your booking request has been received.';
            } else if (error.message.includes('timeout')) {
                statusCode = 504;
                errorMessage = 'Request timeout. Please try again.';
            }

            return res.status(statusCode).json({
                success: false,
                message: errorMessage,
                error: {
                    type: error.name || 'BookingError',
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
                },
                meta: {
                    processingTime: `${processingTime}ms`,
                    timestamp: new Date().toISOString(),
                    supportInfo: {
                        email: process.env.HOTEL_EMAIL || 'support@hoteleurope.com',
                        phone: '+1 (555) 123-4567'
                    }
                }
            });
        }
    }

    // TODO: Implement database operations
    async saveBookingToDatabase(bookingData) {
        // This would integrate with your database (MongoDB, PostgreSQL, etc.)
        // For now, we'll just log that this would happen
        console.log('💾 [TODO] Save booking to database:', bookingData.name, '-', bookingData.bookingId);
        return { id: 'db_' + Date.now(), ...bookingData };
    }

    async getBookingById(bookingId) {
        // TODO: Implement database retrieval
        console.log('🔍 [TODO] Get booking from database:', bookingId);
        return null;
    }

    async updateBooking(bookingId, updates) {
        // TODO: Implement booking updates
        console.log('📝 [TODO] Update booking in database:', bookingId, updates);
        return null;
    }

    async cancelBooking(bookingId) {
        // TODO: Implement booking cancellation
        console.log('❌ [TODO] Cancel booking in database:', bookingId);
        return null;
    }
}

export default BookingController;