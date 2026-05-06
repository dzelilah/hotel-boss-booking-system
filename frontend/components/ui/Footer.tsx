export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Hotel Boss</h4>
            <p>Doživite luksuz i komfor u srcu Sarajeva.</p>
            <div className="social-links">
              <a href="#" aria-label="Posjetite naš Facebook profil">📘</a>
              <a href="#" aria-label="Posjetite naš Instagram profil">📷</a>
              <a href="#" aria-label="Posjetite naš Twitter profil">🐦</a>
            </div>
          </div>
          <div className="footer-section">
            <h5>Kontakt</h5>
            <p>📍 Alifakovac 42, Sarajevo 71000</p>
            <p>📞 +387 33 869 656</p>
            <p>✉️ info@bosshotel.ba</p>
          </div>
        </div>
        <p>© {new Date().getFullYear()} Hotel Boss. Sva prava zadržana.</p>
      </div>
    </footer>
  );
}
