import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { KeycloakProvider } from '@/components/auth/KeycloakProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css"
        />
      </head>
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
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"
          strategy="afterInteractive"
        />
        <Script id="aos-init" strategy="afterInteractive">
          {`AOS.init({ duration: 1000, once: true });`}
        </Script>
        <Script id="sticky-nav" strategy="afterInteractive">
          {`
            window.addEventListener('scroll', function() {
              var header = document.querySelector('header');
              if (header) {
                if (window.scrollY > 100) {
                  header.classList.add('sticky');
                } else {
                  header.classList.remove('sticky');
                }
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
