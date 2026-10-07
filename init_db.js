const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        console.log('Connecting to database...');
        const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
        await pool.query(schema);
        console.log('Schema successfully initialized on NeonDB!');
    } catch (err) {
        console.error('Error initializing schema:', err);
    } finally {
        await pool.end();
    }
}

initDB();
