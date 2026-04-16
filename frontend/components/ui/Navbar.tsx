'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Hotel, LogIn, LogOut, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, user, login, logout, hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN') || hasRole('STAFF');

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
              <Hotel className="h-6 w-6" />
              <span>HotelBoss</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/rooms" className="hover:text-blue-200 transition-colors">
                Rooms
              </Link>
              {isAuthenticated && (
                <Link href="/my-reservations" className="hover:text-blue-200 transition-colors">
                  My Reservations
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin/dashboard" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-blue-200">{user?.name || user?.email}</span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-md text-sm transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 px-3 py-2 rounded-md text-sm transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
