'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Room } from './useRooms';

export interface Reservation {
  id: number;
  guestId: string;
  guestEmail: string;
  room: Room;
  checkIn: string;
  checkOut: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
}

export interface CreateReservationRequest {
  roomId: number;
  checkIn: string;
  checkOut: string;
  guestEmail: string;
}

export function useMyReservations() {
  return useQuery<Reservation[]>({
    queryKey: ['my-reservations'],
    queryFn: async () => {
      const { data } = await api.get('/reservations/my');
      return data;
    },
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
    },
  });
}
