'use client';

import { useState } from 'react';
import { Room } from '@/lib/hooks/useRooms';
import { Edit2, Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface RoomTableProps {
  rooms: Room[];
}

export function RoomTable({ rooms }: RoomTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Room>>({});
  const queryClient = useQueryClient();

  const updateRoom = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Room> }) => {
      const { data: updated } = await api.put(`/admin/rooms/${id}`, data);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setEditingId(null);
    },
  });

  const handleEdit = (room: Room) => {
    setEditingId(room.id);
    setEditData(room);
  };

  const handleSave = (id: number) => {
    updateRoom.mutate({ id, data: editData });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Capacity</th>
            <th className="px-4 py-3">Price/Night</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                {editingId === room.id ? (
                  <input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="border rounded px-2 py-1 w-full text-sm"
                  />
                ) : room.name}
              </td>
              <td className="px-4 py-3">{room.type}</td>
              <td className="px-4 py-3">{room.capacity}</td>
              <td className="px-4 py-3">
                {editingId === room.id ? (
                  <input
                    type="number"
                    value={editData.pricePerNight || 0}
                    onChange={(e) => setEditData({ ...editData, pricePerNight: parseFloat(e.target.value) })}
                    className="border rounded px-2 py-1 w-24 text-sm"
                  />
                ) : `$${room.pricePerNight}`}
              </td>
              <td className="px-4 py-3">
                {editingId === room.id ? (
                  <select
                    value={editData.available ? 'true' : 'false'}
                    onChange={(e) => setEditData({ ...editData, available: e.target.value === 'true' })}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="true">Available</option>
                    <option value="false">Occupied</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs ${room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {room.available ? 'Available' : 'Occupied'}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                {editingId === room.id ? (
                  <div className="flex space-x-2">
                    <button onClick={() => handleSave(room.id)} className="text-green-600 hover:text-green-800">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-red-600 hover:text-red-800">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEdit(room)} className="text-blue-600 hover:text-blue-800">
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
