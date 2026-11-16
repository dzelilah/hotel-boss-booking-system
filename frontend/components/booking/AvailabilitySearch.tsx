'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDaysIso, guestsLabel, isIsoDate, nightsBetween, nightsLabel, todayIso } from '@/lib/format';
import { ROOM_TYPES, RoomTypeKey } from '@/lib/roomTypes';

const MAX_NIGHTS = 30;
const MAX_GUESTS = 4;

interface AvailabilitySearchProps {
  /** "bar" is a compact horizontal strip; "form" is the full form used on the booking page. */
  variant?: 'bar' | 'form';
  initialCheckIn?: string | null;
  initialCheckOut?: string | null;
  initialGuests?: number | null;
  initialType?: RoomTypeKey | null;
}

export function AvailabilitySearch({
  variant = 'bar',
  initialCheckIn,
  initialCheckOut,
  initialGuests,
  initialType,
}: AvailabilitySearchProps) {
  const router = useRouter();
  const today = todayIso();
  const [checkIn, setCheckIn] = useState(isIsoDate(initialCheckIn) ? initialCheckIn : today);
  const [checkOut, setCheckOut] = useState(
    isIsoDate(initialCheckOut) ? initialCheckOut : addDaysIso(isIsoDate(initialCheckIn) ? initialCheckIn : today, 1),
  );
  const [guests, setGuests] = useState(initialGuests && initialGuests > 0 ? Math.min(initialGuests, MAX_GUESTS) : 2);
  const [type, setType] = useState<RoomTypeKey | ''>(initialType ?? '');
  const [error, setError] = useState<string | null>(null);

  const onCheckInChange = (value: string) => {
    setCheckIn(value);
    // Keep the stay valid when moving the arrival date past the departure date.
    if (isIsoDate(value) && (!isIsoDate(checkOut) || checkOut <= value)) {
      setCheckOut(addDaysIso(value, 1));
    }
  };

  const nights = isIsoDate(checkIn) && isIsoDate(checkOut) ? nightsBetween(checkIn, checkOut) : 0;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) return setError('Odaberite datume dolaska i odlaska.');
    if (checkIn < today) return setError('Datum dolaska ne može biti u prošlosti.');
    if (nights < 1) return setError('Datum odlaska mora biti nakon datuma dolaska.');
    if (nights > MAX_NIGHTS) return setError(`Najduži boravak je ${MAX_NIGHTS} noći.`);
    setError(null);

    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    if (type) params.set('type', type);
    router.push(`/rooms?${params.toString()}#rezultati`);
  };

  const dateFields = (
    <>
      <div className="form-group">
        <label htmlFor={`${variant}-check-in`}>Datum dolaska</label>
        <input
          id={`${variant}-check-in`}
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => onCheckInChange(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor={`${variant}-check-out`}>Datum odlaska</label>
        <input
          id={`${variant}-check-out`}
          type="date"
          value={checkOut}
          min={isIsoDate(checkIn) ? addDaysIso(checkIn, 1) : today}
          onChange={(e) => setCheckOut(e.target.value)}
          required
        />
      </div>
    </>
  );

  const guestsField = (
    <div className="form-group">
      <label htmlFor={`${variant}-guests`}>Broj gostiju</label>
      <select id={`${variant}-guests`} value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
        {Array.from({ length: MAX_GUESTS }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>{guestsLabel(n)}</option>
        ))}
      </select>
    </div>
  );

  if (variant === 'form') {
    return (
      <form onSubmit={onSubmit} noValidate>
        <div className="form-row">{dateFields}</div>
        <div className="form-row">
          {guestsField}
          <div className="form-group">
            <label htmlFor="form-room-type">Tip sobe</label>
            <select id="form-room-type" value={type} onChange={(e) => setType(e.target.value as RoomTypeKey | '')}>
              <option value="">Svi tipovi soba</option>
              {ROOM_TYPES.map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        {nights > 0 && nights <= MAX_NIGHTS && (
          <p className="search-summary">Boravak: <strong>{nightsLabel(nights)}</strong>, {guestsLabel(guests)}</p>
        )}
        {error && <p className="form-alert error" role="alert">{error}</p>}
        <button type="submit" className="submit-btn">Provjeri dostupnost</button>
      </form>
    );
  }

  return (
    <form className="availability-bar" onSubmit={onSubmit} noValidate>
      {dateFields}
      {guestsField}
      <button type="submit" className="book-btn availability-bar-btn">Provjeri dostupnost</button>
      {error && <p className="form-alert error availability-bar-error" role="alert">{error}</p>}
    </form>
  );
}
