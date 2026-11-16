'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateReservation } from '@/lib/hooks/useReservations';
import { Room, useRoomAvailability } from '@/lib/hooks/useRooms';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  addDaysIso, apiErrorMessage, formatDate, formatPrice, isIsoDate, nightsBetween, nightsLabel, todayIso,
} from '@/lib/format';
import { roomTypeInfo } from '@/lib/roomTypes';

const MAX_NIGHTS = 30;

const bookingSchema = z.object({
  checkIn: z.string().refine(isIsoDate, 'Odaberite datum dolaska.'),
  checkOut: z.string().refine(isIsoDate, 'Odaberite datum odlaska.'),
  guestEmail: z.string().email('Unesite ispravnu email adresu.'),
}).superRefine((data, ctx) => {
  if (!isIsoDate(data.checkIn) || !isIsoDate(data.checkOut)) return;
  if (data.checkIn < todayIso()) {
    ctx.addIssue({ code: 'custom', path: ['checkIn'], message: 'Datum dolaska ne može biti u prošlosti.' });
  }
  const nights = nightsBetween(data.checkIn, data.checkOut);
  if (nights < 1) {
    ctx.addIssue({ code: 'custom', path: ['checkOut'], message: 'Datum odlaska mora biti nakon datuma dolaska.' });
  } else if (nights > MAX_NIGHTS) {
    ctx.addIssue({ code: 'custom', path: ['checkOut'], message: `Najduži boravak je ${MAX_NIGHTS} noći.` });
  }
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  room: Room;
  initialCheckIn?: string | null;
  initialCheckOut?: string | null;
}

export function BookingForm({ room, initialCheckIn, initialCheckOut }: BookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: createReservation, isPending, error } = useCreateReservation();
  const today = todayIso();
  const defaultCheckIn = isIsoDate(initialCheckIn) && initialCheckIn >= today ? initialCheckIn : today;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkIn: defaultCheckIn,
      checkOut: isIsoDate(initialCheckOut) && initialCheckOut > defaultCheckIn
        ? initialCheckOut
        : addDaysIso(defaultCheckIn, 1),
      guestEmail: user?.email || '',
    },
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');
  const datesValid = isIsoDate(checkIn) && isIsoDate(checkOut) && checkIn >= today
    && nightsBetween(checkIn, checkOut) >= 1 && nightsBetween(checkIn, checkOut) <= MAX_NIGHTS;
  const nights = datesValid ? nightsBetween(checkIn, checkOut) : 0;

  const { data: isFree, isFetching: checking } = useRoomAvailability(room.id, checkIn, checkOut, datesValid);
  const type = roomTypeInfo(room.type);

  const checkInField = register('checkIn');

  const onSubmit = (data: BookingFormData) => {
    createReservation(
      { roomId: room.id, checkIn: data.checkIn, checkOut: data.checkOut, guestEmail: data.guestEmail },
      { onSuccess: (reservation) => router.push(`/booking/confirmation?reservationId=${reservation.id}`) },
    );
  };

  return (
    <div className="booking-wrapper">
      <div className="booking-form-container" data-aos="fade-right">
        <h3>Detalji Rezervacije</h3>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="checkIn">Datum dolaska *</label>
              <input
                id="checkIn"
                type="date"
                min={today}
                {...checkInField}
                onChange={(e) => {
                  checkInField.onChange(e);
                  const value = e.target.value;
                  if (isIsoDate(value) && (!isIsoDate(checkOut) || checkOut <= value)) {
                    setValue('checkOut', addDaysIso(value, 1));
                  }
                }}
              />
              {errors.checkIn && <p className="field-error">{errors.checkIn.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="checkOut">Datum odlaska *</label>
              <input
                id="checkOut"
                type="date"
                min={isIsoDate(checkIn) ? addDaysIso(checkIn, 1) : today}
                {...register('checkOut')}
              />
              {errors.checkOut && <p className="field-error">{errors.checkOut.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="guestEmail">Email za potvrdu *</label>
            <input id="guestEmail" type="email" placeholder="vaš@email.com" {...register('guestEmail')} />
            {errors.guestEmail && <p className="field-error">{errors.guestEmail.message}</p>}
          </div>

          {datesValid && !checking && isFree === false && (
            <p className="form-alert error" role="alert">
              {room.name} nije slobodna za odabrane datume. Odaberite druge datume ili{' '}
              <a href={`/rooms?checkIn=${checkIn}&checkOut=${checkOut}#rezultati`}>pogledajte druge sobe</a>.
            </p>
          )}
          {datesValid && !checking && isFree === true && (
            <p className="form-alert success" role="status">✓ Soba je slobodna za odabrane datume.</p>
          )}
          {error && (
            <p className="form-alert error" role="alert">
              {apiErrorMessage(error, 'Rezervacija nije uspjela. Pokušajte ponovo.')}
            </p>
          )}

          <button type="submit" className="submit-btn" disabled={isPending || isFree === false}>
            {isPending ? 'Rezervacija u toku…' : 'Potvrdi rezervaciju'}
          </button>
        </form>
      </div>

      <aside className="booking-info" data-aos="fade-left">
        <div className="info-card booking-summary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={type.image} alt={type.label} />
          <h4>{room.name}</h4>
          <p className="summary-type">{type.label} · do {room.capacity} osobe</p>
          <dl>
            <div><dt>Dolazak</dt><dd>{isIsoDate(checkIn) ? formatDate(checkIn) : '—'}</dd></div>
            <div><dt>Odlazak</dt><dd>{isIsoDate(checkOut) ? formatDate(checkOut) : '—'}</dd></div>
            <div><dt>Cijena po noći</dt><dd>{formatPrice(room.pricePerNight)}</dd></div>
            {nights > 0 && (
              <div className="summary-total">
                <dt>Ukupno ({nightsLabel(nights)})</dt>
                <dd>{formatPrice(room.pricePerNight * nights)}</dd>
              </div>
            )}
          </dl>
        </div>
        <div className="info-card">
          <h4>📋 Dobro je znati</h4>
          <p>Check-in od 15:00, check-out do 12:00.</p>
          <p>Doručak je uključen u cijenu.</p>
          <p>Besplatno otkazivanje do dan prije dolaska.</p>
        </div>
      </aside>
    </div>
  );
}
