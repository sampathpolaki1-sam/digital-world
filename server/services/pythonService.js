const mathEngine = require('./mathEngine');

// We intercept the python calls and use pure Node.js math to ensure 100% Vercel compatibility
function runPythonScript(scriptName, inputData) {
    return new Promise((resolve, reject) => {
        try {
            let result;
            if (scriptName === 'number_systems.py') {
                result = mathEngine.numberSystem(inputData);
            } else if (scriptName === 'boolean_logic.py') {
                result = mathEngine.booleanLogic(inputData);
            } else if (scriptName === 'matrices.py') {
                result = mathEngine.matrices(inputData);
            } else if (scriptName === 'crypto.py') {
                result = mathEngine.crypto(inputData);
            } else if (scriptName === 'error_correction.py') {
                result = mathEngine.errorCorrection(inputData);
            } else if (scriptName === 'data_science.py') {
                result = mathEngine.dataScience(inputData);
            } else {
                result = mathEngine.graph(inputData); // fallback for graph/others
            }
            
            if (result.error) {
                reject(new Error(result.error));
            } else {
                resolve(result);
            }
        } catch (e) {
            reject(new Error('Math engine execution failed: ' + e.message));
        }
    });
}

module.exports = { runPythonScript };
