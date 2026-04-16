import type { Metadata } from 'next';
import './globals.css';
import { KeycloakProvider } from '@/components/auth/KeycloakProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'HotelBoss - Hotel Management System',
  description: 'A full-stack hotel management platform supporting guest reservations and admin operations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <KeycloakProvider>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </KeycloakProvider>
      </body>
    </html>
  );
}
