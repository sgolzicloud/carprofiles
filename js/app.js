/**
 * Car Profiles - Main Application Utilities
 * Provides common functions and utilities used across the application
 */

/**
 * Fetch a car profile by ID
 * @param {string} carId - The car ID to fetch
 * @returns {Promise<Object>} - The car profile data
 */
async function fetchCarProfile(carId) {
    try {
        const response = await fetch(`data/cars/${carId}.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch car profile: ${response.statusText}`);
        }
        
        const carData = await response.json();
        return carData;
    } catch (error) {
        console.error(`Error fetching car profile ${carId}:`, error);
        throw error;
    }
}

/**
 * Get URL query parameter by name
 * @param {string} name - The parameter name
 * @returns {string|null} - The parameter value or null
 */
function getQueryParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Format a spec value with proper units and formatting
 * @param {string} key - The spec key
 * @param {string} value - The spec value
 * @returns {Object} - Object with label and value
 */
function formatSpecValue(key, value) {
    const specLabels = {
        'horsepower': '⚡ Power',
        'torque': '🔧 Torque',
        'acceleration': '🏁 Acceleration',
        'topSpeed': '📍 Top Speed',
        'engineSize': '🔩 Engine',
        'fuelType': '⛽ Fuel',
        'transmission': '⚙️ Transmission'
    };

    return {
        label: specLabels[key] || key,
        value: value
    };
}

/**
 * Lazy load images
 * Initializes Intersection Observer for lazy loading images
 */
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

/**
 * Format date to a readable format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString + 'T00:00:00Z');
    return date.toLocaleDateString('en-US', options);
}

/**
 * Create a modal for displaying full-size images
 * @param {string} imageSrc - The image source URL
 * @param {string} imageAlt - The image alt text
 */
function createImageModal(imageSrc, imageAlt = '') {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <img src="${imageSrc}" alt="${imageAlt}" class="modal-image">
        </div>
    `;

    // Add styles for modal
    if (!document.querySelector('style[data-modal]')) {
        const style = document.createElement('style');
        style.setAttribute('data-modal', 'true');
        style.textContent = `
            .image-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
            }
            
            .modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: white;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .modal-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                width: 40px;
                height: 40px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 1001;
                transition: background 0.3s ease;
            }
            
            .modal-close:hover {
                background: rgba(0, 0, 0, 0.9);
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(modal);

    // Close modal handlers
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    closeBtn.addEventListener('click', () => modal.remove());
    overlay.addEventListener('click', () => modal.remove());

    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

/**
 * Validate car profile data
 * @param {Object} carData - The car profile data
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidCarProfile(carData) {
    const requiredFields = ['id', 'name', 'year', 'description', 'specs', 'owner'];
    
    for (const field of requiredFields) {
        if (!carData[field]) {
            console.error(`Missing required field: ${field}`);
            return false;
        }
    }

    return true;
}

/**
 * Handle navigation with smooth scrolling
 * @param {string} sectionId - The section ID to navigate to
 */
function navigateToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Initialize event delegation for dynamic content
 * Useful for handling events on elements added after page load
 */
function initializeEventDelegation() {
    // Event delegation for gallery items (if needed)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.gallery-item img')) {
            const img = e.target;
            createImageModal(img.src, img.alt);
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeLazyLoading();
    initializeEventDelegation();
});
