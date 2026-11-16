'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageHero } from '@/components/ui/PageHero';
import { PageLoading } from '@/components/ui/PageLoading';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Reservation, STATUS_LABELS, useCancelReservation, useMyReservations,
} from '@/lib/hooks/useReservations';
import { apiErrorMessage, formatDate, formatPrice, nightsLabel, todayIso } from '@/lib/format';
import { roomTypeInfo } from '@/lib/roomTypes';

function ReservationCard({ reservation }: { reservation: Reservation }) {
  const [confirming, setConfirming] = useState(false);
  const cancel = useCancelReservation();
  const today = todayIso();
  const type = roomTypeInfo(reservation.room.type);
  const upcoming = reservation.checkIn > today;
  const isPast = reservation.checkOut <= today;
  const canCancel = reservation.status === 'CONFIRMED' && upcoming;

  return (
    <article className={`reservation-card${reservation.status === 'CANCELLED' || isPast ? ' muted' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={type.image} alt={type.label} />
      <div className="reservation-body">
        <div className="reservation-header">
          <div>
            <h4>{reservation.room.name}</h4>
            <p className="reservation-id">Rezervacija #{reservation.id}</p>
          </div>
          <span className={`status-badge ${reservation.status.toLowerCase()}`}>
            {isPast && reservation.status === 'CONFIRMED' ? 'Završena' : STATUS_LABELS[reservation.status]}
          </span>
        </div>
        <div className="room-specs">
          <span>📅 {formatDate(reservation.checkIn)} – {formatDate(reservation.checkOut)}</span>
          <span>🌙 {nightsLabel(reservation.nights)}</span>
          <span>💶 {formatPrice(reservation.totalPrice)}</span>
        </div>

        {canCancel && !confirming && (
          <button type="button" className="text-btn danger" onClick={() => setConfirming(true)}>
            Otkaži rezervaciju
          </button>
        )}
        {canCancel && confirming && (
          <div className="cancel-confirm" role="group" aria-label="Potvrda otkazivanja">
            <span>Sigurno želite otkazati ovu rezervaciju?</span>
            <button
              type="button"
              className="text-btn danger"
              disabled={cancel.isPending}
              onClick={() => cancel.mutate(reservation.id, { onSuccess: () => setConfirming(false) })}
            >
              {cancel.isPending ? 'Otkazivanje…' : 'Da, otkaži'}
            </button>
            <button type="button" className="text-btn" onClick={() => setConfirming(false)}>Ne</button>
          </div>
        )}
        {cancel.isError && (
          <p className="form-alert error" role="alert">{apiErrorMessage(cancel.error, 'Otkazivanje nije uspjelo.')}</p>
        )}
        {reservation.status === 'CONFIRMED' && !upcoming && !isPast && (
          <p className="reservation-hint">Za izmjene ili otkazivanje kontaktirajte recepciju: +387 33 869 656</p>
        )}
      </div>
    </article>
  );
}

function MyReservationsContent() {
  const { hasRole } = useAuth();
  const isGuest = hasRole('GUEST');
  const { data: reservations, isLoading, isError } = useMyReservations(isGuest);

  if (!isGuest) {
    return (
      <div className="notice-card">
        <h3>Ova stranica je za goste hotela</h3>
        <p>Rezervacije svih gostiju možete pregledati u administraciji.</p>
        <Link href="/admin/reservations" className="book-btn">Sve rezervacije</Link>
      </div>
    );
  }
  if (isLoading) return <PageLoading />;
  if (isError) {
    return <p className="form-alert error page-alert">Rezervacije trenutno nije moguće učitati. Pokušajte ponovo kasnije.</p>;
  }
  if (!reservations || reservations.length === 0) {
    return (
      <div className="notice-card">
        <h3>Još nemate rezervacija</h3>
        <p>Pronađite savršenu sobu za vaš boravak u Sarajevu.</p>
        <Link href="/rooms" className="book-btn">Pogledajte sobe</Link>
      </div>
    );
  }

  const today = todayIso();
  const upcoming = reservations.filter((r) => r.checkOut > today && r.status !== 'CANCELLED')
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const other = reservations.filter((r) => !upcoming.includes(r));

  return (
    <div className="reservations-list">
      {upcoming.length > 0 && <h3>Predstojeći boravci</h3>}
      {upcoming.map((r) => <ReservationCard key={r.id} reservation={r} />)}
      {other.length > 0 && <h3>Prethodne i otkazane</h3>}
      {other.map((r) => <ReservationCard key={r.id} reservation={r} />)}
    </div>
  );
}

export default function MyReservationsPage() {
  return (
    <div>
      <PageHero title="Moje Rezervacije" subtitle="Pregled vaših boravaka u Hotel Boss." />
      <section className="booking-section">
        <div className="container">
          <ProtectedRoute>
            <MyReservationsContent />
          </ProtectedRoute>
        </div>
      </section>
    </div>
  );
}
