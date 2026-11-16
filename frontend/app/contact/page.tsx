import { AvailabilitySearch } from '@/components/booking/AvailabilitySearch';

export default function ContactPage() {
  return (
    <div>
      <section className="page-hero">
        <div className="hero-content" data-aos="fade-left">
          <h2>Rezervišite Vaš Boravak</h2>
          <p>
            Odaberite datume i broj gostiju, provjerite slobodne sobe i rezervišite online za manje od minute.
          </p>
        </div>
      </section>

      <section className="booking-section">
        <div className="container">
          <div className="booking-wrapper">
            <div className="booking-form-container" data-aos="fade-right">
              <h3>Provjerite Dostupnost</h3>
              <AvailabilitySearch variant="form" />
              <p className="form-footnote">
                Radije biste rezervisali telefonom? Pozovite nas na{' '}
                <a href="tel:+38733869656">+387 33 869 656</a>, dostupni smo 24/7.
              </p>
            </div>

            <div className="booking-info" data-aos="fade-left">
              <div className="info-card">
                <h4>📍 Lokacija Hotela</h4>
                <p><strong>Hotel Boss</strong></p>
                <p>Alifakovac 42<br />71000 Sarajevo, BiH</p>
                <p>📞 +387 33 869 656</p>
                <p>✉️ info@bosshotel.ba</p>
              </div>

              <div className="info-card">
                <h4>🗺️ Lokacija na Mapi</h4>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2877.4826855735834!2d18.416885315846104!3d43.86366654615152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4758cbb1ed719bd1%3A0x562ecda6de87b33e!2sAlifakovac%2C%20Sarajevo%2071000%2C%20Bosnia%20and%20Herzegovina!5e0!3m2!1sen!2s!4v1699185555555!5m2!1sen!2s"
                    width="100%"
                    height="200"
                    style={{ border: 0, borderRadius: '8px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Hotel Boss lokacija"
                  ></iframe>
                </div>
                <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                  Istorijske građevine na dohvat ruke
                </p>
              </div>

              <div className="info-card">
                <h4>🎯 Usluge Uključene</h4>
                <p>• Mini Bar u svakoj sobi</p>
                <p>• Besplatni WiFi Hotspot</p>
                <p>• Klima uređaj</p>
                <p>• LED TV</p>
                <p>• Sigurnosni sef</p>
                <p>• Doručak uključen u cenu</p>
                <p>• 7/24 servis</p>
              </div>

              <div className="info-card contact-card">
                <h4>Trebate Pomoć?</h4>
                <p>
                  Naš tim za rezervacije je dostupan 24/7 da vam pomogne sa vašom rezervacijom.
                </p>
                <div className="contact-buttons">
                  <a href="tel:+38733869656" className="contact-btn">📞 Pozovite Sada</a>
                  <a href="mailto:info@bosshotel.ba" className="contact-btn">✉️ Pošaljite Email</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
