const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public (or semi-public)
router.get('/', authenticateToken, doctorController.getAllDoctors);
router.get('/slots', authenticateToken, doctorController.getTimeSlots); // Can pass ?doctor_id=X

// Protected (Doctor only)
router.get('/profile', authenticateToken, authorizeRoles('doctor'), doctorController.getDoctorProfile);
router.put('/profile', authenticateToken, authorizeRoles('doctor'), doctorController.updateProfile);
router.post('/slots', authenticateToken, authorizeRoles('doctor'), doctorController.addTimeSlot);
router.delete('/slots/:id', authenticateToken, authorizeRoles('doctor'), doctorController.deleteTimeSlot);

module.exports = router;
