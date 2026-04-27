// app.js
// Express app configuration — middleware, routes, error handlers
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request logger (dev only) ─────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'OK', message: 'Skill Exchange API is running 🚀' });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/users',    require('./routes/users.routes'));
app.use('/api/skills',   require('./routes/skills.routes'));
app.use('/api/requests', require('./routes/requests.routes'));

// ── Error Handling Middleware ─────────────────────────────────────────────────
const { notFound, errorHandler } = require('./middleware/error.middleware');
app.use(notFound);
app.use(errorHandler);

module.exports = app;
