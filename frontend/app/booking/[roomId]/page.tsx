'use client';

import { useParams } from 'next/navigation';
import { useRoom } from '@/lib/hooks/useRooms';
import { BookingForm } from '@/components/booking/BookingForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ArrowLeft, BedDouble } from 'lucide-react';
import Link from 'next/link';

export default function BookingPage() {
  const params = useParams();
  const roomId = typeof params.roomId === 'string' ? parseInt(params.roomId) : null;
  const { data: room, isLoading } = useRoom(roomId);

  return (
    <ProtectedRoute>
      <RoleGuard roles={['GUEST']}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link href={`/rooms/${roomId}`} className="flex items-center text-blue-600 hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Room Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Booking</h1>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : room ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-4">
                <BedDouble className="h-10 w-10 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-gray-900">{room.name}</h2>
                  <p className="text-sm text-gray-600">${room.pricePerNight}/night</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6">
                <BookingForm room={room} />
              </div>
            </div>
          ) : (
            <p className="text-red-500">Room not found.</p>
          )}
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
