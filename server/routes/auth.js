const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { db }  = require('../firebaseAdmin');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль обов\'язкові' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль мінімум 6 символів' });
    }

    const existing = await db.collection('users').where('email', '==', email).get();
    if (!existing.empty) {
      return res.status(409).json({ error: 'Користувач з таким email вже існує' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      name: name || '',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    const docRef = await db.collection('users').add(newUser);

    const token = jwt.sign(
      { uid: docRef.id, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '✅ Реєстрація успішна',
      token,
      user: { id: docRef.id, email, name: name || '' },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email та пароль обов\'язкові' });
    }

    const snapshot = await db.collection('users').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(401).json({ error: 'Невірний email або пароль' });
    }

    const userDoc  = snapshot.docs[0];
    const userData = userDoc.data();

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Невірний email або пароль' });
    }

    const token = jwt.sign(
      { uid: userDoc.id, email: userData.email, role: userData.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '✅ Вхід успішний',
      token,
      user: { id: userDoc.id, email: userData.email, name: userData.name || '', role: userData.role || 'user' },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

// GET /api/auth/profile — захищений маршрут
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    const data = userDoc.data();
    res.json({
      user: {
        id: userDoc.id,
        email: data.email,
        name: data.name || '',
        role: data.role || 'user',
        createdAt: data.createdAt,
      },
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

module.exports = router;