const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/stats', authenticateToken, authorizeRoles('admin'), adminController.getStats);
router.get('/doctors/pending', authenticateToken, authorizeRoles('admin'), adminController.getPendingDoctors);
router.patch('/doctors/:id/approve', authenticateToken, authorizeRoles('admin'), adminController.approveDoctor);
router.get('/users', authenticateToken, authorizeRoles('admin'), adminController.getAllUsers);
router.delete('/users/:id', authenticateToken, authorizeRoles('admin'), adminController.deleteUser);
router.delete('/doctors/:id/reject', authenticateToken, authorizeRoles('admin'), adminController.rejectDoctor);
router.get('/appointments', authenticateToken, authorizeRoles('admin'), adminController.getAllAppointments);
router.delete('/appointments/:id', authenticateToken, authorizeRoles('admin'), adminController.deleteAppointment);

module.exports = router;
