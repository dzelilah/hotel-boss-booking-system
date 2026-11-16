'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageHero } from '@/components/ui/PageHero';
import { LayoutDashboard, BedDouble, CalendarDays } from 'lucide-react';

const navItems = [
  { href: '/admin/dashboard', label: 'Pregled', icon: LayoutDashboard },
  { href: '/admin/rooms', label: 'Sobe', icon: BedDouble },
  { href: '/admin/reservations', label: 'Rezervacije', icon: CalendarDays },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <PageHero title="Administracija" subtitle="Upravljanje sobama i rezervacijama." />
      <section className="admin-section">
        <ProtectedRoute>
          <RoleGuard roles={['ADMIN', 'STAFF']}>
            <div className="admin-shell">
              <aside className="admin-sidebar">
                <nav aria-label="Administracija">
                  {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`admin-nav-link${pathname === href ? ' active' : ''}`}
                      aria-current={pathname === href ? 'page' : undefined}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span>{label}</span>
                    </Link>
                  ))}
                </nav>
              </aside>
              <div className="admin-content">
                {children}
              </div>
            </div>
          </RoleGuard>
        </ProtectedRoute>
      </section>
    </div>
  );
}
