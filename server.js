//---------------------------------------------------------------------------------

const express = require('express');  //const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());
const path = require('path');
const cors = require('cors');
//CORS
const corsOptions = {
  origin : process.end.NODE_ENV === 'production'
  ?[
    //frontend production URL
    'https://hospitex-frontend.onrender.com',
    'https://hospitex.onrender.com'
  ]
  :['http://localhost:5173','http://localhost:8080'],
  credentials: true,
  methods: [ 'GET', 'POST', 'PUT', 'DELETE','OPTIONS' ],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());


// Connect to MongoDB
const mongoose = require('mongoose');
const databaseUrl = process.env.DBURL;
mongoose.connect(databaseUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
  //Health check endpoint
  // Health check endpoint for Render
app.get('/', (req, res) => {
  res.json({
    message: 'Healthcare API is running!',
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});
//routes define
const authRoutes = require('./api/routes/authRoutes');
const patientRoutes = require('./api/routes/patientRoutes');
const staffRoutes = require('./api/routes/staffRoutes');
const vitalsRoutes = require('./api/routes/vitalsRoutes');
const medicRecordRoutes = require('./api/routes/MedicRecordRoutes');
const protectedRoutes = require('./api/routes/protectedRoutes');
app.use('/api', protectedRoutes);
app.use('/', authRoutes);
app.use('/patients', patientRoutes);
app.use('/staffs', staffRoutes);
app.use('/vitals', vitalsRoutes);
app.use('/medic-records', medicRecordRoutes);


// Start server
const port = process.env.PORT || 10000;
app.listen(port,'0.0.0.0', () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});