// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { VolunteerProvider } from './context/VolunteerContext';
import { AuthProvider } from './context/AuthContext';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast  from './components/Toast';

import InitiativesPage   from './pages/InitiativesPage';
import MyInitiativesPage from './pages/MyInitiativesPage';
import AboutPage         from './pages/AboutPage';

import { useVolunteer } from './context/VolunteerContext';

function AppContent() {
  const { toast } = useVolunteer();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/"                element={<InitiativesPage />} />
        <Route path="/my-initiatives"  element={<MyInitiativesPage />} />
        <Route path="/about"           element={<AboutPage />} />
        <Route path="*"                element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
      <Toast message={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <VolunteerProvider>
        <AppContent />
      </VolunteerProvider>
    </AuthProvider>
  );
}