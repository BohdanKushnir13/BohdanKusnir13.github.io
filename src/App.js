// src/App.js
// Головний компонент — визначення маршрутів через react-router-dom
// Завдання 4: Routes + Route для кожної сторінки

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { VolunteerProvider } from './context/VolunteerContext';
import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import Toast     from './components/Toast';

// Сторінки (маршрути)
import InitiativesPage   from './pages/InitiativesPage';
import MyInitiativesPage from './pages/MyInitiativesPage';
import AboutPage         from './pages/AboutPage';

import { useVolunteer } from './context/VolunteerContext';

// Окремий компонент, щоб мати доступ до Context (toast)
function AppContent() {
  const { toast } = useVolunteer();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Маршрутизація (Завдання 4) ── */}
      <Routes>
        {/* Маршрут 1: Головна — Доступні ініціативи */}
        <Route path="/" element={<InitiativesPage />} />

        {/* Маршрут 2: Мої ініціативи */}
        <Route path="/my-initiatives" element={<MyInitiativesPage />} />

        {/* Маршрут 3: Про нас */}
        <Route path="/about" element={<AboutPage />} />

        {/* Будь-який невідомий шлях → на головну */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      {/* Глобальний Toast */}
      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <VolunteerProvider>
      <AppContent />
    </VolunteerProvider>
  );
}
