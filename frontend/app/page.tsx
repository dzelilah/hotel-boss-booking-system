import Link from 'next/link';
import { RoomSearch } from '@/components/rooms/RoomSearch';
import { BedDouble, Shield, Clock, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to HotelBoss
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience luxury and comfort. Book your perfect room with our seamless reservation system.
          </p>
          <RoomSearch />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose HotelBoss?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BedDouble className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Rooms</h3>
              <p className="text-gray-600">Single rooms, doubles, and luxury suites for every occasion.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
              <p className="text-gray-600">Your reservations are protected with enterprise-grade security.</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Confirmation</h3>
              <p className="text-gray-600">Get immediate confirmation with email notifications via Azure Queue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Book Your Stay?</h2>
          <p className="text-gray-600 mb-8">Browse our available rooms and find your perfect accommodation.</p>
          <Link
            href="/rooms"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Rooms
          </Link>
        </div>
      </section>
    </div>
  );
}
