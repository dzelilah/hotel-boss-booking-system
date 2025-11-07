import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../../.env') });

class EmailService {
    constructor() {
        this.transporter = null;
        this.etherealUser = null;
        this.initializeTransporter();
    }

    async initializeTransporter() {
        try {
            // Create test account if using Ethereal
            if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
                const testAccount = await nodemailer.createTestAccount();
                
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass
                    }
                });

                // Store ethereal user for email sending
                this.etherealUser = testAccount.user;
                
                console.log('📧 Ethereal Email Test Account:');
                console.log('User:', testAccount.user);
                console.log('Pass:', testAccount.pass);
            } else {
                this.transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: process.env.SMTP_PORT || 587,
                    secure: process.env.SMTP_PORT === '465',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });
            }

            // Verify connection
            await this.transporter.verify();
            console.log('✅ SMTP connection successful');
        } catch (error) {
            console.error('❌ SMTP connection failed:', error.message);
        }
    }

    createTransporter() {
        // Fallback method - now handled by initializeTransporter
        if (!this.transporter) {
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: process.env.SMTP_PORT || 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        }
        return this.transporter;
    }

    async sendBookingConfirmation(email, name, arrivalDate, nights, roomType, bookingData = {}) {
        // Wait for transporter to be initialized
        if (!this.transporter) {
            await this.initializeTransporter();
        }

        const bookingId = this.generateBookingId();
        const checkoutDate = this.calculateCheckoutDate(arrivalDate, nights);
        
        const senderEmail = this.etherealUser || process.env.SMTP_USER;
        
        const mailOptions = {
            from: `"${process.env.HOTEL_NAME || 'Hotel Boss'}" <${senderEmail}>`,
            to: email,
            subject: `🏨 Booking Confirmation - ${bookingId} - Hotel Boss`,
            text: this.createTextEmail(name, bookingId, arrivalDate, checkoutDate, nights, roomType, bookingData),
            html: this.createHtmlEmail(name, bookingId, arrivalDate, checkoutDate, nights, roomType, bookingData)
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);
            console.log('✅ Confirmation email sent successfully to:', email);
            console.log('Message ID:', result.messageId);
            
            // Show Ethereal preview URL if using test account
            if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
                console.log('📧 Preview email:', nodemailer.getTestMessageUrl(result));
            }
            
            // Send notification to hotel as well
            await this.sendHotelNotification(bookingData, bookingId);
            
            return { success: true, bookingId, messageId: result.messageId };
        } catch (error) {
            console.error('❌ Error sending confirmation email:', error);
            throw new Error(`Email could not be sent: ${error.message}`);
        }
    }

    async sendHotelNotification(bookingData, bookingId) {
        // Ensure transporter is initialized
        if (!this.transporter) {
            await this.initializeTransporter();
        }

        const senderEmail = this.etherealUser || process.env.SMTP_USER;
        const hotelEmail = process.env.HOTEL_EMAIL || senderEmail;
        
        const mailOptions = {
            from: `"Hotel Boss Booking System" <${senderEmail}>`,
            to: hotelEmail,
            subject: `🔔 New Booking Received - ${bookingId}`,
            html: this.createHotelNotificationEmail(bookingData, bookingId)
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log('✅ Hotel notification sent successfully');
        } catch (error) {
            console.error('❌ Error sending hotel notification:', error);
            // Don't throw here - guest confirmation is more important
        }
    }

    createTextEmail(name, bookingId, arrivalDate, checkoutDate, nights, roomType, bookingData) {
        return `
Dear ${name},

Thank you for choosing Hotel Boss! We're delighted to confirm your reservation.

BOOKING CONFIRMATION
Booking ID: ${bookingId}
Guest Name: ${name}
Email: ${bookingData.email || 'N/A'}
Phone: ${bookingData.phone || 'N/A'}

RESERVATION DETAILS
Check-in: ${this.formatDate(arrivalDate)} (3:00 PM)
Check-out: ${this.formatDate(checkoutDate)} (12:00 PM)
Nights: ${nights}
Room Type: ${this.getRoomTypeName(roomType)}
Guests: ${bookingData.guests || 'N/A'}

${bookingData.specialRequests ? `Special Requests: ${bookingData.specialRequests}` : ''}

WHAT'S INCLUDED
✓ Complimentary high-speed Wi-Fi
✓ Daily housekeeping service  
✓ 24/7 front desk assistance
✓ Free parking for registered guests
✓ Access to fitness center and business center

IMPORTANT INFORMATION
• Please bring a valid ID for check-in
• Early check-in and late check-out available (additional charges may apply)
• Free cancellation up to 24 hours before arrival
• Children under 12 stay free when sharing with parents

We look forward to welcoming you to Hotel Boss!

Best regards,
The Hotel Boss Team

Hotel Boss
123 Main Street, City Center
Phone: +1 (555) 123-4567
Email: info@hoteleurope.com
Website: www.hoteleurope.com
        `.trim();
    }

    createHtmlEmail(name, bookingId, arrivalDate, checkoutDate, nights, roomType, bookingData) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation - Hotel Boss</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🏨 Hotel Boss</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Booking Confirmation</p>
    </div>

    <!-- Content -->
    <div style="background: white; padding: 30px 20px; border: 1px solid #e0e0e0; border-top: none;">
        
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
            <h2 style="color: #1e3c72; margin-bottom: 10px;">Dear ${name},</h2>
            <p style="font-size: 16px; color: #666;">Thank you for choosing Hotel Boss! We're delighted to confirm your reservation.</p>
        </div>

        <!-- Booking ID Badge -->
        <div style="background: #f8f9fa; border-left: 4px solid #1e3c72; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin: 0 0 5px 0; color: #1e3c72;">Booking Confirmation ID</h3>
            <p style="margin: 0; font-size: 20px; font-weight: bold; color: #333;">${bookingId}</p>
        </div>

        <!-- Guest Information -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1e3c72; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">Guest Information</h3>
            <table style="width: 100%; margin-top: 10px;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Name:</td>
                    <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                    <td style="padding: 8px 0; color: #333;">${bookingData.email || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
                    <td style="padding: 8px 0; color: #333;">${bookingData.phone || 'N/A'}</td>
                </tr>
            </table>
        </div>

        <!-- Reservation Details -->
        <div style="margin: 25px 0;">
            <h3 style="color: #1e3c72; border-bottom: 2px solid #e0e0e0; padding-bottom: 5px;">Reservation Details</h3>
            <table style="width: 100%; margin-top: 10px;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Check-in:</td>
                    <td style="padding: 8px 0; color: #333;">${this.formatDate(arrivalDate)} <span style="color: #666;">(3:00 PM)</span></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Check-out:</td>
                    <td style="padding: 8px 0; color: #333;">${this.formatDate(checkoutDate)} <span style="color: #666;">(12:00 PM)</span></td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Nights:</td>
                    <td style="padding: 8px 0; color: #333;">${nights}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Room Type:</td>
                    <td style="padding: 8px 0; color: #333;">${this.getRoomTypeName(roomType)}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #555;">Guests:</td>
                    <td style="padding: 8px 0; color: #333;">${bookingData.guests || 'N/A'}</td>
                </tr>
            </table>
            
            ${bookingData.specialRequests ? `
            <div style="margin-top: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; padding: 15px;">
                <h4 style="margin: 0 0 8px 0; color: #856404;">Special Requests:</h4>
                <p style="margin: 0; color: #856404;">${bookingData.specialRequests}</p>
            </div>
            ` : ''}
        </div>

        <!-- What's Included -->
        <div style="background: #e8f5e8; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #2e7d32; margin-top: 0;">What's Included</h3>
            <ul style="margin: 10px 0; padding-left: 20px; color: #2e7d32;">
                <li>✓ Complimentary high-speed Wi-Fi</li>
                <li>✓ Daily housekeeping service</li>
                <li>✓ 24/7 front desk assistance</li>
                <li>✓ Free parking for registered guests</li>
                <li>✓ Access to fitness center and business center</li>
            </ul>
        </div>

        <!-- Important Information -->
        <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #1565c0; margin-top: 0;">Important Information</h3>
            <ul style="margin: 10px 0; padding-left: 20px; color: #1565c0;">
                <li>Please bring a valid ID for check-in</li>
                <li>Early check-in and late check-out available (additional charges may apply)</li>
                <li>Free cancellation up to 24 hours before arrival</li>
                <li>Children under 12 stay free when sharing with parents</li>
            </ul>
        </div>

        <!-- Contact Information -->
        <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; color: #666;">We look forward to welcoming you to Hotel Boss!</p>
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #1e3c72; margin: 0 0 10px 0;">Contact Us</h4>
                <p style="margin: 5px 0; color: #666;">📍 123 Main Street, City Center</p>
                <p style="margin: 5px 0; color: #666;">📞 +1 (555) 123-4567</p>
                <p style="margin: 5px 0; color: #666;">✉️ info@hoteleurope.com</p>
            </div>
        </div>
        
    </div>

    <!-- Footer -->
    <div style="background: #1a1a1a; color: #ccc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
        <p style="margin: 0; font-size: 14px;">Best regards,<br><strong style="color: #ffd700;">The Hotel Boss Team</strong></p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This is an automated confirmation email. Please do not reply directly to this message.</p>
    </div>

</body>
</html>
        `.trim();
    }

    createHotelNotificationEmail(bookingData, bookingId) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Booking - ${bookingId}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">🔔 New Booking Alert</h2>
        <p style="margin: 10px 0 0 0;">Booking ID: ${bookingId}</p>
    </div>

    <div style="background: white; border: 1px solid #e0e0e0; border-top: none; padding: 20px;">
        <h3>Booking Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${bookingData.name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${bookingData.email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${bookingData.phone || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Arrival:</td><td>${this.formatDate(bookingData.arrivalDate)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Nights:</td><td>${bookingData.nights}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Room Type:</td><td>${this.getRoomTypeName(bookingData.roomType)}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold;">Guests:</td><td>${bookingData.guests}</td></tr>
        </table>
        
        ${bookingData.specialRequests ? `
        <div style="margin-top: 20px; background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px;">
            <h4 style="margin: 0 0 10px 0;">Special Requests:</h4>
            <p style="margin: 0;">${bookingData.specialRequests}</p>
        </div>
        ` : ''}
        
        <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Booking received at: ${new Date().toLocaleString()}
        </p>
    </div>

</body>
</html>
        `.trim();
    }

    generateBookingId() {
        const prefix = 'HE';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.random().toString(36).substr(2, 3).toUpperCase();
        return `${prefix}${timestamp}${random}`;
    }

    calculateCheckoutDate(arrivalDate, nights) {
        const arrival = new Date(arrivalDate);
        const checkout = new Date(arrival);
        checkout.setDate(checkout.getDate() + parseInt(nights));
        return checkout.toISOString().split('T')[0];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getRoomTypeName(roomType) {
        const roomTypes = {
            'standard': 'Standard Room - €80/night',
            'deluxe': 'Deluxe Room - €120/night',
            'suite': 'Executive Suite - €200/night',
            'family': 'Family Room - €150/night'
        };
        return roomTypes[roomType] || roomType;
    }

    // Test email connection
    async testConnection() {
        try {
            // Ensure transporter is initialized
            if (!this.transporter) {
                await this.initializeTransporter();
            }
            
            if (this.transporter) {
                await this.transporter.verify();
                console.log('✅ SMTP connection successful');
                return true;
            } else {
                console.error('❌ SMTP transporter not initialized');
                return false;
            }
        } catch (error) {
            console.error('❌ SMTP connection failed:', error);
            return false;
        }
    }
}

export default EmailService;