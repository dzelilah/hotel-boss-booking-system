'use client';

import { useRooms } from '@/lib/hooks/useRooms';
import { RoomTable } from '@/components/admin/RoomTable';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import api from '@/lib/api';
import { Plus } from 'lucide-react';
import { Room } from '@/lib/hooks/useRooms';

export default function AdminRoomsPage() {
  const { data: rooms, isLoading } = useRooms();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
    type: 'SINGLE',
    capacity: 1,
    pricePerNight: 100,
    available: true,
    description: '',
  });

  const createRoom = useMutation({
    mutationFn: async (room: Partial<Room>) => {
      const { data } = await api.post('/admin/rooms', room);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setShowForm(false);
      setNewRoom({ name: '', type: 'SINGLE' as const, capacity: 1, pricePerNight: 100, available: true, description: '' });
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Room Inventory</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Room</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Room</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              className="border rounded-lg px-3 py-2 col-span-2"
            />
            <select
              value={newRoom.type}
              onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as Room['type'] })}
              className="border rounded-lg px-3 py-2"
            >
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="SUITE">Suite</option>
            </select>
            <input
              type="number"
              placeholder="Capacity"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Price per Night"
              value={newRoom.pricePerNight}
              onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: parseFloat(e.target.value) })}
              className="border rounded-lg px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              className="border rounded-lg px-3 py-2 col-span-2"
              rows={2}
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => createRoom.mutate(newRoom)}
              disabled={createRoom.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {createRoom.isPending ? 'Creating...' : 'Create Room'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <RoomTable rooms={rooms || []} />
        )}
      </div>
    </div>
  );
}
