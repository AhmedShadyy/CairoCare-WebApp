const db = require('../src/config/db');

async function migrate() {
    try {
        console.log('Starting migration...');

        // 1. Add name_ar to users
        try {
            await db.execute('ALTER TABLE users ADD COLUMN name_ar VARCHAR(255)');
            console.log('Added name_ar to users.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('name_ar already exists in users.');
            else throw err;
        }

        // 2. Add bio_ar to doctors
        try {
            await db.execute('ALTER TABLE doctors ADD COLUMN bio_ar TEXT');
            console.log('Added bio_ar to doctors.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('bio_ar already exists in doctors.');
            else throw err;
        }

        // 3. Populate Data
        // Map English Names to Arabic
        const userUpdates = [
            { name: 'Dr. Amr Ali', name_ar: 'د. عمرو علي' },
            { name: 'Dr. Murad Mohamed', name_ar: 'د. مراد محمد' },
            { name: 'salwa', name_ar: 'سلوى' }, // Patient from screenshot
            { name: 'Salwa', name_ar: 'سلوى' }  // Case sensitivity check
        ];

        for (const u of userUpdates) {
            await db.execute('UPDATE users SET name_ar = ? WHERE name = ?', [u.name_ar, u.name]);
        }
        console.log('Updated user Arabic names.');

        // Update Doctors Bios
        // We need to join to find the doctor by user name
        const doctorUpdates = [
            {
                name: 'Dr. Amr Ali',
                bio_ar: 'استشاري القلب بمستشفى الشفاء'
            },
            {
                name: 'Dr. Murad Mohamed',
                bio_ar: 'طبيب عام بمستشفى الأمل'
            }
        ];

        for (const d of doctorUpdates) {
            // Find user id
            const [users] = await db.execute('SELECT id FROM users WHERE name = ?', [d.name]);
            if (users.length > 0) {
                await db.execute('UPDATE doctors SET bio_ar = ? WHERE user_id = ?', [d.bio_ar, users[0].id]);
            }
        }
        console.log('Updated doctor Arabic bios.');

        console.log('Migration complete.');
        process.exit(0);

    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
