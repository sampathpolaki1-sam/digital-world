const express = require('express');
const router = express.Router();
const { runPythonScript } = require('../services/pythonService');
const { saveCalculation } = require('../services/databaseService');

router.post('/', async (req, res) => {
    try {
        const payload = req.body;
        
        if (!payload.operation || !payload.matrixA) {
            return res.status(400).json({ error: 'Operation and matrixA are required' });
        }

        const result = await runPythonScript('matrices.py', payload);
        
        // Save to NeonDB
        await saveCalculation('Matrices', payload.operation, payload, result.result);
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
