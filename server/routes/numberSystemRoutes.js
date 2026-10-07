const express = require('express');
const router = express.Router();
const { runPythonScript } = require('../services/pythonService');
const { saveCalculation } = require('../services/databaseService');

router.post('/', async (req, res) => {
    try {
        const { input, fromBase, toBase } = req.body;
        
        if (!input || !fromBase || !toBase) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const result = await runPythonScript('number_systems.py', { input, fromBase, toBase });
        
        // Save to NeonDB
        await saveCalculation('Number Systems', `Base ${fromBase} to ${toBase}`, { input, fromBase, toBase }, result.result);
        
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
