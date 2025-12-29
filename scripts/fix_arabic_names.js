const db = require('../src/config/db');

async function migrate() {
    try {
        console.log('Starting name correction migration...');

        // Update correct names (without Dr. prefix)
        const userUpdates = [
            { name: 'Amr Ali', name_ar: 'د. عمرو علي' },
            { name: 'Murad Mohamed', name_ar: 'د. مراد محمد' }
        ];

        for (const u of userUpdates) {
            const [result] = await db.execute('UPDATE users SET name_ar = ? WHERE name = ?', [u.name_ar, u.name]);
            console.log(`Updated ${u.name}: ${result.affectedRows} rows affected.`);
        }

        console.log('Name correction complete.');
        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
