import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content" data-aos="fade-right">
          <h1>Dobrodošli u</h1>
          <h2>Hotel Boss</h2>
          <p>Glamur i luksuz na dohvat ruke</p>
          <Link href="/contact" className="cta-button">Rezervišite sada</Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container" data-aos="fade-right">
          <h3>O Hotel Boss</h3>
          <div className="about-content">
            <div className="about-text">
              <p>
                Smešten u veoma mirnom delu grada koji odiše prošlim vremenima, garantuje kvalitetan odmor,
                koji je svima potreban, kako bi bili spremni za nove izazove i svakodnevne obaveze.
              </p>
              <p>
                16 komfornih i luksuznih soba uređenih u skladu sa najnovijim trendovima omogućiće da se
                osećate odmorno, sveže i spremno kako za poslovne susrete i obaveze, tako i za putovanja
                iz privatnih razloga.
              </p>
              <p>
                Hotelu posebnost daje njegova lokacija gde su Vam istorijske građevine na dohvat ruke bez
                korišćenja prevoznih sredstava.
              </p>
              <p>
                Objedinili smo visoki standard i udobnost, profesionalnost i ljubaznost, te želimo da naš
                hotel &ldquo;Hotel Boss&rdquo; bude mesto koje ćete osećati kao &ldquo;drugi dom&rdquo;, jer Vaše želje
                stavljamo na prvo mesto.
              </p>
            </div>
            <div className="features">
              <div className="feature">
                <h4>🏛️ Istorijska Lokacija</h4>
                <p>Istorijske građevine u krugu od par koraka</p>
              </div>
              <div className="feature">
                <h4>🛏️ 16 Luksuznih Soba</h4>
                <p>Komfor dizajniran prema najnovijim trendovima</p>
              </div>
              <div className="feature">
                <h4>🌟 Visoki Standardi Usluge</h4>
                <p>Profesionalno i ljubazno osoblje</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rooms Preview Section */}
      <section className="rooms-preview">
        <div className="container" data-aos="fade-up">
          <h3>Naše Sobe</h3>
          <div className="room-grid">
            {/* Standard Room */}
            <div className="room-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"
                alt="Standardna Soba"
              />
              <div className="room-info">
                <h4>Standardna Soba</h4>
                <p>Udobna soba sa modernim sadržajima, savršena za poslovne putnike.</p>
                <div className="room-amenities">
                  <span>📶 Besplatan Wi-Fi</span>
                  <span>❄️ Klima</span>
                  <span>📺 Smart TV</span>
                </div>
                <div className="price-booking">
                  <Link href="/contact" className="book-btn">Rezerviši</Link>
                </div>
              </div>
            </div>

            {/* Deluxe Room */}
            <div className="room-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop"
                alt="Deluxe Soba"
              />
              <div className="room-info">
                <h4>Deluxe Soba</h4>
                <p>Prostrana soba sa pogledom na grad i premium sadržajima.</p>
                <div className="room-amenities">
                  <span>🌆 Pogled na Grad</span>
                  <span>🛁 Kada</span>
                  <span>☕ Aparat za Kafu</span>
                </div>
                <div className="price-booking">
                  <Link href="/contact" className="book-btn">Rezerviši</Link>
                </div>
              </div>
            </div>

            {/* Suite */}
            <div className="room-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"
                alt="Family Suite"
              />
              <div className="room-info">
                <h4>Family Suite</h4>
                <p>Luksuzni apartman sa odvojenim dnevnim boravkom i premium uslugama.</p>
                <div className="room-amenities">
                  <span>🏛️ Spojene Sobe</span>
                  <span>🥐 Besplatan Doručak</span>
                  <span>🛎️ Koncijaž</span>
                </div>
                <div className="price-booking">
                  <Link href="/contact" className="book-btn">Rezerviši</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
