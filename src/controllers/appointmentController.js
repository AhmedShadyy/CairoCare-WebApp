const db = require('../config/db');

exports.bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.user.id; // user_id (needs to be mapped to patient_id)

    try {
        // 1. Get patient_id from patients table using user_id
        const [patientRows] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
        if (patientRows.length === 0) return res.status(403).json({ message: 'User is not a patient' });
        const realPatientId = patientRows[0].id;

        // 2. Validate against Doctor's Time Slots
        // Parse date manually to ensure Local Time interpretation, avoiding UTC parsing shift
        const [year, month, day] = appointment_date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day); // Local date
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[dateObj.getDay()];

        // Normalize appointment time to HH:MM:SS for string comparison
        const apptTime = appointment_time.length === 5 ? appointment_time + ':00' : appointment_time;

        console.log(`Booking Request: Date=${appointment_date}, Day=${dayName}, Time=${apptTime}, DocID=${doctor_id}`);
        console.log('Body:', req.body); // Debug log to see description

        // Fetch slots for this doctor on this day
        const [slots] = await db.execute(
            'SELECT * FROM time_slots WHERE doctor_id = ? AND day_of_week = ?',
            [doctor_id, dayName]
        );

        console.log(`Found ${slots.length} slots for ${dayName}`);

        let isWithinSlot = false;

        for (const slot of slots) {
            console.log(`Checking slot: ${slot.start_time} - ${slot.end_time}`);
            // Ensure slot times are strings
            if (apptTime >= slot.start_time && apptTime <= slot.end_time) {
                isWithinSlot = true;
                break;
            }
        }

        if (!isWithinSlot) {
            console.log('Validation Failed: Time not within slot');
            return res.status(400).json({ message: 'Sorry, this doctor is unavailable at this time.' });
        }

        // 3. Check if already booked
        const [existing] = await db.execute(
            'SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != "rejected"',
            [doctor_id, appointment_date, appointment_time]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: 'Sorry, this time slot is already booked.' });
        }

        const medicalReportPath = req.file ? '/uploads/' + req.file.filename : null;
        // The field in DB is 'description' per update_db.js
        console.log('Booking Request Body:', req.body); // DEBUG: Check what is received
        const descriptionText = req.body.description || null;

        await db.execute(
            'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, medical_report_path, description) VALUES (?, ?, ?, ?, ?, ?)',
            [realPatientId, doctor_id, appointment_date, appointment_time, medicalReportPath, descriptionText]
        );

        res.status(201).json({ message: 'Appointment booked successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error booking appointment' });
    }
};

exports.getMyAppointments = async (req, res) => {
    try {
        console.log(`Getting appointments for user: ${req.user.id}, Role: ${req.user.role}`);
        let query = '';
        let params = [];

        if (req.user.role === 'patient') {
            const [patientRows] = await db.execute('SELECT id FROM patients WHERE user_id = ?', [req.user.id]);
            if (patientRows.length === 0) return res.json([]);

            query = `
                SELECT a.*, d.specialization, u.name as doctor_name, u.name_ar as doctor_name_ar
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                JOIN users u ON d.user_id = u.id
                WHERE a.patient_id = ?
                ORDER BY a.appointment_date DESC, a.appointment_time ASC
            `;
            params = [patientRows[0].id];

        } else if (req.user.role === 'doctor') {
            const [doctorRows] = await db.execute('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
            if (doctorRows.length === 0) return res.json([]);

            query = `
                SELECT a.*, p.gender, u.name as patient_name, u.name_ar as patient_name_ar, u.email as patient_email, u.phone as patient_phone
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON p.user_id = u.id
                WHERE a.doctor_id = ?
                ORDER BY a.appointment_date ASC
            `;
            params = [doctorRows[0].id];
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // approved, rejected, completed

    try {
        // Verify doctor owns this appointment
        const [doctorRows] = await db.execute('SELECT id FROM doctors WHERE user_id = ?', [req.user.id]);
        if (doctorRows.length === 0) return res.status(403).json({ message: 'Not authorized' });

        // Update
        await db.execute('UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?', [status, id, doctorRows[0].id]);
        res.json({ message: 'Appointment updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating appointment' });
    }
};
