// src/context/VolunteerContext.js
// Глобальний стан через React Context + useState
// Завдання 3: Керування станом у компонентах

import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIATIVES } from '../data/initiatives';

const VolunteerContext = createContext(null);

// Читаємо початковий стан з localStorage
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function VolunteerProvider({ children }) {
  // ── useState: список проєктів, до яких приєднався юзер ──
  const [myProjects, setMyProjects] = useState(() =>
    loadFromStorage('myProjects', [])
  );

  // ── useState: залишок волонтерів для кожного проєкту ──
  const [volCounts, setVolCounts] = useState(() =>
    loadFromStorage('volCounts', {})
  );

  // ── useState: toast-повідомлення ──
  const [toast, setToast] = useState(null);

  // Перевірка: чи юзер вже приєднався
  const isJoined = useCallback(
    (id) => myProjects.some((p) => p.id === id),
    [myProjects]
  );

  // Кількість волонтерів, що залишилась
  const getRemaining = useCallback(
    (initiative) => {
      const ini = INITIATIVES.find((i) => i.id === initiative.id);
      return volCounts[initiative.id] !== undefined
        ? volCounts[initiative.id]
        : ini.volunteers;
    },
    [volCounts]
  );

  // Приєднатися до ініціативи
  const joinInitiative = useCallback(
    (id, userData) => {
      const ini = INITIATIVES.find((i) => i.id === id);
      if (!ini || isJoined(id)) return;

      // Оновлюємо кількість волонтерів
      const current = volCounts[id] !== undefined ? volCounts[id] : ini.volunteers;
      const newCounts = { ...volCounts, [id]: Math.max(0, current - 1) };
      setVolCounts(newCounts);
      saveToStorage('volCounts', newCounts);

      // Додаємо до списку моїх проєктів
      const newProjects = [...myProjects, { id, registeredAt: new Date().toISOString(), ...userData }];
      setMyProjects(newProjects);
      saveToStorage('myProjects', newProjects);

      showToast(`✅ Ви зареєстровані на «${ini.title}»!`);
    },
    [isJoined, myProjects, volCounts]
  );

  // Скасувати участь
  const leaveInitiative = useCallback(
    (id) => {
      const ini = INITIATIVES.find((i) => i.id === id);
      if (!ini) return;

      const updated = myProjects.filter((p) => p.id !== id);
      setMyProjects(updated);
      saveToStorage('myProjects', updated);

      // Повертаємо волонтера назад
      const current = volCounts[id] !== undefined ? volCounts[id] : ini.volunteers;
      const newCounts = { ...volCounts, [id]: Math.min(current + 1, ini.volunteers) };
      setVolCounts(newCounts);
      saveToStorage('volCounts', newCounts);

      showToast('Участь скасовано');
    },
    [myProjects, volCounts]
  );

  // Toast
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <VolunteerContext.Provider
      value={{ myProjects, isJoined, getRemaining, joinInitiative, leaveInitiative, toast }}
    >
      {children}
    </VolunteerContext.Provider>
  );
}

// Хук для зручного використання контексту
export function useVolunteer() {
  const ctx = useContext(VolunteerContext);
  if (!ctx) throw new Error('useVolunteer must be used inside VolunteerProvider');
  return ctx;
}
