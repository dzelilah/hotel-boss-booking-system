'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';

export function Navbar() {
  const { isAuthenticated, user, login, logout, hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN') || hasRole('STAFF');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <nav>
        <div className="logo">
          <Link href="/">
            <Image src="/assets/images/logo.png" alt="Hotel Boss Logo" width={80} height={80} priority />
          </Link>
        </div>

        <div
          className={`mobile-menu-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul id="mobile-menu" className={menuOpen ? 'active' : ''}>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>POČETNA</Link></li>
          <li><Link href="/rooms" onClick={() => setMenuOpen(false)}>SOBE</Link></li>
          <li><Link href="/about" onClick={() => setMenuOpen(false)}>O NAMA</Link></li>
          <li><Link href="/gallery" onClick={() => setMenuOpen(false)}>GALERIJA SLIKA</Link></li>
          <li><Link href="/contact" onClick={() => setMenuOpen(false)}>REZERVIŠI SMJEŠTAJ</Link></li>
          {isAuthenticated && (
            <li><Link href="/my-reservations" onClick={() => setMenuOpen(false)}>MOJE REZERVACIJE</Link></li>
          )}
          {isAdmin && (
            <li><Link href="/admin/dashboard" onClick={() => setMenuOpen(false)}>ADMIN</Link></li>
          )}
          <li className="language-menu-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {user?.name || user?.email}
                  </span>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="lang-btn"
                  >
                    Odjavi se
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { login(); setMenuOpen(false); }}
                  className="lang-btn active"
                >
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
