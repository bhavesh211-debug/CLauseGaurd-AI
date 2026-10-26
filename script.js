const analyzeBtn = document.getElementById('analyze-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const inputField = document.getElementById('tc-input');
const errorMsg = document.getElementById('error-msg');
const resultsContainer = document.getElementById('results-container');

const redFlagsList = document.getElementById('red-flags-list');
const keyPointsList = document.getElementById('key-points-list');
const keywordsList = document.getElementById('keywords-list');

analyzeBtn.addEventListener('click', async function() {
    const rawInput = inputField.value.trim();

    if (rawInput === "" || !rawInput.startsWith("http")) {
        errorMsg.style.display = "block";
        resultsContainer.style.display = "none";
        return;
    }

    errorMsg.style.display = "none";
    
    // Show Loading State
    btnText.textContent = "Scraping & Analyzing URL...";
    btnSpinner.style.display = "inline-block";
    analyzeBtn.disabled = true;

    try {
        // When backend is ready, point this to your teammate's API endpoint
        const API_URL = "http://YOUR-LAPTOP-IP:8000";

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: rawInput }) // Sending the URL to the backend
        });

        if (!response.ok) {
            throw new Error("Failed to process the URL.");
        }

        const aiData = await response.json(); 
        renderResults(aiData);

    } catch (error) {
        // --- TEMPORARY SIMULATION FALLBACK ---
        const simulatedData = {
            red_flags: [
                "Ambiguous termination clause",
                "Data collection practices are not clearly disclosed"
            ],
            key_points: [
                "Users can request data deletion at any time.",
                "Cancellation policy is subject to change with 30 days notice."
            ],
            keywords: ["#DataPrivacy", "#CancellationPolicy", "#Transparency"]
        };
        renderResults(simulatedData);
        
        // --- ADD THESE THREE LINES TO FIX THE STUCK BUTTON ---
        btnText.textContent = "Analyze Terms";
        btnSpinner.style.display = "none";
        analyzeBtn.disabled = false;
        
        return;
    }

    // Reset Button State (for real backend response)
    btnText.textContent = "Analyze Terms";
    btnSpinner.style.display = "none";
    analyzeBtn.disabled = false;
});

function renderResults(data) {
    redFlagsList.innerHTML = "";
    keyPointsList.innerHTML = "";
    keywordsList.innerHTML = "";

    data.red_flags.forEach(flag => {
        const li = document.createElement('li');
        li.textContent = flag;
        redFlagsList.appendChild(li);
    });

    data.key_points.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point;
        keyPointsList.appendChild(li);
    });

    data.keywords.forEach(tag => {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = tag;
        keywordsList.appendChild(badge);
    });

    resultsContainer.style.display = "block";
}