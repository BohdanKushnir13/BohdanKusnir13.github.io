// src/components/StarRating.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './StarRating.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function StarRating({ initiative }) {
  const { currentUser } = useAuth();

  const [userRating, setUserRating]   = useState(0);
  const [average, setAverage]         = useState(initiative.averageRating || 0);
  const [count, setCount]             = useState(initiative.ratingsCount || 0);
  const [hovered, setHovered]         = useState(0);
  const [submitting, setSubmitting]   = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/ratings/${initiative.id}`)
      .then(r => r.json())
      .then(data => {
        setAverage(data.average || 0);
        setCount(data.count || 0);
        if (currentUser && data.ratings) {
          const myRating = data.ratings.find(r => r.userId === currentUser.uid);
          if (myRating) setUserRating(myRating.rating);
        }
      })
      .catch(() => {});
  }, [initiative.id, currentUser]);

  const handleRate = async (star) => {
    if (!currentUser) {
      alert('Щоб оцінити ініціативу, потрібно увійти в акаунт');
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    try {
      const token = await currentUser.getIdToken();
      const res = await fetch(`${API_URL}/ratings/${initiative.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: star }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserRating(star);
        setAverage(data.average);
        setCount(data.count);
      }
    } catch (err) {
      console.error('Rating error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="star-wrapper">
      <div className="star-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star-btn ${star <= (hovered || userRating) ? 'star-active' : ''}`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
            disabled={submitting}
            aria-label={`Оцінити ${star} з 5`}
          >
            ★
          </button>
        ))}
      </div>

      <div className="star-info">
        {count > 0 ? (
          <span>
            <strong>{average}</strong> / 5
            <span className="star-count"> ({count} оцінок)</span>
          </span>
        ) : (
          <span className="star-no-rating">Ще немає оцінок</span>
        )}
      </div>

      {userRating > 0 && (
        <div className="star-your-rating">
          Ваша оцінка: {userRating} ★
        </div>
      )}
    </div>
  );
}