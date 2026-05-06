'use client';

import { useRooms } from '@/lib/hooks/useRooms';
import { useAllReservations } from '@/lib/hooks/useReservations';
import { StatCard } from '@/components/admin/StatCard';
import { BedDouble, CalendarCheck, XCircle, DollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: rooms } = useRooms();
  const { data: reservations } = useAllReservations();

  const totalRooms = rooms?.length ?? 0;
  const availableRooms = rooms?.filter(r => r.available).length ?? 0;
  const activeBookings = reservations?.filter(r => r.status === 'CONFIRMED').length ?? 0;
  const cancelledBookings = reservations?.filter(r => r.status === 'CANCELLED').length ?? 0;
  const revenue = reservations
    ?.filter(r => r.status === 'CONFIRMED')
    .reduce((acc, r) => {
      const nights = Math.ceil(
        (new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      return acc + (r.room.pricePerNight * nights);
    }, 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Rooms" value={totalRooms} icon={BedDouble} color="bg-blue-500" />
        <StatCard title="Available Rooms" value={availableRooms} icon={BedDouble} color="bg-green-500" />
        <StatCard title="Active Bookings" value={activeBookings} icon={CalendarCheck} color="bg-purple-500" />
        <StatCard title="Cancelled" value={cancelledBookings} icon={XCircle} color="bg-red-500" />
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-8 w-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Estimated Revenue (Confirmed Bookings)</p>
            <p className="text-2xl font-bold text-gray-900">${revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
