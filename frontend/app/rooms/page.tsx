'use client';

import { useSearchParams } from 'next/navigation';
import { useRooms } from '@/lib/hooks/useRooms';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Suspense } from 'react';
import { BedDouble } from 'lucide-react';

function RoomsContent() {
  const searchParams = useSearchParams();
  const availableOnly = searchParams.get('available') === 'true';
  const { data: rooms, isLoading, error } = useRooms(availableOnly);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Failed to load rooms. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms && rooms.length > 0 ? (
        rooms.map((room) => <RoomCard key={room.id} room={room} />)
      ) : (
        <div className="col-span-3 text-center py-16">
          <BedDouble className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No rooms found</p>
        </div>
      )}
    </div>
  );
}

export default function RoomsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Our Rooms</h1>
      <Suspense fallback={<div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
        <RoomsContent />
      </Suspense>
    </div>
  );
}
