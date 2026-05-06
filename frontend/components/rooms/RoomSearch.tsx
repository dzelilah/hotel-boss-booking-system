'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function RoomSearch() {
  const router = useRouter();
  const [availableOnly, setAvailableOnly] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (availableOnly) params.set('available', 'true');
    router.push(`/rooms?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(e) => setAvailableOnly(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded"
        />
        <span className="text-white">Available rooms only</span>
      </label>
      <button
        type="submit"
        className="flex items-center justify-center space-x-2 bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search Rooms</span>
      </button>
    </form>
  );
}
