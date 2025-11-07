document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        // Set minimum date to today
        const arrivalDateInput = document.getElementById('arrival-date');
        if (arrivalDateInput) {
            arrivalDateInput.min = new Date().toISOString().split('T')[0];
        }
        
        // Form submission handler
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const bookingData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                guests: formData.get('guests'),
                arrivalDate: formData.get('arrivalDate'),
                nights: formData.get('nights'),
                roomType: formData.get('roomType'),
                specialRequests: formData.get('specialRequests'),
                newsletter: formData.get('newsletter') ? true : false
            };
            
            // Basic form validation
            if (!validateBookingForm(bookingData)) {
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline';
            submitBtn.disabled = true;
            
            try {
                // Call real API
                const result = await submitBookingAPI(bookingData);
                
                // Show success message with booking ID
                showNotification(`✅ Booking confirmed! Your booking ID is: ${result.data.bookingId}. A confirmation email has been sent to ${bookingData.email}.`, 'success');
                form.reset();
                
            } catch (error) {
                console.error('Booking error:', error);
                showNotification('❌ There was an error processing your booking. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button state
                if (btnText) btnText.style.display = 'inline';
                if (btnLoader) btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});

// Form validation
function validateBookingForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.arrivalDate) {
        errors.push('Please select an arrival date');
    } else {
        const arrivalDate = new Date(data.arrivalDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (arrivalDate < today) {
            errors.push('Arrival date cannot be in the past');
        }
    }
    
    if (!data.nights || data.nights < 1 || data.nights > 30) {
        errors.push('Please enter a valid number of nights (1-30)');
    }
    
    if (!data.roomType) {
        errors.push('Please select a room type');
    }
    
    if (!data.guests) {
        errors.push('Please select the number of guests');
    }
    
    if (errors.length > 0) {
        showNotification('Please fix the following errors:\n• ' + errors.join('\n• '), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Real API call to backend
async function submitBookingAPI(bookingData) {
    const API_BASE_URL = 'http://localhost:5000/api';
    
    const response = await fetch(`${API_BASE_URL}/book`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
    });

    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }
    
    return result;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        z-index: 10000;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease;
    `;
    
    // Type-specific styles
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
        notification.style.color = 'white';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
        notification.style.color = 'white';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        padding: 1rem 1.5rem;
        display: flex;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .notification-content p {
        margin: 0;
        flex: 1;
        white-space: pre-line;
    }
    
    .notification-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: inherit;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        background: rgba(255,255,255,0.3);
    }
`;
document.head.appendChild(style);