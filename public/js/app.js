document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navLinks = document.querySelectorAll('.nav-links a, .nav-menu a');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            const targetId = e.target.getAttribute('data-target');
            views.forEach(view => {
                view.classList.remove('active-view');
                if (view.id === targetId) {
                    view.classList.add('active-view');
                    if(targetId === 'history') {
                        loadHistory();
                    }
                }
            });
        });
    });

    // UI Toggles for Boolean Logic
    const boolOpSelect = document.getElementById('bool-op');
    const boolVarsGroup = document.getElementById('bool-vars-group');
    const boolExprGroup = document.getElementById('bool-expr-group');

    if(boolOpSelect) {
        boolOpSelect.addEventListener('change', (e) => {
            if (e.target.value === 'EXPRESSION') {
                boolVarsGroup.classList.add('hidden');
                boolExprGroup.classList.remove('hidden');
            } else if (e.target.value === 'NOT') {
                boolVarsGroup.classList.remove('hidden');
                boolExprGroup.classList.add('hidden');
                document.getElementById('bool-b').classList.add('hidden');
            } else {
                boolVarsGroup.classList.remove('hidden');
                boolExprGroup.classList.add('hidden');
                document.getElementById('bool-b').classList.remove('hidden');
            }
        });
    }

    // UI Toggles for Matrices
    const matrixOpSelect = document.getElementById('matrix-op');
    const matrixBContainer = document.getElementById('matrix-b-container');
    
    if(matrixOpSelect) {
        matrixOpSelect.addEventListener('change', (e) => {
            if (e.target.value === 'transpose') {
                matrixBContainer.classList.add('hidden');
            } else {
                matrixBContainer.classList.remove('hidden');
            }
        });
    }
});

// UI Helper Functions
function showResult(sectionId, htmlContent) {
    const resultDiv = document.getElementById(`${sectionId}-result`);
    const errorDiv = document.getElementById(`${sectionId}-error`);
    
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    
    setTimeout(() => {
        resultDiv.innerHTML = htmlContent;
        resultDiv.classList.remove('hidden');
        
        const preElements = resultDiv.querySelectorAll('pre');
        preElements.forEach((pre, index) => {
            pre.style.opacity = '0';
            pre.style.transform = 'translateY(10px)';
            pre.style.transition = 'all 0.5s ease ' + (0.2 + (index * 0.2)) + 's';
            
            setTimeout(() => {
                pre.style.opacity = '1';
                pre.style.transform = 'translateY(0)';
            }, 50);
        });
    }, 50);
}

function showError(sectionId, message) {
    const resultDiv = document.getElementById(`${sectionId}-result`);
    const errorDiv = document.getElementById(`${sectionId}-error`);
    
    errorDiv.innerHTML = `<p>> <strong>SYSTEM ALERT:</strong> ${message}</p>`;
    errorDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
}
