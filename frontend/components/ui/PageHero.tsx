interface PageHeroProps {
  title: string;
  subtitle?: string;
}

/** Shorter hero for app pages; also gives the transparent header a dark backdrop. */
export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="page-hero compact">
      <div className="hero-content">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </section>
  );
}
