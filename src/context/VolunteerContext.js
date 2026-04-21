// src/context/VolunteerContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIATIVES } from '../data/initiatives';

const VolunteerContext = createContext(null);

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
  const [myProjects, setMyProjects] = useState(() =>
    loadFromStorage('myProjects', [])
  );
  const [volCounts, setVolCounts] = useState(() =>
    loadFromStorage('volCounts', {})
  );
  const [toast, setToast] = useState(null);

  const isJoined = useCallback(
    (id) => myProjects.some((p) => String(p.id) === String(id)),
    [myProjects]
  );

  // ── Виправлено: підтримка як локальних так і Firestore ініціатив ──
  const getRemaining = useCallback(
    (initiative) => {
      if (volCounts[initiative.id] !== undefined) {
        return volCounts[initiative.id];
      }
      const ini = INITIATIVES.find((i) => String(i.id) === String(initiative.id));
      return ini ? ini.volunteers : (initiative.volunteers ?? 0);
    },
    [volCounts]
  );

  const joinInitiative = useCallback(
    (id, userData) => {
      if (isJoined(id)) return;

      const ini = INITIATIVES.find((i) => String(i.id) === String(id));
      const volunteers = ini ? ini.volunteers : (userData.volunteers ?? 0);
      const title = ini ? ini.title : (userData.title ?? '');

      const current = volCounts[id] !== undefined ? volCounts[id] : volunteers;
      const newCounts = { ...volCounts, [id]: Math.max(0, current - 1) };
      setVolCounts(newCounts);
      saveToStorage('volCounts', newCounts);

      const newProjects = [...myProjects, { id, registeredAt: new Date().toISOString(), ...userData }];
      setMyProjects(newProjects);
      saveToStorage('myProjects', newProjects);

      showToast(`✅ Ви зареєстровані на «${title}»!`);
    },
    [isJoined, myProjects, volCounts]
  );

  const leaveInitiative = useCallback(
    (id) => {
      const ini = INITIATIVES.find((i) => String(i.id) === String(id));

      const updated = myProjects.filter((p) => String(p.id) !== String(id));
      setMyProjects(updated);
      saveToStorage('myProjects', updated);

      const maxVol = ini ? ini.volunteers : 0;
      const current = volCounts[id] !== undefined ? volCounts[id] : maxVol;
      const newCounts = { ...volCounts, [id]: Math.min(current + 1, maxVol) };
      setVolCounts(newCounts);
      saveToStorage('volCounts', newCounts);

      showToast('Участь скасовано');
    },
    [myProjects, volCounts]
  );

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

export function useVolunteer() {
  const ctx = useContext(VolunteerContext);
  if (!ctx) throw new Error('useVolunteer must be used inside VolunteerProvider');
  return ctx;
}