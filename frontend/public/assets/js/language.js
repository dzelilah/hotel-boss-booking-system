// Language translations
const translations = {
    bs: {
        // Navigation
        'nav-home': 'POČETNA',
        'nav-rooms': 'SOBE', 
        'nav-about': 'O NAMA',
        'nav-gallery': 'GALERIJA SLIKA',
        'nav-contact': 'REZERVIŠI SMJEŠTAJ',
        
        // Gallery page
        'gallery-title': 'Galerija Hotela',
        'gallery-description': 'Otkrijte eleganciju i ljepotu Hotel Boss-a kroz našu kolekciju prekrasnih slika koje prikazuju naš smještaj, sadržaje i ambijent.',
        'category-all': 'Sve Slike',
        'category-rooms': 'Sobe i Apartmani',
        'category-exterior': 'Eksterijer Hotela',
        
        // Room titles
        'room-standard': 'Standardna Soba',
        'room-deluxe': 'Deluxe Soba',
        'room-executive': 'Izvršni Apartman',
        'room-family': 'Porodična Soba',
        
        // Room descriptions
        'room-standard-desc': 'Moderna udobnost',
        'room-deluxe-desc': 'Pogled na grad i luksuz',
        'room-executive-desc': 'Premium smještaj',
        'room-family-desc': 'Prostor za porodice',
        
        // Exterior titles
        'exterior-hotel': 'Eksterijer Hotela',
        'exterior-night': 'Noćni Pogled',
        'exterior-entrance': 'Glavni Ulaz',
        'exterior-city': 'Pogled na Grad',
        
        // Exterior descriptions
        'exterior-hotel-desc': 'Moderan i elegantan',
        'exterior-night-desc': 'Prekrasno osvjetljenje',
        'exterior-entrance-desc': 'Dobrodošli i veličanstven',
        'exterior-city-desc': 'Panoramski pogled',
        
        // CTA section
        'cta-title': 'Spremni da doživite Hotel Boss?',
        'cta-description': 'Rezervišite svoj boravak danas i otkrijte zašto naši gosti biraju nas za svoj komfor i luksuzne potrebe.',
        'cta-button': 'Napravite Rezervaciju',
        
        // Footer
        'footer-description': 'Vaša glavna destinacija za luksuzni smještaj.',
        'footer-contact-title': 'Kontakt',
        'footer-copyright': '© 2024 Hotel Boss. Sva prava zadržana.',
        
        // Index page
        'index-title': 'Hotel Boss - Luksuzni Smještaj',
        'index-welcome': 'Dobrodošli u',
        'index-subtitle': 'Glamur i luksuz na dohvat ruke',
        'index-cta': 'Rezervišite sada',
        'index-about-title': 'O Hotel Boss',
        'index-about-p1': 'Smešten u veoma mirnom delu grada koji odiše prošlim vremenima, garantuje kvalitetan odmor, koji je svima potreban, kako bi bili spremni za nove izazove i svakodnevne obavege.',
        'index-about-p2': '16 komfornih i luksuznih soba uređenih u skladu sa najnovijim trendovima omogućiće da se osećate odmorno, sveže i spremno kako za poslovne susrete i obaveze, tako i za putovanja iz privatnih razloga.',
        'index-about-p3': 'Hotelu posebnost daje njegova lokacija gde su Vam istorijske građevine na dohvat ruke bez korišćenja prevoznih sredstava.',
        'index-about-p4': 'Objedinili smo visoki standard i udobnost, profesionalnost i ljubaznost, te želimo da naš hotel "Hotel Boss" bude mesto koje ćete osećati kao "drugi dom", jer Vaše želje stavljamo na prvo mesto.',
        'index-feature1-title': '🏛️ Istorijska Lokacija',
        'index-feature1-desc': 'Istorijske građevine u krugu od par koraka',
        'index-feature2-title': '🛏️ 16 Luksuznih Soba',
        'index-feature2-desc': 'Komfor dizajniran prema najnovijim trendovima',
        'index-feature3-title': '🌟 Visoki Standardi Usluge',
        'index-feature3-desc': 'Profesionalno i ljubazno osoblje',
        'index-rooms-title': 'Naše Sobe',
        'index-footer-desc': 'Doživite luksuz i komfor u srcu Sarajeva.',
        
        // Contact page
        'contact-title': 'Rezervišite Vaš Boravak - Hotel Boss',
        'contact-hero-title': 'Rezervišite Vaš Boravak',
        'contact-hero-desc': 'Rezervišite savršen smještaj u Hotel Boss. Popunite formu i poslat ćemo vam potvrdu emailom sa svim detaljima.',
        'contact-form-title': 'Detalji Rezervacije',
        'contact-help-title': 'Trebate Pomoć?',
        'contact-help-desc': 'Naš tim za rezervacije je dostupan 24/7 da vam pomogne sa vašom rezervacijom.',
        'contact-call': 'Pozovite Sada',
        'contact-email': 'Pošaljite Email'
    },
    en: {
        // Navigation
        'nav-home': 'HOME',
        'nav-rooms': 'ROOMS',
        'nav-about': 'ABOUT US',
        'nav-gallery': 'GALLERY',
        'nav-contact': 'BOOK NOW',
        
        // Gallery page
        'gallery-title': 'Hotel Gallery',
        'gallery-description': 'Discover the elegance and beauty of Hotel Boss through our collection of stunning images showcasing our accommodations, facilities, and ambiance.',
        'category-all': 'All Photos',
        'category-rooms': 'Rooms & Suites',
        'category-exterior': 'Hotel Exterior',
        
        // Room titles
        'room-standard': 'Standard Room',
        'room-deluxe': 'Deluxe Room',
        'room-executive': 'Executive Suite',
        'room-family': 'Family Room',
        
        // Room descriptions
        'room-standard-desc': 'Modern comfort',
        'room-deluxe-desc': 'City views & luxury',
        'room-executive-desc': 'Premium accommodation',
        'room-family-desc': 'Family-friendly space',
        
        // Exterior titles
        'exterior-hotel': 'Hotel Exterior',
        'exterior-night': 'Night View',
        'exterior-entrance': 'Main Entrance',
        'exterior-city': 'City Views',
        
        // Exterior descriptions
        'exterior-hotel-desc': 'Modern & elegant',
        'exterior-night-desc': 'Beautiful illumination',
        'exterior-entrance-desc': 'Welcoming & grand',
        'exterior-city-desc': 'Panoramic vistas',
        
        // CTA section
        'cta-title': 'Ready to Experience Hotel Boss?',
        'cta-description': 'Book your stay today and discover why our guests choose us for their comfort and luxury needs.',
        'cta-button': 'Make Reservation',
        
        // Footer
        'footer-description': 'Your premier destination for luxury accommodation.',
        'footer-contact-title': 'Contact',
        'footer-copyright': '© 2024 Hotel Boss. All rights reserved.',
        
        // Index page
        'index-title': 'Hotel Boss - Luxury Accommodation',
        'index-welcome': 'Welcome to',
        'index-subtitle': 'Glamour and luxury at your fingertips',
        'index-cta': 'Book Now',
        'index-about-title': 'About Hotel Boss',
        'index-about-p1': 'Located in a very quiet part of the city that breathes past times, guarantees quality rest, which everyone needs, in order to be ready for new challenges and daily obligations.',
        'index-about-p2': '16 comfortable and luxurious rooms decorated in accordance with the latest trends will allow you to feel rested, fresh and ready for both business meetings and obligations, as well as for travel for private reasons.',
        'index-about-p3': 'The hotel is special because of its location where historical buildings are within reach without using means of transport.',
        'index-about-p4': 'We have combined high standards and comfort, professionalism and kindness, and we want our hotel "Hotel Boss" to be a place that you will feel like a "second home", because we put your wishes first.',
        'index-feature1-title': '🏛️ Historic Location',
        'index-feature1-desc': 'Historic buildings within walking distance',
        'index-feature2-title': '🛏️ 16 Luxury Rooms',
        'index-feature2-desc': 'Comfort designed with latest trends',
        'index-feature3-title': '🌟 High Service Standards',
        'index-feature3-desc': 'Professional and friendly staff',
        'index-rooms-title': 'Our Rooms',
        'index-footer-desc': 'Experience luxury and comfort in the heart of Sarajevo.',
        
        // Contact page
        'contact-title': 'Book Your Stay - Hotel Boss',
        'contact-hero-title': 'Book Your Stay',
        'contact-hero-desc': 'Reserve the perfect accommodation at Hotel Boss. Fill out the form and we will send you an email confirmation with all the details.',
        'contact-form-title': 'Reservation Details',
        'contact-help-title': 'Need Help?',
        'contact-help-desc': 'Our reservation team is available 24/7 to assist you with your booking.',
        'contact-call': 'Call Now',
        'contact-email': 'Email Us'
    }
};

