'use client';

import { useState } from 'react';
import { useAllReservations } from '@/lib/hooks/useReservations';
import { ReservationTable } from '@/components/admin/ReservationTable';
import { PageLoading } from '@/components/ui/PageLoading';
import { todayIso } from '@/lib/format';

type Filter = 'upcoming' | 'all' | 'cancelled';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'upcoming', label: 'Aktivne' },
  { key: 'cancelled', label: 'Otkazane' },
  { key: 'all', label: 'Sve' },
];

export default function AdminReservationsPage() {
  const { data: reservations, isLoading, isError } = useAllReservations();
  const [filter, setFilter] = useState<Filter>('upcoming');
  const today = todayIso();

  const shown = (reservations ?? []).filter((r) => {
    if (filter === 'upcoming') return r.status !== 'CANCELLED' && r.checkOut >= today;
    if (filter === 'cancelled') return r.status === 'CANCELLED';
    return true;
  });

  return (
    <div>
      <div className="admin-title-row">
        <h2 className="admin-title">Rezervacije</h2>
        <div className="filter-tabs" role="tablist" aria-label="Filter rezervacija">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={filter === key}
              className={`category-btn${filter === key ? ' active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-panel">
        {isLoading ? <PageLoading /> : isError ? (
          <p className="form-alert error">Rezervacije trenutno nije moguće učitati.</p>
        ) : (
          <ReservationTable reservations={shown} />
        )}
      </div>
    </div>
  );
}
