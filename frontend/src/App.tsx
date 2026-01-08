import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Evaluator } from './pages/Evaluator';
import { About } from './pages/About';
import styles from './App.module.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <div className={styles.navBrand}>
          <span className={styles.navIcon}>🎓</span>
          <span className={styles.navTitle}>Kod Değerlendirme Sistemi</span>
        </div>
        <div className={styles.navLinks}>
          <Link
            to="/"
            className={`${styles.navLink} ${location.pathname === '/' ? styles.navLinkActive : ''}`}
          >
            Değerlendirici
          </Link>
          <Link
            to="/hakkinda"
            className={`${styles.navLink} ${location.pathname === '/hakkinda' ? styles.navLinkActive : ''}`}
          >
            Hakkında
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Navigation />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Evaluator />} />
            <Route path="/hakkinda" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
