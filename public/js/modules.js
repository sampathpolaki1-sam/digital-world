// Number Systems Module
document.getElementById('num-system-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('num-input').value.trim();
    const fromBase = document.getElementById('from-base').value;
    const toBase = document.getElementById('to-base').value;

    try {
        const data = await api.convertNumberSystem({ input, fromBase, toBase });
        showResult('num-system', `
            <h3>Result: ${data.result}</h3>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) {
        showError('num-system', err.message);
    }
});

// Boolean Logic Module
document.getElementById('boolean-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const operation = document.getElementById('bool-op').value;
    let payload = { operation };
    
    if (operation === 'EXPRESSION') {
        payload.expression = document.getElementById('bool-expr').value.trim();
    } else {
        payload.a = parseInt(document.getElementById('bool-a').value) || 0;
        if (operation !== 'NOT') {
            payload.b = parseInt(document.getElementById('bool-b').value) || 0;
        }
    }

    try {
        const data = await api.evaluateBoolean(payload);
        showResult('boolean', `
            <h3>Result: ${data.result}</h3>
            <h4>Truth Table:</h4>
            <pre>${data.truth_table}</pre>
            <h4>Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) {
        showError('boolean', err.message);
    }
});

// Matrices Module
document.getElementById('matrix-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const operation = document.getElementById('matrix-op').value;
    
    try {
        const matrixA = JSON.parse(document.getElementById('matrix-a').value);
        let payload = { operation, matrixA };
        
        if (operation !== 'transpose') {
            payload.matrixB = JSON.parse(document.getElementById('matrix-b').value);
        }

        const data = await api.calculateMatrix(payload);
        showResult('matrix', `
            <h3>Result:</h3>
            <pre>${JSON.stringify(data.result, null, 2)}</pre>
            <h4>Steps:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) {
        showError('matrix', err.message || 'Invalid JSON format for matrices.');
    }
});

// Graph Theory Module (Dijkstra)
document.getElementById('graph-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const edges = document.getElementById('graph-edges').value.trim();
    const source = document.getElementById('graph-start').value.trim();
    const target = document.getElementById('graph-end').value.trim();

    try {
        const data = await api.analyzeGraph({ edges, source, target });
        showResult('graph', `
            <h3>Optimal Path: ${data.path || 'No path found'}</h3>
            <p><strong>Total Cost:</strong> ${data.distance}</p>
            <h4>Node Degrees:</h4>
            <pre>${JSON.stringify(data.degrees, null, 2)}</pre>
        `);
    } catch (err) {
        showError('graph', err.message);
    }
});

// Crypto Lab Module
document.getElementById('crypto-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('crypto-msg').value.trim();
    const key = parseInt(document.getElementById('crypto-key').value);

    try {
        const data = await api.calculateCrypto({ message: msg, key: key });
        showResult('crypto', `
            <p><strong>Original:</strong> ${msg}</p>
            <p><strong>Encrypted:</strong> <span style="color: #bd93f9; font-size: 1.2rem;">${data.encrypted}</span></p>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) {
        showError('crypto', err.message);
    }
});

// Error Correction Module
document.getElementById('error-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const binaryData = document.getElementById('error-data').value.trim();
    const errorIndexStr = document.getElementById('error-index').value.trim();
    
    let payload = { data: binaryData };
    if (errorIndexStr) {
        payload.error_index = parseInt(errorIndexStr);
    }

    try {
        const data = await api.calculateError(payload);
        showResult('error', `
            <p><strong>Original Data:</strong> ${binaryData}</p>
            <p><strong>Transmitted Data (with Parity):</strong> ${data.transmitted}</p>
            ${data.received !== data.transmitted ? '<p><strong>Received Data (Corrupted):</strong> <span style="color: var(--neon-red);">' + data.received + '</span></p>' : '<p><strong>Received Data:</strong> ' + data.received + '</p>'}
            <p><strong>Parity Check Result:</strong> <span style="color: ${data.isValid ? 'var(--neon-green)' : 'var(--neon-red)'};">${data.isValid ? 'VALID' : 'INVALID - ERROR DETECTED'}</span></p>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) {
        showError('error', err.message);
    }
});

// DS Profiler Module
document.getElementById('profiler-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const dataStr = document.getElementById('profiler-data').value.trim();
    const dataset = dataStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (dataset.length === 0) return showError('profiler', 'Provide valid numbers');

    try {
        const data = await api.calculateProfiler({ data: dataset });
        showResult('profiler', `
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <p><strong>Mean:</strong> ${data.mean}</p>
                <p><strong>Median:</strong> ${data.median}</p>
                <p><strong>Variance:</strong> ${data.variance}</p>
                <p><strong>Std Dev:</strong> ${data.std_dev}</p>
                <p><strong>IQR:</strong> ${data.iqr}</p>
                <p><strong>Skewness:</strong> ${data.skewness}</p>
            </div>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) { showError('profiler', err.message); }
});

