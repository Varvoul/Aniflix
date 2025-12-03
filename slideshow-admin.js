// Slideshow Management JavaScript

let postsData = [];
let slideshowPosts = [];
let slideshowSettings = {
    autoplayEnabled: true,
    slideInterval: 5,
    maxSlides: 10,
    transitionEffect: 'fade'
};

// Initialize Slideshow Management
document.addEventListener('DOMContentLoaded', function() {
    loadPostsData();
    loadSlideshowData();
    setupEventListeners();
    updateAvailablePosts();
});

// Load posts data
async function loadPostsData() {
    try {
        const response = await fetch('data/posts.json');
        const data = await response.json();
        postsData = data.posts || [];
    } catch (error) {
        // Error loading posts data
        showNotification('Error loading posts data', 'error');
    }
}

// Load slideshow data (from localStorage or default)
function loadSlideshowData() {
    const savedSlideshow = localStorage.getItem('quravel-slideshow');
    if (savedSlideshow) {
        const data = JSON.parse(savedSlideshow);
        slideshowPosts = data.posts || [];
        slideshowSettings = { ...slideshowSettings, ...data.settings };
    } else {
        // Default: use posts with isSlideshow flag
        slideshowPosts = postsData.filter(post => post.flags?.isSlideshow).slice(0, 5);
    }
    
    updateCurrentSlideshow();
    updateSettingsUI();
}

