// Main JavaScript for Quravel

class QuravelApp {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.carousel-item');
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.postsData = [];
        this.slideshowPosts = [];
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupCarousel();
        this.setupSearch();
        this.populateContent();
        this.setupNavigation();
        this.setupScrollEffects();
        this.startAutoPlay();
    }

    // Load data from JSON files
    async loadData() {
        try {
            // Load posts data
            const postsResponse = await fetch('data/posts.json');
            const postsData = await postsResponse.json();
            this.postsData = postsData.posts || [];
            
            // Load slideshow configuration
            const slideshowResponse = localStorage.getItem('quravel-slideshow');
            if (slideshowResponse) {
                const slideshowData = JSON.parse(slideshowResponse);
                this.slideshowPosts = slideshowData.posts || [];
            } else {
                // Default: use posts with isSlideshow flag
                this.slideshowPosts = this.postsData.filter(post => post.flags?.isSlideshow).slice(0, 10);
            }
            
            // Data loaded successfully
        } catch (error) {
            // Error loading data - using fallback empty arrays
            // Fallback to empty arrays
            this.postsData = [];
            this.slideshowPosts = [];
        }
    }

    // Hero Carousel Functionality
    setupCarousel() {
        // This function will be called by updateHeroCarousel
        // No setup needed here as slides are dynamically created
    }

    setupSlideControls() {
        // Remove existing controls
        const heroSlider = document.getElementById('hero-slider');
        if (!heroSlider) return;
        
        // Add arrow controls if they don't exist
        if (!heroSlider.querySelector('.slide-arrow')) {
            const arrowControls = document.createElement('div');
            arrowControls.className = 'slide-arrows';
            arrowControls.innerHTML = `
                <button class="slide-arrow slide-prev" onclick="app.previousSlide()">‹</button>
                <button class="slide-arrow slide-next" onclick="app.nextSlide()">›</button>
            `;
            heroSlider.appendChild(arrowControls);
        }
        
        // Setup touch/swipe controls
        this.setupTouchControls();
        
        // Start auto-play if enabled
        this.startAutoPlay();
    }

    setupTouchControls() {
        const heroSlider = document.getElementById('hero-slider');
        if (!heroSlider) return;
        
        let startX = 0;
        let endX = 0;

        heroSlider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        heroSlider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
                this.resetAutoPlay();
            }
        });
    }

    showSlide(index) {
        // Hide all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Show current slide
        if (this.slides[index]) {
            this.slides[index].classList.add('active');
        }
        
        this.currentSlide = index;
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(this.currentSlide);
    }

    previousSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(this.currentSlide);
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }

    // Search Functionality
    setupSearch() {
        const searchBtn = document.getElementById('searchBtn');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');

        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            searchInput.focus();
        });

        searchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
        });

        // Close search on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
            }
        });

        // Close search when clicking outside
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
            }
        });

        // Search functionality (placeholder)
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 2) {
                this.performSearch(query);
            }
        });
    }

    performSearch(query) {
        // Placeholder search functionality
        // In a real app, this would make API calls to search for content
    }

    // Content Population
    populateContent() {
        this.populateTrending();
        this.populateLatestMovies();
        this.populateLatestTVShows();
        this.populateLatestAnime();
        this.populateRecommendation();
        this.updateHeroCarousel();
    }

    populateTrending() {
        const container = document.getElementById('trending');
        const trending = this.getTrendingData();
        container.innerHTML = trending.map(item => this.createContentCard(item)).join('');
    }

    populateLatestMovies() {
        const container = document.getElementById('latestMovies');
        const movies = this.getLatestMovieData();
        container.innerHTML = movies.map(movie => this.createContentCard(movie)).join('');
    }

    populateLatestTVShows() {
        const container = document.getElementById('latestTVShows');
        const tvShows = this.getLatestTVShowData();
        container.innerHTML = tvShows.map(show => this.createContentCard(show)).join('');
    }

    populateLatestAnime() {
        const container = document.getElementById('latestAnime');
        const anime = this.getLatestAnimeData();
        container.innerHTML = anime.map(anime => this.createContentCard(anime)).join('');
    }

    populateRecommendation() {
        const container = document.getElementById('recommendation');
        const recommendations = this.getRecommendationData();
        container.innerHTML = recommendations.map(item => this.createContentCard(item)).join('');
    }

    // Dynamic Data Functions
    getTrendingData() {
        return this.postsData
            .filter(post => post.flags?.isTopAiring)
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 6);
    }

    getLatestMovieData() {
        return this.postsData
            .filter(post => post.type === 'movie' && post.flags?.isLatestMovie)
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 6);
    }

    getLatestTVShowData() {
        return this.postsData
            .filter(post => post.type === 'tv-show')
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 6);
    }

    getLatestAnimeData() {
        return this.postsData
            .filter(post => post.type === 'anime')
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, 6);
    }

    getRecommendationData() {
        return this.postsData
            .filter(post => post.flags?.isRecommended)
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
            .slice(0, 6);
    }

    // Update Hero Carousel with dynamic content
    updateHeroCarousel() {
        const slidesContainer = document.querySelector('.slider-container');
        if (!slidesContainer || this.slideshowPosts.length === 0) return;

        // Clear existing slides except the first one as fallback
        slidesContainer.innerHTML = '';

        // Create new slides from slideshow posts
        this.slideshowPosts.forEach((post, index) => {
            const slide = this.createHeroSlide(post, index === 0);
            slidesContainer.appendChild(slide);
        });

        // Update carousel references
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        
        // Setup slide controls for the current homepage structure
        this.setupSlideControls();
    }

    createHeroSlide(post, isActive = false) {
        const slide = document.createElement('div');
        slide.className = `slide ${isActive ? 'active' : ''}`;
        slide.style.backgroundImage = `url('${post.backdrop || post.poster}')`;
        
        slide.innerHTML = `
            <div class="slide-overlay"></div>
            <div class="slide-content">
                <h1 class="slide-title">${post.title}</h1>
                <div class="slide-meta">
                    <span class="imdb-badge">${post.rating || 'N/A'}</span>
                    <span class="badge hd">${post.quality || 'HD'}</span>
                    <span class="rating-badge">${post.contentRating || 'PG-13'}</span>
                    <span>${post.duration || post.episodeLength || '120m'}</span>
                    <span>${post.year}</span>
                </div>
                <div class="action-buttons">
                    <a class="btn-primary" href="#" data-title="${post.title}">
                        <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Watch Now
                    </a>
                    <div class="add-list-dropdown">
                        <button class="btn-add-list" data-title="${post.title}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Add to List
                        </button>
                        <div class="dropdown-content">
                            <a href="#" data-status="planning">Planning to watch</a>
                            <a href="#" data-status="watching">Watching</a>
                            <a href="#" data-status="completed">Completed</a>
                            <a href="#" data-status="remove">Remove from the list</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return slide;
    }

    createContentCard(item) {
        return `
            <div class="content-card" data-id="${item.id}">
                <img src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                <div class="card-badge ${this.getQualityClass(item.rating)}">${this.getQualityLabel(item.rating)}</div>
                <div class="play-overlay">
                    <div class="play-icon">▶</div>
                </div>
                <div class="card-overlay">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        <span>${item.year}</span>
                        <span>★ ${item.rating || 'N/A'}</span>
                        <span>${item.type}</span>
                    </div>
                </div>
            </div>
        `;
    }

    getQualityClass(rating) {
        if (!rating) return 'hd';
        if (rating >= 8.5) return 'uhd';
        if (rating >= 7.5) return '4k';
        if (rating >= 6.5) return 'hd';
        return 'sd';
    }

    getQualityLabel(rating) {
        if (!rating) return 'HD';
        if (rating >= 8.5) return 'UHD';
        if (rating >= 7.5) return '4K';
        if (rating >= 6.5) return 'HD';
        return 'SD';
    }



    // Navigation and UI Effects
    setupNavigation() {
        // Add click handlers for content cards
        document.addEventListener('click', (e) => {
            const contentCard = e.target.closest('.content-card');
            if (contentCard) {
                const contentId = contentCard.dataset.id;
                this.handleContentClick(contentId);
            }
        });

        // Header scroll effect
        this.setupHeaderScrollEffect();
    }

    handleContentClick(contentId) {
        // Navigate to content details page
        window.location.href = `post-details.html?id=${contentId}`;
    }

    setupHeaderScrollEffect() {
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                header.style.background = 'rgba(0, 0, 0, 0.7)';
            }

            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    setupScrollEffects() {
        // Smooth scroll for content rows
        const contentRows = document.querySelectorAll('.content-row');
        
        contentRows.forEach(row => {
            let isScrolling = false;

            row.addEventListener('wheel', (e) => {
                if (!isScrolling) {
                    isScrolling = true;
                    e.preventDefault();
                    
                    const scrollAmount = row.clientWidth * 0.8;
                    const direction = e.deltaY > 0 ? 1 : -1;
                    
                    row.scrollBy({
                        left: scrollAmount * direction,
                        behavior: 'smooth'
                    });

                    setTimeout(() => {
                        isScrolling = false;
                    }, 500);
                }
            });
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
function optimizeImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main app
    window.app = new QuravelApp();
    
    // Setup performance optimizations
    optimizeImages();
    
    // Add loading states
    const contentRows = document.querySelectorAll('.content-row');
    contentRows.forEach(row => {
        row.classList.add('loading');
        setTimeout(() => {
            row.classList.remove('loading');
        }, 1000);
    });

    // Add intersection observer for animations
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.content-section').forEach(section => {
            animationObserver.observe(section);
        });
    }

    // Quravel App initialized successfully
});

// Global function for hero button navigation
function goToDetails(contentId) {
    window.location.href = `post-details.html?id=${contentId}`;
}

function goToStreaming(contentId) {
    window.location.href = `streaming.html?id=${contentId}`;
}