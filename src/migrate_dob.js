const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function migrate() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Adding date_of_birth to users table...');
        try {
            await connection.query("ALTER TABLE users ADD COLUMN date_of_birth DATE");
            console.log('Column added.');
        } catch (e) {
            console.log('Column might already exist:', e.message);
        }

        // Move data from patients to users
        console.log('Migrating DOB from patients to users...');
        await connection.query(`
            UPDATE users u 
            JOIN patients p ON u.id = p.user_id 
            SET u.date_of_birth = p.date_of_birth
        `);

        // Drop column from patients? No, keep it for legacy safety for now or cleanup later. 
        // Actually, preventing confusion is better. But let's just make sure we use 'users' from now on.

        console.log('Migration complete.');
        await connection.end();
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
