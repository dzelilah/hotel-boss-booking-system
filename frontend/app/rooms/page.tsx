'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRooms } from '@/lib/hooks/useRooms';
import { Suspense } from 'react';

const ROOM_IMAGES: Record<string, string> = {
  SINGLE: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
  DOUBLE: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
  SUITE: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
};

const ROOM_BADGE_CLASS: Record<string, string> = {
  SINGLE: '',
  DOUBLE: 'deluxe',
  SUITE: 'suite',
};

const ROOM_BADGE_LABELS: Record<string, string> = {
  SINGLE: 'Najpopularnija',
  DOUBLE: 'Deluxe',
  SUITE: 'Family Suite',
};

function RoomsContent() {
  const searchParams = useSearchParams();
  const availableOnly = searchParams.get('available') === 'true';
  const { data: rooms, isLoading, error } = useRooms(availableOnly);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" style={{ margin: '0 auto' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p style={{ color: '#dc2626' }}>Greška pri učitavanju soba. Molimo pokušajte ponovo.</p>
      </div>
    );
  }

  return (
    <div className="room-grid">
      {rooms && rooms.length > 0 ? (
        rooms.map((room) => (
          <div key={room.id} className="room-card detailed" data-aos="fade-up">
            <div className="room-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ROOM_IMAGES[room.type] || ROOM_IMAGES.SINGLE}
                alt={room.name}
              />
              <div className={`room-badge${ROOM_BADGE_CLASS[room.type] ? ` ${ROOM_BADGE_CLASS[room.type]}` : ''}`}>
                {ROOM_BADGE_LABELS[room.type] || room.type}
              </div>
              {!room.available && (
                <div className="room-badge" style={{ top: '45px', background: 'linear-gradient(45deg, #6b7280, #4b5563)' }}>
                  Zauzeta
                </div>
              )}
            </div>
            <div className="room-info">
              <h3>{room.name}</h3>
              {room.description && (
                <p className="room-description">{room.description}</p>
              )}
              <div className="room-services">
                <h4>Usluge:</h4>
                <div className="services-grid">
                  <span>🍷 Mini Bar</span>
                  <span>📶 WI-FI</span>
                  <span>❄️ Klima</span>
                  <span>📺 LED TV</span>
                  <span>🕐 7/24 SERVICE</span>
                </div>
              </div>
              <div className="room-specs">
                <span>👥 Maksimalno: {room.capacity} {room.capacity === 1 ? 'osoba' : 'osobe'}</span>
                <span>💶 {room.pricePerNight}€/noć</span>
              </div>
              <div className="price-booking">
                <Link href={`/rooms/${room.id}`} className="book-btn" style={{ background: 'linear-gradient(45deg, #64748b, #475569)', marginRight: '0.5rem' }}>
                  Detalji
                </Link>
                {room.available && (
                  <Link href={`/booking/${room.id}`} className="book-btn">
                    Rezervišite Sada
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        /* Static rooms when API returns no results */
        <>
          <div className="room-card detailed" data-aos="fade-up" data-aos-delay="100">
            <div className="room-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop" alt="Standard Soba" />
              <div className="room-badge">Najpopularnija</div>
            </div>
            <div className="room-info">
              <h3>Standard Soba</h3>
              <p className="room-description">Dvokrevetna soba sa bračnim krevetom. Soba pored ostalog sadrži i mini-bar, klima uređaj i Led TV.</p>
              <div className="room-features">
                <h4>U cenu sobe je uključeno:</h4>
                <ul>
                  <li>🛏️ Udobnost</li>
                  <li>🍳 Doručak</li>
                  <li>📶 Hotspot (WiFi)</li>
                  <li>🍷 Mini Bar</li>
                  <li>🏙️ Pogled na grad</li>
                  <li>🔒 Sigurnosni sef</li>
                  <li>❄️ Klima</li>
                  <li>🕐 7/24 service</li>
                </ul>
              </div>
              <div className="room-specs">
                <span>👥 Maksimalno: 2 odrasle osobe</span>
                <span>🛏️ Bračni krevet</span>
              </div>
              <div className="price-booking">
                <Link href="/contact" className="book-btn">Rezervišite Sada</Link>
              </div>
            </div>
          </div>

          <div className="room-card detailed" data-aos="fade-up" data-aos-delay="200">
            <div className="room-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop" alt="Deluxe Soba" />
              <div className="room-badge deluxe">Deluxe</div>
            </div>
            <div className="room-info">
              <h3>Deluxe Soba</h3>
              <p className="room-description">Dvokrevetna soba sa 1+1 dva kreveta. Soba pored ostalog sadrži i mini-bar, klima uređaj i Led TV.</p>
              <div className="room-features">
                <h4>U cenu sobe je uključeno:</h4>
                <ul>
                  <li>🛏️ Udobnost</li>
                  <li>🍳 Doručak</li>
                  <li>📶 Hotspot (WiFi)</li>
                  <li>🍷 Mini Bar</li>
                  <li>🏙️ Pogled na grad</li>
                  <li>🔒 Sigurnosni sef</li>
                  <li>❄️ Klima</li>
                  <li>🕐 7/24 service</li>
                </ul>
              </div>
              <div className="room-specs">
                <span>👥 Maksimalno: 2 odrasle osobe</span>
                <span>🛏️ 1+1 dva kreveta</span>
              </div>
              <div className="price-booking">
                <Link href="/contact" className="book-btn">Rezervišite Sada</Link>
              </div>
            </div>
          </div>

          <div className="room-card detailed" data-aos="fade-up" data-aos-delay="300">
            <div className="room-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop" alt="Family Suite" />
              <div className="room-badge suite">Family Suite</div>
            </div>
            <div className="room-info">
              <h3>Family Suite</h3>
              <p className="room-description">Spojene dve dvokrevetne sobe za porodice. Soba pored ostalog sadrži i mini-bar, klima uređaj i Led TV.</p>
              <div className="room-features">
                <h4>U cenu sobe je uključeno:</h4>
                <ul>
                  <li>🛏️ Udobnost</li>
                  <li>🍳 Doručak</li>
                  <li>📶 Hotspot (WiFi)</li>
                  <li>🍷 Mini Bar</li>
                  <li>🏙️ Pogled na grad</li>
                  <li>🔒 Sigurnosni sef</li>
                  <li>❄️ Klima</li>
                  <li>🕐 7/24 service</li>
                </ul>
              </div>
              <div className="room-specs">
                <span>👪 Idealno za porodice</span>
                <span>🛏️ Spojene dve dvokrevetne sobe</span>
              </div>
              <div className="price-booking">
                <Link href="/contact" className="book-btn">Rezervišite Sada</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function RoomsPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="hero-content" data-aos="fade-left">
          <h2>Naše Sobe</h2>
          <p>16 komfornih i luksuznih soba uređenih u skladu sa najnovijim trendovima za Vaš savršen boravak.</p>
        </div>
      </section>

      <section className="room-types">
        <div className="container">
          <Suspense fallback={
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" style={{ margin: '0 auto' }}></div>
            </div>
          }>
            <RoomsContent />
          </Suspense>
        </div>
      </section>

      <section className="booking-info" data-aos="fade-up">
        <div className="container">
          <h3>Informacije o Rezervaciji</h3>
          <div className="info-grid">
            <div className="info-card">
              <h4>🕐 Check-in / Check-out</h4>
              <p><strong>Check-in:</strong> 15:00</p>
              <p><strong>Check-out:</strong> 12:00</p>
              <p>Rani check-in i kasni check-out dostupni na zahtjev</p>
            </div>
            <div className="info-card">
              <h4>🅿️ Sadržaji i Usluge</h4>
              <p>• Besplatno parkiranje za goste</p>
              <p>• Recepcija 24/7</p>
              <p>• Čuvanje prtljaga</p>
              <p>• Svakodnevno čišćenje sobe</p>
            </div>
            <div className="info-card">
              <h4>📋 Pravila</h4>
              <p>• Besplatno otkazivanje do 24h prije dolaska</p>
              <p>• Djeca do 12 godina besplatno uz roditelje</p>
              <p>• Zabranjeno pušenje u svim sobama</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

