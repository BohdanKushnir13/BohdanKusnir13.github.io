const express = require('express');
const router  = express.Router();
const { db }  = require('../firebaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/initiatives — публічний
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('initiatives').get();
    const initiatives = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ initiatives });
  } catch (err) {
    res.status(500).json({ error: 'Помилка отримання ініціатив' });
  }
});

// POST /api/initiatives — захищений
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, city, location, date, type, volunteers } = req.body;

    if (!title || !description || !city || !date || !type) {
      return res.status(400).json({ error: 'Заповніть усі обов\'язкові поля' });
    }

    const newInitiative = {
      title, description, city,
      location: location || city,
      date, dateLabel: date,
      type, typeLabel: type,
      badgeClass: `badge-${type}`,
      volunteers: volunteers || 10,
      averageRating: 0,
      ratingsCount: 0,
      createdBy: req.user.uid,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('initiatives').add(newInitiative);
    res.status(201).json({
      message: '✅ Ініціативу додано',
      initiative: { id: docRef.id, ...newInitiative },
    });
  } catch (err) {
    res.status(500).json({ error: 'Помилка додавання' });
  }
});

// DELETE /api/initiatives/:id — захищений
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.collection('initiatives').doc(req.params.id).delete();
    res.json({ message: '🗑️ Ініціативу видалено' });
  } catch (err) {
    res.status(500).json({ error: 'Помилка видалення' });
  }
});

module.exports = router;