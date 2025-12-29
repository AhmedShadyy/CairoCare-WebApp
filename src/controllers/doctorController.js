const db = require('../config/db');

// Get all doctors (for patients to browse)
exports.getAllDoctors = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.name, u.name_ar, d.id as doctor_id, d.specialization, d.consultation_fee, d.bio, d.bio_ar, d.is_approved 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.is_approved = TRUE
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching doctors' });
    }
};

// Get doctor profile (for the doctor themselves)
exports.getDoctorProfile = async (req, res) => {
    try {
        // req.user.id is user_id from token
        const [rows] = await db.execute(`
            SELECT u.name, u.name_ar, u.email, u.phone, u.date_of_birth, d.id as doctor_id, d.specialization, d.consultation_fee, d.bio, d.bio_ar, d.is_approved 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id 
            WHERE u.id = ?
        `, [req.user.id]);

        if (rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

// Update doctor profile
exports.updateProfile = async (req, res) => {
    const { name, email, phone, date_of_birth, specialization, consultation_fee, bio } = req.body;
    try {
        const [doctor] = await db.execute('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
        if (doctor.length === 0) return res.status(404).json({ message: 'Doctor not found' });

        // Update Doctor details
        await db.execute('UPDATE doctors SET specialization = ?, consultation_fee = ?, bio = ? WHERE user_id = ?',
            [specialization, consultation_fee, bio, req.user.id]);

        // Update User details (Name, Phone, DOB) - Email updating is risky without verification, skipping for now
        await db.execute('UPDATE users SET name = ?, phone = ?, date_of_birth = ? WHERE id = ?',
            [name, phone, date_of_birth, req.user.id]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};

// Manage Time Slots
exports.addTimeSlot = async (req, res) => {
    const { day, startTime, endTime } = req.body;
    try {
        const [rows] = await db.execute('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });
        const doctorId = rows[0].id;

        await db.execute(
            'INSERT INTO time_slots (doctor_id, day_of_week, start_time, end_time) VALUES (?, ?, ?, ?)',
            [doctorId, day, startTime, endTime]
        );
        res.status(201).json({ message: 'Time slot added' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding time slot' });
    }
};

exports.getTimeSlots = async (req, res) => {
    try {
        const user_id = req.query.user_id ? req.query.user_id : req.user.id; // If query param provided (for patients), use it, else current user

        // If user_id provided is a doctor viewing their own, ok.
        // If patient viewing a doctor, we need that doctor's doctor_id.
        // Let's assume input is doctor_id for public view, or inferred from token for private view.

        let doctorId;
        if (req.query.doctor_id) {
            doctorId = req.query.doctor_id;
        } else {
            const [rows] = await db.execute('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
            if (rows.length === 0) return res.status(404).json({ message: 'Doctor not found' });
            doctorId = rows[0].id;
        }

        const [slots] = await db.execute('SELECT * FROM time_slots WHERE doctor_id = ? ORDER BY day_of_week', [doctorId]);
        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching time slots' });
    }
};

exports.deleteTimeSlot = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM time_slots WHERE id = ?', [id]);
        res.json({ message: 'Time slot deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting time slot' });
    }
};
