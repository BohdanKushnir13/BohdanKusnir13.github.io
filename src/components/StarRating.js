// src/components/StarRating.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rateInitiative, getUserRating } from '../services/firestoreService';

export default function StarRating({ initiativeId }) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getUserRating(currentUser.uid, initiativeId).then((r) => {
      if (r) { setRating(r); setSubmitted(true); }
    });
  }, [currentUser, initiativeId]);

  if (!currentUser) {
    return <p style={{ fontSize: '0.85rem', color: '#888' }}>🔒 Увійдіть щоб оцінити</p>;
  }

  const handleClick = async (star) => {
    if (submitted) return;
    setRating(star);
    setSubmitted(true);
    await rateInitiative(currentUser.uid, initiativeId, star);
  };

  return (
    <div style={{ marginTop: '8px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !submitted && setHover(star)}
          onMouseLeave={() => !submitted && setHover(0)}
          style={{
            fontSize: '1.4rem',
            cursor: submitted ? 'default' : 'pointer',
            color: star <= (hover || rating) ? '#f5a623' : '#ccc',
            transition: 'color 0.15s',
          }}
        >
          ★
        </span>
      ))}
      {submitted && <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: '6px' }}>Дякуємо!</span>}
    </div>
  );
}