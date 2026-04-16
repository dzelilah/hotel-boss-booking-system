'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Room {
  id: number;
  name: string;
  type: 'SINGLE' | 'DOUBLE' | 'SUITE';
  capacity: number;
  pricePerNight: number;
  available: boolean;
  description: string;
}

export function useRooms(availableOnly?: boolean) {
  return useQuery<Room[]>({
    queryKey: ['rooms', availableOnly],
    queryFn: async () => {
      const params = availableOnly ? { available: true } : {};
      const { data } = await api.get('/rooms', { params });
      return data;
    },
  });
}

export function useRoom(id: number | null) {
  return useQuery<Room>({
    queryKey: ['room', id],
    queryFn: async () => {
      const { data } = await api.get(`/rooms/${id}`);
      return data;
    },
    enabled: id !== null,
  });
}
