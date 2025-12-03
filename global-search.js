/**
 * Global Search Component for Quravel Streaming Platform
 * Multi-language search with genre and year filtering
 * Modern design with centered popup and image suggestions
 */

class GlobalSearch {
    constructor(options = {}) {
        // Configuration options
        this.config = {
            dataUrl: options.dataUrl || 'data/posts.json',
            searchIcon: options.searchIcon || 'searchIcon',
            searchBox: options.searchBox || 'searchBox',
            searchInput: options.searchInput || 'searchInput',
            filterBtn: options.filterBtn || 'filterBtn',
            filterDropdown: options.filterDropdown || 'filterDropdown',
            resultsContainer: options.resultsContainer || 'resultsContainer',
            resultsGrid: options.resultsGrid || 'resultsGrid',
            resultsCount: options.resultsCount || 'resultsCount',
            maxSuggestions: options.maxSuggestions || 8,
            debounceDelay: options.debounceDelay || 300,
            maxResults: options.maxResults || 50,
            placeholderImage: options.placeholderImage || 'https://via.placeholder.com/60x90/333/fff?text=No+Image',
            ...options
        };

        // Component state
        this.allPosts = [];
        this.isLoaded = false;
        this.searchCache = new Map();
        this.currentSearch = '';
        this.selectedGenres = new Set();
        this.debounceTimer = null;
        this.suggestionsVisible = false;

        // Initialize the component
        this.init();
    }

    /**
     * Initialize the global search component
     */
    async init() {
        await this.loadContent();
        this.setupUI();
        this.setupEventListeners();
        this.injectStyles();
        console.log('🔍 Global Search Component initialized');
    }

    /**
     * Load all content from the data source
     */
    async loadContent() {
        try {
            const response = await fetch(this.config.dataUrl);
            const data = await response.json();
            this.allPosts = data.posts || [];
            this.isLoaded = true;
            console.log(`✅ Loaded ${this.allPosts.length} posts for search`);
            
            // Build search index for faster lookups
            this.buildSearchIndex();
            
        } catch (error) {
            console.error('❌ Error loading search content:', error);
            this.handleLoadError(error);
        }
    }

    /**
     * Build search index for faster lookups
     */
    buildSearchIndex() {
        this.searchIndex = this.allPosts.map((post, index) => ({
            ...post,
            searchableTitles: this.getSearchableTitles(post),
            normalizedYear: post.year ? post.year.toString() : '',
            genres: post.genres || []
        }));
    }

    /**
     * Get all searchable titles for a post
     */
    getSearchableTitles(post) {
        const titles = [];
        if (post.title) titles.push(post.title.toLowerCase());
        if (post.title_en) titles.push(post.title_en.toLowerCase());
        if (post.title_jp) titles.push(post.title_jp.toLowerCase());
        if (post.alternative_titles && Array.isArray(post.alternative_titles)) {
            post.alternative_titles.forEach(title => {
                if (title) titles.push(title.toLowerCase());
            });
        }
        return titles;
    }

