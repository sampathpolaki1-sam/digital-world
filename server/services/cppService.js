const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runCppEngine(edges, source, target) {
    return new Promise((resolve, reject) => {
        const ext = process.platform === 'win32' ? '.exe' : '';
        const cppExe = path.join(__dirname, '..', '..', 'cpp_engine', `graph_engine${ext}`);
        
        // Fallback for missing C++ compiled engine
        if (!fs.existsSync(cppExe)) {
            console.warn(`C++ Engine not found at ${cppExe}. Using JavaScript fallback implementation.`);
            try {
                const result = runDijkstraFallback(edges, source, target);
                return resolve(result);
            } catch (err) {
                return reject(err);
            }
        }

        const cpp = spawn(cppExe, [edges, source, target]);
        
        let output = '';
        let errorOutput = '';

        cpp.stdout.on('data', (data) => {
            output += data.toString();
        });

        cpp.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        cpp.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(errorOutput || `C++ process exited with code ${code}`));
            }
            try {
                const result = JSON.parse(output.trim());
                if (result.error) {
                    reject(new Error(result.error));
                } else {
                    resolve(result);
                }
            } catch (e) {
                reject(new Error('Failed to parse C++ output'));
            }
        });
    });
}

module.exports = { runCppEngine };

// Dijkstra's Algorithm Implementation in JavaScript
function runDijkstraFallback(edges_str, source, target) {
    const adjList = {};
    const degrees = {};

    // Edges format: "A-B:5, A-C:2"
    edges_str.split(',').forEach(edgeStr => {
        const parts = edgeStr.trim().split('-');
        if (parts.length === 2) {
            const u = parts[0].trim();
            const nodeAndWeight = parts[1].split(':');
            const v = nodeAndWeight[0].trim();
            const weight = nodeAndWeight.length > 1 ? parseInt(nodeAndWeight[1].trim()) : 1;
            
            if (u && v && !isNaN(weight)) {
                if (!adjList[u]) adjList[u] = [];
                if (!adjList[v]) adjList[v] = [];
                adjList[u].push({ node: v, weight });
                adjList[v].push({ node: u, weight }); // Undirected graph
                
                degrees[u] = (degrees[u] || 0) + 1;
                degrees[v] = (degrees[v] || 0) + 1;
            }
        }
    });

    if (!adjList[source] || !adjList[target]) {
        return {
            degrees,
            path: null,
            distance: -1,
            error: "Source or Target node not found in graph."
        };
    }

    const dist = {};
    const prev = {};
    const pq = [];

    // Initialize distances
    Object.keys(adjList).forEach(node => {
        dist[node] = Infinity;
        prev[node] = null;
    });

    dist[source] = 0;
    pq.push({ node: source, distance: 0 });

    while (pq.length > 0) {
        // Simple priority queue extraction (find min)
        pq.sort((a, b) => a.distance - b.distance);
        const current = pq.shift();
        const u = current.node;

        if (u === target) break; // Found shortest path

        if (current.distance > dist[u]) continue; // Stale record

        const neighbors = adjList[u] || [];
        for (const edge of neighbors) {
            const v = edge.node;
            const alt = dist[u] + edge.weight;
            if (alt < dist[v]) {
                dist[v] = alt;
                prev[v] = u;
                pq.push({ node: v, distance: alt });
            }
        }
    }

    if (dist[target] === Infinity) {
        return {
            degrees,
            path: null,
            distance: -1,
            error: "No path found between source and target."
        };
    }

    // Reconstruct path
    const path = [];
    let curr = target;
    while (curr !== null) {
        path.push(curr);
        curr = prev[curr];
    }
    path.reverse();
    
    return {
        degrees,
        path: path.join(' -> '),
        distance: dist[target]
    };
}
