import fs from 'fs';
import path from 'path';
import { sequelize } from './connection';

async function runMigrations() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Database connection established.');

        const migrationsDir = path.join(__dirname, '../../migrations');
        const files = fs.readdirSync(migrationsDir).sort();

        console.log(`Found ${files.length} migrations.`);

        // Create migrations table if not exists
        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        for (const file of files) {
            if (!file.endsWith('.sql')) continue;

            const [alreadyExecuted] = await sequelize.query(
                'SELECT id FROM migrations WHERE name = ?',
                { replacements: [file] }
            );

            if (alreadyExecuted.length > 0) {
                console.log(`Skipping ${file} (already executed)`);
                continue;
            }

            console.log(`Executing ${file}...`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

            // Split by semicolon to handle multiple statements if needed, 
            // but usually sequelize.query handles it if strictly one statement or supported by driver.
            // Postgres driver supports multiple statements in one query.
            await sequelize.query(sql);

            await sequelize.query(
                'INSERT INTO migrations (name) VALUES (?)',
                { replacements: [file] }
            );
            console.log(`Completed ${file}`);
        }

        console.log('All migrations completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
