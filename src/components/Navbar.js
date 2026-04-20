// src/components/Navbar.js
// Завдання 4: Маршрутизація — використовуємо NavLink з react-router-dom

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useVolunteer } from '../context/VolunteerContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { myProjects } = useVolunteer();

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

        {/* Desktop меню */}
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

        {/* Burger кнопка для мобільних */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Меню"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>
    </header>
  );
}
