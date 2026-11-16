'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

const LINKS = [
  { href: '/', label: 'POČETNA' },
  { href: '/rooms', label: 'SOBE' },
  { href: '/about', label: 'O NAMA' },
  { href: '/gallery', label: 'GALERIJA SLIKA' },
  { href: '/contact', label: 'REZERVIŠI SMJEŠTAJ' },
];

export function Navbar() {
  const { isAuthenticated, user, login, logout, hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN') || hasRole('STAFF');
  const isGuest = hasRole('GUEST');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 100);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const linkClass = (href: string) => (isActive(href) ? 'active' : undefined);

  return (
    <header className={sticky ? 'sticky' : undefined}>
      <nav>
        <div className="logo">
          <Link href="/" aria-label="Hotel Boss - početna">
            <Image
              src="/assets/images/logo.png"
              alt="Hotel Boss Logo"
              width={80}
              height={80}
              style={{ width: 'auto' }}
              priority
            />
          </Link>
        </div>

        <button
          type="button"
          className={`mobile-menu-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Zatvori meni' : 'Otvori meni'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul id="mobile-menu" className={menuOpen ? 'active' : ''}>
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={linkClass(href)}>{label}</Link>
            </li>
          ))}
          {isAuthenticated && isGuest && (
            <li><Link href="/my-reservations" className={linkClass('/my-reservations')}>MOJE REZERVACIJE</Link></li>
          )}
          {isAdmin && (
            <li><Link href="/admin/dashboard" className={linkClass('/admin')}>ADMIN</Link></li>
          )}
          <li className="language-menu-item">
            <div className="nav-auth">
              {isAuthenticated ? (
                <>
                  <span className="nav-user">{user?.name || user?.email}</span>
                  <button
                    type="button"
                    onClick={logout}
                    className="lang-btn"
                    title={user?.email ? `Prijavljeni ste kao ${user.email}` : undefined}
                  >
                    Odjavi se
                  </button>
                </>
              ) : (
                <button type="button" onClick={login} className="lang-btn active">
                  Prijavi se
                </button>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
