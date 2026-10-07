const express = require('express');
const router = express.Router();
const { runPythonScript } = require('../services/pythonService');
const { saveCalculation } = require('../services/databaseService');

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        
        if (!payload.operation) {
            return res.status(400).json({ error: 'Operation is required' });
        }

        const result = await runPythonScript('boolean_logic.py', payload);
        
        // Save to NeonDB
        await saveCalculation('Boolean Logic', payload.operation, payload, result.result);
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
