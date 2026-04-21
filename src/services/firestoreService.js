// src/services/firestoreService.js
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
   deleteDoc,
} from 'firebase/firestore';

// ── ЗАПИС: зберегти профіль користувача ──
export async function saveUserProfile(userId, data) {
  await setDoc(doc(db, 'users', userId), {
    email: data.email,
    createdAt: new Date().toISOString(),
    ...data,
  });
  console.log('✅ Профіль збережено');
}

// ── ЧИТАННЯ: отримати всіх користувачів ──
export async function getUsers() {
  const snapshot = await getDocs(collection(db, 'users'));
  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  console.log('📋 Користувачі:', users);
  return users;
}

// ── ЗАПИС: зберегти реєстрацію на ініціативу ──
export async function saveRegistration(userId, initiativeId, data) {
  await addDoc(collection(db, 'registrations'), {
    userId,
    initiativeId,
    ...data,
    registeredAt: new Date().toISOString(),
  });
  console.log('✅ Реєстрацію збережено');
}

// ── ЧИТАННЯ: отримати реєстрації користувача ──
export async function getUserRegistrations(userId) {
  const snapshot = await getDocs(collection(db, 'registrations'));
  const all = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const userRegs = all.filter((r) => r.userId === userId);
  console.log('📋 Реєстрації користувача:', userRegs);
  return userRegs;
}

// ── ЧИТАННЯ: отримати всі ініціативи з Firestore ──
export async function getInitiatives() {
  const snapshot = await getDocs(collection(db, 'initiatives'));
  return snapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
}

// ── ЗАПИС: зберегти оцінку користувача ──
export async function rateInitiative(userId, initiativeId, rating) {
  // Зберігаємо оцінку користувача (ключ унікальний — один юзер = одна оцінка)
  await setDoc(doc(db, 'ratings', `${userId}_${initiativeId}`), {
    userId,
    initiativeId,
    rating,
    createdAt: new Date().toISOString(),
  });

  // Збільшуємо лічильник оцінок ініціативи
  await updateDoc(doc(db, 'initiatives', String(initiativeId)), {
    ratingsCount: increment(1),
  });

  console.log('✅ Оцінку збережено');
}

// ── ЧИТАННЯ: отримати оцінку конкретного користувача для ініціативи ──
export async function getUserRating(userId, initiativeId) {
  const ref = doc(db, 'ratings', `${userId}_${initiativeId}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().rating : null;
}

export async function submitInitiativeRequest(data) {
  await addDoc(collection(db, 'requests'), {
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
  console.log('✅ Заявку надіслано');
}
 
// ── ЧИТАННЯ: отримати всі заявки зі статусом pending ──
export async function getPendingRequests() {
  const snapshot = await getDocs(collection(db, 'requests'));
  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((r) => r.status === 'pending');
}
 
// ── ЗАПИС: схвалити заявку → додати як ініціативу ──
export async function approveInitiative(request) {
  // Додаємо в колекцію initiatives
  await addDoc(collection(db, 'initiatives'), {
    title: request.title,
    description: request.description,
    city: request.city,
    location: request.location,
    date: request.date,
    type: request.type,
    typeLabel: request.type,
    volunteers: 0,
    averageRating: 0,
    ratingsCount: 0,
    dateLabel: request.date,
    badgeClass: `badge-${request.type}`,
  });
 
  // Оновлюємо статус заявки
  await updateDoc(doc(db, 'requests', request.id), { status: 'approved' });
  console.log('✅ Ініціативу схвалено');
}
 
// ── ЗАПИС: відхилити заявку ──
export async function rejectInitiative(requestId) {
  await updateDoc(doc(db, 'requests', requestId), { status: 'rejected' });
  console.log('❌ Заявку відхилено');
}

// ── ВИДАЛЕННЯ: видалити ініціативу ──
export async function deleteInitiative(initiativeId) {
  await deleteDoc(doc(db, 'initiatives', String(initiativeId)));
  console.log('🗑️ Ініціативу видалено');
}