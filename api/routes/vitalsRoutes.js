const express = require('express');
const router = express.Router();
const { 
    getAllVitals, 
    getVitalsByPatientId, 
    createVital, 
    updateVital, 
    deleteVital,
    totalVital
} = require('../controllers/vitalsController');

// ✅ Add auth middleware (use the same one as medical records)
const { authenticateToken } = require('../middleware/authMiddleware');

// Apply auth to all routes
router.use(authenticateToken);

// Get all vitals
router.get('/', getAllVitals);
//total
router.get('/totalVitals', totalVital);
// Get vitals for specific patient
router.get('/patient/:id', getVitalsByPatientId); // ← Use 'id' to match frontend

// Create new vitals (patient_id in body)
router.post('/', createVital);

// Update & delete vitals
router.put('/:id', updateVital);
router.delete('/:id', deleteVital);

module.exports = router;