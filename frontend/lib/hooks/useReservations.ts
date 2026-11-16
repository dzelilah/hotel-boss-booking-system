'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Room } from './useRooms';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface Reservation {
  id: number;
  guestId: string;
  guestEmail: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
}

export interface CreateReservationRequest {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestEmail: string;
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: 'Na čekanju',
  CONFIRMED: 'Potvrđena',
  CANCELLED: 'Otkazana',
};

export function useMyReservations(enabled = true) {
  return useQuery<Reservation[]>({
    queryKey: ['my-reservations'],
    queryFn: async () => {
      const { data } = await api.get('/reservations/my');
      return data;
    },
    enabled,
  });
}

export function useAllReservations() {
  return useQuery<Reservation[]>({
    queryKey: ['all-reservations'],
    queryFn: async () => {
      const { data } = await api.get('/admin/reservations');
      return data;
    },
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CreateReservationRequest) => {
      const { data } = await api.post('/reservations', request);
      return data as Reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-availability'] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.put(`/reservations/${id}/cancel`);
      return data as Reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room-availability'] });
    },
  });
}
