'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const reservationId = searchParams.get('reservationId');

  return (
    <div className="text-center">
      <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
      {reservationId && (
        <p className="text-gray-600 mb-2">Reservation #{reservationId}</p>
      )}
      <p className="text-gray-600 mb-8">
        Your booking has been confirmed. A confirmation email will be sent to you shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/my-reservations"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View My Reservations
        </Link>
        <Link
          href="/rooms"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Browse More Rooms
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Suspense fallback={<div className="flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
