// src/services/seedInitiatives.js
// Запускається один раз для заповнення бази даних
import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { INITIATIVES } from '../data/initiatives';

export async function seedInitiatives() {
  for (const initiative of INITIATIVES) {
    await setDoc(doc(db, 'initiatives', String(initiative.id)), {
      ...initiative,
      averageRating: 0,
      ratingsCount: 0,
    });
  }
  console.log('✅ Ініціативи додано до Firestore');
}