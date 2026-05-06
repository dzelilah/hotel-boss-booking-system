'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LayoutDashboard, BedDouble, CalendarDays } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { href: '/admin/reservations', label: 'Reservations', icon: CalendarDays },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <RoleGuard roles={['ADMIN', 'STAFF']}>
        <div className="flex min-h-screen">
          <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-lg font-bold">Admin Panel</h2>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
