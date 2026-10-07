// Visual Labs: Fractals and Cellular Automata

// ==========================================
// 1. Mandelbrot Set (Fractals)
// ==========================================
document.getElementById('btn-draw-mandelbrot')?.addEventListener('click', () => {
    const canvas = document.getElementById('fractal-canvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Mandelbrot parameters
    const maxIter = 100;
    const minRe = -2.5, maxRe = 1.0;
    const minIm = -1.0, maxIm = 1.0;
    
    const reScale = (maxRe - minRe) / width;
    const imScale = (maxIm - minIm) / height;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
        const cIm = maxIm - y * imScale;
        for (let x = 0; x < width; x++) {
            const cRe = minRe + x * reScale;
            
            let zRe = cRe;
            let zIm = cIm;
            let n = 0;
            
            while (n < maxIter) {
                const zRe2 = zRe * zRe;
                const zIm2 = zIm * zIm;
                if (zRe2 + zIm2 > 4.0) break;
                zIm = 2.0 * zRe * zIm + cIm;
                zRe = zRe2 - zIm2 + cRe;
                n++;
            }
            
            const px = (y * width + x) * 4;
            if (n === maxIter) {
                // Inside set (black)
                data[px] = 0; data[px+1] = 0; data[px+2] = 0; data[px+3] = 255;
            } else {
                // Outside set (color mapped to iteration)
                const hue = Math.floor(255 * n / maxIter);
                data[px] = hue;       // R
                data[px+1] = hue/2;   // G
                data[px+2] = 255-hue; // B
                data[px+3] = 255;     // Alpha
            }
        }
    }
    ctx.putImageData(imgData, 0, 0);
});

// ==========================================
// 2. Cellular Automata (Game of Life)
// ==========================================
const caCanvas = document.getElementById('automata-canvas');
const caCtx = caCanvas?.getContext('2d');
const cols = 80;
const rows = 40;
let grid = buildGrid();
let animFrame;
let isPlaying = false;

function buildGrid() {
    return new Array(cols).fill(null)
        .map(() => new Array(rows).fill(null)
        .map(() => Math.floor(Math.random() * 2)));
}

function drawGrid() {
    if(!caCtx) return;
    const w = caCanvas.width / cols;
    const h = caCanvas.height / rows;
    
    caCtx.fillStyle = '#0a0a0a';
    caCtx.fillRect(0, 0, caCanvas.width, caCanvas.height);
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] === 1) {
                caCtx.fillStyle = '#50fa7b';
                caCtx.fillRect(i * w, j * h, w - 1, h - 1);
            }
        }
    }
}

function computeNextGen() {
    const nextGen = grid.map(arr => [...arr]);
    
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let neighbors = 0;
            // Count 8 neighbors
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    if (x === 0 && y === 0) continue;
                    const col = (i + x + cols) % cols;
                    const row = (j + y + rows) % rows;
                    neighbors += grid[col][row];
                }
            }
            
            // Rules
            if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGen[i][j] = 0; // Death
            } else if (grid[i][j] === 0 && neighbors === 3) {
                nextGen[i][j] = 1; // Birth
            }
        }
    }
    grid = nextGen;
}

function updateAutomata() {
    computeNextGen();
    drawGrid();
    if (isPlaying) {
        animFrame = requestAnimationFrame(updateAutomata);
    }
}

document.getElementById('btn-random-automata')?.addEventListener('click', () => {
    grid = buildGrid();
    drawGrid();
});

document.getElementById('btn-start-automata')?.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        updateAutomata();
    } else {
        cancelAnimationFrame(animFrame);
    }
});

// Initial draw
if (caCanvas) drawGrid();

// ==========================================
// 3. RSA Cybersecurity Simulator
// ==========================================
const rsaCanvas = document.getElementById('rsa-canvas');
const rsaCtx = rsaCanvas ? rsaCanvas.getContext('2d') : null;
let rsaAnimFrame;
let packets = [];
let interceptedData = '';
let encryptedMsg = '';
let secretMsg = '';

const LOG = (msg) => {
    const el = document.getElementById('rsa-log');
    if (el) {
        el.innerHTML += '<br>> ' + msg;
        el.scrollTop = el.scrollHeight;
    }
};

