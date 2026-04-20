// src/components/RegistrationModal.js
// Компонент: форма реєстрації на ініціативу
// Завдання 3: керування станом форми через useState

import React, { useState, useEffect } from 'react';
import { useVolunteer } from '../context/VolunteerContext';
import styles from './RegistrationModal.module.css';

// Початковий стан форми
const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  comment: '',
};

export default function RegistrationModal({ initiative, onClose }) {
  // ── useState: стан полів форми ──
  const [form, setForm] = useState(INITIAL_FORM);
  // ── useState: помилки валідації ──
  const [errors, setErrors] = useState({});
  // ── useState: стан надсилання ──
  const [submitting, setSubmitting] = useState(false);

  const { joinInitiative } = useVolunteer();

  // Скидаємо форму при відкритті нової ініціативи
  useEffect(() => {
    setForm(INITIAL_FORM);
    setErrors({});
  }, [initiative?.id]);

  // Закриття по Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Блокуємо скрол body коли модалка відкрита
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!initiative) return null;

  // Оновлення поля форми
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Знімаємо помилку при введенні
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Валідація
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Вкажіть ваше ім'я";
    if (!form.phone.trim()) newErrors.phone = 'Вкажіть номер телефону';
    else if (!/^\+?[\d\s\-()]{10,}$/.test(form.phone))
      newErrors.phone = 'Некоректний формат телефону';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = 'Некоректний email';
    return newErrors;
  };

  // Надсилання форми
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    // Імітуємо асинхронну реєстрацію
    await new Promise((r) => setTimeout(r, 400));
    joinInitiative(initiative.id, {
      userName: form.name,
      userPhone: form.phone,
      userEmail: form.email,
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрити">✕</button>

        <h2 className={styles.heading}>Реєстрація на ініціативу</h2>
        <p className={styles.initiativeName}>📌 {initiative.title}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="reg-name">Ваше ім'я та прізвище *</label>
            <input
              id="reg-name"
              name="name"
              type="text"
              placeholder="Іван Іваненко"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? styles.inputError : ''}
            />
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="reg-phone">Номер телефону *</label>
            <input
              id="reg-phone"
              name="phone"
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? styles.inputError : ''}
            />
            {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="reg-email">Email (необов'язково)</label>
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : ''}
            />
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="reg-comment">Коментар</label>
            <textarea
              id="reg-comment"
              name="comment"
              placeholder="Ваш досвід або побажання..."
              rows={3}
              value={form.comment}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ marginTop: '8px' }}
          >
            {submitting ? '⏳ Реєстрація...' : '✅ Підтвердити реєстрацію'}
          </button>
        </form>
      </div>
    </div>
  );
}
