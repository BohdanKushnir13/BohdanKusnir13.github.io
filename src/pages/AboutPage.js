import React, { useState } from 'react';
import styles from './AboutPage.module.css';

// Дані статистики — виведені в окремий масив для зручності
const STATS = [
  { icon: '📋', value: '200+', label: 'організованих проєктів' },
  { icon: '👥', value: '5 000+', label: 'залучених волонтерів' },
  { icon: '🏙️', value: '15', label: 'міст України' },
  { icon: '🎯', value: '98%', label: 'успішно завершених акцій' },
];

const TEAM = [,
  { name: 'Богдан Кушнір',  role: 'Координатор проєктів',  emoji: '👨‍💻' },
];

// FAQ — стан відкритих питань через useState
const FAQ = [
  { q: 'Як долучитися до ініціативи?', a: 'Натисніть кнопку "Приєднатися" на сторінці ініціативи та заповніть форму реєстрації.' },
  { q: 'Чи потрібен досвід?',           a: 'Ні! Більшість наших проєктів не потребує спеціальних навичок — лише бажання допомагати.' },
  { q: 'Як запропонувати свою ідею?',   a: 'На головній сторінці є форма "Запропонувати нову ініціативу" — заповніть її, і ми вас зв\'яжемо.' },
  { q: 'Чи можна скасувати реєстрацію?', a: 'Так. У розділі "Мої ініціативи" натисніть "Скасувати участь" на потрібній картці.' },
];

export default function AboutPage() {
  // ── useState: який елемент FAQ відкрито ──
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => setOpenFaq((prev) => (prev === idx ? null : idx));

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1>Про нашу <span>організацію</span></h1>
        <p>Наша місія — об'єднувати серця задля добрих справ.</p>
      </section>

      {/* Статистика */}
      <section className={styles.statsSection}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <span className={styles.statIcon}>{s.icon}</span>
            <strong className={styles.statValue}>{s.value}</strong>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* Про організацію */}
      <section className={styles.aboutGrid}>
        <div className={styles.aboutCard}>
          <span className={styles.aboutIcon}>🎯</span>
          <h3>Наша місія</h3>
          <p>Ми створюємо простір, де кожен може знайти спосіб допомогти суспільству — незалежно від можливостей і досвіду.</p>
        </div>
        <div className={styles.aboutCard}>
          <span className={styles.aboutIcon}>💡</span>
          <h3>Наш підхід</h3>
          <p>Організовуємо прозорі, добре скоординовані акції з чіткою метою та вимірюваним результатом для кожного учасника.</p>
        </div>
        <div className={styles.aboutCard}>
          <span className={styles.aboutIcon}>🌱</span>
          <h3>Наші цінності</h3>
          <p>Відкритість, взаємоповага, відповідальність та постійний розвиток волонтерської культури в Україні.</p>
        </div>
      </section>

      {/* Команда */}
      <section className={styles.teamSection}>
        <h2>Наша команда</h2>
        <div className={styles.teamGrid}>
          {TEAM.map((member) => (
            <div key={member.name} className={styles.teamCard}>
              <div className={styles.teamAvatar}>{member.emoji}</div>
              <h4>{member.name}</h4>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Контакти */}
      <section className={styles.contactSection}>
        <h2>Контакти</h2>
        <div className={styles.contactGrid}>
          <address className={styles.contactCard}>
            <span className={styles.contactIcon}>📍</span>
            <strong>Адреса</strong>
            <p>м. Львів, вул. Степана Бандери, 10</p>
          </address>
          <address className={styles.contactCard}>
            <span className={styles.contactIcon}>📞</span>
            <strong>Телефон</strong>
            <p><a href="tel:+380932791621">+380 (93) 279-16-21</a></p>
          </address>
          <address className={styles.contactCard}>
            <span className={styles.contactIcon}>✉️</span>
            <strong>Email</strong>
            <p><a href="mailto:bohdan.kushnir.oi.24@lpnu.ua">bohdan.kushnir.oi.24@lpnu.ua</a></p>
          </address>
          <div className={styles.contactCard}>
            <span className={styles.contactIcon}>🕐</span>
            <strong>Графік роботи</strong>
            <p>Пн–Пт: 09:00–18:00<br />Сб–Нд: 10:00–14:00</p>
          </div>
        </div>
      </section>

      {/* FAQ з useState */}
      <section className={styles.faqSection}>
        <h2>Часті запитання</h2>
        <div className={styles.faqList}>
          {FAQ.map((item, idx) => (
            <div key={idx} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${openFaq === idx ? styles.faqOpen : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <span>{item.q}</span>
                <span className={styles.faqArrow}>{openFaq === idx ? '▲' : '▼'}</span>
              </button>
              {openFaq === idx && (
                <div className={styles.faqAnswer}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