// Update current slideshow display
function updateCurrentSlideshow() {
    const container = document.getElementById('current-slideshow-posts');
    container.innerHTML = '';
    
    slideshowPosts.forEach((post, index) => {
        const slideCard = createSlideshowPostCard(post, index);
        container.appendChild(slideCard);
    });
    
    // Show empty state if no slides
    if (slideshowPosts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No slideshow posts selected. Add posts from the available posts below.</p>
            </div>
        `;
    }
}

// Create slideshow post card
function createSlideshowPostCard(post, index) {
    const card = document.createElement('div');
    card.className = 'slideshow-post-card';
    card.innerHTML = `
        <div class="post-image">
            <img src="${post.poster}" alt="${post.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <div class="post-overlay">
                <div class="post-order">${index + 1}</div>
                <button class="remove-btn" onclick="removeFromSlideshow('${post.id}')">&times;</button>
            </div>
        </div>
        <div class="post-info">
            <h3>${post.title}</h3>
            <p>${post.type} • ${post.category}</p>
            <div class="post-rating">⭐ ${post.rating || 'N/A'}</div>
        </div>
        <div class="post-actions">
            <button class="btn-small btn-up" onclick="moveSlideUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
            <button class="btn-small btn-down" onclick="moveSlideDown(${index})" ${index === slideshowPosts.length - 1 ? 'disabled' : ''}>↓</button>
        </div>
    `;
    return card;
}

// Update available posts display
function updateAvailablePosts() {
    const container = document.getElementById('available-posts-grid');
    container.innerHTML = '';
    
    const availablePosts = postsData.filter(post => 
        !slideshowPosts.some(slide => slide.id === post.id)
    );
    
    availablePosts.forEach(post => {
        const postCard = createAvailablePostCard(post);
        container.appendChild(postCard);
    });
}

// Create available post card
function createAvailablePostCard(post) {
    const card = document.createElement('div');
    card.className = 'available-post-card';
    card.innerHTML = `
        <div class="post-image">
            <img src="${post.poster}" alt="${post.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
        </div>
        <div class="post-info">
            <h3>${post.title}</h3>
            <p>${post.type} • ${post.category}</p>
            <div class="post-rating">⭐ ${post.rating || 'N/A'}</div>
            <div class="post-popularity">Popularity: ${post.popularity || 0}</div>
        </div>
        <button class="add-btn" onclick="addToSlideshow('${post.id}')">Add to Slideshow</button>
    `;
    return card;
}

// Add post to slideshow
function addToSlideshow(postId) {
    if (slideshowPosts.length >= slideshowSettings.maxSlides) {
        showNotification(`Maximum ${slideshowSettings.maxSlides} slides allowed`, 'error');
        return;
    }
    
    const post = postsData.find(p => p.id === postId);
    if (post) {
        slideshowPosts.push(post);
        updateCurrentSlideshow();
        updateAvailablePosts();
        showNotification(`${post.title} added to slideshow`, 'success');
    }
}

// Remove post from slideshow
function removeFromSlideshow(postId) {
    slideshowPosts = slideshowPosts.filter(p => p.id !== postId);
    updateCurrentSlideshow();
    updateAvailablePosts();
    showNotification('Post removed from slideshow', 'success');
}

// Move slide up
function moveSlideUp(index) {
    if (index > 0) {
        [slideshowPosts[index - 1], slideshowPosts[index]] = 
        [slideshowPosts[index], slideshowPosts[index - 1]];
        updateCurrentSlideshow();
    }
}

// Move slide down
function moveSlideDown(index) {
    if (index < slideshowPosts.length - 1) {
        [slideshowPosts[index + 1], slideshowPosts[index]] = 
        [slideshowPosts[index], slideshowPosts[index + 1]];
        updateCurrentSlideshow();
    }
}

// Filter posts
function filterPosts() {
    const searchTerm = document.getElementById('post-search').value.toLowerCase();
    const typeFilter = document.getElementById('type-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    let filteredPosts = postsData.filter(post => 
        !slideshowPosts.some(slide => slide.id === post.id)
    );
    
    // Apply search filter
    if (searchTerm) {
        filteredPosts = filteredPosts.filter(post =>
            post.title.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm) ||
            post.genres.some(genre => genre.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply type filter
    if (typeFilter) {
        filteredPosts = filteredPosts.filter(post => post.type === typeFilter);
    }
    
    // Apply sort
    filteredPosts.sort((a, b) => {
        switch (sortFilter) {
            case 'popularity':
                return (b.popularity || 0) - (a.popularity || 0);
            case 'dateAdded':
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            default:
                return a.title.localeCompare(b.title);
        }
    });
    
    // Update display
    const container = document.getElementById('available-posts-grid');
    container.innerHTML = '';
    
    filteredPosts.forEach(post => {
        const postCard = createAvailablePostCard(post);
        container.appendChild(postCard);
    });
}

// Update settings UI
function updateSettingsUI() {
    document.getElementById('autoplay-enabled').checked = slideshowSettings.autoplayEnabled;
    document.getElementById('slide-interval').value = slideshowSettings.slideInterval;
    document.getElementById('max-slides').value = slideshowSettings.maxSlides;
    document.getElementById('transition-effect').value = slideshowSettings.transitionEffect;
}

// Setup event listeners
function setupEventListeners() {
    // Settings change handlers
    document.getElementById('autoplay-enabled').addEventListener('change', function() {
        slideshowSettings.autoplayEnabled = this.checked;
    });
    
    document.getElementById('slide-interval').addEventListener('change', function() {
        slideshowSettings.slideInterval = parseInt(this.value);
    });
    
    document.getElementById('max-slides').addEventListener('change', function() {
        slideshowSettings.maxSlides = parseInt(this.value);
    });
    
    document.getElementById('transition-effect').addEventListener('change', function() {
        slideshowSettings.transitionEffect = this.value;
    });
}

// Save slideshow configuration
function saveSlideshow() {
    const slideshowData = {
        posts: slideshowPosts,
        settings: slideshowSettings,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('quravel-slideshow', JSON.stringify(slideshowData));
    showNotification('Slideshow configuration saved!', 'success');
}

// Preview slideshow
function previewSlideshow() {
    const modal = document.getElementById('slideshow-preview-modal');
    const container = document.getElementById('slideshow-preview-container');
    
    // Create slideshow preview
    container.innerHTML = createSlideshowHTML(slideshowPosts, slideshowSettings);
    
    modal.style.display = 'block';
}

// Close slideshow preview
function closeSlideshowPreview() {
    document.getElementById('slideshow-preview-modal').style.display = 'none';
}

// Create slideshow HTML
function createSlideshowHTML(posts, settings) {
    if (posts.length === 0) {
        return '<div class="empty-preview">No slideshow posts configured</div>';
    }
    
    const slides = posts.map((post, index) => `
        <div class="hero-slide ${index === 0 ? 'active' : ''}" data-slide="${index}">
            <div class="hero-background">
                <img src="${post.backdrop}" alt="${post.title}" onerror="this.style.display='none'">
                <div class="hero-overlay"></div>
            </div>
            <div class="hero-content">
                <div class="hero-info">
                    <h1 class="hero-title">${post.title}</h1>
                    <div class="hero-meta">
                        <span class="hero-rating">⭐ ${post.rating || 'N/A'}</span>
                        <span class="hero-year">${post.year}</span>
                        <span class="hero-duration">${post.duration}</span>
                    </div>
                    <p class="hero-description">${post.description || 'No description available.'}</p>
                    <div class="hero-actions">
                        <button class="btn btn-primary" onclick="alert('Play ${post.title}')">▶ Play Now</button>
                        <button class="btn btn-secondary" onclick="alert('More info about ${post.title}')">+ More Info</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    return `
        <div class="hero-carousel-preview" style="max-width: 100%; height: 400px; position: relative; overflow: hidden; border-radius: 12px;">
            ${slides}
            <div class="carousel-nav">
                <button class="nav-btn prev" onclick="previewSlide(-1)">‹</button>
                <button class="nav-btn next" onclick="previewSlide(1)">›</button>
            </div>
            <div class="carousel-indicators">
                ${posts.map((_, index) => `<button class="indicator ${index === 0 ? 'active' : ''}" onclick="previewSlideTo(${index})"></button>`).join('')}
            </div>
        </div>
        <script>
            let currentPreviewSlide = 0;
            function previewSlide(direction) {
                const slides = document.querySelectorAll('.hero-slide');
                slides[currentPreviewSlide].classList.remove('active');
                currentPreviewSlide = (currentPreviewSlide + direction + slides.length) % slides.length;
                slides[currentPreviewSlide].classList.add('active');
            }
            function previewSlideTo(index) {
                const slides = document.querySelectorAll('.hero-slide');
                slides[currentPreviewSlide].classList.remove('active');
                currentPreviewSlide = index;
                slides[currentPreviewSlide].classList.add('active');
            }
        </script>
    `;
}

// HTML Compose Mode
function toggleComposeMode() {
    const composer = document.getElementById('html-composer');
    const isVisible = composer.style.display !== 'none';
    
    if (!isVisible) {
        composer.style.display = 'block';
        if (!document.getElementById('html-editor').value) {
            document.getElementById('html-editor').value = generateHTMLTemplate();
        }
    } else {
        composer.style.display = 'none';
    }
}

// Switch composer tab
function switchComposerTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.composer-tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`html-${tab}-tab`).classList.add('active');
    
    if (tab === 'preview') {
        updateHTMLPreview();
    }
}

