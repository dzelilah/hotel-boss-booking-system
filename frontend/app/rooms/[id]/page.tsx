'use client';

import { useRoom } from '@/lib/hooks/useRooms';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BedDouble, Users, DollarSign, ArrowLeft } from 'lucide-react';

const roomTypeLabels: Record<string, string> = {
  SINGLE: 'Single Room',
  DOUBLE: 'Double Room',
  SUITE: 'Suite',
};

export default function RoomDetailPage() {
  const params = useParams();
  const roomId = typeof params.id === 'string' ? parseInt(params.id) : null;
  const { data: room, isLoading, error } = useRoom(roomId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-red-500">Room not found.</p>
        <Link href="/rooms" className="text-blue-600 hover:underline mt-4 block">Back to Rooms</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/rooms" className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Rooms
      </Link>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-48 flex items-center justify-center">
          <BedDouble className="h-24 w-24 text-white opacity-80" />
        </div>
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
              <p className="text-blue-600 font-medium mt-1">{roomTypeLabels[room.type] || room.type}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {room.available ? 'Available' : 'Occupied'}
            </span>
          </div>
          {room.description && (
            <p className="text-gray-600 mb-6">{room.description}</p>
          )}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-gray-700">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Up to {room.capacity} guests</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-700">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="font-semibold">${room.pricePerNight} per night</span>
            </div>
          </div>
          {room.available ? (
            <Link
              href={`/booking/${room.id}`}
              className="inline-block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Book This Room
            </Link>
          ) : (
            <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed">
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
