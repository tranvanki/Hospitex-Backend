const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');


const {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaffById

} = require('../controllers/staffController');
// Route to get all staff members
router.get('/', authenticateToken, authorizeRoles('admin'), getAllStaff);


// Read staff by ID
router.get('/:id', authenticateToken, authorizeRoles('admin'), getStaffById);

// Create new staff
router.post('/', authenticateToken, authorizeRoles('admin'), createStaff);

// Update staff by ID
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateStaff);

// Delete staff by ID
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteStaffById);

module.exports = router;
