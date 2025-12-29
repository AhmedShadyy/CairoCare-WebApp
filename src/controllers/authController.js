const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const db = require('../config/db');

exports.register = async (req, res) => {
    const { name, email, password, role, phone, ...otherDetails } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Start transaction manually since mysql2 doesn't support nested easily, 
        // but for simplicity we will do sequential inserts. 
        // In a real high-integrity app, we'd wrap this in a transaction.

        const userId = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            date_of_birth: otherDetails.date_of_birth || null
        });

        // Role specific tables
        if (role === 'patient') {
            await db.execute(
                'INSERT INTO patients (user_id, gender, address, date_of_birth) VALUES (?, ?, ?, ?)',
                [userId, otherDetails.gender || null, otherDetails.address || null, otherDetails.date_of_birth || null]
            );
        } else if (role === 'doctor') {
            await db.execute(
                'INSERT INTO doctors (user_id, specialization, consultation_fee, bio) VALUES (?, ?, ?, ?)',
                [userId, otherDetails.specialization || 'General', otherDetails.consultation_fee || 0, otherDetails.bio || '']
            );
        }

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                name_ar: user.name_ar, // Return name_ar
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const [user] = await db.execute('SELECT id, name, name_ar, email, phone, role, date_of_birth FROM users WHERE id = ?', [req.user.id]);
        if (user.length === 0) return res.status(404).json({ message: 'User not found' });

        // If patient, fetch patient specifics (optional if everything is in users now? No, address is in patients)
        let profile = user[0];
        if (profile.role === 'patient') {
            const [patientRows] = await db.execute('SELECT address FROM patients WHERE user_id = ?', [req.user.id]);
            if (patientRows.length > 0) {
                profile = { ...profile, ...patientRows[0] };
            }
        }

        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
};

exports.updateProfile = async (req, res) => {
    const { name, phone, date_of_birth, address } = req.body;
    try {
        await db.execute('UPDATE users SET name = ?, phone = ?, date_of_birth = ? WHERE id = ?',
            [name, phone, date_of_birth, req.user.id]);

        if (req.user.role === 'patient') {
            await db.execute('UPDATE patients SET address = ?, date_of_birth = ? WHERE user_id = ?',
                [address, date_of_birth, req.user.id]);
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
};
