'use client';

import Link from 'next/link';
import { useState } from 'react';

type Category = 'all' | 'rooms' | 'exterior';

interface GalleryItem {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  category: 'rooms' | 'exterior';
}

const galleryItems: GalleryItem[] = [
  {
    src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    alt: 'Standardna Soba',
    title: 'Standardna Soba',
    subtitle: 'Moderna udobnost',
    category: 'rooms',
  },
  {
    src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop',
    alt: 'Deluxe Soba',
    title: 'Deluxe Soba',
    subtitle: 'Pogled na grad i luksuz',
    category: 'rooms',
  },
  {
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    alt: 'Izvršni Apartman',
    title: 'Izvršni Apartman',
    subtitle: 'Premium smještaj',
    category: 'rooms',
  },
  {
    src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    alt: 'Porodična Soba',
    title: 'Porodična Soba',
    subtitle: 'Prostor za porodice',
    category: 'rooms',
  },
  {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    alt: 'Eksterijer Hotela Danju',
    title: 'Eksterijer Hotela',
    subtitle: 'Moderan i elegantan',
    category: 'exterior',
  },
  {
    src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop',
    alt: 'Eksterijer Hotela Noću',
    title: 'Noćni Pogled',
    subtitle: 'Prekrasno osvjetljenje',
    category: 'exterior',
  },
  {
    src: 'https://images.unsplash.com/photo-1577683946856-7089f7309636?w=800&h=600&fit=crop',
    alt: 'Ulaz u Hotel',
    title: 'Glavni Ulaz',
    subtitle: 'Dobrodošli i veličanstven',
    category: 'exterior',
  },
  {
    src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
    alt: 'Pogled na Grad',
    title: 'Pogled na Grad',
    subtitle: 'Panoramski pogled',
    category: 'exterior',
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div>
      <section className="page-hero">
        <div className="hero-content" data-aos="fade-left">
          <h2>Galerija Hotela</h2>
          <p>
            Otkrijte eleganciju i ljepotu Hotel Boss-a kroz našu kolekciju prekrasnih slika koje
            prikazuju naš smještaj, sadržaje i ambijent.
          </p>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="gallery-categories" data-aos="fade-up">
            <button
              className={`category-btn${activeCategory === 'all' ? ' active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Sve Slike
            </button>
            <button
              className={`category-btn${activeCategory === 'rooms' ? ' active' : ''}`}
              onClick={() => setActiveCategory('rooms')}
            >
              Sobe i Apartmani
            </button>
            <button
              className={`category-btn${activeCategory === 'exterior' ? ' active' : ''}`}
              onClick={() => setActiveCategory('exterior')}
            >
              Eksterijer Hotela
            </button>
          </div>

          <div className="gallery-grid">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className={`gallery-item ${item.category}`}
                data-aos="fade-up"
                data-aos-delay={String((index % 4) * 100)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.alt} />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" data-aos="fade-up">
        <div className="container">
          <div className="cta-content">
            <h3>Spremni da doživite Hotel Boss?</h3>
            <p>
              Rezervišite svoj boravak danas i otkrijte zašto naši gosti biraju nas za svoj
              komfor i luksuzne potrebe.
            </p>
            <Link href="/contact" className="cta-button">
              Napravite Rezervaciju
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
