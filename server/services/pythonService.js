const { spawn } = require('child_process');
const path = require('path');

function runPythonScript(scriptName, inputData) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '..', '..', 'python_engine', scriptName);
        
        // Pass data as JSON string argument
        const python = spawn('python', [scriptPath, JSON.stringify(inputData)]);
        
        let output = '';
        let errorOutput = '';

        python.stdout.on('data', (data) => {
            output += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(errorOutput || `Python process exited with code ${code}`));
            }
            try {
                const result = JSON.parse(output.trim());
                if (result.error) {
                    reject(new Error(result.error));
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(new Error('Failed to parse Python output'));
            }
        });
    });
}

module.exports = { runPythonScript };
