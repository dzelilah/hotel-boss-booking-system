'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Reservation, ReservationStatus, STATUS_LABELS } from '@/lib/hooks/useReservations';
import { apiErrorMessage, formatDate, formatPrice } from '@/lib/format';

interface ReservationTableProps {
  reservations: Reservation[];
}

export function ReservationTable({ reservations }: ReservationTableProps) {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ReservationStatus }) => {
      const { data } = await api.put(`/admin/reservations/${id}/status`, null, { params: { status } });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  if (reservations.length === 0) {
    return <p className="admin-empty">Nema rezervacija za prikaz.</p>;
  }

  return (
    <div className="admin-table-wrap">
      {updateStatus.isError && (
        <p className="form-alert error">{apiErrorMessage(updateStatus.error, 'Promjena statusa nije uspjela.')}</p>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Gost</th>
            <th>Soba</th>
            <th>Dolazak</th>
            <th>Odlazak</th>
            <th>Ukupno</th>
            <th>Status</th>
            <th><span className="sr-only">Akcije</span></th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => {
            const busy = updateStatus.isPending && updateStatus.variables?.id === res.id;
            return (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.guestEmail}</td>
                <td>{res.room.name}</td>
                <td>{formatDate(res.checkIn)}</td>
                <td>{formatDate(res.checkOut)}</td>
                <td>{formatPrice(res.totalPrice)}</td>
                <td>
                  <span className={`status-badge ${res.status.toLowerCase()}`}>{STATUS_LABELS[res.status]}</span>
                </td>
                <td className="admin-actions">
                  {res.status !== 'CONFIRMED' && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => updateStatus.mutate({ id: res.id, status: 'CONFIRMED' })}
                      className="pill-btn success"
                    >
                      Potvrdi
                    </button>
                  )}
                  {res.status !== 'CANCELLED' && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => updateStatus.mutate({ id: res.id, status: 'CANCELLED' })}
                      className="pill-btn danger"
                    >
                      Otkaži
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
