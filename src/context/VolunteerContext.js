import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { INITIATIVES } from '../data/initiatives';
import { useAuth } from './AuthContext';

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
  const { currentUser } = useAuth();

  // Ключ залежить від userId — кожен юзер має свої дані
  const projectsKey = currentUser ? `myProjects_${currentUser.uid}` : null;
  const countsKey   = currentUser ? `volCounts_${currentUser.uid}`  : null;

  const [myProjects, setMyProjects] = useState([]);
  const [volCounts,  setVolCounts]  = useState({});
  const [toast, setToast] = useState(null);

  // При зміні юзера — завантажуємо його дані
  useEffect(() => {
    if (currentUser) {
      setMyProjects(loadFromStorage(projectsKey, []));
      setVolCounts(loadFromStorage(countsKey, {}));
    } else {
      // Юзер вийшов — очищаємо стан
      setMyProjects([]);
      setVolCounts({});
    }
  }, [currentUser]);

  const isJoined = useCallback(
    (id) => myProjects.some((p) => String(p.id) === String(id)),
    [myProjects]
  );

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
      // Баг 1: перевіряємо чи є авторизація
      if (!currentUser) {
        showToast('⚠️ Щоб приєднатися, потрібно увійти в акаунт');
        return;
      }
      if (isJoined(id)) return;

      const ini = INITIATIVES.find((i) => String(i.id) === String(id));
      const volunteers = ini ? ini.volunteers : (userData.volunteers ?? 0);
      const title = ini ? ini.title : (userData.title ?? '');

      const current = volCounts[id] !== undefined ? volCounts[id] : volunteers;
      const newCounts = { ...volCounts, [id]: Math.max(0, current - 1) };
      setVolCounts(newCounts);
      saveToStorage(countsKey, newCounts);

      const newProjects = [...myProjects, { id, registeredAt: new Date().toISOString(), ...userData }];
      setMyProjects(newProjects);
      saveToStorage(projectsKey, newProjects);

      showToast(`✅ Ви зареєстровані на «${title}»!`);
    },
    [currentUser, isJoined, myProjects, volCounts, projectsKey, countsKey]
  );

  const leaveInitiative = useCallback(
    (id) => {
      if (!currentUser) return;

      const ini = INITIATIVES.find((i) => String(i.id) === String(id));

      const updated = myProjects.filter((p) => String(p.id) !== String(id));
      setMyProjects(updated);
      saveToStorage(projectsKey, updated);

      const maxVol = ini ? ini.volunteers : 0;
      const current = volCounts[id] !== undefined ? volCounts[id] : maxVol;
      const newCounts = { ...volCounts, [id]: Math.min(current + 1, maxVol) };
      setVolCounts(newCounts);
      saveToStorage(countsKey, newCounts);

      showToast('Участь скасовано');
    },
    [currentUser, myProjects, volCounts, projectsKey, countsKey]
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