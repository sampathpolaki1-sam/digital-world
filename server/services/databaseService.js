const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function saveCalculation(moduleName, operation, inputData, result) {
    try {
        const query = `
            INSERT INTO calculations (module, operation, input_data, result)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [moduleName, operation, JSON.stringify(inputData), JSON.stringify(result)];
        const res = await pool.query(query, values);
        return res.rows[0];
    } catch (err) {
        console.error('Database Error:', err);
        // Do not crash, just return null if DB fails
        return null;
    }
}

async function getHistory() {
    try {
        const query = `
            SELECT * FROM calculations
            ORDER BY created_at DESC
            LIMIT 20;
        `;
        const res = await pool.query(query);
        return res.rows;
    } catch (err) {
        console.error('Database Error:', err);
        return [];
    }
}

module.exports = {
    saveCalculation,
    getHistory,
    pool
};
