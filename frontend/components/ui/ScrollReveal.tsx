'use client';

import { useEffect } from 'react';

const OFFSETS: Record<string, string> = {
  'fade-up': '0 40px',
  'fade-right': '-40px 0',
  'fade-left': '40px 0',
};

/**
 * Reveals `[data-aos]` elements as they scroll into view (replaces the AOS CDN script, whose
 * init raced the script load and left content stuck at opacity 0).
 *
 * CSS hides un-revealed elements once `html.reveal-ready` is set; revealing is done with the
 * Web Animations API (fill: forwards), which overrides that CSS without touching the element's
 * attributes, so it can't cause hydration mismatches. It animates `translate` rather than
 * `transform`, so hover effects that use `transform` keep working.
 * A MutationObserver picks up content rendered later (client navigation, API data).
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const seen = new WeakSet<Element>();

    const reveal = (el: Element) => {
      const offset = OFFSETS[el.getAttribute('data-aos') ?? ''] ?? '0 0';
      const delay = Number(el.getAttribute('data-aos-delay')) || 0;
      el.animate(
        [{ opacity: 0, translate: offset }, { opacity: 1, translate: '0 0' }],
        { duration: 800, delay, easing: 'ease', fill: 'both' },
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );

    const scan = () => {
      document.querySelectorAll('[data-aos]').forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    };

    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });

    scan();
    // Hide un-revealed elements only once the observer is running, so content is never lost.
    document.documentElement.classList.add('reveal-ready');
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
