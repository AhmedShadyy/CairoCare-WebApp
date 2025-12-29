const db = require('../src/config/db');

async function updateSchema() {
    try {
        console.log('Attempting to update appointments table...');
        // We use a try-catch block for the specific query in case the column already exists, 
        // though "ADD COLUMN" usually throws if it exists. 
        // "IF NOT EXISTS" syntax for columns is available in newer MariaDB/MySQL versions, 
        // but to be safe we can just run it and catch the error if it says "Duplicate column".

        try {
            await db.execute('ALTER TABLE appointments ADD COLUMN description TEXT');
            console.log('Successfully added "description" column to appointments table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('"description" column already exists.');
            } else {
                throw err;
            }
        }

        console.log('Schema update complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error updating schema:', err);
        process.exit(1);
    }
}

updateSchema();
