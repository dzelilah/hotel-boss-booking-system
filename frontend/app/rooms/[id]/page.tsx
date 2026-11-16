'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRoom } from '@/lib/hooks/useRooms';
import { PageHero } from '@/components/ui/PageHero';
import { PageLoading } from '@/components/ui/PageLoading';
import { formatPrice } from '@/lib/format';
import { ROOM_AMENITIES, roomTypeInfo } from '@/lib/roomTypes';

function RoomDetail() {
  const params = useParams();
  const roomId = typeof params.id === 'string' ? Number(params.id) : null;
  const { data: room, isLoading, isError } = useRoom(roomId);

  if (isLoading) return <PageLoading />;

  if (isError || !room) {
    return (
      <div className="notice-card">
        <h3>Soba nije pronađena</h3>
        <p>Ova soba ne postoji ili je uklonjena iz ponude.</p>
        <Link href="/rooms" className="book-btn">Pogledajte naše sobe</Link>
      </div>
    );
  }

  const type = roomTypeInfo(room.type);

  return (
    <div className="room-card detailed room-detail" data-aos="fade-up">
      <div className="room-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={type.image} alt={room.name} />
        <div className={`room-badge${type.badgeClass ? ` ${type.badgeClass}` : ''}`}>{type.badge}</div>
      </div>
      <div className="room-info">
        <h3>{room.name}</h3>
        {room.description && <p className="room-description">{room.description}</p>}
        <div className="room-services">
          <h4>U cijenu je uključeno:</h4>
          <div className="services-grid">
            {ROOM_AMENITIES.map((a) => <span key={a}>{a}</span>)}
          </div>
        </div>
        <div className="room-specs">
          <span>👥 Do {room.capacity} osobe</span>
          <span>🛏️ {type.bed}</span>
        </div>
        <div className="price-booking">
          <div className="price">{formatPrice(room.pricePerNight)} <small>/ noć</small></div>
          {room.available ? (
            <Link href={`/booking/${room.id}`} className="book-btn">Rezervišite sada</Link>
          ) : (
            <span className="availability-note unavailable">Soba trenutno nije u ponudi</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RoomDetailPage() {
  return (
    <div>
      <PageHero title="Detalji Sobe" />
      <section className="booking-section">
        <div className="container">
          <Link href="/rooms" className="back-link">← Sve sobe</Link>
          <RoomDetail />
        </div>
      </section>
    </div>
  );
}
