'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCreateReservation } from '@/lib/hooks/useReservations';
import { Room } from '@/lib/hooks/useRooms';
import { useAuth } from '@/lib/hooks/useAuth';
import { Calendar, Mail } from 'lucide-react';

const bookingSchema = z.object({
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guestEmail: z.string().email('Invalid email address'),
}).refine((data) => {
  return new Date(data.checkOut) > new Date(data.checkIn);
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  room: Room;
}

export function BookingForm({ room }: BookingFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutate: createReservation, isPending, error } = useCreateReservation();

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guestEmail: user?.email || '',
    },
  });

  const onSubmit = (data: BookingFormData) => {
    createReservation(
      {
        roomId: room.id,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guestEmail: data.guestEmail,
      },
      {
        onSuccess: (reservation) => {
          router.push(`/booking/confirmation?reservationId=${reservation.id}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Check-in Date</span>
          </span>
        </label>
        <input
          type="date"
          {...register('checkIn')}
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Check-out Date</span>
          </span>
        </label>
        <input
          type="date"
          {...register('checkOut')}
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <span className="flex items-center space-x-1">
            <Mail className="h-4 w-4" />
            <span>Guest Email</span>
          </span>
        </label>
        <input
          type="email"
          {...register('guestEmail')}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.guestEmail && <p className="text-red-500 text-sm mt-1">{errors.guestEmail.message}</p>}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">
            {(error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to create reservation. Please try again.'}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Booking...' : 'Confirm Booking'}
      </button>
    </form>
  );
}
