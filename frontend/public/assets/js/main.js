document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('active');
    };
    
    // Sticky navigation
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
    
    // Scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.display = 'none';
    document.body.appendChild(scrollToTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Initialize placeholder images
    initPlaceholderImages();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Initialize placeholder images using Unsplash
function initPlaceholderImages() {
    const hotelImages = [
        // Hotel exterior images
        { src: 'assets/images/hotel-exterior.jpg', placeholder: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop' },
        { src: 'assets/images/hotel-exterior-day.jpg', placeholder: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop' },
        { src: 'assets/images/hotel-exterior-night.jpg', placeholder: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop' },
        
        // Room images
        { src: 'assets/images/room1.jpg', placeholder: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop' },
        { src: 'assets/images/room2.jpg', placeholder: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop' },
        { src: 'assets/images/suite.jpg', placeholder: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop' },
        { src: 'assets/images/family-room.jpg', placeholder: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop' },
        
        // Detailed room images for gallery
        { src: 'assets/images/room-standard-1.jpg', placeholder: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop' },
        { src: 'assets/images/room-deluxe-1.jpg', placeholder: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop' },
        { src: 'assets/images/suite-executive.jpg', placeholder: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop' },
        
        // Facilities
        { src: 'assets/images/lobby.jpg', placeholder: 'https://images.unsplash.com/photo-1577683946856-7089f7309636?w=800&h=600&fit=crop' },
        { src: 'assets/images/restaurant.jpg', placeholder: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop' },
        { src: 'assets/images/bar.jpg', placeholder: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop' },
        { src: 'assets/images/fitness-center.jpg', placeholder: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop' },
        { src: 'assets/images/business-center.jpg', placeholder: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop' },
        { src: 'assets/images/conference-room.jpg', placeholder: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800&h=600&fit=crop' },
        
        // Additional images
        { src: 'assets/images/breakfast.jpg', placeholder: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&h=600&fit=crop' },
        { src: 'assets/images/entrance.jpg', placeholder: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop' },
        { src: 'assets/images/city-view.jpg', placeholder: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop' }
    ];
    
    // Replace image sources with beautiful Unsplash placeholder URLs
    hotelImages.forEach(imageData => {
        const imgs = document.querySelectorAll(`img[src="${imageData.src}"]`);
        imgs.forEach(img => {
            img.src = imageData.placeholder;
            img.onerror = function() {
                // Fallback to a simple placeholder if Unsplash fails
                const width = 800;
                const height = 600;
                const text = img.alt || 'Hotel Image';
                img.src = `https://via.placeholder.com/${width}x${height}/1e3c72/ffffff?text=${encodeURIComponent(text)}`;
            };
        });
    });
}