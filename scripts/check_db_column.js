const db = require('../src/config/db');

async function check() {
    try {
        const [columns] = await db.execute("SHOW COLUMNS FROM appointments LIKE 'description'");
        if (columns.length > 0) {
            console.log('Column "description" exists.');
            console.log(columns[0]);
        } else {
            console.error('Column "description" DOES NOT exist.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
