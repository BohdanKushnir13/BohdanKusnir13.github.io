import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitInitiativeRequest } from '../services/firestoreService';
import styles from './RegistrationModal.module.css';

const INITIAL_FORM = {
  title: '',
  description: '',
  city: '',
  location: '',
  date: '',
  type: 'social',
  volunteers: '',
};

const TYPES = [
  { value: 'ecology',   label: '🌿 Екологія' },
  { value: 'animals',   label: '🐾 Тварини' },
  { value: 'social',    label: '🤝 Соціальна' },
  { value: 'military',  label: '🛡️ Військовим' },
  { value: 'education', label: '📚 Освіта' },
];

export default function SubmitInitiativeModal({ onClose }) {
  const { currentUser } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = 'Вкажіть назву';
    if (!form.description.trim()) e.description = 'Вкажіть опис';
    if (!form.city.trim())        e.city        = 'Вкажіть місто';
    if (!form.location.trim())    e.location    = 'Вкажіть адресу';
    if (!form.date)               e.date        = 'Вкажіть дату';
    if (!form.volunteers || Number(form.volunteers) <= 0)
      e.volunteers = 'Вкажіть кількість волонтерів';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    await submitInitiativeRequest({
      ...form,
      volunteers: Number(form.volunteers),
      authorEmail: currentUser.email,
      authorId: currentUser.uid,
    });
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={styles.modal} role="dialog" aria-modal="true">
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          <h2 className={styles.heading}>✅ Заявку надіслано!</h2>
          <p style={{ marginTop: '12px', color: '#555' }}>
            Дякуємо! Ваша ініціатива на розгляді у адміністратора.
          </p>
          <button className="btn-primary" onClick={onClose} style={{ marginTop: '20px' }}>
            Закрити
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <h2 className={styles.heading}>📋 Запропонувати ініціативу</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label>Назва ініціативи *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="Наприклад: Прибирання парку"
              className={errors.title ? styles.inputError : ''} />
            {errors.title && <span className={styles.errorMsg}>{errors.title}</span>}
          </div>

          <div className="form-field">
            <label>Опис *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Що планується робити?"
              className={errors.description ? styles.inputError : ''} />
            {errors.description && <span className={styles.errorMsg}>{errors.description}</span>}
          </div>

          <div className="form-field">
            <label>Місто *</label>
            <input name="city" value={form.city} onChange={handleChange}
              placeholder="Львів"
              className={errors.city ? styles.inputError : ''} />
            {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
          </div>

          <div className="form-field">
            <label>Адреса *</label>
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="вул. Шевченка, 1"
              className={errors.location ? styles.inputError : ''} />
            {errors.location && <span className={styles.errorMsg}>{errors.location}</span>}
          </div>

          <div className="form-field">
            <label>Дата *</label>
            <input name="date" type="date" value={form.date} onChange={handleChange}
              className={errors.date ? styles.inputError : ''} />
            {errors.date && <span className={styles.errorMsg}>{errors.date}</span>}
          </div>

          {/* НОВЕ ПОЛЕ: кількість волонтерів */}
          <div className="form-field">
            <label>Кількість волонтерів *</label>
            <input
              name="volunteers"
              type="number"
              min="1"
              max="1000"
              value={form.volunteers}
              onChange={handleChange}
              placeholder="Наприклад: 15"
              className={errors.volunteers ? styles.inputError : ''}
            />
            {errors.volunteers && <span className={styles.errorMsg}>{errors.volunteers}</span>}
          </div>

          <div className="form-field">
            <label>Тип ініціативи</label>
            <select name="type" value={form.type} onChange={handleChange}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-primary" disabled={submitting} style={{ marginTop: '8px' }}>
            {submitting ? '⏳ Надсилання...' : '📤 Надіслати заявку'}
          </button>
        </form>
      </div>
    </div>
  );
}