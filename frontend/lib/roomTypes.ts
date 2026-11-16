import type { Room } from './hooks/useRooms';

export type RoomTypeKey = Room['type'];

export interface RoomTypeInfo {
  key: RoomTypeKey;
  label: string;
  badge: string;
  badgeClass: string;
  image: string;
  description: string;
  bed: string;
  occupancy: string;
  /** Shown when the API is unreachable, so the page still has prices. */
  fallbackPrice: number;
  fallbackCapacity: number;
}

/** Display metadata per room type. The API enum names predate the hotel's marketing names. */
export const ROOM_TYPES: RoomTypeInfo[] = [
  {
    key: 'SINGLE',
    label: 'Standard Soba',
    badge: 'Najpopularnija',
    badgeClass: '',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    description: 'Dvokrevetna soba sa bračnim krevetom. Soba pored ostalog sadrži i mini-bar, klima uređaj i LED TV.',
    bed: 'Bračni krevet',
    occupancy: 'Maksimalno 2 odrasle osobe',
    fallbackPrice: 80,
    fallbackCapacity: 2,
  },
  {
    key: 'DOUBLE',
    label: 'Deluxe Soba',
    badge: 'Deluxe',
    badgeClass: 'deluxe',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    description: 'Prostrana dvokrevetna soba sa 1+1 dva kreveta i pogledom na grad. Sadrži mini-bar, klima uređaj i LED TV.',
    bed: '1+1 dva kreveta',
    occupancy: 'Maksimalno 2 odrasle osobe',
    fallbackPrice: 110,
    fallbackCapacity: 2,
  },
  {
    key: 'SUITE',
    label: 'Family Suite',
    badge: 'Family Suite',
    badgeClass: 'suite',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    description: 'Spojene dvije dvokrevetne sobe, idealno za porodice. Sadrži mini-bar, klima uređaj i LED TV.',
    bed: 'Spojene dvije dvokrevetne sobe',
    occupancy: 'Idealno za porodice (do 4 osobe)',
    fallbackPrice: 160,
    fallbackCapacity: 4,
  },
];

export const ROOM_AMENITIES = ['🍳 Doručak', '📶 WiFi', '🍷 Mini Bar', '❄️ Klima', '📺 LED TV', '🔒 Sef', '🕐 Servis 24/7'];

export function roomTypeInfo(type: RoomTypeKey): RoomTypeInfo {
  return ROOM_TYPES.find((t) => t.key === type) ?? ROOM_TYPES[0];
}
