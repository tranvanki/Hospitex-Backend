//---------------------------------------------------------------------------------

const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' // FIXED: process.env
    ? [
        'https://your-frontend-name.vercel.app', // Your Vercel URL
        'https://*.vercel.app'
      ]
    : ['http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection - Using DBURL from your .env
mongoose.connect(process.env.DBURL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Health check endpoints
app.get('/', (req, res) => {
  res.json({
    message: 'Healthcare API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// Routes - ORGANIZED BETTER
const authRoutes = require('./api/routes/authRoutes');
const patientRoutes = require('./api/routes/patientRoutes');
const staffRoutes = require('./api/routes/staffRoutes');
const vitalsRoutes = require('./api/routes/vitalsRoutes');
const medicRecordRoutes = require('./api/routes/MedicRecordRoutes');
const protectedRoutes = require('./api/routes/protectedRoutes');

// API Routes with /api prefix for consistency
app.use('/api', protectedRoutes);
app.use('/api/auth', authRoutes);      // Better: /api/auth/login
app.use('/api/patients', patientRoutes); // Better: /api/patients/
app.use('/api/staffs', staffRoutes);
app.use('/api/vitals', vitalsRoutes);
app.use('/api/records', medicRecordRoutes); // Changed from medic-records to records

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableRoutes: [
      '/api/auth/login',
      '/api/patients',
      '/api/vitals',
      '/api/records'
    ]
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});