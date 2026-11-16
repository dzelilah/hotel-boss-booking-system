'use client';

import { useRooms } from '@/lib/hooks/useRooms';
import { Reservation, useAllReservations } from '@/lib/hooks/useReservations';
import { StatCard } from '@/components/admin/StatCard';
import { PageLoading } from '@/components/ui/PageLoading';
import { formatPrice, todayIso } from '@/lib/format';
import { BedDouble, CalendarCheck, DoorOpen, Euro } from 'lucide-react';

function GuestList({ title, items, empty }: { title: string; items: Reservation[]; empty: string }) {
  return (
    <div className="admin-panel">
      <h3>{title}</h3>
      {items.length === 0 ? (
        <p className="admin-empty">{empty}</p>
      ) : (
        <ul className="admin-list">
          {items.map((r) => (
            <li key={r.id}>
              <strong>{r.room.name}</strong>
              <span>{r.guestEmail}</span>
              <span className="admin-muted">#{r.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: rooms, isLoading: roomsLoading, isError: roomsError } = useRooms();
  const { data: reservations, isLoading: resLoading, isError: resError } = useAllReservations();

  if (roomsLoading || resLoading) return <PageLoading />;
  if (roomsError || resError) {
    return <p className="form-alert error">Podatke trenutno nije moguće učitati. Provjerite da li backend radi.</p>;
  }

  const today = todayIso();
  const active = (reservations ?? []).filter((r) => r.status === 'CONFIRMED');
  const inService = (rooms ?? []).filter((r) => r.available).length;
  const occupiedToday = new Set(active.filter((r) => r.checkIn <= today && r.checkOut > today).map((r) => r.room.id)).size;
  const arrivals = active.filter((r) => r.checkIn === today);
  const departures = active.filter((r) => r.checkOut === today);
  const upcoming = active.filter((r) => r.checkOut > today).length;
  const revenue = active.reduce((sum, r) => sum + r.totalPrice, 0);
  const occupancy = inService ? Math.round((occupiedToday / inService) * 100) : 0;

  return (
    <div>
      <h2 className="admin-title">Pregled</h2>
      <div className="stat-grid">
        <StatCard title="Zauzetost danas" value={`${occupancy}%`} icon={DoorOpen} hint={`${occupiedToday} od ${inService} soba`} />
        <StatCard title="Sobe u ponudi" value={inService} icon={BedDouble} hint={`Ukupno ${rooms?.length ?? 0} soba`} />
        <StatCard title="Aktivne rezervacije" value={upcoming} icon={CalendarCheck} hint="Tekući i predstojeći boravci" />
        <StatCard title="Prihod (potvrđene)" value={formatPrice(revenue)} icon={Euro} hint="Sve potvrđene rezervacije" />
      </div>
      <div className="admin-two-col">
        <GuestList title="Današnji dolasci" items={arrivals} empty="Nema dolazaka danas." />
        <GuestList title="Današnji odlasci" items={departures} empty="Nema odlazaka danas." />
      </div>
    </div>
  );
}