function drawRSAScene() {
    if (!rsaCtx) return;
    rsaCtx.clearRect(0, 0, rsaCanvas.width, rsaCanvas.height);
    
    // Draw Alice
    rsaCtx.fillStyle = '#50fa7b';
    rsaCtx.fillRect(50, 70, 60, 60);
    rsaCtx.fillStyle = '#111';
    rsaCtx.font = '12px var(--font-code)';
    rsaCtx.fillText('ALICE', 60, 105);
    
    // Draw Bob
    rsaCtx.fillStyle = '#8be9fd';
    rsaCtx.fillRect(690, 70, 60, 60);
    rsaCtx.fillStyle = '#111';
    rsaCtx.fillText('BOB', 705, 105);
    
    // Draw Eve (Hacker in middle)
    rsaCtx.fillStyle = '#ff5555';
    rsaCtx.beginPath();
    rsaCtx.arc(400, 100, 30, 0, Math.PI * 2);
    rsaCtx.fill();
    rsaCtx.fillStyle = '#111';
    rsaCtx.fillText('EVE', 385, 105);
    
    // Draw Network Lines
    rsaCtx.strokeStyle = '#444';
    rsaCtx.setLineDash([5, 5]);
    rsaCtx.beginPath();
    rsaCtx.moveTo(110, 100);
    rsaCtx.lineTo(690, 100);
    rsaCtx.stroke();
    rsaCtx.setLineDash([]);
    
    // Draw Packets
    packets.forEach(p => {
        rsaCtx.fillStyle = p.color;
        rsaCtx.fillRect(p.x, p.y, 20, 15);
        rsaCtx.fillStyle = '#fff';
        rsaCtx.font = '10px var(--font-code)';
        rsaCtx.fillText(p.label, p.x, p.y - 5);
        p.x += p.vx;
        
        // Eve interception
        if (Math.abs(p.x - 400) < 5 && !p.intercepted) {
            p.intercepted = true;
            LOG('<span style="color:#ff5555">EVE INTERCEPTED: ' + p.label + '</span>');
            interceptedData += p.label + ' ';
        }
    });
    
    // Remove arrived packets
    packets = packets.filter(p => (p.vx > 0 && p.x < 700) || (p.vx < 0 && p.x > 100));
    
    rsaAnimFrame = requestAnimationFrame(drawRSAScene);
}

if (rsaCanvas) drawRSAScene();

document.getElementById('btn-rsa-step1')?.addEventListener('click', () => {
    LOG('<span style="color:#8be9fd">Bob generates keys: Public Key (e,n), Private Key (d,n)</span>');
    LOG('<span style="color:#8be9fd">Bob sends Public Key to Alice over unsecured network.</span>');
    packets.push({ x: 670, y: 92, vx: -3, color: '#8be9fd', label: 'PublicKey' });
    
    document.getElementById('btn-rsa-step1').disabled = true;
    setTimeout(() => {
        document.getElementById('btn-rsa-step2').disabled = false;
        LOG('<span style="color:#50fa7b">Alice received Public Key! Ready to encrypt.</span>');
    }, 3500);
});

document.getElementById('btn-rsa-step2')?.addEventListener('click', () => {
    secretMsg = document.getElementById('rsa-msg').value || 'HELLO';
    encryptedMsg = btoa(secretMsg).replace(/=/g, '') + 'X9$'; // Fake encryption visual
    
    LOG('<span style="color:#50fa7b">Alice encrypts message: ' + secretMsg + ' -> ' + encryptedMsg + '</span>');
    LOG('<span style="color:#50fa7b">Alice sends Encrypted Data to Bob.</span>');
    packets.push({ x: 110, y: 92, vx: 3, color: '#ffb86c', label: encryptedMsg });
    
    document.getElementById('btn-rsa-step2').disabled = true;
    setTimeout(() => {
        document.getElementById('btn-rsa-step3').disabled = false;
        LOG('<span style="color:#8be9fd">Bob received Encrypted Data! Ready to decrypt.</span>');
    }, 3500);
});

document.getElementById('btn-rsa-step3')?.addEventListener('click', () => {
    LOG('<span style="color:#8be9fd">Bob uses Private Key to decrypt: ' + encryptedMsg + ' -> ' + secretMsg + '</span>');
    LOG('<span style="color:#ff5555">Eve tries to read intercepted data, but she lacks the Private Key!</span>');
    document.getElementById('btn-rsa-step3').disabled = true;
});

document.getElementById('btn-rsa-reset')?.addEventListener('click', () => {
    document.getElementById('btn-rsa-step1').disabled = false;
    document.getElementById('btn-rsa-step2').disabled = true;
    document.getElementById('btn-rsa-step3').disabled = true;
    packets = [];
    interceptedData = '';
    const el = document.getElementById('rsa-log');
    if (el) el.innerHTML = '> System Reset. Waiting for Key Exchange...';
});
