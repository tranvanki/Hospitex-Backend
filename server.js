const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

console.log('Environment Check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DBURL:', process.env.DBURL ? 'Connected' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');

// In server.js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
  ? [
    'https://hospitex-frontend-jzwu.vercel.app', 
    'https://hospitex-frontend.onrender.com',
    'https://hospitex.onrender.com',
    'https://*.vercel.app'  // Allow all Vercel subdomains
  ]
  : ['http://localhost:5173','http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB Connection
mongoose.connect(process.env.DBURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
//mongoose.connect(process.env.DBURL)
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

// Load routes with error handling
console.log('Loading routes...');

try {
  const authRoutes = require('./api/routes/authRoutes');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  const patientRoutes = require('./api/routes/patientRoutes');
  app.use('/api/patients', patientRoutes);
  console.log('Patient routes loaded');
} catch (error) {
  console.error('Error loading patient routes:', error.message);
}

try {
  const staffRoutes = require('./api/routes/staffRoutes');
  app.use('/api/staffs', staffRoutes);
  console.log('Staff routes loaded');
} catch (error) {
  console.error('Error loading staff routes:', error.message);
}

try {
  const vitalsRoutes = require('./api/routes/vitalsRoutes');
  app.use('/api/vitals', vitalsRoutes);
  console.log('Vitals routes loaded');
} catch (error) {
  console.error('Error loading vitals routes:', error.message);
}

try {
  const medicRecordRoutes = require('./api/routes/MedicRecordRoutes');
  app.use('/api/records', medicRecordRoutes);
  console.log('Medical records routes loaded');
} catch (error) {
  console.error('Error loading medical records routes:', error.message);
}

try {
  const protectedRoutes = require('./api/routes/protectedRoutes');
  app.use('/api', protectedRoutes);
  console.log('Protected routes loaded');
} catch (error) {
  console.error('Error loading protected routes:', error.message);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    requestedPath: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET  /',
      'GET  /api/health',
      'POST /api/auth/login',
      'POST /api/auth/signup',
      'GET  /api/patients/total',
      'GET  /api/vitals/totalVitals',
      'GET  /api/records/totalMedicalRecords'
    ]
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on port', PORT);
  console.log('Environment:', process.env.NODE_ENV || 'development');
});
