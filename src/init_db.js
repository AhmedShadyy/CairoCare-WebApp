const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
    try {
        // Create connection without database selected to ensure DB creation
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        const schemaPath = path.join(__dirname, '../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon to get individual queries (basic splitting)
        // Note: This might fail if stored procedures have semicolons, but our schema is simple.
        const queries = schema.split(';').filter(query => query.trim().length > 0);

        for (const query of queries) {
            await connection.query(query);
        }

        console.log('Database initialized successfully.');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initDB();
