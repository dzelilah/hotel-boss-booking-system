import type { Metadata } from 'next';
import './globals.css';
import { KeycloakProvider } from '@/components/auth/KeycloakProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Hotel Boss - Luksuzni Smještaj',
  description: 'Hotel Boss - Doživite luksuz i komfor u srcu Sarajeva. Rezervišite vašu savršenu sobu.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bs">
      <body className="min-h-screen">
        <KeycloakProvider>
          <QueryProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </KeycloakProvider>
        <ScrollReveal />
      </body>
    </html>
  );
}
