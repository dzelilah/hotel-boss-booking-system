export default function AboutPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="hero-content" data-aos="fade-left">
          <h2>O Hotel Boss</h2>
          <p>Upoznajte našu priču i vrijednosti koje nas čine posebnima.</p>
        </div>
      </section>

      <section className="about-detailed">
        <div className="container" data-aos="fade-right">
          <div className="about-grid">
            <div className="about-text">
              <h3>Naša Priča</h3>
              <p>
                Smešten u veoma mirnom delu grada koji odiše prošlim vremenima, Hotel Boss garantuje
                kvalitetan odmor, koji je svima potreban, kako bi bili spremni za nove izazove i
                svakodnevne obaveze.
              </p>
              <p>
                16 komfornih i luksuznih soba uređenih u skladu sa najnovijim trendovima omogućiće da
                se osećate odmorno, sveže i spremno kako za poslovne susrete i obaveze, tako i za
                putovanja iz privatnih razloga.
              </p>
              <p>
                Hotelu posebnost daje njegova lokacija gde su Vam istorijske građevine na dohvat ruke
                bez korišćenja prevoznih sredstava.
              </p>

              <h3>Naša Misija</h3>
              <p>
                Objedinili smo visoki standard i udobnost, profesionalnost i ljubaznost, te želimo da
                naš hotel &ldquo;Hotel Boss&rdquo; bude mesto koje ćete osećati kao &ldquo;drugi dom&rdquo;, jer Vaše
                želje stavljamo na prvo mesto.
              </p>
            </div>

            <div className="about-features">
              <h3>Što Nas Čini Posebnima</h3>
              <div className="feature-list">
                <div className="feature-item">
                  <h4>🏛️ Istorijska Lokacija</h4>
                  <p>Istorijske građevine na dohvat ruke bez korišćenja transporta</p>
                </div>
                <div className="feature-item">
                  <h4>🛏️ 16 Luksuznih Soba</h4>
                  <p>Komfort uređen po najnovijim trendovima</p>
                </div>
                <div className="feature-item">
                  <h4>🌟 Visok Standard Usluge</h4>
                  <p>Profesionalnost i ljubaznost osoblja</p>
                </div>
                <div className="feature-item">
                  <h4>🏆 Personalizirani Pristup</h4>
                  <p>Vaše želje i potrebe su naš prioritet</p>
                </div>
                <div className="feature-item">
                  <h4>📍 Centralna Lokacija</h4>
                  <p>U srcu Sarajeva, blizu svih atrakcija</p>
                </div>
                <div className="feature-item">
                  <h4>🕰️ 24/7 Recepcija</h4>
                  <p>Uvek smo tu kada nam trebate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container" data-aos="fade-up">
          <h3>Naš Tim</h3>
          <p>
            Hotel Boss vodi tim iskusnih profesionalaca posvećenih pružanju nezaboravnog iskustva
            svakom gostu.
          </p>
          <div className="values-grid">
            <div className="value-item">
              <h4>Gostoljubivost</h4>
              <p>Svaki gost je dobrodošao kao član porodice</p>
            </div>
            <div className="value-item">
              <h4>Kvalitet</h4>
              <p>Neprestano težimo izvrsnosti u svim segmentima</p>
            </div>
            <div className="value-item">
              <h4>Tradicija</h4>
              <p>Poštujemo nasljeđe Sarajeva i Bosne i Hercegovine</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
