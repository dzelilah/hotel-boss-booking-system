'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageHero } from '@/components/ui/PageHero';
import { PageLoading } from '@/components/ui/PageLoading';
import { useMyReservations } from '@/lib/hooks/useReservations';
import { formatDate, formatPrice, nightsLabel } from '@/lib/format';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reservationId = Number(searchParams.get('reservationId'));
  const { data: reservations, isLoading } = useMyReservations();
  const reservation = reservations?.find((r) => r.id === reservationId);

  if (isLoading) return <PageLoading />;

  return (
    <div className="notice-card confirmation-card" data-aos="fade-up">
      <p className="confirmation-icon" aria-hidden="true">✅</p>
      <h3>Hvala na rezervaciji!</h3>
      {reservation ? (
        <>
          <p>
            Vaša rezervacija <strong>#{reservation.id}</strong> je potvrđena. Potvrdu ćemo poslati na{' '}
            <strong>{reservation.guestEmail}</strong>.
          </p>
          <dl className="confirmation-details">
            <div><dt>Soba</dt><dd>{reservation.room.name}</dd></div>
            <div><dt>Dolazak</dt><dd>{formatDate(reservation.checkIn)} od 15:00</dd></div>
            <div><dt>Odlazak</dt><dd>{formatDate(reservation.checkOut)} do 12:00</dd></div>
            <div><dt>Ukupno ({nightsLabel(reservation.nights)})</dt><dd>{formatPrice(reservation.totalPrice)}</dd></div>
          </dl>
          <p className="confirmation-note">Plaćanje se vrši na recepciji hotela.</p>
        </>
      ) : (
        <p>Vaša rezervacija je potvrđena. Detalje možete pogledati u svojim rezervacijama.</p>
      )}
      <div className="contact-buttons">
        <Link href="/my-reservations" className="book-btn">Moje rezervacije</Link>
        <Link href="/rooms" className="book-btn secondary">Nazad na sobe</Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div>
      <PageHero title="Rezervacija potvrđena" />
      <section className="booking-section">
        <div className="container">
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <ConfirmationContent />
            </Suspense>
          </ProtectedRoute>
        </div>
      </section>
    </div>
  );
}
