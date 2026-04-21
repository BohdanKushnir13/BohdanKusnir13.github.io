// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ADMIN_EMAIL } from '../config/admin';
import {
  getPendingRequests,
  approveInitiative,
  rejectInitiative,
  getInitiatives,
  deleteInitiative,
} from '../services/firestoreService';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.css';

export default function AdminPage() {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('requests'); // 'requests' або 'initiatives'
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
      navigate('/');
      return;
    }
    Promise.all([getPendingRequests(), getInitiatives()]).then(([reqs, inis]) => {
      setRequests(reqs);
      setInitiatives(inis);
      setLoading(false);
    });
  }, [currentUser, navigate]);

  const handleApprove = async (request) => {
    await approveInitiative(request);
    const updated = await getInitiatives();
    setInitiatives(updated);
    setRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleReject = async (id) => {
    await rejectInitiative(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Видалити цю ініціативу?')) return;
    await deleteInitiative(id);
    setInitiatives((prev) => prev.filter((i) => i.id !== id));
  };

  if (!currentUser || currentUser.email !== ADMIN_EMAIL) return null;

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>🛡️ Адмін-панель</h1>

      {/* Вкладки */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setTab('requests')}
          className={styles.approveBtn}
          style={{ opacity: tab === 'requests' ? 1 : 0.5 }}
        >
          📋 Заявки {requests.length > 0 && `(${requests.length})`}
        </button>
        <button
          onClick={() => setTab('initiatives')}
          className={styles.approveBtn}
          style={{ opacity: tab === 'initiatives' ? 1 : 0.5 }}
        >
          📌 Ініціативи ({initiatives.length})
        </button>
      </div>

      {loading && <p>Завантаження...</p>}

      {/* ── ВКЛАДКА: Заявки ── */}
      {!loading && tab === 'requests' && (
        <>
          {requests.length === 0 && <p className={styles.empty}>Нових заявок немає 🎉</p>}
          <div className={styles.list}>
            {requests.map((req) => (
              <div key={req.id} className={styles.card}>
                <h3 className={styles.cardTitle}>{req.title}</h3>
                <p><strong>Автор:</strong> {req.authorEmail}</p>
                <p><strong>Місто:</strong> {req.city}</p>
                <p><strong>Адреса:</strong> {req.location}</p>
                <p><strong>Дата:</strong> {req.date}</p>
                <p><strong>Тип:</strong> {req.type}</p>
                <p><strong>Опис:</strong> {req.description}</p>
                <div className={styles.actions}>
                  <button className={styles.approveBtn} onClick={() => handleApprove(req)}>
                    ✅ Схвалити
                  </button>
                  <button className={styles.rejectBtn} onClick={() => handleReject(req.id)}>
                    ❌ Відхилити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── ВКЛАДКА: Ініціативи ── */}
      {!loading && tab === 'initiatives' && (
        <>
          {initiatives.length === 0 && <p className={styles.empty}>Немає ініціатив</p>}
          <div className={styles.list}>
            {initiatives.map((ini) => (
              <div key={ini.id} className={styles.card}>
                <h3 className={styles.cardTitle}>{ini.title}</h3>
                <p><strong>Місто:</strong> {ini.city}</p>
                <p><strong>Дата:</strong> {ini.date}</p>
                <p><strong>Тип:</strong> {ini.type}</p>
                <p><strong>Опис:</strong> {ini.description}</p>
                <div className={styles.actions}>
                  <button className={styles.rejectBtn} onClick={() => handleDelete(ini.id)}>
                    🗑️ Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}