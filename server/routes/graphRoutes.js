const express = require('express');
const router = express.Router();
const { runCppEngine } = require('../services/cppService');
const { saveCalculation } = require('../services/databaseService');

router.post('/', async (req, res) => {
    try {
        const { edges, source, target } = req.body;
        
        if (!edges || !source || !target) {
            return res.status(400).json({ error: 'Edges, source, and target are required' });
        }

        const result = await runCppEngine(edges, source, target);
        
        // Save to NeonDB
        await saveCalculation('Graph Theory', 'BFS Shortest Path', { edges, source, target }, result.path);
        
        res.json(result);
    } catch (err) {
        // Log explicitly if C++ engine is missing
        if(err.message.includes('C++ Engine not found')) {
            return res.status(503).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
