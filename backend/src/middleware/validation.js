// Validation middleware for booking data
export const validateBookingData = (req, res, next) => {
    const errors = [];
    const { name, email, arrivalDate, nights, roomType, guests, phone } = req.body;

    // Required field validation
    if (!name || name.trim().length < 2) {
        errors.push('Name is required and must be at least 2 characters long');
    }

    if (!email) {
        errors.push('Email is required');
    } else if (!isValidEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!arrivalDate) {
        errors.push('Arrival date is required');
    } else if (!isValidDate(arrivalDate)) {
        errors.push('Please provide a valid arrival date');
    } else if (isPastDate(arrivalDate)) {
        errors.push('Arrival date cannot be in the past');
    }

    if (!nights) {
        errors.push('Number of nights is required');
    } else if (!isValidNights(nights)) {
        errors.push('Number of nights must be between 1 and 30');
    }

    if (!roomType) {
        errors.push('Room type is required');
    } else if (!isValidRoomType(roomType)) {
        errors.push('Please select a valid room type');
    }

    if (!guests) {
        errors.push('Number of guests is required');
    } else if (!isValidGuestCount(guests)) {
        errors.push('Number of guests must be between 1 and 4');
    }

    // Optional field validation
    if (phone && !isValidPhone(phone)) {
        errors.push('Please provide a valid phone number');
    }

    // Name validation (no numbers, reasonable length)
    if (name && (name.length > 100 || /\d/.test(name))) {
        errors.push('Name should not contain numbers and must be under 100 characters');
    }

    // Special requests length validation
    if (req.body.specialRequests && req.body.specialRequests.length > 500) {
        errors.push('Special requests must be under 500 characters');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors
        });
    }

    // Sanitize data
    req.body.name = sanitizeString(req.body.name);
    req.body.email = req.body.email.toLowerCase().trim();
    if (req.body.phone) req.body.phone = sanitizeString(req.body.phone);
    if (req.body.specialRequests) req.body.specialRequests = sanitizeString(req.body.specialRequests);

    next();
};

// Rate limiting middleware
export const rateLimitBooking = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Simple in-memory rate limiting (in production, use Redis)
    if (!global.bookingAttempts) {
        global.bookingAttempts = new Map();
    }
    
    const attempts = global.bookingAttempts.get(clientIp) || [];
    const recentAttempts = attempts.filter(timestamp => now - timestamp < 15 * 60 * 1000); // 15 minutes
    
    if (recentAttempts.length >= 5) {
        return res.status(429).json({
            success: false,
            message: 'Too many booking attempts. Please try again in 15 minutes.',
            retryAfter: 15 * 60 // seconds
        });
    }
    
    recentAttempts.push(now);
    global.bookingAttempts.set(clientIp, recentAttempts);
    
    next();
};

// Helper validation functions
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}

function isPastDate(dateString) {
    const inputDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return inputDate < today;
}

function isValidNights(nights) {
    const numNights = parseInt(nights);
    return Number.isInteger(numNights) && numNights >= 1 && numNights <= 30;
}

function isValidRoomType(roomType) {
    const validTypes = ['standard', 'deluxe', 'suite', 'family'];
    return validTypes.includes(roomType);
}

function isValidGuestCount(guests) {
    const numGuests = parseInt(guests);
    return Number.isInteger(numGuests) && numGuests >= 1 && numGuests <= 4;
}

function isValidPhone(phone) {
    // Basic international phone number validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 7 && cleanPhone.length <= 20;
}

function sanitizeString(str) {
    if (typeof str !== 'string') return str;
    return str
        .trim()
        .replace(/[<>]/g, '') // Remove potential XSS characters
        .replace(/\s+/g, ' '); // Normalize whitespace
}

// Export all validation functions for testing
export const validationHelpers = {
    isValidEmail,
    isValidDate,
    isPastDate,
    isValidNights,
    isValidRoomType,
    isValidGuestCount,
    isValidPhone,
    sanitizeString
};