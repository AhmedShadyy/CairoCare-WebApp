const db = require('../src/config/db');

async function migrate() {
    try {
        console.log('Starting bio correction migration...');

        const doctorUpdates = [
            {
                name: 'Amr Ali',
                bio_ar: 'استشاري القلب بمستشفى الشفاء'
            },
            {
                name: 'Murad Mohamed',
                bio_ar: 'طبيب عام بمستشفى الأمل'
            }
        ];

        for (const d of doctorUpdates) {
            // Find user id using the CORRECT name (without Dr. prefix if that's how it is in DB)
            const [users] = await db.execute('SELECT id FROM users WHERE name = ?', [d.name]);
            if (users.length > 0) {
                const [result] = await db.execute('UPDATE doctors SET bio_ar = ? WHERE user_id = ?', [d.bio_ar, users[0].id]);
                console.log(`Updated bio for ${d.name}: ${result.affectedRows} rows affected.`);
            } else {
                console.log(`User ${d.name} not found.`);
            }
        }

        console.log('Bio correction complete.');
        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
