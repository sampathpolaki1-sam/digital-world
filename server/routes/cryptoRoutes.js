const express = require('express');
const router = express.Router();
const { runPythonScript } = require('../services/pythonService');
const { saveCalculation } = require('../services/databaseService');

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        if (!payload.message) return res.status(400).json({ error: 'Message is required' });

        const result = await runPythonScript('crypto.py', payload);
        await saveCalculation('Cryptography', 'Caesar Cipher', payload, result.encrypted);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
