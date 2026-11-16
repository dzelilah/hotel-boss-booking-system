'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Room {
  id: number;
  name: string;
  type: 'SINGLE' | 'DOUBLE' | 'SUITE';
  capacity: number;
  pricePerNight: number;
  /** Admin "in service" flag. Whether it's free on given dates is a separate question. */
  available: boolean;
  description: string;
}

export interface StaySearch {
  checkIn: string;
  checkOut: string;
  guests?: number;
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

/** Rooms that are free for the whole stay. Disabled until both dates are known. */
export function useAvailableRooms(search: StaySearch | null) {
  return useQuery<Room[]>({
    queryKey: ['rooms', 'available', search],
    queryFn: async () => {
      const { data } = await api.get('/rooms', { params: search });
      return data;
    },
    enabled: search !== null,
    staleTime: 0,
  });
}

export function useRoom(id: number | null) {
  return useQuery<Room>({
    queryKey: ['room', id],
    queryFn: async () => {
      const { data } = await api.get(`/rooms/${id}`);
      return data;
    },
    enabled: id !== null && !Number.isNaN(id),
  });
}

/** Whether one specific room is free for the stay. */
export function useRoomAvailability(id: number | null, checkIn: string, checkOut: string, enabled: boolean) {
  return useQuery<boolean>({
    queryKey: ['room-availability', id, checkIn, checkOut],
    queryFn: async () => {
      const { data } = await api.get(`/rooms/${id}/availability`, { params: { checkIn, checkOut } });
      return data.available as boolean;
    },
    enabled: enabled && id !== null,
    staleTime: 0,
  });
}
