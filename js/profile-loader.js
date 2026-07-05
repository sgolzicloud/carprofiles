/**
 * Car Profiles - Profile Loader (German)
 * Handles loading and rendering individual car profiles
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadCarProfile();
});

/**
 * Load and render the car profile based on URL parameter
 */
async function loadCarProfile() {
    const carId = getQueryParameter('id');
    const profileContent = document.getElementById('profile-content');
    const loadingError = document.getElementById('loading-error');

    if (!carId) {
        showError('Keine Auto-ID bereitgestellt. Bitte nutzen Sie einen gültigen Link.');
        return;
    }

    try {
        // Show loading state
        profileContent.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

        // Fetch car profile
        const carData = await fetchCarProfile(carId);

        // Validate car data
        if (!isValidCarProfile(carData)) {
            throw new Error('Ungültige Autoprofiledaten');
        }

        // Update page title
        document.title = `${carData.brand} ${carData.model} - Auto Profil`;

        // Render profile
        profileContent.innerHTML = renderCarProfile(carData);

    } catch (error) {
        console.error('Fehler beim Laden des Autoprofils:', error);
        showError(`Fehler beim Laden des Autoprofils: ${error.message}`);
    }
}

/**
 * Render car profile HTML
 * @param {Object} carData - The car profile data
 * @returns {string} - The HTML string
 */
function renderCarProfile(carData) {
    const performanceHtml = renderPerformanceSection(carData);
    const modificationsHtml = carData.modifications && carData.modifications.length > 0 ? 
        renderModificationsSection(carData.modifications) : 
        '<div class="modifications-section"><h2>Modifikationen</h2><div class="empty-state"><p class="empty-state-text">Noch keine Modifikationen hinzugefügt.</p></div></div>';

    return `
        <div class="profile-header">
            <h1>${escapeHtml(carData.brand)} ${escapeHtml(carData.model)}</h1>
            ${carData.subtitle ? `<div class="profile-subtitle">${escapeHtml(carData.subtitle)}</div>` : ''}
            
            <div class="profile-info-grid">
                ${carData.yearManufactured ? `
                    <div class="info-item">
                        <div class="info-item-label">Hergestellt</div>
                        <div class="info-item-value">${escapeHtml(carData.yearManufactured)}</div>
                    </div>
                ` : ''}
                
                ${carData.ownedSince ? `
                    <div class="info-item">
                        <div class="info-item-label">Besitzer seit</div>
                        <div class="info-item-value">${escapeHtml(carData.ownedSince)}</div>
                    </div>
                ` : ''}
                
                ${carData.performance?.ps ? `
                    <div class="info-item">
                        <div class="info-item-label">Leistung</div>
                        <div class="info-item-value">${escapeHtml(carData.performance.ps)}<span class="info-item-unit"> PS</span></div>
                    </div>
                ` : ''}
                
                ${carData.performance?.kw ? `
                    <div class="info-item">
                        <div class="info-item-label">Leistung</div>
                        <div class="info-item-value">${escapeHtml(carData.performance.kw)}<span class="info-item-unit"> KW</span></div>
                    </div>
                ` : ''}
            </div>

            ${carData.instagram ? `
                <div class="social-links">
                    <a href="https://instagram.com/${escapeHtml(carData.instagram)}" target="_blank" rel="noopener noreferrer" class="social-link">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.149-4.771-1.699-4.919-4.92-.058-1.266-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.646-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.015-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z"/>
                            <circle cx="12" cy="12" r="3.305"/>
                            <path d="M5.927 7.727a1.527 1.527 0 1 0 3.053 0 1.527 1.527 0 0 0-3.053 0"/>
                        </svg>
                        Instagram
                    </a>
                </div>
            ` : ''}
        </div>

        ${performanceHtml}
        ${modificationsHtml}
    `;
}

/**
 * Render performance section
 * @param {Object} carData - The car profile data
 * @returns {string} - The HTML string
 */
function renderPerformanceSection(carData) {
    if (!carData.performance || Object.keys(carData.performance).length === 0) {
        return '';
    }

    let html = '<div class="modifications-section"><h2>Leistung</h2><div class="profile-info-grid">';

    const performanceLabels = {
        'ps': 'PS',
        'kw': 'KW',
        'torque': 'Drehmoment',
        'acceleration': 'Beschleunigung',
        'topSpeed': 'Höchstgeschwindigkeit'
    };

    for (const [key, value] of Object.entries(carData.performance)) {
        if (key !== 'ps' && key !== 'kw') { // These are already in header
            const label = performanceLabels[key] || key;
            html += `
                <div class="info-item">
                    <div class="info-item-label">${label}</div>
                    <div class="info-item-value">${escapeHtml(value)}</div>
                </div>
            `;
        }
    }

    html += '</div></div>';
    return html;
}

/**
 * Render modifications section
 * @param {Array} modifications - The modifications array
 * @returns {string} - The HTML string
 */
function renderModificationsSection(modifications) {
    if (!modifications || modifications.length === 0) {
        return '<div class="modifications-section"><h2>Modifikationen</h2><div class="empty-state"><p class="empty-state-text">Noch keine Modifikationen hinzugefügt.</p></div></div>';
    }

    let html = '<div class="modifications-section"><h2>Modifikationen</h2><div class="modifications-list">';

    modifications.forEach(mod => {
        html += `
            <div class="modification-item">
                ${mod.category ? `<div class="modification-category">${escapeHtml(mod.category)}</div>` : ''}
                <div class="modification-name">${escapeHtml(mod.name)}</div>
                ${mod.description ? `<div class="modification-description">${escapeHtml(mod.description)}</div>` : ''}
            </div>
        `;
    });

    html += '</div></div>';
    return html;
}

/**
 * Escape HTML special characters
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
function escapeHtml(text) {
    if (typeof text !== 'string') {
        return '';
    }

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Show error message
 * @param {string} message - The error message
 */
function showError(message) {
    const profileContent = document.getElementById('profile-content');
    const loadingError = document.getElementById('loading-error');

    profileContent.style.display = 'none';
    loadingError.style.display = 'block';

    const errorMessage = loadingError.querySelector('p');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}
