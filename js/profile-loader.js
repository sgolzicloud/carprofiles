/**
 * Car Profiles - Profile Loader
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
        showError('No car ID provided. Please use a valid link.');
        return;
    }

    try {
        // Show loading state
        profileContent.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';

        // Fetch car profile
        const carData = await fetchCarProfile(carId);

        // Validate car data
        if (!isValidCarProfile(carData)) {
            throw new Error('Invalid car profile data');
        }

        // Update page title
        document.title = `${carData.name} - Car Profile`;

        // Render profile
        profileContent.innerHTML = renderCarProfile(carData);

        // Initialize lazy loading for newly added images
        initializeLazyLoading();

    } catch (error) {
        console.error('Error loading car profile:', error);
        showError(`Failed to load car profile: ${error.message}`);
    }
}

/**
 * Render car profile HTML
 * @param {Object} carData - The car profile data
 * @returns {string} - The HTML string
 */
function renderCarProfile(carData) {
    const heroImageHtml = carData.heroImage ? 
        `<div class="profile-hero" style="background-image: url('${carData.heroImage}');"></div>` : '';

    const specsHtml = renderSpecsSection(carData.specs);
    const partsHtml = carData.parts && carData.parts.length > 0 ? 
        renderPartsSection(carData.parts) : '';
    const galleryHtml = carData.gallery && carData.gallery.length > 0 ? 
        renderGallerySection(carData.gallery) : '';
    const ownerHtml = renderOwnerSection(carData.owner);

    return `
        ${heroImageHtml}
        
        <div class="profile-header">
            <h1>${carData.name}</h1>
            <div class="profile-meta">
                <div class="meta-item">
                    <span>📅 Year:</span>
                    <strong>${carData.year}</strong>
                </div>
                ${carData.lastUpdated ? `
                    <div class="meta-item">
                        <span>🔄 Updated:</span>
                        <strong>${formatDate(carData.lastUpdated)}</strong>
                    </div>
                ` : ''}
            </div>
        </div>

        <div class="profile-description">
            <p>${carData.description}</p>
        </div>

        ${specsHtml}
        ${partsHtml}
        ${galleryHtml}
        ${ownerHtml}
    `;
}

/**
 * Render specifications section
 * @param {Object} specs - The specifications object
 * @returns {string} - The HTML string
 */
function renderSpecsSection(specs) {
    if (!specs || Object.keys(specs).length === 0) {
        return '';
    }

    let specsHtml = '<div class="specs-section"><h2>Performance Specifications</h2><div class="specs-grid">';

    for (const [key, value] of Object.entries(specs)) {
        const formatted = formatSpecValue(key, value);
        specsHtml += `
            <div class="spec-card">
                <h3>${formatted.label}</h3>
                <div class="spec-value">${formatted.value}</div>
            </div>
        `;
    }

    specsHtml += '</div></div>';
    return specsHtml;
}

/**
 * Render parts section
 * @param {Array} parts - The parts array
 * @returns {string} - The HTML string
 */
function renderPartsSection(parts) {
    if (!parts || parts.length === 0) {
        return '';
    }

    let partsHtml = '<div class="parts-section"><h2>Modifications & Parts</h2><div class="parts-list">';

    parts.forEach(part => {
        partsHtml += `
            <div class="part-item">
                <div class="part-category">${escapeHtml(part.category || 'Other')}</div>
                <div class="part-name">${escapeHtml(part.name)}</div>
                <div class="part-description">${escapeHtml(part.description || '')}</div>
            </div>
        `;
    });

    partsHtml += '</div></div>';
    return partsHtml;
}

/**
 * Render gallery section
 * @param {Array} gallery - The gallery array with image URLs
 * @returns {string} - The HTML string
 */
function renderGallerySection(gallery) {
    if (!gallery || gallery.length === 0) {
        return '';
    }

    let galleryHtml = '<div class="gallery-section"><h2>Photo Gallery</h2><div class="gallery-grid">';

    gallery.forEach((imagePath, index) => {
        const imageUrl = escapeHtml(imagePath);
        galleryHtml += `
            <div class="gallery-item" style="cursor: pointer;" data-index="${index}">
                <img 
                    src="${imageUrl}" 
                    alt="Gallery photo ${index + 1}"
                    loading="lazy"
                    data-src="${imageUrl}"
                />
            </div>
        `;
    });

    galleryHtml += '</div></div>';
    return galleryHtml;
}

/**
 * Render owner section
 * @param {Object} owner - The owner information
 * @returns {string} - The HTML string
 */
function renderOwnerSection(owner) {
    if (!owner) {
        return '';
    }

    let ownerHtml = '<div class="owner-section"><h2>Owner Information</h2><div class="owner-info">';

    if (owner.name) {
        ownerHtml += `
            <div class="owner-detail">
                <h3>👤 Owner</h3>
                <p>${escapeHtml(owner.name)}</p>
            </div>
        `;
    }

    if (owner.contact) {
        const isEmail = owner.contact.includes('@');
        const contactLink = isEmail ? 
            `<a href="mailto:${escapeHtml(owner.contact)}">${escapeHtml(owner.contact)}</a>` :
            escapeHtml(owner.contact);
        
        ownerHtml += `
            <div class="owner-detail">
                <h3>📞 Contact</h3>
                <p>${contactLink}</p>
            </div>
        `;
    }

    if (owner.location) {
        ownerHtml += `
            <div class="owner-detail">
                <h3>📍 Location</h3>
                <p>${escapeHtml(owner.location)}</p>
            </div>
        `;
    }

    ownerHtml += '</div></div>';
    return ownerHtml;
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

    // Optionally update error message
    const errorMessage = loadingError.querySelector('p');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}
