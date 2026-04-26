import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVolunteer } from '../context/VolunteerContext';
import { getInitiatives } from '../services/firestoreService';
import styles from './MyInitiativesPage.module.css';

export default function MyInitiativesPage() {
  const { myProjects, leaveInitiative } = useVolunteer();
  const [allInitiatives, setAllInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);

  // Завантажуємо всі ініціативи з Firestore
  useEffect(() => {
    getInitiatives().then((data) => {
      setAllInitiatives(data);
      setLoading(false);
    });
  }, []);

  // Збагачуємо дані з Firestore а не з локального файлу
  const enriched = myProjects
    .map((p) => {
      const ini = allInitiatives.find((i) => i.id === p.id);
      return ini ? { ...ini, registeredAt: p.registeredAt, userName: p.userName } : null;
    })
    .filter(Boolean);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.hero}>
          <h1>Мої <span>ініціативи</span></h1>
        </div>
        <p style={{ textAlign: 'center', margin: '40px' }}>⏳ Завантаження...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <h1>Мої <span>ініціативи</span></h1>
        <p>Проєкти, до яких ви приєдналися</p>
      </div>

      {enriched.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <h3>Поки що порожньо</h3>
          <p>Ви ще не приєдналися до жодної ініціативи.</p>
          <Link to="/" className={styles.goBtn}>
            Переглянути ініціативи →
          </Link>
        </div>
      ) : (
        <>
          <p className={styles.count}>
            Ви берете участь у <strong>{enriched.length}</strong>{' '}
            {enriched.length === 1 ? 'ініціативі' : 'ініціативах'}
          </p>

          <section className={styles.grid}>
            {enriched.map((ini, idx) => (
              <article
                key={ini.id}
                className={styles.card}
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <div className={`${styles.badge} badge-${ini.type}`}>
                  {ini.typeLabel}
                </div>

                <div className={styles.content}>
                  <h3>{ini.title}</h3>

                  <div className={styles.meta}>
                    <p>📅 {ini.dateLabel}</p>
                    <p>📍 {ini.location}</p>
                  </div>

                  {ini.userName && (
                    <p className={styles.userName}>👤 Зареєстровано: {ini.userName}</p>
                  )}

                  <p className={styles.status}>✅ Ви учасник</p>
                  <p className={styles.description}>{ini.description}</p>

                  <button
                    className={styles.removeBtn}
                    onClick={() => {
                      if (window.confirm('Скасувати участь в ініціативі?')) {
                        leaveInitiative(ini.id);
                      }
                    }}
                  >
                    🗑️ Скасувати участь
                  </button>
                </div>
              </article>
            ))}
          </section>
        </>
      )}
    </main>
  );
}