// Base URL for the API
const API_BASE = '/api';

async function fetchAPI(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'API request failed');
        }
        
        return result;
    } catch (error) {
        throw error;
    }
}

const api = {
    convertNumberSystem: (data) => fetchAPI('/number-system', 'POST', data),
    evaluateBoolean: (data) => fetchAPI('/boolean', 'POST', data),
    calculateMatrix: (data) => fetchAPI('/matrix', 'POST', data),
    analyzeGraph: (data) => fetchAPI('/graph', 'POST', data),
    calculateProfiler: (data) => fetchAPI('/ds/profiler', 'POST', data),
    calculateBayesian: (data) => fetchAPI('/ds/bayesian', 'POST', data),
    calculateDistributions: (data) => fetchAPI('/ds/distributions', 'POST', data),
    calculateABTesting: (data) => fetchAPI('/ds/ab-testing', 'POST', data),
    calculateRegression: (data) => fetchAPI('/ds/regression', 'POST', data),
    calculateMonteCarlo: (data) => fetchAPI('/ds/monte-carlo', 'POST', data),
    calculateCrypto: (data) => fetchAPI('/crypto', 'POST', data),
    calculateError: (data) => fetchAPI('/error-correction', 'POST', data),
    getHistory: () => fetchAPI('/history', 'GET')
};