// Generate HTML template
function generateHTMLTemplate() {
    return `<!-- Quravel Slideshow Template -->
<div class="hero-carousel">
    {{#each slideshowPosts}}
    <div class="hero-slide {{#if @first}}active{{/if}}">
        <div class="hero-background">
            <img src="{{backdrop}}" alt="{{title}}">
            <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
            <div class="hero-info">
                <h1 class="hero-title">{{title}}</h1>
                <div class="hero-meta">
                    <span class="hero-rating">⭐ {{rating}}</span>
                    <span class="hero-year">{{year}}</span>
                    <span class="hero-duration">{{duration}}</span>
                </div>
                <p class="hero-description">{{description}}</p>
                <div class="hero-actions">
                    <button class="btn btn-primary" onclick="playContent('{{id}}')">▶ Play Now</button>
                    <button class="btn btn-secondary" onclick="showDetails('{{id}}')">+ More Info</button>
                </div>
            </div>
        </div>
    </div>
    {{/each}}
</div>`;
}

// Update HTML preview
function updateHTMLPreview() {
    const editor = document.getElementById('html-editor');
    const preview = document.getElementById('html-preview-content');
    
    // Simple preview - replace template variables
    let html = editor.value;
    if (slideshowPosts.length > 0) {
        const firstPost = slideshowPosts[0];
        html = html
            .replace(/{{title}}/g, firstPost.title)
            .replace(/{{rating}}/g, firstPost.rating || 'N/A')
            .replace(/{{year}}/g, firstPost.year)
            .replace(/{{duration}}/g, firstPost.duration)
            .replace(/{{description}}/g, firstPost.description || 'No description available.')
            .replace(/{{id}}/g, firstPost.id)
            .replace(/{{backdrop}}/g, firstPost.backdrop);
    }
    
    preview.innerHTML = html;
}

// Validate HTML
function validateHTML() {
    const editor = document.getElementById('html-editor');
    try {
        // Basic HTML validation - create a temporary element to test parsing
        const temp = document.createElement('div');
        temp.innerHTML = editor.value;
        
        if (temp.innerHTML !== editor.value) {
            throw new Error('Invalid HTML structure');
        }
        
        showNotification('HTML is valid!', 'success');
    } catch (error) {
        showNotification('HTML validation error: ' + error.message, 'error');
    }
}

// Apply HTML
function applyHTML() {
    const editor = document.getElementById('html-editor');
    
    // Save custom HTML to localStorage
    localStorage.setItem('quravel-custom-slideshow', editor.value);
    
    showNotification('Custom HTML applied!', 'success');
}

// Reset HTML
function resetHTML() {
    if (confirm('Reset to default HTML template?')) {
        document.getElementById('html-editor').value = generateHTMLTemplate();
        updateHTMLPreview();
        showNotification('HTML reset to template', 'info');
    }
}

// Show notification (reused from admin.js)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 3000;
                display: flex;
                align-items: center;
                gap: 1rem;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }
            .notification-success { background: #10b981; }
            .notification-error { background: #ef4444; }
            .notification-info { background: #3b82f6; }
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}