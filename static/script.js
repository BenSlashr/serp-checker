// Éléments DOM
const keywordsTextarea = document.getElementById('keywords');
const apiKeyInput = document.getElementById('apiKey');
const scrapeBtn = document.getElementById('scrapeBtn');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');
const progressText = document.getElementById('progressText');
const resultsContent = document.getElementById('resultsContent');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');
const errorMessage = document.getElementById('errorMessage');

// Variables globales
let currentResults = null;

// Événements
scrapeBtn.addEventListener('click', handleScrape);
downloadCsvBtn.addEventListener('click', () => downloadResults('csv'));
downloadJsonBtn.addEventListener('click', () => downloadResults('json'));

// Gestion du scraping
async function handleScrape() {
    const keywords = getKeywords();
    const apiKey = apiKeyInput.value.trim();
    
    if (!keywords.length) {
        showError('Veuillez saisir au moins un mot-clé.');
        return;
    }
    
    if (!apiKey) {
        showError('Veuillez saisir votre clé API ValueSerp.');
        return;
    }
    
    // Masquer les sections précédentes
    hideAllSections();
    
    // Afficher le chargement
    showLoading(keywords.length);
    
    try {
        // Appel à l'API
        const response = await fetch('/serp-checker/api/scrape-serp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                keywords: keywords,
                api_key: apiKey
            })
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        currentResults = data;
        
        // Afficher les résultats
        displayResults(data.results);
        showResults();
        
    } catch (error) {
        console.error('Erreur lors du scraping:', error);
        showError(`Erreur lors du scraping: ${error.message}`);
    }
}

// Récupération des mots-clés
function getKeywords() {
    const text = keywordsTextarea.value.trim();
    if (!text) return [];
    
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
}

// Affichage du chargement
function showLoading(totalKeywords) {
    loadingSection.classList.remove('hidden');
    progressText.textContent = `0 / ${totalKeywords} mots-clés traités`;
}

// Affichage des résultats
function displayResults(results) {
    resultsContent.innerHTML = '';
    
    if (!results || results.length === 0) {
        resultsContent.innerHTML = '<p>Aucun résultat trouvé.</p>';
        return;
    }
    
    results.forEach(result => {
        const resultCard = createResultCard(result);
        resultsContent.appendChild(resultCard);
    });
}

// Création d'une carte de résultat
function createResultCard(result) {
    const card = document.createElement('div');
    card.className = 'result-card';
    
    const title = document.createElement('h3');
    title.innerHTML = `<i class="fas fa-search"></i> ${escapeHtml(result.mot_cle)}`;
    
    const resultsList = document.createElement('div');
    
    if (result.error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'result-item';
        errorDiv.innerHTML = `
            <div style="color: var(--error-color);">
                <i class="fas fa-exclamation-triangle"></i>
                Erreur: ${escapeHtml(result.error)}
            </div>
        `;
        resultsList.appendChild(errorDiv);
    } else if (result.serp_results && result.serp_results.length > 0) {
        result.serp_results.forEach(serpResult => {
            const resultItem = createResultItem(serpResult);
            resultsList.appendChild(resultItem);
        });
    } else {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'result-item';
        noResultsDiv.innerHTML = '<p>Aucun résultat trouvé pour ce mot-clé.</p>';
        resultsList.appendChild(noResultsDiv);
    }
    
    card.appendChild(title);
    card.appendChild(resultsList);
    
    return card;
}

// Création d'un élément de résultat
function createResultItem(serpResult) {
    const item = document.createElement('div');
    item.className = 'result-item';
    
    const position = document.createElement('span');
    position.className = 'result-position';
    position.textContent = `Position ${serpResult.position}`;
    
    const title = document.createElement('div');
    title.className = 'result-title';
    title.textContent = serpResult.titre;
    
    const url = document.createElement('div');
    url.className = 'result-url';
    url.innerHTML = `<a href="${escapeHtml(serpResult.url)}" target="_blank">${escapeHtml(serpResult.url)}</a>`;
    
    const snippet = document.createElement('div');
    snippet.className = 'result-snippet';
    snippet.textContent = serpResult.snippet;
    
    const type = document.createElement('span');
    type.className = `result-type ${serpResult.type_resultat}`;
    type.textContent = serpResult.type_resultat;
    
    item.appendChild(position);
    item.appendChild(title);
    item.appendChild(url);
    item.appendChild(snippet);
    item.appendChild(type);
    
    return item;
}

// Téléchargement des résultats
async function downloadResults(format) {
    if (!currentResults) {
        showError('Aucun résultat à télécharger.');
        return;
    }
    
    try {
        const endpoint = format === 'csv' ? '/serp-checker/api/download-csv' : '/serp-checker/api/download-json';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentResults)
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Création et téléchargement du fichier
        const blob = new Blob([data.content], { type: data.content_type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = data.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        showError(`Erreur lors du téléchargement: ${error.message}`);
    }
}

// Affichage des erreurs
function showError(message) {
    errorMessage.textContent = message;
    hideAllSections();
    errorSection.classList.remove('hidden');
}

// Masquage de toutes les sections
function hideAllSections() {
    loadingSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    errorSection.classList.add('hidden');
}

// Affichage de la section résultats
function showResults() {
    loadingSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
}

// Échappement HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Validation en temps réel
keywordsTextarea.addEventListener('input', function() {
    const keywords = getKeywords();
    scrapeBtn.disabled = keywords.length === 0;
});

apiKeyInput.addEventListener('input', function() {
    const keywords = getKeywords();
    scrapeBtn.disabled = keywords.length === 0 || !this.value.trim();
});

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    scrapeBtn.disabled = true;
}); 