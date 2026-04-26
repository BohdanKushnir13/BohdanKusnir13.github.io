// server/middleware/authMiddleware.js
const { admin } = require('../firebaseAdmin');

async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Токен відсутній' });
  }

  try {
    // Верифікуємо Firebase ID токен через Admin SDK
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Токен невалідний' });
  }
}

module.exports = { verifyToken };