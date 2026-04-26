const express = require('express');
const router  = express.Router();
const { db }  = require('../firebaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:initiativeId', async (req, res) => {
  try {
    const { initiativeId } = req.params;
    const snapshot = await db.collection('ratings')
      .where('initiativeId', '==', initiativeId)
      .get();
    const ratings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    const average = ratings.length > 0
      ? parseFloat(
          (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length)
          .toFixed(2)
        )
      : 0;
    res.json({ initiativeId, ratings, average, count: ratings.length });
  } catch (err) {
    console.error('Get ratings error:', err);
    res.status(500).json({ error: 'Помилка отримання оцінок' });
  }
});

router.post('/:initiativeId', verifyToken, async (req, res) => {
  try {
    const { initiativeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.uid;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Оцінка має бути від 1 до 5' });
    }

    const ratingId = `${userId}_${initiativeId}`;
    await db.collection('ratings').doc(ratingId).set({
      userId,
      initiativeId,
      rating: Number(rating),
      createdAt: new Date().toISOString(),
    });

    const snapshot = await db.collection('ratings')
      .where('initiativeId', '==', initiativeId)
      .get();
    const ratings = snapshot.docs.map(doc => doc.data());
    const average = parseFloat(
      (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length)
      .toFixed(2)
    );

    await db.collection('initiatives').doc(initiativeId).update({
      averageRating: average,
      ratingsCount: ratings.length,
    });

    res.json({ message: '✅ Оцінку збережено', average, count: ratings.length });
  } catch (err) {
    console.error('Post rating error:', err);
    res.status(500).json({ error: 'Помилка збереження оцінки' });
  }
});

module.exports = router;