const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getHistory } = require('./services/databaseService');

const numberSystemRoutes = require('./routes/numberSystemRoutes');
const booleanRoutes = require('./routes/booleanRoutes');
const matrixRoutes = require('./routes/matrixRoutes');
const graphRoutes = require('./routes/graphRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const cryptoRoutes = require('./routes/cryptoRoutes');
const errorRoutes = require('./routes/errorRoutes');
const dsRoutes = require('./routes/dsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/number-system', numberSystemRoutes);
app.use('/api/boolean', booleanRoutes);
app.use('/api/matrix', matrixRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/crypto', cryptoRoutes);
app.use('/api/error-correction', errorRoutes);
app.use('/api/ds', dsRoutes);

// History and Health Endpoints
app.get('/api/history', async (req, res) => {
    try {
        const history = await getHistory();
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
