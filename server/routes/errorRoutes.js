const express = require('express');
const router = express.Router();
const { runPythonScript } = require('../services/pythonService');
const { saveCalculation } = require('../services/databaseService');

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        if (!payload.data) return res.status(400).json({ error: 'Binary data is required' });

        const result = await runPythonScript('error_correction.py', payload);
        await saveCalculation('Error Correction', 'Parity Check', payload, result.received);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
