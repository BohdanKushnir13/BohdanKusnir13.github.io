require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const authRoutes          = require('./routes/auth');
const initiativesRoutes   = require('./routes/initiatives');
const registrationsRoutes = require('./routes/registrations');
const ratingsRoutes       = require('./routes/ratings');
const { verifyToken }     = require('./middleware/authMiddleware');

const app  = express();
const PORT = process.env.PORT || 5000;

// CORS — має бути ПЕРШИМ
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://cerulean-brioche-08d9fe.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());

// Логування
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Публічні маршрути
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: '✅ Сервер працює' });
});
app.use('/api/auth',          authRoutes);
app.use('/api/initiatives',   initiativesRoutes);
app.use('/api/ratings',       ratingsRoutes);

// Захищені маршрути
app.use('/api/registrations', registrationsRoutes);

app.get('/api/protected/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `👋 Привіт, ${req.user.email}!`,
    user: req.user,
  });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ error: '404 — маршрут не знайдено' });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер на http://localhost:${PORT}`);
});