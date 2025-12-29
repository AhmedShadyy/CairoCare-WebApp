const db = require('../config/db');

class User {
    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(userData) {
        const { name, email, password, role, phone, date_of_birth } = userData;
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, role, phone, date_of_birth) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, role, phone, date_of_birth]
        );
        return result.insertId;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }
}

module.exports = User;
