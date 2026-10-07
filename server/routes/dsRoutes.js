const express = require('express');
const router = express.Router();
const { runPythonScript } = require('../services/pythonService');
const { saveCalculation } = require('../services/databaseService');

async function handleDSRequest(req, res, moduleName, operationName) {
    try {
        const payload = req.body;
        payload.module = moduleName; // Tell Python which function to run

        const result = await runPythonScript('data_science.py', payload);
        
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        
        await saveCalculation('Data Science Lab', operationName, payload, JSON.stringify(result));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

router.post('/profiler', (req, res) => handleDSRequest(req, res, 'profiler', 'Footprint Profiler'));
router.post('/bayesian', (req, res) => handleDSRequest(req, res, 'bayesian', 'Bayesian Engine'));
router.post('/distributions', (req, res) => handleDSRequest(req, res, 'distributions', 'Traffic Simulator'));
router.post('/ab-testing', (req, res) => handleDSRequest(req, res, 'ab_testing', 'A/B Testing'));
router.post('/regression', (req, res) => handleDSRequest(req, res, 'regression', 'Revenue Predictor'));
router.post('/monte-carlo', (req, res) => handleDSRequest(req, res, 'monte_carlo', 'Monte Carlo LLN'));

module.exports = router;
