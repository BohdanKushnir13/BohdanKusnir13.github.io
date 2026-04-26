const express = require('express');
const router  = express.Router();
const { db }  = require('../firebaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/registrations — захищений
router.post('/', verifyToken, async (req, res) => {
  try {
    const { initiativeId, userName, userPhone, userEmail, comment } = req.body;

    if (!initiativeId) {
      return res.status(400).json({ error: 'initiativeId обов\'язковий' });
    }

    const existing = await db.collection('registrations')
      .where('userId', '==', req.user.uid)
      .where('initiativeId', '==', initiativeId)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: 'Ви вже зареєстровані' });
    }

    const registration = {
      userId: req.user.uid,
      initiativeId,
      userName:  userName  || '',
      userPhone: userPhone || '',
      userEmail: userEmail || req.user.email || '',
      comment:   comment   || '',
      registeredAt: new Date().toISOString(),
    };

    const docRef = await db.collection('registrations').add(registration);
    res.status(201).json({
      message: '✅ Реєстрацію збережено',
      registration: { id: docRef.id, ...registration },
    });
  } catch (err) {
    res.status(500).json({ error: 'Помилка реєстрації' });
  }
});

// GET /api/registrations/my — захищений
router.get('/my', verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection('registrations')
      .where('userId', '==', req.user.uid)
      .get();

    const registrations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ registrations });
  } catch (err) {
    res.status(500).json({ error: 'Помилка отримання реєстрацій' });
  }
});

// DELETE /api/registrations/:id — захищений
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await db.collection('registrations').doc(req.params.id).get();

    if (!doc.exists) return res.status(404).json({ error: 'Не знайдено' });
    if (doc.data().userId !== req.user.uid) return res.status(403).json({ error: 'Немає доступу' });

    await db.collection('registrations').doc(req.params.id).delete();
    res.json({ message: 'Реєстрацію скасовано' });
  } catch (err) {
    res.status(500).json({ error: 'Помилка скасування' });
  }
});

module.exports = router;