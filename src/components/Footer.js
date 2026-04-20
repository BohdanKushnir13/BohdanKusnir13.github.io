// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>Volunteer<span>UA</span></div>
          <p>Об'єднуємо серця задля добрих справ.</p>
        </div>
        <div className={styles.col}>
          <h4>Зв'язок з нами</h4>
          <p>📞 <a href="tel:+380932791621">+380 (93) 279-16-21</a></p>
          <p>✉️ <a href="mailto:bohdan.kushnir.oi.24@lpnu.ua">bohdan.kushnir.oi.24@lpnu.ua</a></p>
        </div>
        <div className={styles.col}>
          <h4>Адреса</h4>
          <p>📍 м. Львів, вул. Волонтерська, 10</p>
          <p>🕐 Пн-Пт: 09:00–18:00</p>
          <p>🕐 Сб-Нд: 10:00–14:00</p>
        </div>
        <div className={styles.col}>
          <h4>Навігація</h4>
          <Link to="/">Доступні ініціативи</Link>
          <Link to="/my-initiatives">Мої ініціативи</Link>
          <Link to="/about">Про нас</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© 2026 VolunteerUA. Всі права захищені.</p>
      </div>
    </footer>
  );
}
