const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/admin-data', authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Admin data' });
});
router.get('/doctor-data', authenticateToken, authorizeRoles('doctor'), (req, res) => {
    res.json({ message: 'Doctor data' });
});
router.get('/staff-data', authenticateToken, authorizeRoles('admin', 'doctor'), (req, res) => {
    res.json({ message: 'Staff data for admin only' });
});

module.exports = router;
