import EmailService from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmailService() {
    console.log('🧪 Testing Email Service...');
    console.log('===============================');
    
    try {
        const emailService = new EmailService();
        
        // Test connection
        console.log('📡 Testing SMTP connection...');
        const isConnected = await emailService.testConnection();
        
        if (!isConnected) {
            console.error('❌ SMTP connection failed!');
            console.log('\n📋 Check these settings in your .env file:');
            console.log('- SMTP_HOST');
            console.log('- SMTP_PORT');
            console.log('- SMTP_USER');
            console.log('- SMTP_PASS');
            return;
        }
        
        console.log('✅ SMTP connection successful!');
        
        // Test sending email
        console.log('\n📧 Sending test booking confirmation...');
        
        const testBookingData = {
            name: 'John Doe',
            email: process.env.SMTP_USER, // Send to yourself for testing
            phone: '+1 (555) 123-4567',
            guests: 2,
            arrivalDate: '2024-12-15',
            nights: 3,
            roomType: 'deluxe',
            specialRequests: 'Late check-in requested, city view room preferred',
            newsletter: true,
            bookingTime: new Date().toISOString()
        };
        
        const result = await emailService.sendBookingConfirmation(
            testBookingData.email,
            testBookingData.name,
            testBookingData.arrivalDate,
            testBookingData.nights,
            testBookingData.roomType,
            testBookingData
        );
        
        console.log('✅ Test email sent successfully!');
        console.log('📋 Booking ID:', result.bookingId);
        console.log('📧 Message ID:', result.messageId);
        console.log('📮 Recipient:', testBookingData.email);
        
        console.log('\n🎉 Email service is working correctly!');
        console.log('You should receive a confirmation email shortly.');
        
    } catch (error) {
        console.error('❌ Email test failed:');
        console.error('Error:', error.message);
        
        if (error.message.includes('authentication')) {
            console.log('\n💡 Authentication Tips:');
            console.log('- For Gmail: Use App Password, not your regular password');
            console.log('- Go to: Google Account > Security > 2-Step Verification > App passwords');
            console.log('- Generate an app password and use it in SMTP_PASS');
        }
        
        if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Connection Tips:');
            console.log('- Check your SMTP_HOST and SMTP_PORT settings');
            console.log('- Make sure you have internet connection');
            console.log('- Try using a different SMTP provider (Mailtrap, Ethereal)');
        }
    }
}

// Run the test
testEmailService();