// Language management
class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'bs';
        this.init();
    }
    
    init() {
        this.setupLanguageButtons();
        this.updateLanguage(this.currentLang);
    }
    
    setupLanguageButtons() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
    }
    
    switchLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updateLanguage(lang);
        this.updateActiveButton(lang);
        
        // Update page title
        this.updatePageTitle(lang);
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
    }
    
    updateLanguage(lang) {
        const elements = document.querySelectorAll('[data-text-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-text-key');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }
    
    updateActiveButton(lang) {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
    }
    
    updatePageTitle(lang) {
        const currentPath = window.location.pathname;
        const fileName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        
        let titleKey = '';
        switch(fileName) {
            case 'index.html':
            case '':
                titleKey = 'index-title';
                break;
            case 'gallery.html':
                titleKey = lang === 'bs' ? 'Galerija - Hotel Boss' : 'Gallery - Hotel Boss';
                break;
            case 'contact.html':
                titleKey = 'contact-title';
                break;
            case 'about.html':
                titleKey = lang === 'bs' ? 'O Nama - Hotel Boss' : 'About Us - Hotel Boss';
                break;
            case 'rooms.html':
                titleKey = lang === 'bs' ? 'Sobe - Hotel Boss' : 'Rooms - Hotel Boss';
                break;
        }
        
        if (titleKey && translations[lang] && translations[lang][titleKey]) {
            document.title = translations[lang][titleKey];
        } else if (titleKey) {
            document.title = titleKey;
        }
    }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
});