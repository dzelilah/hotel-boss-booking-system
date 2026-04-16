import Link from 'next/link';
import { Room } from '@/lib/hooks/useRooms';
import { Users, DollarSign, BedDouble } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

const roomTypeLabels: Record<string, string> = {
  SINGLE: 'Single Room',
  DOUBLE: 'Double Room',
  SUITE: 'Suite',
};

export function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32 flex items-center justify-center">
        <BedDouble className="h-16 w-16 text-white opacity-80" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {room.available ? 'Available' : 'Occupied'}
          </span>
        </div>
        <p className="text-sm text-blue-600 font-medium mb-2">{roomTypeLabels[room.type] || room.type}</p>
        {room.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{room.description}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>Up to {room.capacity} guests</span>
          </div>
          <div className="flex items-center space-x-1 font-semibold text-gray-900">
            <DollarSign className="h-4 w-4" />
            <span>${room.pricePerNight}/night</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/rooms/${room.id}`}
            className="flex-1 text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
          >
            View Details
          </Link>
          {room.available && (
            <Link
              href={`/booking/${room.id}`}
              className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
