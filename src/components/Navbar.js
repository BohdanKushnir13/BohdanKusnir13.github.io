// src/components/Navbar.js
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useVolunteer } from '../context/VolunteerContext';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../config/admin';
import styles from './Navbar.module.css';
import AuthModal from './AuthModal';
import SubmitInitiativeModal from './SubmitInitiativeModal';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const { myProjects } = useVolunteer();
  const { currentUser, logout } = useAuth();

  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  const links = [
    { to: '/',               label: 'Доступні ініціативи' },
    { to: '/my-initiatives', label: 'Мої ініціативи' },
    { to: '/about',          label: 'Про нас' },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo}>
          Volunteer<span>UA</span>
        </NavLink>

        <ul className={`${styles.menu} ${menuOpen ? styles.open : ''}`}>
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
                {to === '/my-initiatives' && myProjects.length > 0 && (
                  <span className={styles.badge}>{myProjects.length}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className={styles.authBlock}>
          {currentUser ? (
            <>
              <span className={styles.userEmail}>{currentUser.email}</span>
              {!isAdmin && (
                <button
                  className={styles.authBtn}
                  style={{ background: '#2ecc71' }}
                  onClick={() => setShowSubmitModal(true)}
                >
                  + Ініціатива
                </button>
              )}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={styles.authBtn}
                  style={{ background: '#e67e22', textDecoration: 'none' }}
                >
                  🛡️ Адмін
                </NavLink>
              )}
              <button className={styles.authBtn} onClick={logout}>
                Вийти
              </button>
            </>
          ) : (
            <button className={styles.authBtn} onClick={() => setShowAuthModal(true)}>
              Увійти
            </button>
          )}
        </div>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showSubmitModal && <SubmitInitiativeModal onClose={() => setShowSubmitModal(false)} />}
    </header>
  );
}