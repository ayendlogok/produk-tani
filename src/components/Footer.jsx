import { Leaf, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <div className="logo">
            <Leaf className="logo-icon" size={28} />
            <span className="logo-text text-gradient">TaniCare</span>
          </div>
          <p className="brand-desc">
            Platform pertanian pintar untuk generasi masa depan. Membawa teknologi Enterprise ke ladang Anda.
          </p>
          <div className="social-links">
            <a href="#"><Leaf size={20} /></a>
            <a href="#"><Mail size={20} /></a>
            <a href="#"><Phone size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Solusi</h3>
          <ul>
            <li><a href="/market">TaniMarket</a></li>
            <li><a href="/dashboard">IoT Dashboard</a></li>
            <li><a href="#">Deteksi Penyakit AI</a></li>
            <li><a href="/hub">Klinik Tani</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Perusahaan</h3>
          <ul>
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Karir</a></li>
            <li><a href="#">Privasi & Kebijakan</a></li>
            <li><a href="#">Syarat Ketentuan</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Hubungi Kami</h3>
          <ul>
            <li><MapPin size={18} /> Menara Pertanian Lt. 12, Jakarta</li>
            <li><Phone size={18} /> +62 812 3456 7890</li>
            <li><Mail size={18} /> info@tanicare.id</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TaniCare Enterprise. Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
};

export default Footer;
