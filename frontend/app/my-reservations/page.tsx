'use client';

import Link from 'next/link';
import { useMyReservations } from '@/lib/hooks/useReservations';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

function MyReservationsContent() {
  const { data: reservations, isLoading, error } = useMyReservations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">Failed to load reservations.</p>;
  }

  if (!reservations || reservations.length === 0) {
    return (
      <div className="text-center py-16">
        <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No reservations yet.</p>
        <Link href="/rooms" className="text-blue-600 hover:underline mt-2 block">Browse rooms to make a booking</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((res) => (
        <div key={res.id} className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{res.room.name}</h3>
              <p className="text-sm text-gray-500 mt-1">Reservation #{res.id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[res.status] || ''}`}>
              {res.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Check-in:</span>{' '}
              {format(new Date(res.checkIn), 'MMM dd, yyyy')}
            </div>
            <div>
              <span className="font-medium">Check-out:</span>{' '}
              {format(new Date(res.checkOut), 'MMM dd, yyyy')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyReservationsPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reservations</h1>
        <MyReservationsContent />
      </div>
    </ProtectedRoute>
  );
}
