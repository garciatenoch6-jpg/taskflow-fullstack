require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./src/routes/auth.routes');
const taskRoutes = require('./src/routes/task.routes');
const { notFound, errorHandler } = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('Faltan MONGODB_URI o JWT_SECRET en backend/.env');
  process.exit(1);
}
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('/api/health', (_req, res) => res.json({
  status: 'ok', message: 'TaskFlow API funcionando',
  database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado correctamente.');
    app.listen(PORT, () => console.log(`TaskFlow disponible en http://localhost:${PORT}`));
  } catch (error) {
    console.error('No se pudo conectar con MongoDB:', error.message);
    process.exit(1);
  }
}
start();