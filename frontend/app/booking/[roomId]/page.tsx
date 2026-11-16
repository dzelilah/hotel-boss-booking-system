'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useRoom } from '@/lib/hooks/useRooms';
import { useAuth } from '@/lib/hooks/useAuth';
import { BookingForm } from '@/components/booking/BookingForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageHero } from '@/components/ui/PageHero';
import { PageLoading } from '@/components/ui/PageLoading';

function BookingContent() {
  const params = useParams();
  const search = useSearchParams();
  const roomId = typeof params.roomId === 'string' ? Number(params.roomId) : null;
  const { hasRole } = useAuth();
  const { data: room, isLoading, isError } = useRoom(roomId);

  if (!hasRole('GUEST')) {
    return (
      <div className="notice-card">
        <h3>Rezervacije su dostupne samo gostima</h3>
        <p>Prijavljeni ste kao osoblje hotela. Za online rezervaciju prijavite se gostujućim računom.</p>
        <Link href="/rooms" className="book-btn">Nazad na sobe</Link>
      </div>
    );
  }

  if (isLoading) return <PageLoading />;

  if (isError || !room) {
    return (
      <div className="notice-card">
        <h3>Soba nije pronađena</h3>
        <p>Ova soba ne postoji ili trenutno nije dostupna.</p>
        <Link href="/rooms" className="book-btn">Pogledajte naše sobe</Link>
      </div>
    );
  }

  return (
    <BookingForm
      room={room}
      initialCheckIn={search.get('checkIn')}
      initialCheckOut={search.get('checkOut')}
    />
  );
}

export default function BookingPage() {
  return (
    <div>
      <PageHero title="Rezervacija" subtitle="Još samo korak do vašeg boravka u Hotel Boss." />
      <section className="booking-section">
        <div className="container">
          <ProtectedRoute>
            <Suspense fallback={<PageLoading />}>
              <BookingContent />
            </Suspense>
          </ProtectedRoute>
        </div>
      </section>
    </div>
  );
}
