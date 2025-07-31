const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
    getAllRecords,
    createRecord,
    updateRecord,
    deleteRecord
} = require('../controllers/MedicRecordCtrl');
router.use(authenticateToken);
// Patient-specific routes
router.get('/',  getAllRecords);
router.post('/', createRecord);

// Record-specific routes (for doctor dashboard editing)
router.put('/:id', updateRecord);
router.delete('/:id', deleteRecord);

module.exports = router;