// Bayesian Engine Module
document.getElementById('bayesian-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const prior = parseFloat(document.getElementById('prob-prior').value);
    const tpr = parseFloat(document.getElementById('prob-tpr').value);
    const fpr = parseFloat(document.getElementById('prob-fpr').value);

    try {
        const data = await api.calculateBayesian({ prior, tpr, fpr });
        showResult('bayesian', `
            <p><strong>P(Alert):</strong> ${data.p_alert}</p>
            <p style="font-size:1.2rem; color:var(--neon-red);"><strong>Posterior P(Fraud|Alert):</strong> ${data.posterior}</p>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) { showError('bayesian', err.message); }
});

// Traffic Simulator (Distributions) Module
document.getElementById('dist-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const lam = parseFloat(document.getElementById('dist-lambda').value);
    const k = parseInt(document.getElementById('dist-k').value);

    try {
        const data = await api.calculateDistributions({ lambda: lam, k: k });
        showResult('dist', `
            <p style="font-size:1.2rem; color:var(--neon-blue);"><strong>Probability:</strong> ${data.poisson_prob}</p>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) { showError('dist', err.message); }
});

// A/B Testing Lab Module
document.getElementById('ab-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const aStr = document.getElementById('ab-group-a').value.trim();
    const bStr = document.getElementById('ab-group-b').value.trim();
    const groupA = aStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const groupB = bStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    if (groupA.length < 2 || groupB.length < 2) return showError('ab', 'Provide at least 2 numbers per group');

    try {
        const data = await api.calculateABTesting({ group_a: groupA, group_b: groupB });
        showResult('ab', `
            <p><strong>Mean A:</strong> ${data.mean_a}</p>
            <p><strong>Mean B:</strong> ${data.mean_b}</p>
            <p style="font-size:1.2rem; color:${data.significant ? 'var(--neon-green)' : 'var(--neon-red)'}"><strong>Z-Score:</strong> ${data.z_score}</p>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) { showError('ab', err.message); }
});

// Regression Module
document.getElementById('regression-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const xStr = document.getElementById('reg-x').value.trim();
    const yStr = document.getElementById('reg-y').value.trim();
    const pStr = document.getElementById('reg-predict').value.trim();
    const x = xStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    const y = yStr.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

    let payload = { x, y };
    if (pStr) payload.predict_x = parseFloat(pStr);

    try {
        const data = await api.calculateRegression(payload);
        showResult('reg', `
            <p><strong>Model:</strong> y = ${data.slope}x + ${data.intercept}</p>
            <p><strong>R² (Accuracy):</strong> ${data.r_squared}</p>
            ${data.prediction !== undefined ? '<p style="font-size:1.2rem; color:var(--neon-blue);"><strong>Predicted Revenue:</strong> $' + data.prediction + '</p>' : ''}
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) { showError('reg', err.message); }
});

// Monte Carlo Module
document.getElementById('monte-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const n = parseInt(document.getElementById('monte-n').value);
    const p = parseFloat(document.getElementById('monte-p').value);

    try {
        const data = await api.calculateMonteCarlo({ n, p });
        showResult('monte', `
            <p><strong>Simulated Probability:</strong> ${data.simulated_p}</p>
            <p><strong>Total Simulated Failures:</strong> ${data.failures}</p>
            <h4>Mathematical Explanation:</h4>
            <pre>${data.explanation}</pre>
        `);
    } catch (err) { showError('monte', err.message); }
});

// History Logic
document.getElementById('refresh-history')?.addEventListener('click', loadHistory);

async function loadHistory() {
    const container = document.getElementById('history-container');
    container.innerHTML = '<p>Loading history...</p>';
    
    try {
        const history = await api.getHistory();
        if (history.length === 0) {
            container.innerHTML = '<p>No history found.</p>';
            return;
        }
        
        container.innerHTML = history.map(item => `
            <div class="history-item">
                <div class="history-item-header">
                    <span><strong>Module:</strong> ${item.module} (${item.operation})</span>
                    <span>${new Date(item.created_at).toLocaleString()}</span>
                </div>
                <div>
                    <p><strong>Input:</strong> ${item.input_data}</p>
                    <p><strong>Result:</strong> ${item.result}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="error-area"><p>Failed to load history: ${err.message}</p></div>`;
    }
}
