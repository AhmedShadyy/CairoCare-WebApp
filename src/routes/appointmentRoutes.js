const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authenticateToken, authorizeRoles('patient'), upload.single('report'), appointmentController.bookAppointment);
router.get('/', authenticateToken, appointmentController.getMyAppointments);
router.patch('/:id/status', authenticateToken, authorizeRoles('doctor'), appointmentController.updateStatus);

module.exports = router;
