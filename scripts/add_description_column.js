const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cairo_care'
};

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if description column exists
        const [columns] = await connection.execute("SHOW COLUMNS FROM appointments LIKE 'description'");

        if (columns.length === 0) {
            console.log('Adding description column...');
            await connection.execute("ALTER TABLE appointments ADD COLUMN description TEXT AFTER medical_report_path");
            console.log('Description column added successfully.');
        } else {
            console.log('Description column already exists.');
        }

    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
