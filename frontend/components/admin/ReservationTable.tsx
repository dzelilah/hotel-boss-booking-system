'use client';

import { Reservation } from '@/lib/hooks/useReservations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { format } from 'date-fns';

interface ReservationTableProps {
  reservations: Reservation[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function ReservationTable({ reservations }: ReservationTableProps) {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data } = await api.put(`/admin/reservations/${id}/status`, null, { params: { status } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-reservations'] });
    },
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Guest</th>
            <th className="px-4 py-3">Room</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Check-out</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reservations.map((res) => (
            <tr key={res.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">#{res.id}</td>
              <td className="px-4 py-3">{res.guestEmail}</td>
              <td className="px-4 py-3">{res.room.name}</td>
              <td className="px-4 py-3">{format(new Date(res.checkIn), 'MMM dd, yyyy')}</td>
              <td className="px-4 py-3">{format(new Date(res.checkOut), 'MMM dd, yyyy')}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[res.status] || ''}`}>
                  {res.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-2">
                  {res.status !== 'CONFIRMED' && (
                    <button
                      onClick={() => updateStatus.mutate({ id: res.id, status: 'CONFIRMED' })}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                    >
                      Confirm
                    </button>
                  )}
                  {res.status !== 'CANCELLED' && (
                    <button
                      onClick={() => updateStatus.mutate({ id: res.id, status: 'CANCELLED' })}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