    /**
     * Set up the UI components
     */
    setupUI() {
        // Create search overlay if not exists
        if (!document.getElementById('searchOverlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'searchOverlay';
            overlay.className = 'search-overlay';
            document.body.appendChild(overlay);
        }

        // Initialize genre checkboxes if filter dropdown exists
        this.initializeGenres();
    }

    /**
     * Initialize genre checkboxes
     */
    initializeGenres() {
        const genreGrid = document.querySelector('.genre-grid');
        if (!genreGrid) return;

        const genres = [
            "Action", "Adventure", "Thriller", "Drama", "Anime", "Animation", "Biography",
            "Comedy", "Costume", "Crime", "Documentary", "Family", "Fantasy", "Film-Noir",
            "Game-Show", "History", "Horror", "Kungfu", "Music", "Musical", "Mystery",
            "News", "Reality", "Reality-TV", "Romance", "Sci-Fi", "Short", "Sport",
            "Talk", "Talk-Show", "TV Movie", "TV Show", "War", "War & Politics", "Western"
        ];

        genreGrid.innerHTML = genres.map(genre => `
            <label class="genre-label">
                <input type="checkbox" value="${genre}">
                ${genre}
            </label>
        `).join('');

        // Add event listeners for genre checkboxes
        genreGrid.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                if (e.target.checked) {
                    this.selectedGenres.add(e.target.value);
                } else {
                    this.selectedGenres.delete(e.target.value);
                }
                this.updateActiveFilters();
                this.performSearch();
            }
        });
    }

    /**
     * Set up event listeners for search functionality
     */
    setupEventListeners() {
        // Search icon click
        const searchIcon = document.getElementById(this.config.searchIcon);
        if (searchIcon) {
            searchIcon.addEventListener('click', (e) => {
                this.openSearchBox();
                e.stopPropagation();
            });
        }

        // Close button
        const searchClose = document.getElementById('searchClose');
        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearchBox());
        }

        // Overlay click
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay) {
            searchOverlay.addEventListener('click', () => this.closeSearchBox());
        }

        // Filter button
        const filterBtn = document.getElementById(this.config.filterBtn);
        if (filterBtn) {
            filterBtn.addEventListener('click', (e) => {
                this.toggleFilterDropdown();
                e.stopPropagation();
            });
        }

        // Search input with debounce
        const searchInput = document.getElementById(this.config.searchInput);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value);
            });

            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }

        // Clear filters button
        const clearBtn = document.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Apply filters button
        const applyBtn = document.querySelector('.apply-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+K or Cmd+K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearchBox();
            }
            // Escape to close search
            if (e.key === 'Escape') {
                this.closeSearchBox();
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            this.handleOutsideClick(e);
        });
    }

    /**
     * Handle search input with debounce
     */
    handleSearchInput(value) {
        this.currentSearch = value.trim();
        
        clearTimeout(this.debounceTimer);
        
        if (this.currentSearch.length > 0) {
            this.debounceTimer = setTimeout(() => {
                this.showSuggestions(this.currentSearch);
            }, this.config.debounceDelay);
        } else {
            this.hideSuggestions();
        }
    }

    /**
     * Open the search box
     */
    openSearchBox() {
        const searchBox = document.getElementById(this.config.searchBox);
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById(this.config.searchInput);

        if (searchBox) {
            searchBox.style.display = 'block';
            searchOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Focus input after animation
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }

    /**
     * Close the search box
     */
    closeSearchBox() {
        const searchBox = document.getElementById(this.config.searchBox);
        const searchOverlay = document.getElementById('searchOverlay');
        const filterDropdown = document.getElementById(this.config.filterDropdown);

        if (searchBox) {
            searchBox.style.display = 'none';
            searchOverlay.style.display = 'none';
            document.body.style.overflow = '';
            
            if (filterDropdown) {
                filterDropdown.style.display = 'none';
            }
            
            this.hideSuggestions();
        }
    }

    /**
     * Toggle filter dropdown
     */
    toggleFilterDropdown() {
        const filterDropdown = document.getElementById(this.config.filterDropdown);
        if (filterDropdown) {
            filterDropdown.style.display = 
                filterDropdown.style.display === 'block' ? 'none' : 'block';
        }
    }

    /**
     * Show search suggestions
     */
    showSuggestions(searchTerm) {
        if (!this.isLoaded || searchTerm.length < 1) {
            this.hideSuggestions();
            return;
        }

        // Filter posts for suggestions
        const suggestions = this.searchIndex.filter(post => {
            return post.searchableTitles.some(title => 
                title.includes(searchTerm.toLowerCase())
            );
        }).slice(0, this.config.maxSuggestions);

        this.displaySuggestions(suggestions, searchTerm);
    }

    /**
     * Display search suggestions with correct images
     */
    displaySuggestions(suggestions, searchTerm) {
        const suggestionsEl = document.getElementById('suggestions');
        if (!suggestionsEl) return;

        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestionsEl.innerHTML = suggestions.map(post => {
            // Use actual poster image from data, fallback to placeholder
            const posterImage = post.poster || this.config.placeholderImage;
            
            return `
                <div class="suggestion-item" data-id="${post.id}">
                    <img src="${posterImage}" 
                         alt="${post.title}" 
                         class="suggestion-image"
                         onerror="this.onerror=null; this.src='${this.config.placeholderImage}'">
                    <div class="suggestion-details">
                        <div class="suggestion-title">${this.highlightText(post.title, searchTerm)}</div>
                        <div class="suggestion-meta">
                            <span>${post.type || 'Unknown'}</span>
                            <span>•</span>
                            <span>${post.year || '?'}</span>
                            ${post.duration ? `<span>•</span><span>${post.duration}</span>` : ''}
                        </div>
                        <div class="suggestion-genres">
                            ${(post.genres || []).slice(0, 2).map(g => 
                                `<span class="suggestion-genre">${g}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        suggestionsEl.style.display = 'block';
        this.suggestionsVisible = true;

        // Add click handlers
        suggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const postId = item.dataset.id;
                const searchInput = document.getElementById(this.config.searchInput);
                if (searchInput) {
                    const post = suggestions.find(p => p.id == postId);
                    if (post) {
                        searchInput.value = post.title;
                    }
                }
                this.hideSuggestions();
                this.performSearch();
            });
        });
    }

    /**
     * Hide search suggestions
     */
    hideSuggestions() {
        const suggestionsEl = document.getElementById('suggestions');
        if (suggestionsEl) {
            suggestionsEl.style.display = 'none';
            this.suggestionsVisible = false;
        }
    }

    /**
     * Highlight search terms in text
     */
    highlightText(text, searchTerm) {
        if (!text || !searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * Perform the main search
     */
    performSearch() {
        if (!this.isLoaded) return;

        const searchTerm = this.currentSearch.toLowerCase();
        const selectedGenres = Array.from(this.selectedGenres);

        // Filter posts
        let results = this.searchIndex.filter(post => {
            // Title match
            const titleMatch = !searchTerm || post.searchableTitles.some(title => 
                title.includes(searchTerm)
            );
            
            // Genre match
            const genreMatch = selectedGenres.length === 0 || 
                selectedGenres.some(genre => post.genres.includes(genre));
            
            return titleMatch && genreMatch;
        });

        // Display results
        this.displayResults(results.slice(0, this.config.maxResults));
        this.hideSuggestions();
    }

    /**
     * Display search results
     */
    displayResults(results) {
        const resultsContainer = document.getElementById(this.config.resultsContainer);
        const resultsGrid = document.getElementById(this.config.resultsGrid);
        const resultsCount = document.getElementById(this.config.resultsCount);

        if (!resultsContainer || !resultsGrid) return;

        // Update results count
        if (resultsCount) {
            resultsCount.textContent = results.length;
        }

        // Display results
        if (results.length === 0) {
            resultsGrid.innerHTML = this.getNoResultsHTML();
        } else {
            resultsGrid.innerHTML = results.map(post => this.getResultCardHTML(post)).join('');
            this.attachResultClickHandlers();
        }

        // Show results container with animation
        resultsContainer.style.display = 'block';
        setTimeout(() => {
            resultsContainer.style.opacity = '1';
            resultsContainer.style.transform = 'translateY(0)';
        }, 10);

        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Get HTML for no results state
     */
    getNoResultsHTML() {
        return `
            <div class="no-results">
                <svg viewBox="0 0 24 24" style="width: 64px; height: 64px; fill: #666; margin-bottom: 20px;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <h3>No results found</h3>
                <p>Try different search terms or adjust your filters</p>
                <button class="clear-all-btn" onclick="globalSearch.clearFilters()">Clear All Filters</button>
            </div>
        `;
    }

    /**
     * Get HTML for result card with correct image
     */
    getResultCardHTML(post) {
        // Use actual poster image from data, fallback to placeholder
        const posterImage = post.poster || this.config.placeholderImage;
        
        return `
            <a href="post-details.html?id=${post.id}" class="result-card" data-id="${post.id}">
                <div class="result-image">
                    <img src="${posterImage}" 
                         alt="${post.title}"
                         onerror="this.onerror=null; this.src='${this.config.placeholderImage}'">
                    <div class="result-type">${post.type || 'Unknown'}</div>
                </div>
                <div class="result-info">
                    <div class="result-title">${post.title}</div>
                    <div class="result-meta">
                        <span>${post.year || '?'}</span>
                        ${post.duration ? `<span>•</span><span>${post.duration}</span>` : ''}
                        <span>•</span>
                        <span class="result-rating">★ ${post.rating || 'N/A'}</span>
                    </div>
                    <div class="result-genres">
                        ${(post.genres || []).slice(0, 3).map(genre => 
                            `<span class="result-genre">${genre}</span>`
                        ).join('')}
                    </div>
                    ${post.description ? `<div class="result-description">${post.description.substring(0, 100)}...</div>` : ''}
                </div>
            </a>
        `;
    }

    /**
     * Update active filters display
     */
    updateActiveFilters() {
        const activeFiltersEl = document.getElementById('activeFilters');
        if (!activeFiltersEl) return;

        if (this.selectedGenres.size === 0) {
            activeFiltersEl.innerHTML = '';
            return;
        }

        activeFiltersEl.innerHTML = Array.from(this.selectedGenres).map(genre => `
            <div class="filter-tag">
                ${genre}
                <span class="remove-filter" data-genre="${genre}">×</span>
            </div>
        `).join('');

        // Add remove handlers
        activeFiltersEl.querySelectorAll('.remove-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const genre = btn.dataset.genre;
                this.selectedGenres.delete(genre);
                this.updateActiveFilters();
                this.performSearch();
                e.stopPropagation();
            });
        });
    }

    /**
     * Clear all filters
     */
    clearFilters() {
        this.selectedGenres.clear();
        document.querySelectorAll('.genre-label input').forEach(cb => {
            cb.checked = false;
        });
        this.updateActiveFilters();
        this.performSearch();
    }

    /**
     * Apply filters
     */
    applyFilters() {
        const filterDropdown = document.getElementById(this.config.filterDropdown);
        if (filterDropdown) {
            filterDropdown.style.display = 'none';
        }
        this.performSearch();
    }

    /**
     * Handle outside click to close dropdowns
     */
    handleOutsideClick(e) {
        const filterDropdown = document.getElementById(this.config.filterDropdown);
        const filterBtn = document.getElementById(this.config.filterBtn);
        const searchBox = document.getElementById(this.config.searchBox);
        const searchIcon = document.getElementById(this.config.searchIcon);

        // Close filter dropdown if clicking outside
        if (filterDropdown && 
            !filterDropdown.contains(e.target) && 
            filterBtn && 
            !filterBtn.contains(e.target)) {
            filterDropdown.style.display = 'none';
        }

        // Close suggestions if clicking outside
        if (this.suggestionsVisible) {
            const suggestionsEl = document.getElementById('suggestions');
            const searchInput = document.getElementById(this.config.searchInput);
            if (suggestionsEl && 
                !suggestionsEl.contains(e.target) && 
                searchInput && 
                !searchInput.contains(e.target)) {
                this.hideSuggestions();
            }
        }

        // Close search box if clicking outside
        if (searchBox && 
            searchBox.style.display === 'block' &&
            !searchBox.contains(e.target) && 
            searchIcon && 
            !searchIcon.contains(e.target)) {
            const searchOverlay = document.getElementById('searchOverlay');
            if (searchOverlay && searchOverlay.contains(e.target)) {
                this.closeSearchBox();
            }
        }
    }

    /**
     * Attach click handlers to result cards
     */
    attachResultClickHandlers() {
        document.querySelectorAll('.result-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const id = card.dataset.id;
                window.location.href = `post-details.html?id=${id}`;
            });
        });
    }

    /**
     * Inject styles for the search component
     */
    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Search Overlay */
            .search-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
                z-index: 999;
            }

            /* Search Box */
            #searchBox {
                display: none;
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 700px;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                padding: 30px;
                border-radius: 20px;
                z-index: 1000;
                animation: popUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
            }

            @keyframes popUp {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            /* Suggestions */
            #suggestions {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                margin-top: 10px;
                max-height: 400px;
                overflow-y: auto;
                z-index: 1001;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            }

            .suggestion-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 12px 20px;
                cursor: pointer;
                transition: background 0.2s ease;
                border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            }

            .suggestion-item:hover {
                background: rgba(255, 255, 255, 0.05);
            }

            .suggestion-item:last-child {
                border-bottom: none;
            }

            .suggestion-image {
                width: 60px;
                height: 90px;
                border-radius: 8px;
                object-fit: cover;
            }

            .suggestion-details {
                flex: 1;
            }

            .suggestion-title {
                font-weight: 500;
                margin-bottom: 5px;
                color: white;
                font-size: 14px;
            }

            .suggestion-meta {
                display: flex;
                gap: 8px;
                font-size: 12px;
                color: #aaa;
                margin-bottom: 5px;
            }

            .suggestion-genres {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;
            }

            .suggestion-genre {
                font-size: 11px;
                padding: 2px 8px;
                background: rgba(102, 126, 234, 0.2);
                color: #9ab1ff;
                border-radius: 10px;
                border: 1px solid rgba(102, 126, 234, 0.3);
            }

            /* Search Highlight */
            .search-highlight {
                background: rgba(78, 205, 196, 0.3);
                color: #4ecdc4;
                font-weight: 600;
                padding: 0 2px;
                border-radius: 3px;
            }

            /* Results Container */
            #resultsContainer {
                display: none;
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.3s ease, transform 0.3s ease;
                margin-top: 40px;
                padding: 30px;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(12px);
                border-radius: 20px;
                width: 100%;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                gap: 25px;
                margin-top: 20px;
            }

            /* Result Card */
            .result-card {
                display: block;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 15px;
                overflow: hidden;
                transition: all 0.3s ease;
                border: 1px solid rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(10px);
                text-decoration: none;
                color: inherit;
            }

            .result-card:hover {
                transform: translateY(-5px);
                background: rgba(255, 255, 255, 0.08);
                border-color: rgba(102, 126, 234, 0.3);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }

            .result-image {
                width: 100%;
                height: 200px;
                position: relative;
                overflow: hidden;
            }

            .result-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .result-type {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 500;
            }

            .result-info {
                padding: 20px;
            }

            .result-title {
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 10px;
                color: white;
                line-height: 1.3;
            }

            .result-meta {
                display: flex;
                gap: 8px;
                font-size: 13px;
                color: #aaa;
                margin-bottom: 10px;
                align-items: center;
            }

            .result-rating {
                color: #ffd700;
                font-weight: 500;
            }

            .result-genres {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
                margin-bottom: 10px;
            }

            .result-genre {
                font-size: 11px;
                padding: 3px 10px;
                background: rgba(102, 126, 234, 0.15);
                color: #9ab1ff;
                border-radius: 12px;
                border: 1px solid rgba(102, 126, 234, 0.2);
            }

            .result-description {
                font-size: 12px;
                color: #aaa;
                line-height: 1.4;
                margin-top: 10px;
            }

            /* Active Filters */
            .active-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin: 15px 0;
                min-height: 40px;
            }

            .filter-tag {
                background: rgba(102, 126, 234, 0.15);
                color: #9ab1ff;
                padding: 6px 15px;
                border-radius: 20px;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
                border: 1px solid rgba(102, 126, 234, 0.3);
            }

            .remove-filter {
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
                width: 18px;
                height: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }

            .remove-filter:hover {
                background: rgba(255, 255, 255, 0.1);
            }

            /* No Results */
            .no-results {
                text-align: center;
                padding: 60px 20px;
                color: #ccc;
            }

            .clear-all-btn {
                margin-top: 20px;
                padding: 10px 20px;
                background: rgba(102, 126, 234, 0.1);
                color: #9ab1ff;
                border: 1px solid rgba(102, 126, 234, 0.3);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .clear-all-btn:hover {
                background: rgba(102, 126, 234, 0.2);
            }

            /* Scrollbar */
            ::-webkit-scrollbar {
                width: 10px;
            }

            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 5px;
            }

            ::-webkit-scrollbar-thumb {
                background: rgba(102, 126, 234, 0.3);
                border-radius: 5px;
                border: 3px solid rgba(0, 0, 0, 0);
                background-clip: padding-box;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: rgba(102, 126, 234, 0.5);
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                #searchBox {
                    width: 95%;
                    padding: 20px;
                }

                .results-grid {
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }

                .result-image {
                    height: 180px;
                }

                .suggestion-item {
                    padding: 10px 15px;
                }

                .suggestion-image {
                    width: 50px;
                    height: 75px;
                }
            }

            @media (max-width: 480px) {
                .results-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Handle load errors
     */
    handleLoadError(error) {
        const resultsContainer = document.getElementById(this.config.resultsContainer);
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>⚠️ Search Unavailable</h3>
                    <p>Unable to load content. Please try again later.</p>
                    <p><small>Error: ${error.message}</small></p>
                </div>
            `;
            resultsContainer.style.display = 'block';
        }
    }

    /**
     * Clear search cache
     */
    clearCache() {
        this.searchCache.clear();
        console.log('🗑️ Search cache cleared');
    }

    /**
     * Refresh data
     */
    async refreshData() {
        this.searchCache.clear();
        await this.loadContent();
        console.log('🔄 Search data refreshed');
    }

    /**
     * Get search stats
     */
    getStats() {
        return {
            loadedPosts: this.allPosts.length,
            cacheSize: this.searchCache.size,
            selectedGenres: this.selectedGenres.size,
            currentSearch: this.currentSearch
        };
    }

    /**
     * Destroy component
     */
    destroy() {
        this.searchCache.clear();
        this.allPosts = [];
        this.isLoaded = false;
        console.log('🗑️ Global Search Component destroyed');
    }
}

// Auto-initialize
if (typeof window !== 'undefined') {
    window.GlobalSearch = GlobalSearch;
    
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('searchIcon')) {
            window.globalSearch = new GlobalSearch({
                dataUrl: 'data/posts.json'
            });
        }
    });
}