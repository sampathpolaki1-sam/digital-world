document.getElementById('start-sim-btn')?.addEventListener('click', () => {
    const msg = document.getElementById('sim-message').value;
    if (!msg) {
        alert("Please enter a message to begin the simulation.");
        return;
    }

    const progressArea = document.getElementById('sim-progress-area');
    const terminal = document.getElementById('sim-terminal');
    const mathFormula = document.getElementById('sim-math-formula');
    const nodes = document.querySelectorAll('.pipe-node');
    
    progressArea.classList.remove('hidden');
    terminal.innerHTML = `> INITIALIZING SIMULATION...<br>> INPUT: "${msg}"<br>> STANDBY FOR PHASE 2 IMPLEMENTATION.`;
    mathFormula.innerHTML = `ASCII Conversion: wait...<br>Binary Stream: wait...`;

    // Reset nodes
    nodes.forEach(n => n.classList.remove('active-node'));

    // Mock progress for Phase 1
    let step = 0;
    const interval = setInterval(() => {
        if (step < nodes.length) {
            nodes.forEach(n => n.classList.remove('active-node'));
            nodes[step].classList.add('active-node');
            terminal.innerHTML += `<br>> Executing: ${nodes[step].innerText}...`;
            step++;
        } else {
            clearInterval(interval);
            terminal.innerHTML += `<br><br>> [ SIMULATION PAUSED - AWAITING PHASE 2 ]`;
            document.getElementById('audit-log').innerHTML = `
                <p><strong>[ SYSTEM AUDIT ]</strong></p>
                <p>Mathematical operations will be logged here in Phase 2.</p>
                <p>Input tracked: ${msg}</p>
            `;
        }
    }, 1000);
});
