'use client';

import { useState } from 'react';
import { Room } from '@/lib/hooks/useRooms';
import { Edit2, Check, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { apiErrorMessage, formatPrice } from '@/lib/format';
import { roomTypeInfo } from '@/lib/roomTypes';

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
    updateRoom.reset();
    setEditingId(room.id);
    setEditData(room);
  };

  return (
    <div className="admin-table-wrap">
      {updateRoom.isError && (
        <p className="form-alert error">{apiErrorMessage(updateRoom.error, 'Izmjena sobe nije uspjela.')}</p>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Tip</th>
            <th>Kapacitet</th>
            <th>Cijena / noć</th>
            <th>Status</th>
            <th><span className="sr-only">Akcije</span></th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const editing = editingId === room.id;
            return (
              <tr key={room.id}>
                <td>
                  {editing ? (
                    <input
                      aria-label="Naziv sobe"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    />
                  ) : room.name}
                </td>
                <td>{roomTypeInfo(room.type).label}</td>
                <td>
                  {editing ? (
                    <input
                      aria-label="Kapacitet"
                      type="number"
                      min={1}
                      max={10}
                      className="narrow"
                      value={editData.capacity ?? ''}
                      onChange={(e) => setEditData({ ...editData, capacity: Number(e.target.value) })}
                    />
                  ) : room.capacity}
                </td>
                <td>
                  {editing ? (
                    <input
                      aria-label="Cijena po noći"
                      type="number"
                      min={1}
                      step="0.01"
                      className="narrow"
                      value={editData.pricePerNight ?? ''}
                      onChange={(e) => setEditData({ ...editData, pricePerNight: Number(e.target.value) })}
                    />
                  ) : formatPrice(room.pricePerNight)}
                </td>
                <td>
                  {editing ? (
                    <select
                      aria-label="Status sobe"
                      value={editData.available ? 'true' : 'false'}
                      onChange={(e) => setEditData({ ...editData, available: e.target.value === 'true' })}
                    >
                      <option value="true">U ponudi</option>
                      <option value="false">Van ponude</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${room.available ? 'confirmed' : 'cancelled'}`}>
                      {room.available ? 'U ponudi' : 'Van ponude'}
                    </span>
                  )}
                </td>
                <td className="admin-actions">
                  {editing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => updateRoom.mutate({ id: room.id, data: editData })}
                        disabled={updateRoom.isPending}
                        className="icon-btn success"
                        aria-label="Sačuvaj"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="icon-btn danger" aria-label="Odustani">
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => handleEdit(room)} className="icon-btn" aria-label={`Uredi ${room.name}`}>
                      <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
