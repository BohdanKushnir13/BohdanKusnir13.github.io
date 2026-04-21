// src/components/AuthModal.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './RegistrationModal.module.css';

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      onClose();
    } catch (err) {
      setError(isLogin ? 'Невірний email або пароль' : 'Помилка реєстрації. Спробуйте інший email.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрити">✕</button>
        <h2 className={styles.heading}>{isLogin ? '🔐 Вхід' : '📝 Реєстрація'}</h2>

        {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="auth-password">Пароль</label>
            <input
              id="auth-password"
              type="password"
              placeholder="Мінімум 6 символів"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? '⏳ Зачекайте...' : isLogin ? '✅ Увійти' : '✅ Зареєструватись'}
          </button>
        </form>

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          {isLogin ? 'Немає акаунту?' : 'Вже є акаунт?'}{' '}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#4f8ef7', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Зареєструватись' : 'Увійти'}
          </button>
        </p>
      </div>
    </div>
  );
}