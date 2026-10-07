const express = require('express');
const router = express.Router();
const { runPythonScript } = require('../services/pythonService');
const { saveCalculation } = require('../services/databaseService');

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        
        if (!payload.dataset || !Array.isArray(payload.dataset)) {
            return res.status(400).json({ error: 'Dataset is required and must be an array' });
        }

        const result = await runPythonScript('statistics_module.py', payload);
        
        // Save to NeonDB
        await saveCalculation('Statistics', 'Descriptive Stats', payload, result);
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
