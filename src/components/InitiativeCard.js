import React from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import StarRating from './StarRating';
import styles from './InitiativeCard.module.css';

export default function InitiativeCard({ initiative, onJoin }) {
  const { isJoined, getRemaining } = useVolunteer();

  const joined = isJoined(initiative.id);
  const remaining = getRemaining(initiative);

  return (
    <article className={styles.card}>
      <div className={`${styles.badge} ${styles[initiative.badgeClass]}`}>
        {initiative.typeLabel}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{initiative.title}</h3>

        <div className={styles.meta}>
          <p>📅 {initiative.dateLabel}</p>
          <p>📍 {initiative.location}</p>
          <p>👥 Потрібно: <strong>{remaining}</strong> волонтерів</p>
        </div>

        {/* Зірочки — рейтинг */}
        <StarRating initiative={initiative} />

        <p className={styles.description}>{initiative.description}</p>

        <button
          className={`btn-primary ${joined ? styles.joinedBtn : ''}`}
          onClick={() => !joined && onJoin(initiative)}
          disabled={joined}
        >
          {joined ? '✅ Ви вже учасник' : 'Приєднатися'}
        </button>
      </div>
    </article>
  );
}