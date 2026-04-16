'use client';

import { useAllReservations } from '@/lib/hooks/useReservations';
import { ReservationTable } from '@/components/admin/ReservationTable';

export default function AdminReservationsPage() {
  const { data: reservations, isLoading } = useAllReservations();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">All Reservations</h1>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ReservationTable reservations={reservations || []} />
        )}
      </div>
    </div>
  );
}
