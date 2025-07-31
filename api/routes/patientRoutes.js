const express = require('express');
const { authenticateToken,authorizeRoles } = require('../middleware/authMiddleware');

const {
    getAllPatients,
    getPatientById,
    createPatient,
    updatePatient,
    getMyPatients,
    deletePatientById
} = require('../controllers/patientController');
    const router = express.Router();

    // Route to get all patients
    router.get('/', authenticateToken, getAllPatients);
// Route to get patients assigned to the logged-in doctor
    router.get('/my-patients', authenticateToken, getMyPatients);
    // Route to get a specific patient by ID
    router.get('/:id', authenticateToken, getPatientById);
    // Route to create a new patient
    router.post('/', authenticateToken, authorizeRoles('doctor'), createPatient);
                    
    // Route to update an existing patient
    router.put('/:id', authenticateToken, authorizeRoles('doctor'), updatePatient);
    // Route to delete a patient
    router.delete('/:id', authenticateToken, authorizeRoles('doctor'), deletePatientById);

  

module.exports = router;


