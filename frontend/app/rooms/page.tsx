'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AvailabilitySearch } from '@/components/booking/AvailabilitySearch';
import { Room, StaySearch, useAvailableRooms, useRooms } from '@/lib/hooks/useRooms';
import { formatDate, formatPrice, freeRoomsLabel, guestsLabel, isIsoDate, nightsBetween, nightsLabel } from '@/lib/format';
import { ROOM_AMENITIES, ROOM_TYPES, RoomTypeInfo, RoomTypeKey } from '@/lib/roomTypes';

const MAX_NIGHTS = 30;

function readSearch(params: URLSearchParams): StaySearch | null {
  const checkIn = params.get('checkIn');
  const checkOut = params.get('checkOut');
  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) return null;
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1 || nights > MAX_NIGHTS) return null;
  const guests = Number(params.get('guests'));
  return { checkIn, checkOut, guests: guests > 0 ? guests : undefined };
}

interface TypeCardProps {
  info: RoomTypeInfo;
  rooms: Room[] | undefined;
  search: StaySearch | null;
  freeRooms: Room[] | undefined;
  offline: boolean;
  delay: number;
}

function RoomTypeCard({ info, rooms, search, freeRooms, offline, delay }: TypeCardProps) {
  const ofType = rooms?.filter((r) => r.type === info.key && r.available) ?? [];
  const price = ofType.length ? Math.min(...ofType.map((r) => r.pricePerNight)) : info.fallbackPrice;
  const capacity = ofType.length ? Math.max(...ofType.map((r) => r.capacity)) : info.fallbackCapacity;
  const free = freeRooms?.filter((r) => r.type === info.key) ?? [];
  const nights = search ? nightsBetween(search.checkIn, search.checkOut) : 0;
  const tooSmall = !!search?.guests && search.guests > capacity;

  let action: React.ReactNode;
  if (offline) {
    action = <a href="tel:+38733869656" className="book-btn">📞 Rezervišite telefonom</a>;
  } else if (!search) {
    action = <a href="#pretraga" className="book-btn">Provjeri dostupnost</a>;
  } else if (freeRooms === undefined) {
    action = <span className="availability-note">Provjeravamo dostupnost…</span>;
  } else if (free.length === 0) {
    action = (
      <span className="availability-note unavailable">
        {tooSmall ? `Soba prima najviše ${capacity} osobe` : 'Nema slobodnih soba za odabrane datume'}
      </span>
    );
  } else {
    const href = `/booking/${free[0].id}?checkIn=${search.checkIn}&checkOut=${search.checkOut}`;
    action = <Link href={href} className="book-btn">Rezervišite sada</Link>;
  }

  return (
    <div className="room-card detailed" data-aos="fade-up" data-aos-delay={delay}>
      <div className="room-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={info.image} alt={info.label} />
        <div className={`room-badge${info.badgeClass ? ` ${info.badgeClass}` : ''}`}>{info.badge}</div>
        {search && freeRooms && free.length > 0 && (
          <div className="room-badge availability-badge">
            {free.length === 1 ? 'Posljednja slobodna soba!' : freeRoomsLabel(free.length)}
          </div>
        )}
      </div>
      <div className="room-info">
        <h3>{info.label}</h3>
        <p className="room-description">{info.description}</p>
        <div className="room-services">
          <h4>U cijenu je uključeno:</h4>
          <div className="services-grid">
            {ROOM_AMENITIES.map((a) => <span key={a}>{a}</span>)}
          </div>
        </div>
        <div className="room-specs">
          <span>👥 {info.occupancy}</span>
          <span>🛏️ {info.bed}</span>
        </div>
        <div className="price-booking">
          <div className="price">
            {search && !offline ? (
              <>
                {formatPrice(price * nights)} <small>/ {nightsLabel(nights)}</small>
              </>
            ) : (
              <>
                {offline ? 'od ' : ''}{formatPrice(price)} <small>/ noć</small>
              </>
            )}
          </div>
          {action}
        </div>
      </div>
    </div>
  );
}

function RoomsContent() {
  const params = useSearchParams();
  const search = readSearch(params);
  const typeParam = params.get('type') as RoomTypeKey | null;
  const typeFilter = ROOM_TYPES.some((t) => t.key === typeParam) ? typeParam : null;

  const { data: rooms, isError: roomsError } = useRooms();
  const { data: freeRooms, isError: searchError } = useAvailableRooms(search);
  const offline = roomsError || searchError;

  const types = typeFilter ? ROOM_TYPES.filter((t) => t.key === typeFilter) : ROOM_TYPES;
  const nights = search ? nightsBetween(search.checkIn, search.checkOut) : 0;

  return (
    <>
      <section className="availability-section" id="pretraga">
        <div className="container">
          <AvailabilitySearch
            key={params.toString()}
            initialCheckIn={search?.checkIn}
            initialCheckOut={search?.checkOut}
            initialGuests={search?.guests}
            initialType={typeFilter}
          />
        </div>
      </section>

      <section className="room-types" id="rezultati">
        <div className="container">
          {offline && (
            <div className="form-alert warning page-alert" role="status">
              Online rezervacija trenutno nije dostupna. Pozovite nas na <a href="tel:+38733869656">+387 33 869 656</a> ili
              pošaljite email na <a href="mailto:info@bosshotel.ba">info@bosshotel.ba</a>.
            </div>
          )}
          {search && !offline && (
            <div className="results-heading">
              <h3>Dostupnost za vaš boravak</h3>
              <p>
                {formatDate(search.checkIn)} – {formatDate(search.checkOut)} · {nightsLabel(nights)}
                {search.guests ? ` · ${guestsLabel(search.guests)}` : ''}
              </p>
              {typeFilter && <Link href={`/rooms?${new URLSearchParams({ checkIn: search.checkIn, checkOut: search.checkOut, ...(search.guests ? { guests: String(search.guests) } : {}) })}#rezultati`}>Prikaži sve tipove soba</Link>}
            </div>
          )}
          <div className="room-grid">
            {types.map((info, i) => (
              <RoomTypeCard
                key={info.key}
                info={info}
                rooms={rooms}
                search={search}
                freeRooms={freeRooms}
                offline={offline}
                delay={(i + 1) * 100}
              />
            ))}
          </div>
        </div>
      </section>
    </>
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

      <Suspense fallback={null}>
        <RoomsContent />
      </Suspense>

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
              <p>• Besplatno otkazivanje do dan prije dolaska</p>
              <p>• Djeca do 12 godina besplatno uz roditelje</p>
              <p>• Zabranjeno pušenje u svim sobama</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
