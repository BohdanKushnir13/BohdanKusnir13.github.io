// src/pages/InitiativesPage.js
// Сторінка "Доступні ініціативи"
// Завдання 3: фільтри і стан форми через useState
// Завдання 4: маршрут "/"

import React, { useState, useMemo } from 'react';
import InitiativeCard from '../components/InitiativeCard';
import RegistrationModal from '../components/RegistrationModal';
import { INITIATIVES, ACTIVITY_TYPES, CITIES } from '../data/initiatives';
import styles from './InitiativesPage.module.css';

export default function InitiativesPage() {
  // ── useState: фільтри ──
  const [filterType, setFilterType] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [sortOrder, setSortOrder]   = useState('asc');

  // ── useState: вибрана ініціатива для модалки ──
  const [selectedInitiative, setSelectedInitiative] = useState(null);

  // ── useState: форма "запропонувати ініціативу" ──
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalForm, setProposalForm] = useState({ name: '', desc: '' });
  const [proposedList, setProposedList] = useState([]);
  const [proposalSending, setProposalSending] = useState(false);

  // Фільтрація + сортування через useMemo (оптимізація)
  const filteredInitiatives = useMemo(() => {
    return INITIATIVES
      .filter((i) => (filterType === 'all' || i.type === filterType))
      .filter((i) => (filterCity === 'all' || i.city === filterCity))
      .sort((a, b) => {
        const diff = new Date(a.date) - new Date(b.date);
        return sortOrder === 'asc' ? diff : -diff;
      });
  }, [filterType, filterCity, sortOrder]);

  // Активні теги фільтрів
  const activeTags = useMemo(() => {
    const tags = [];
    if (filterType !== 'all') {
      const label = ACTIVITY_TYPES.find((t) => t.value === filterType)?.label;
      tags.push({ label, onRemove: () => setFilterType('all') });
    }
    if (filterCity !== 'all') {
      tags.push({ label: `📍 ${filterCity}`, onRemove: () => setFilterCity('all') });
    }
    return tags;
  }, [filterType, filterCity]);

  const resetFilters = () => {
    setFilterType('all');
    setFilterCity('all');
    setSortOrder('asc');
  };

  // Надсилання запиту на нову ініціативу
  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!proposalForm.name.trim() || !proposalForm.desc.trim()) {
      alert('Будь ласка, заповніть усі поля!');
      return;
    }
    setProposalSending(true);
    try {
      const res = await fetch('https://formspree.io/f/mvzbjepv', {
        method: 'POST',
        body: JSON.stringify({ 'Назва ініціативи': proposalForm.name, 'Опис': proposalForm.desc }),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      });
      if (res.ok) {
        setProposedList((prev) => [...prev, { ...proposalForm, id: Date.now() }]);
        setProposalForm({ name: '', desc: '' });
        alert('✅ Ваш запит надіслано!');
      }
    } catch {
      alert('❌ Помилка. Спробуйте пізніше.');
    } finally {
      setProposalSending(false);
    }
  };

  return (
    <main className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <h1>Доступні волонтерські<br /><span>проєкти</span></h1>
        <p>Знайдіть ініціативу, яка відповідає вашим цінностям</p>
      </div>

      {/* ── ФІЛЬТРИ ── */}
      <section className={styles.filtersSection}>
        <div className={styles.filtersBar}>
          {/* Фільтр: тип активності */}
          <div className={styles.filterGroup}>
            <label>🏷️ Тип активності</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              {ACTIVITY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Фільтр: місто */}
          <div className={styles.filterGroup}>
            <label>📍 Місто</label>
            <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c === 'all' ? 'Всі міста' : c}</option>
              ))}
            </select>
          </div>

          {/* Сортування */}
          <div className={styles.filterGroup}>
            <label>📅 Сортування за датою</label>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Спочатку найближчі</option>
              <option value="desc">Спочатку пізніші</option>
            </select>
          </div>

          <button className={styles.resetBtn} onClick={resetFilters}>↩ Скинути</button>
        </div>

        {/* Активні теги фільтрів */}
        {activeTags.length > 0 && (
          <div className={styles.tags}>
            {activeTags.map((tag, i) => (
              <span key={i} className={styles.tag}>
                {tag.label}
                <button onClick={tag.onRemove}>✕</button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── СПИСОК КАРТОК ── */}
      {filteredInitiatives.length > 0 ? (
        <section className={styles.grid}>
          {filteredInitiatives.map((ini, idx) => (
            <div key={ini.id} style={{ animationDelay: `${idx * 0.06}s` }}>
              <InitiativeCard
                initiative={ini}
                onJoin={(initiative) => setSelectedInitiative(initiative)}
              />
            </div>
          ))}
        </section>
      ) : (
        <div className={styles.noResults}>
          <p>😔 За вашими фільтрами нічого не знайдено.</p>
          <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={resetFilters}>
            Скинути фільтри
          </button>
        </div>
      )}

      {/* ── ФОРМА ПРОПОЗИЦІЇ ── */}
      <div style={{ textAlign: 'center', margin: '30px auto' }}>
        <button
          className="btn-secondary"
          onClick={() => setShowProposalForm((v) => !v)}
        >
          {showProposalForm ? '✖ Приховати форму' : '📋 Запропонувати нову ініціативу'}
        </button>
      </div>

      {showProposalForm && (
        <section className={styles.proposalSection}>
          <div className={styles.formCard}>
            <h3>Залишити запит на нову ініціативу</h3>
            <form onSubmit={handleProposalSubmit}>
              <div className="form-field">
                <label>Назва ініціативи *</label>
                <input
                  type="text"
                  placeholder="Наприклад: Посадка дерев у парку"
                  value={proposalForm.name}
                  onChange={(e) => setProposalForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div className="form-field">
                <label>Опис *</label>
                <textarea
                  placeholder="Розкажіть детальніше..."
                  rows={4}
                  value={proposalForm.desc}
                  onChange={(e) => setProposalForm((f) => ({ ...f, desc: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={proposalSending}>
                {proposalSending ? '⏳ Надсилання...' : '✉️ Надіслати запит'}
              </button>
            </form>

            {/* Список запропонованих ініціатив */}
            {proposedList.map((p) => (
              <div key={p.id} className={styles.proposedCard}>
                <span className={`${styles.proposedBadge}`}>✨ Пропонується</span>
                <h4>{p.name}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── МОДАЛКА РЕЄСТРАЦІЇ ── */}
      {selectedInitiative && (
        <RegistrationModal
          initiative={selectedInitiative}
          onClose={() => setSelectedInitiative(null)}
        />
      )}
    </main>
  );
}
