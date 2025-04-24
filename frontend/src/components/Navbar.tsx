import React from 'react';
import { Link } from 'react-router-dom'; // Link bileşenini import edin
import styles from './Navbar.module.css';

interface NavbarProps {
  isAdmin: boolean; // Admin durumunu props olarak alıyoruz
  onLogout: () => void; // Çıkış butonunun işlevini props olarak alıyoruz
}

const Navbar: React.FC<NavbarProps> = ({ isAdmin, onLogout }) => {
  return (
    <nav className={styles.navbar}>
      <h1 className={styles.navbarTitle}>SFlix</h1>
      <ul className={styles.navList}>
        {/* Eğer kullanıcı admin ise Admin Paneli bağlantısını göster */}
        {isAdmin && (
          <li className={styles.navItem}>
            <Link to="/admin-panel" className={styles.navLink}>
              Admin Paneli
            </Link>
          </li>
        )}
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>
            Anasayfa
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/about" className={styles.navLink}>
            Hakkımızda
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/diziler" className={styles.navLink}>
            Diziler
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/filmler" className={styles.navLink}>
            Filmler
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/kategoriler" className={styles.navLink}>
            Kategoriler
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/profilim" className={styles.navLink}>
            Profilim
          </Link>
        </li>
        {/* Çıkış Butonu */}
        <li className={styles.navItem}>
          <button onClick={onLogout} className={styles.logoutButton}>
            Çıkış
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
