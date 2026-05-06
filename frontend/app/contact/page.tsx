'use client';

import { useState, FormEvent } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div>
      <section className="page-hero">
        <div className="hero-content" data-aos="fade-left">
          <h2>Rezervišite Vaš Boravak</h2>
          <p>
            Rezervišite savršen smještaj u Hotel Boss. Popunite formu i poslat ćemo vam potvrdu
            emailom sa svim detaljima.
          </p>
        </div>
      </section>

      <section className="booking-section">
        <div className="container">
          <div className="booking-wrapper">
            <div className="booking-form-container" data-aos="fade-right">
              <h3>Detalji Rezervacije</h3>

              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</p>
                  <h4 style={{ color: '#1e3c72', marginBottom: '1rem', fontSize: '1.5rem' }}>
                    Hvala na rezervaciji!
                  </h4>
                  <p style={{ color: '#666' }}>
                    Primili smo vašu rezervaciju. Naš tim će vas kontaktirati u najkraćem roku.
                  </p>
                </div>
              ) : (
                <form id="contact-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Puno Ime *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Unesite vaše puno ime"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Adresa *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="vaš@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Broj Telefona</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+387 33 123-456"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="guests">Broj Gostiju</label>
                      <select id="guests" name="guests" required>
                        <option value="">Izaberite broj gostiju</option>
                        <option value="1">1 Gost</option>
                        <option value="2">2 Gosta</option>
                        <option value="3">3 Gosta</option>
                        <option value="4">4 Gosta</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="arrival-date">Datum Dolaska *</label>
                      <input
                        type="date"
                        id="arrival-date"
                        name="arrivalDate"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="nights">Broj Noći *</label>
                      <input
                        type="number"
                        id="nights"
                        name="nights"
                        min="1"
                        max="30"
                        required
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="room-type">Tip Sobe *</label>
                    <select id="room-type" name="roomType" required>
                      <option value="">Izaberite tip sobe</option>
                      <option value="standard">Standard Soba</option>
                      <option value="deluxe">Deluxe Soba</option>
                      <option value="family">Family Suite</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="special-requests">Posebni Zahtjevi</label>
                    <textarea
                      id="special-requests"
                      name="specialRequests"
                      rows={3}
                      placeholder="Imate li posebne zahtjeve ili potrebe?"
                    ></textarea>
                  </div>

                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="terms" name="terms" required />
                    <label htmlFor="terms">
                      Slažem se sa Uvjetima i Odredbama i Politikom Privatnosti *
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="newsletter" name="newsletter" />
                    <label htmlFor="newsletter">
                      Pretplati se na naš newsletter za ekskluzivne ponude i ažuriranja
                    </label>
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Šalje se...' : 'Završi Rezervaciju'}
                  </button>
                </form>
              )}
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
