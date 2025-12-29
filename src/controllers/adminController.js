const db = require('../config/db');
const User = require('../models/userModel');

exports.getStats = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [doctors] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "doctor"');
        const [patients] = await db.execute('SELECT COUNT(*) as count FROM users WHERE role = "patient"');
        const [appointments] = await db.execute('SELECT COUNT(*) as count FROM appointments');

        // Pending doctor approvals
        const [pendingDoctors] = await db.execute('SELECT COUNT(*) as count FROM doctors WHERE is_approved = FALSE');

        res.json({
            users: users[0].count,
            doctors: doctors[0].count,
            patients: patients[0].count,
            appointments: appointments[0].count,
            pendingDoctors: pendingDoctors[0].count
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

exports.getPendingDoctors = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.name, u.email, d.id, d.specialization, d.bio 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.is_approved = FALSE
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching pending doctors' });
    }
};

exports.approveDoctor = async (req, res) => {
    const { id } = req.params; // doctor id
    console.log(`Attempting to approve doctor with ID: ${id}`);
    try {
        const [result] = await db.execute('UPDATE doctors SET is_approved = TRUE WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            console.log('No doctor found with that ID to approve.');
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor approved' });
    } catch (error) {
        console.error('Approve Error:', error);
        res.status(500).json({ message: 'Error approving doctor' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.name, u.email, u.role, u.created_at, u.phone, u.date_of_birth,
                   d.specialization, d.consultation_fee, d.is_approved
            FROM users u
            LEFT JOIN doctors d ON u.id = d.user_id
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

exports.rejectDoctor = async (req, res) => {
    const { id } = req.params; // doctor id
    try {
        // Option 1: Just set approved=false (but they are already false).
        // Option 2: Delete the doctor record (so they have to re-apply or user is just a patient).
        // Based on "Drop" logic request, user likely wants them gone from the list. 
        // We will delete the doctor row. The user account will remain as a user/patient unless deleted via "Drop User".

        await db.execute('DELETE FROM doctors WHERE id = ?', [id]);
        res.json({ message: 'Doctor application rejected' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error rejecting doctor' });
    }
};

exports.getAllAppointments = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT a.id, a.appointment_date, a.appointment_time, a.status, a.description,
                   u.name AS patient_name, u.email AS patient_email,
                   ud.name AS doctor_name, ud.email AS doctor_email, d.specialization
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            JOIN users u ON p.user_id = u.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users ud ON d.user_id = ud.id
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching admin appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
};

exports.deleteAppointment = async (req, res) => {
    try {
        await db.execute('DELETE FROM appointments WHERE id = ?', [req.params.id]);
        res.json({ message: 'Appointment deleted' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Error deleting appointment' });
    }
};
