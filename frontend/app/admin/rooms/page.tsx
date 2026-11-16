'use client';

import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import api from '@/lib/api';
import { Room, useRooms } from '@/lib/hooks/useRooms';
import { RoomTable } from '@/components/admin/RoomTable';
import { PageLoading } from '@/components/ui/PageLoading';
import { apiErrorMessage } from '@/lib/format';
import { ROOM_TYPES } from '@/lib/roomTypes';

const EMPTY_ROOM: Partial<Room> = {
  name: '',
  type: 'SINGLE',
  capacity: 2,
  pricePerNight: 80,
  available: true,
  description: '',
};

export default function AdminRoomsPage() {
  const { data: rooms, isLoading, isError } = useRooms();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>(EMPTY_ROOM);

  const createRoom = useMutation({
    mutationFn: async (room: Partial<Room>) => {
      const { data } = await api.post('/admin/rooms', room);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setShowForm(false);
      setNewRoom(EMPTY_ROOM);
    },
  });

  return (
    <div>
      <div className="admin-title-row">
        <h2 className="admin-title">Sobe</h2>
        <button type="button" onClick={() => setShowForm(!showForm)} className="book-btn admin-btn">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Dodaj sobu</span>
        </button>
      </div>

      {showForm && (
        <form
          className="admin-panel admin-form"
          onSubmit={(e) => { e.preventDefault(); createRoom.mutate(newRoom); }}
        >
          <h3>Nova soba</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="room-name">Naziv *</label>
              <input
                id="room-name"
                required
                placeholder="npr. Standard Soba 109"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="room-type">Tip *</label>
              <select
                id="room-type"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value as Room['type'] })}
              >
                {ROOM_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="room-capacity">Kapacitet *</label>
              <input
                id="room-capacity"
                type="number"
                min={1}
                max={10}
                required
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="room-price">Cijena po noći (€) *</label>
              <input
                id="room-price"
                type="number"
                min={1}
                step="0.01"
                required
                value={newRoom.pricePerNight}
                onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="room-description">Opis</label>
            <textarea
              id="room-description"
              rows={2}
              maxLength={1000}
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
            />
          </div>
          {createRoom.isError && (
            <p className="form-alert error">{apiErrorMessage(createRoom.error, 'Kreiranje sobe nije uspjelo.')}</p>
          )}
          <div className="admin-form-actions">
            <button type="submit" disabled={createRoom.isPending} className="book-btn admin-btn">
              {createRoom.isPending ? 'Kreiranje…' : 'Kreiraj sobu'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-btn">Odustani</button>
          </div>
        </form>
      )}

      <div className="admin-panel">
        {isLoading ? <PageLoading /> : isError ? (
          <p className="form-alert error">Sobe trenutno nije moguće učitati.</p>
        ) : (
          <RoomTable rooms={rooms || []} />
        )}
      </div>
    </div>
  );
}
