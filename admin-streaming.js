// Streaming Pages Management JavaScript

let streamingPagesData = [];
let filteredStreamingData = [];

// Initialize Streaming Pages Management
document.addEventListener('DOMContentLoaded', function() {
    loadStreamingPagesData();
    setupEventListeners();
    // Initialize compose editors when modal is opened
    setTimeout(() => {
        // This ensures the modal DOM is loaded before initializing
        initializeStreamingComposeEditors();
    }, 100);
});

// Load streaming pages data
async function loadStreamingPagesData() {
    try {
        // Load from localStorage (in a real app, this would be an API call)
        const saved = localStorage.getItem('quravel_streaming_pages');
        if (saved) {
            streamingPagesData = JSON.parse(saved);
        } else {
            // Generate sample data if none exists
            streamingPagesData = [
                {
                    id: 'the-dark-knight-001',
                    title: 'The Dark Knight',
                    type: 'movie',
                    year: 2008,
                    rating: 9.0,
                    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
                    poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
                    backdrop: 'https://image.tmdb.org/t/p/w1280/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
                    genres: ['Action', 'Crime', 'Drama'],
                    videoSources: [
                        {
                            id: 'source1',
                            name: 'Primary Source',
                            url: 'https://example.com/stream/dark-knight',
                            quality: 'HD',
                            server: 'Server 1'
                        },
                        {
                            id: 'source2',
                            name: 'Backup Source',
                            url: 'https://example2.com/stream/dark-knight',
                            quality: 'SD',
                            server: 'Server 2'
                        }
                    ],
                    episodes: [],
                    settings: {
                        enableComments: true,
                        enableRelated: true,
                        isPremium: false
                    },
                    dateCreated: '2025-01-15T10:30:00Z',
                    views: 15420,
                    likes: 892
                },
                {
                    id: 'stranger-things-002',
                    title: 'Stranger Things',
                    type: 'tv-show',
                    year: 2016,
                    rating: 8.7,
                    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments.',
                    poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
                    backdrop: 'https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
                    genres: ['Drama', 'Fantasy', 'Horror'],
                    videoSources: [
                        {
                            id: 'source1',
                            name: 'Netflix Source',
                            url: 'https://example.com/stream/stranger-things',
                            quality: '4K',
                            server: 'Netflix CDN'
                        }
                    ],
                    // Support for multiple seasons
                    seasons: [
                        {
                            seasonNumber: 1,
                            episodes: [
                                {
                                    id: 'ep1',
                                    number: 1,
                                    title: 'The Vanishing of Will Byers',
                                    duration: '47m',
                                    sources: ['source1']
                                },
                                {
                                    id: 'ep2',
                                    number: 2,
                                    title: 'The Weirdo on Maple Street',
                                    duration: '55m',
                                    sources: ['source1']
                                }
                            ]
                        },
                        {
                            seasonNumber: 2,
                            episodes: [
                                {
                                    id: 'ep9',
                                    number: 1,
                                    title: 'MADMAX',
                                    duration: '48m',
                                    sources: ['source1']
                                },
                                {
                                    id: 'ep10',
                                    number: 2,
                                    title: 'Trick or Treat, Freak',
                                    duration: '56m',
                                    sources: ['source1']
                                }
                            ]
                        }
                    ],
                    // Legacy support for single season shows
                    episodes: [
                        {
                            id: 'ep1',
                            number: 1,
                            title: 'The Vanishing of Will Byers',
                            duration: '47m',
                            sources: ['source1']
                        },
                        {
                            id: 'ep2',
                            number: 2,
                            title: 'The Weirdo on Maple Street',
                            duration: '55m',
                            sources: ['source1']
                        }
                    ],
                    settings: {
                        enableComments: true,
                        enableRelated: true,
                        isPremium: true
                    },
                    dateCreated: '2025-01-10T14:20:00Z',
                    views: 25680,
                    likes: 1523
                },
                {
                    id: 'demon-slayer-003',
                    title: 'Demon Slayer',
                    type: 'anime',
                    year: 2019,
                    rating: 9.1,
                    description: 'A young boy becomes a demon slayer to save his sister and avenge his family.',
                    poster: 'https://image.tmdb.org/t/p/w500/6NCBsBA6VPBrJ8nH6xD8oLS5hQe.jpg',
                    backdrop: 'https://image.tmdb.org/t/p/w1280/1TUg5pO1VZ4B0Q1amPCOMz5Gk1a.jpg',
                    genres: ['Action', 'Fantasy', 'Supernatural'],
                    videoSources: [
                        {
                            id: 'source1',
                            name: 'Crunchyroll',
                            url: 'https://example.com/stream/demon-slayer',
                            quality: 'HD',
                            server: 'Crunchyroll CDN'
                        }
                    ],
                    // Single season anime example
                    seasons: [
                        {
                            seasonNumber: 1,
                            episodes: [
                                {
                                    id: 'ep1',
                                    number: 1,
                                    title: 'Cruelty',
                                    duration: '24m',
                                    sources: ['source1']
                                },
                                {
                                    id: 'ep2',
                                    number: 2,
                                    title: 'Trainer Sakonji Urokodaki',
                                    duration: '24m',
                                    sources: ['source1']
                                }
                            ]
                        }
                    ],
                    episodes: [
                        {
                            id: 'ep1',
                            number: 1,
                            title: 'Cruelty',
                            duration: '24m',
                            sources: ['source1']
                        }
                    ],
                    settings: {
                        enableComments: true,
                        enableRelated: true,
                        isPremium: false
                    },
                    dateCreated: '2025-01-12T09:15:00Z',
                    views: 18920,
                    likes: 1247
                },
                {
                    id: 'breaking-bad-004',
                    title: 'Breaking Bad',
                    type: 'tv-show',
                    year: 2008,
                    rating: 9.5,
                    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
                    poster: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCZjHW3pEukJUR7N.jpg',
                    backdrop: 'https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7QqZ0v3wSI.jpg',
                    genres: ['Crime', 'Drama', 'Thriller'],
                    videoSources: [
                        {
                            id: 'source1',
                            name: 'AMC Source',
                            url: 'https://example.com/stream/breaking-bad',
                            quality: '4K',
                            server: 'AMC CDN'
                        },
                        {
                            id: 'source2',
                            name: 'Backup Source',
                            url: 'https://example2.com/stream/breaking-bad',
                            quality: 'HD',
                            server: 'Server 2'
                        }
                    ],
                    // Multi-season TV show with proper structure
                    seasons: [
                        {
                            id: 'season1',
                            number: 1,
                            title: 'Season 1',
                            episodes: [
                                {
                                    id: 'ep1',
                                    number: 1,
                                    title: 'Pilot',
                                    duration: '47m'
                                },
                                {
                                    id: 'ep2',
                                    number: 2,
                                    title: 'Cat in the Bag',
                                    duration: '47m'
                                },
                                {
                                    id: 'ep3',
                                    number: 3,
                                    title: 'And the Bag is in the River',
                                    duration: '47m'
                                }
                            ]
                        },
                        {
                            id: 'season2',
                            number: 2,
                            title: 'Season 2',
                            episodes: [
                                {
                                    id: 'ep7',
                                    number: 1,
                                    title: 'Seven Thirty-Seven',
                                    duration: '47m'
                                },
                                {
                                    id: 'ep8',
                                    number: 2,
                                    title: 'Grilled',
                                    duration: '47m'
                                },
                                {
                                    id: 'ep9',
                                    number: 3,
                                    title: 'Bit by a Dead Bee',
                                    duration: '47m'
                                }
                            ]
                        }
                    ],
                    // Legacy episodes array for backward compatibility
                    episodes: [
                        {
                            id: 'ep1',
                            number: 1,
                            title: 'Pilot',
                            duration: '47m',
                            sources: ['source1']
                        }
                    ],
                    // Streaming page sections management
                    sections: {
                        youMayLikeThis: [
                            {
                                id: 'suggestion1',
                                title: 'Better Call Saul',
                                type: 'tv-show',
                                poster: 'https://image.tmdb.org/t/p/w500/zrn19Xy9J7N5L8o2y5M2R5p7M3b.jpg',
                                year: 2015,
                                rating: 8.8
                            },
                            {
                                id: 'suggestion2',
                                title: 'Narcos',
                                type: 'tv-show',
                                poster: 'https://image.tmdb.org/t/p/w500/pUVuhzN8sW4eKq9yJ8ZMjG4cF4x.jpg',
                                year: 2015,
                                rating: 8.8
                            }
                        ],
                        recommended: [
                            {
                                id: 'recommendation1',
                                title: 'The Wire',
                                type: 'tv-show',
                                poster: 'https://image.tmdb.org/t/p/w500/pUSGRsHDmS3I3oD6zY8v7M9x5zM.jpg',
                                year: 2002,
                                rating: 9.3
                            },
                            {
                                id: 'recommendation2',
                                title: 'Fargo',
                                type: 'tv-show',
                                poster: 'https://image.tmdb.org/t/p/w500/lm3pB5zRqAj8xXwQf8nC7cM8c7s.jpg',
                                year: 2014,
                                rating: 8.9
                            }
                        ]
                    },
                    settings: {
                        enableComments: true,
                        enableRelated: true,
                        isPremium: false
                    },
                    dateCreated: '2025-01-14T16:45:00Z',
                    views: 32450,
                    likes: 2156
                    likes: 1247
                }
            ];
            localStorage.setItem('quravel_streaming_pages', JSON.stringify(streamingPagesData));
        }
        
        filteredStreamingData = [...streamingPagesData];
        updateStreamingTable();
        updateStreamingStats();
    } catch (error) {
        // Error loading streaming pages data
        showNotification('Error loading streaming pages data', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add event listener for add streaming form modal
    const streamingForm = document.getElementById('add-streaming-form');
    if (streamingForm) {
        streamingForm.addEventListener('submit', handleStreamingFormSubmit);
    }
    
    // Add event listener for edit streaming form modal
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'edit-streaming-form') {
            e.preventDefault();
            const pageId = e.target.getAttribute('data-page-id');
            if (pageId) {
                const formData = new FormData(e.target);
                handleEditStreamingFormSubmit(pageId, formData);
                closeEditStreamingModal();
            }
        }
    });
    
    // Add event listener for edit modal form attribute setting
    document.addEventListener('click', function(e) {
        if (e.target.closest('[onclick*="editStreamingPage"]')) {
            const button = e.target.closest('[onclick*="editStreamingPage"]');
            const onclickAttr = button.getAttribute('onclick');
            const match = onclickAttr.match(/editStreamingPage\('([^']+)'\)/);
            if (match) {
                const pageId = match[1];
                setTimeout(() => {
                    const form = document.getElementById('edit-streaming-form');
                    if (form) {
                        form.setAttribute('data-page-id', pageId);
                    }
                }, 100);
            }
        }
    });
}

// Update streaming pages table
function updateStreamingTable() {
    const tbody = document.getElementById('streaming-table-body');
    tbody.innerHTML = '';
    
    filteredStreamingData.forEach(page => {
        const row = document.createElement('tr');
        
        const episodesCount = page.episodes ? page.episodes.length : 0;
        const sourcesCount = page.videoSources ? page.videoSources.length : 0;
        
        row.innerHTML = `
            <td>
                <div class="content-title">
                    <img src="${page.poster}" alt="${page.title}" class="content-poster" onerror="this.src='https://via.placeholder.com/40x60'">
                    <span>${page.title}</span>
                </div>
            </td>
            <td><span class="post-type-badge post-type-${page.type}">${page.type}</span></td>
            <td>${page.year}</td>
            <td>
                <div class="rating-display">
                    <span class="rating-value">${page.rating}</span>
                    <span class="rating-max">/10</span>
                </div>
            </td>
            <td>${sourcesCount}</td>
            <td>${episodesCount}</td>
            <td>${formatNumber(page.views)}</td>
            <td>${formatNumber(page.likes)}</td>
            <td>${formatDate(page.dateCreated)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-edit" onclick="editStreamingPage('${page.id}')">Edit</button>
                    <button class="btn btn-small btn-view" onclick="previewStreamingPage('${page.id}')">Preview</button>
                    <button class="btn btn-small btn-delete" onclick="deleteStreamingPage('${page.id}')">Delete</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Update streaming statistics
function updateStreamingStats() {
    const totalPages = streamingPagesData.length;
    const moviePages = streamingPagesData.filter(page => page.type === 'movie').length;
    const tvPages = streamingPagesData.filter(page => page.type === 'tv-show' || page.type === 'anime').length;
    const totalViews = streamingPagesData.reduce((sum, page) => sum + (page.views || 0), 0);
    
    document.getElementById('total-streaming-pages').textContent = totalPages;
    document.getElementById('movie-streaming').textContent = moviePages;
    document.getElementById('tv-streaming').textContent = tvPages;
    document.getElementById('total-views').textContent = formatNumber(totalViews);
}

// Filter streaming pages
function filterStreamingPages() {
    const typeFilter = document.getElementById('type-filter').value;
    const searchTerm = document.getElementById('search-streaming').value.toLowerCase();
    
    filteredStreamingData = streamingPagesData.filter(page => {
        const matchesType = !typeFilter || page.type === typeFilter;
        const matchesSearch = !searchTerm || 
            page.title.toLowerCase().includes(searchTerm) ||
            page.description.toLowerCase().includes(searchTerm) ||
            page.genres.some(genre => genre.toLowerCase().includes(searchTerm));
        
        return matchesType && matchesSearch;
    });
    
    updateStreamingTable();
}

// Edit streaming page
function editStreamingPage(pageId) {
    const page = streamingPagesData.find(p => p.id === pageId);
    if (!page) return;
    
    const modal = document.getElementById('edit-streaming-modal');
    const content = document.getElementById('edit-streaming-content');
    
    content.innerHTML = generateEditForm(page);
    modal.style.display = 'block';
}

// Close edit streaming modal
function closeEditStreamingModal() {
    document.getElementById('edit-streaming-modal').style.display = 'none';
}

// Generate edit form HTML
function generateEditForm(page) {
    return `
        <form id="edit-streaming-form" class="streaming-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="edit-title">Content Title *</label>
                    <input type="text" id="edit-title" name="title" value="${page.title}" required>
                </div>
                <div class="form-group">
                    <label for="edit-type">Content Type *</label>
                    <select id="edit-type" name="type" required>
                        <option value="movie" ${page.type === 'movie' ? 'selected' : ''}>Movie</option>
                        <option value="tv-show" ${page.type === 'tv-show' ? 'selected' : ''}>TV Show</option>
                        <option value="anime" ${page.type === 'anime' ? 'selected' : ''}>Anime</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="edit-year">Release Year</label>
                    <input type="number" id="edit-year" name="year" value="${page.year}" min="1900" max="2030">
                </div>
                <div class="form-group">
                    <label for="edit-rating">IMDB Rating</label>
                    <input type="number" id="edit-rating" name="rating" value="${page.rating}" min="0" max="10" step="0.1">
                </div>
            </div>

            <div class="form-group">
                <label for="edit-description">Description</label>
                <textarea id="edit-description" name="description" rows="4">${page.description || ''}</textarea>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="edit-poster">Poster Image URL</label>
                    <input type="url" id="edit-poster" name="poster" value="${page.poster || ''}">
                </div>
                <div class="form-group">
                    <label for="edit-backdrop">Backdrop Image URL</label>
                    <input type="url" id="edit-backdrop" name="backdrop" value="${page.backdrop || ''}">
                </div>
            </div>

            <div class="form-group">
                <label for="edit-genres">Genres (comma-separated)</label>
                <input type="text" id="edit-genres" name="genres" value="${page.genres.join(', ')}">
            </div>

            <div class="video-sources-section">
                <div class="section-header">
                    <h3>Video Sources (${page.videoSources.length})</h3>
                    <button type="button" class="btn btn-small btn-secondary" onclick="addVideoSourceToEdit('${page.id}')">Add Source</button>
                </div>
                <div id="edit-sources-container">
                    ${page.videoSources.map((source, index) => `
                        <div class="video-source-item" data-source-id="${source.id}">
                            <div class="source-header">
                                <span class="source-title">Source ${index + 1}</span>
                                <button type="button" class="remove-source" onclick="removeSourceFromEdit('${page.id}', '${source.id}')">Remove</button>
                            </div>
                            <div class="source-fields">
                                <div class="form-group">
                                    <label>Source Name</label>
                                    <input type="text" name="edit_source_name_${source.id}" value="${source.name}" required>
                                </div>
                                <div class="form-group">
                                    <label>Video URL</label>
                                    <input type="url" name="edit_source_url_${source.id}" value="${source.url}" required>
                                </div>
                                <div class="form-group">
                                    <label>Quality</label>
                                    <select name="edit_source_quality_${source.id}">
                                        <option value="SD" ${source.quality === 'SD' ? 'selected' : ''}>SD</option>
                                        <option value="HD" ${source.quality === 'HD' ? 'selected' : ''}>HD</option>
                                        <option value="4K" ${source.quality === '4K' ? 'selected' : ''}>4K</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Server</label>
                                    <input type="text" name="edit_source_server_${source.id}" value="${source.server || ''}">
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Streaming Page Sections -->
            <div class="streaming-sections-section">
                <div class="section-header">
                    <h3>Streaming Page Sections</h3>
                    <p class="section-description">Manage "You May Like This" and "Recommended" sections for this streaming page</p>
                </div>
                
                <!-- You May Like This Section -->
                <div class="section-management" data-page-id="${page.id}">
                    <h4>You May Like This</h4>
                    <div id="edit-you-may-like-container">
                        ${(page.sections?.youMayLikeThis || []).map((item, index) => `
                            <div class="section-content-item" data-content-id="${item.id}">
                                <div class="content-header">
                                    <span class="content-title">Content Item ${index + 1}</span>
                                    <button type="button" class="remove-content" onclick="removeEditSectionContent(this, 'you-may-like', '${item.id}')">Remove</button>
                                </div>
                                <div class="content-fields">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Title</label>
                                            <input type="text" name="edit_you-may-like_title_${item.id}" value="${item.title}" placeholder="Content title" required>
                                        </div>
                                        <div class="form-group">
                                            <label>Type</label>
                                            <select name="edit_you-may-like_type_${item.id}">
                                                <option value="movie" ${item.type === 'movie' ? 'selected' : ''}>Movie</option>
                                                <option value="tv-show" ${item.type === 'tv-show' ? 'selected' : ''}>TV Show</option>
                                                <option value="anime" ${item.type === 'anime' ? 'selected' : ''}>Anime</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Poster URL</label>
                                            <input type="url" name="edit_you-may-like_poster_${item.id}" value="${item.poster || ''}" placeholder="https://example.com/poster.jpg">
                                        </div>
                                        <div class="form-group">
                                            <label>Year</label>
                                            <input type="number" name="edit_you-may-like_year_${item.id}" value="${item.year}" min="1900" max="2030">
                                        </div>
                                        <div class="form-group">
                                            <label>Rating</label>
                                            <input type="number" name="edit_you-may-like_rating_${item.id}" value="${item.rating}" min="0" max="10" step="0.1" placeholder="8.0">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Link (Optional)</label>
                                        <input type="url" name="edit_you-may-like_link_${item.id}" value="${item.link || ''}" placeholder="https://example.com/link">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" onclick="addEditSectionContent('${page.id}', 'you-may-like')">Add Content</button>
                </div>
                
                <!-- Recommended Section -->
                <div class="section-management" data-page-id="${page.id}">
                    <h4>Recommended</h4>
                    <div id="edit-recommended-container">
                        ${(page.sections?.recommended || []).map((item, index) => `
                            <div class="section-content-item" data-content-id="${item.id}">
                                <div class="content-header">
                                    <span class="content-title">Content Item ${index + 1}</span>
                                    <button type="button" class="remove-content" onclick="removeEditSectionContent(this, 'recommended', '${item.id}')">Remove</button>
                                </div>
                                <div class="content-fields">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Title</label>
                                            <input type="text" name="edit_recommended_title_${item.id}" value="${item.title}" placeholder="Content title" required>
                                        </div>
                                        <div class="form-group">
                                            <label>Type</label>
                                            <select name="edit_recommended_type_${item.id}">
                                                <option value="movie" ${item.type === 'movie' ? 'selected' : ''}>Movie</option>
                                                <option value="tv-show" ${item.type === 'tv-show' ? 'selected' : ''}>TV Show</option>
                                                <option value="anime" ${item.type === 'anime' ? 'selected' : ''}>Anime</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label>Poster URL</label>
                                            <input type="url" name="edit_recommended_poster_${item.id}" value="${item.poster || ''}" placeholder="https://example.com/poster.jpg">
                                        </div>
                                        <div class="form-group">
                                            <label>Year</label>
                                            <input type="number" name="edit_recommended_year_${item.id}" value="${item.year}" min="1900" max="2030">
                                        </div>
                                        <div class="form-group">
                                            <label>Rating</label>
                                            <input type="number" name="edit_recommended_rating_${item.id}" value="${item.rating}" min="0" max="10" step="0.1" placeholder="8.0">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label>Link (Optional)</label>
                                        <input type="url" name="edit_recommended_link_${item.id}" value="${item.link || ''}" placeholder="https://example.com/link">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="btn btn-secondary btn-small" onclick="addEditSectionContent('${page.id}', 'recommended')">Add Content</button>
                </div>
            </div>

            <div class="form-group">
                <label>Page Settings</label>
                <div class="checkbox-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="edit_enableComments" ${page.settings.enableComments ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Enable Comments
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="edit_enableRelated" ${page.settings.enableRelated ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Show Related Content
                    </label>
                    <label class="checkbox-label">
                        <input type="checkbox" name="edit_isPremium" ${page.settings.isPremium ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Premium Content
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeEditStreamingModal()">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
        </form>
    `;
}

// Preview streaming page
function previewStreamingPage(pageId) {
    const page = streamingPagesData.find(p => p.id === pageId);
    if (!page) return;
    
    // Open streaming page in new tab for preview
    const previewUrl = `streaming.html?id=${pageId}`;
    window.open(previewUrl, '_blank');
}

// Delete streaming page
function deleteStreamingPage(pageId) {
    if (!confirm('Are you sure you want to delete this streaming page? This action cannot be undone.')) {
        return;
    }
    
    const index = streamingPagesData.findIndex(p => p.id === pageId);
    if (index !== -1) {
        streamingPagesData.splice(index, 1);
        localStorage.setItem('quravel_streaming_pages', JSON.stringify(streamingPagesData));
        
        filteredStreamingData = [...streamingPagesData];
        updateStreamingTable();
        updateStreamingStats();
        
        showNotification('Streaming page deleted successfully!', 'success');
    }
}

// Add video source to edit form
function addVideoSourceToEdit(pageId) {
    const page = streamingPagesData.find(p => p.id === pageId);
    if (!page) return;
    
    const sourceId = 'edit_source_' + Date.now();
    const container = document.getElementById('edit-sources-container');
    
    const sourceItem = document.createElement('div');
    sourceItem.className = 'video-source-item';
    sourceItem.innerHTML = `
        <div class="source-header">
            <span class="source-title">New Source</span>
            <button type="button" class="remove-source" onclick="removeSourceFromEdit('${pageId}', '${sourceId}')">Remove</button>
        </div>
        <div class="source-fields">
            <div class="form-group">
                <label>Source Name</label>
                <input type="text" name="edit_source_name_${sourceId}" placeholder="e.g., Primary Source" required>
            </div>
            <div class="form-group">
                <label>Video URL</label>
                <input type="url" name="edit_source_url_${sourceId}" placeholder="https://..." required>
            </div>
            <div class="form-group">
                <label>Quality</label>
                <select name="edit_source_quality_${sourceId}">
                    <option value="SD">SD</option>
                    <option value="HD" selected>HD</option>
                    <option value="4K">4K</option>
                </select>
            </div>
            <div class="form-group">
                <label>Server</label>
                <input type="text" name="edit_source_server_${sourceId}" placeholder="e.g., Server 1">
            </div>
        </div>
    `;
    
    container.appendChild(sourceItem);
}

// Remove source from edit form
function removeSourceFromEdit(pageId, sourceId) {
    const page = streamingPagesData.find(p => p.id === pageId);
    if (!page) return;
    
    // Remove from page object
    page.videoSources = page.videoSources.filter(s => s.id !== sourceId);
    
    // Remove from DOM
    const sourceElement = document.querySelector(`[data-source-id="${sourceId}"]`);
    if (sourceElement) {
        sourceElement.remove();
    }
}

// Quick action functions
function bulkManageSources() {
    showNotification('Bulk source management feature coming soon!', 'info');
}

function generateEmbedCodes() {
    showNotification('Embed code generation feature coming soon!', 'info');
}

function checkBrokenLinks() {
    showNotification('Broken link checker feature coming soon!', 'info');
}

function streamingAnalytics() {
    showNotification('Streaming analytics feature coming soon!', 'info');
}

// Import/Export functions
function importStreamingData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (Array.isArray(data)) {
                        streamingPagesData = data;
                        localStorage.setItem('quravel_streaming_pages', JSON.stringify(streamingPagesData));
                        filteredStreamingData = [...streamingPagesData];
                        updateStreamingTable();
                        updateStreamingStats();
                        showNotification('Streaming data imported successfully!', 'success');
                    } else {
                        showNotification('Invalid data format', 'error');
                    }
                } catch (error) {
                    showNotification('Error importing data: Invalid JSON format', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function exportStreamingData() {
    const dataToExport = {
        streamingPages: streamingPagesData,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quravel-streaming-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Streaming data exported successfully!', 'success');
}

// Add content to edit streaming page sections
function addEditSectionContent(pageId, sectionType) {
    const page = streamingPagesData.find(p => p.id === pageId);
    if (!page) return;
    
    const containerId = sectionType === 'you-may-like' ? 'edit-you-may-like-container' : 'edit-recommended-container';
    const container = document.getElementById(containerId);
    const contentId = `${sectionType}_edit_content_${Date.now()}`;
    
    const contentItem = document.createElement('div');
    contentItem.className = 'section-content-item';
    contentItem.setAttribute('data-content-id', contentId);
    contentItem.innerHTML = `
        <div class="content-header">
            <span class="content-title">Content Item</span>
            <button type="button" class="remove-content" onclick="removeEditSectionContent(this, '${sectionType}', '${contentId}')">Remove</button>
        </div>
        <div class="content-fields">
            <div class="form-row">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="edit_${sectionType}_title_${contentId}" placeholder="Content title" required>
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select name="edit_${sectionType}_type_${contentId}">
                        <option value="movie">Movie</option>
                        <option value="tv-show">TV Show</option>
                        <option value="anime">Anime</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Poster URL</label>
                    <input type="url" name="edit_${sectionType}_poster_${contentId}" placeholder="https://example.com/poster.jpg">
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="number" name="edit_${sectionType}_year_${contentId}" min="1900" max="2030" value="2024">
                </div>
                <div class="form-group">
                    <label>Rating</label>
                    <input type="number" name="edit_${sectionType}_rating_${contentId}" min="0" max="10" step="0.1" placeholder="8.0">
                </div>
            </div>
            <div class="form-group">
                <label>Link (Optional)</label>
                <input type="url" name="edit_${sectionType}_link_${contentId}" placeholder="https://example.com/link">
            </div>
        </div>
    `;
    
    container.appendChild(contentItem);
}

// Remove content from edit section
function removeEditSectionContent(button, sectionType, contentId) {
    const container = button.closest('.section-management');
    const pageId = container.getAttribute('data-page-id');
    
    // Remove from DOM
    button.closest('.section-content-item').remove();
    
    // Remove from page object if it exists
    const page = streamingPagesData.find(p => p.id === pageId);
    if (page && page.sections) {
        const sectionArray = page.sections[sectionType === 'you-may-like' ? 'youMayLikeThis' : 'recommended'];
        if (sectionArray) {
            const index = sectionArray.findIndex(item => item.id === contentId);
            if (index !== -1) {
                sectionArray.splice(index, 1);
            }
        }
    }
}

// Handle edit form submission with sections
function handleEditStreamingFormSubmit(pageId, formData) {
    const page = streamingPagesData.find(p => p.id === pageId);
    if (!page) return;
    
    // Update basic information
    page.title = formData.get('title');
    page.type = formData.get('type');
    page.year = parseInt(formData.get('year')) || new Date().getFullYear();
    page.rating = parseFloat(formData.get('rating')) || 0;
    page.description = formData.get('description');
    page.poster = formData.get('poster');
    page.backdrop = formData.get('backdrop');
    page.genres = formData.get('genres') ? formData.get('genres').split(',').map(g => g.trim()) : [];
    
    // Initialize sections if not exists
    if (!page.sections) {
        page.sections = {
            youMayLikeThis: [],
            recommended: []
        };
    }
    
    // Clear existing sections
    page.sections.youMayLikeThis = [];
    page.sections.recommended = [];
    
    // Collect "You May Like This" section content
    const youMayLikeItems = document.querySelectorAll('#edit-you-may-like-container .section-content-item');
    youMayLikeItems.forEach((container, index) => {
        const contentId = container.getAttribute('data-content-id');
        const title = container.querySelector(`input[name^="edit_you-may-like_title_"]`).value;
        const contentType = container.querySelector(`select[name^="edit_you-may-like_type_"]`).value;
        const poster = container.querySelector(`input[name^="edit_you-may-like_poster_"]`).value;
        const year = container.querySelector(`input[name^="edit_you-may-like_year_"]`).value;
        const rating = container.querySelector(`input[name^="edit_you-may-like_rating_"]`).value;
        const link = container.querySelector(`input[name^="edit_you-may-like_link_"]`).value;
        
        if (title) {
            page.sections.youMayLikeThis.push({
                id: contentId || `you-may-like-${index + 1}`,
                title: title,
                type: contentType,
                poster: poster,
                year: parseInt(year) || new Date().getFullYear(),
                rating: parseFloat(rating) || 0,
                link: link
            });
        }
    });
    
    // Collect "Recommended" section content
    const recommendedItems = document.querySelectorAll('#edit-recommended-container .section-content-item');
    recommendedItems.forEach((container, index) => {
        const contentId = container.getAttribute('data-content-id');
        const title = container.querySelector(`input[name^="edit_recommended_title_"]`).value;
        const contentType = container.querySelector(`select[name^="edit_recommended_type_"]`).value;
        const poster = container.querySelector(`input[name^="edit_recommended_poster_"]`).value;
        const year = container.querySelector(`input[name^="edit_recommended_year_"]`).value;
        const rating = container.querySelector(`input[name^="edit_recommended_rating_"]`).value;
        const link = container.querySelector(`input[name^="edit_recommended_link_"]`).value;
        
        if (title) {
            page.sections.recommended.push({
                id: contentId || `recommended-${index + 1}`,
                title: title,
                type: contentType,
                poster: poster,
                year: parseInt(year) || new Date().getFullYear(),
                rating: parseFloat(rating) || 0,
                link: link
            });
        }
    });
    
    // Save to localStorage
    localStorage.setItem('quravel_streaming_pages', JSON.stringify(streamingPagesData));
    
    // Update display
    filteredStreamingData = [...streamingPagesData];
    updateStreamingTable();
    updateStreamingStats();
    
    showNotification('Streaming page updated successfully!', 'success');
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles if not already present
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
                z-index: 10000;
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
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// =============================================================================
// STREAMING COMPOSE AND HTML EDITOR FUNCTIONALITY
// =============================================================================

let streamingQuillEditor;
let streamingCodeMirrorEditor;
let currentStreamingComposeMode = 'template';
let selectedStreamingTemplate = '';
let streamingTemplates = JSON.parse(localStorage.getItem('quravel_streaming_templates') || '[]');
let streamingContentDraft = null;

// Initialize Streaming Compose Editors
function initializeStreamingComposeEditors() {
    // Initialize Quill.js for rich text editing
    const quillOptions = {
        theme: 'snow',
        placeholder: 'Write streaming page content...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
                ['clean']
            ],
            table: true
        }
    };
    
    streamingQuillEditor = new Quill('#streaming-content-editor', quillOptions);
    
    // Initialize CodeMirror for HTML editing
    streamingCodeMirrorEditor = CodeMirror.fromTextArea(document.getElementById('streaming-html-editor'), {
        mode: 'htmlmixed',
        theme: 'material',
        lineNumbers: true,
        lineWrapping: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        extraKeys: {
            "Ctrl-Space": "autocomplete",
            "Ctrl-S": function() {
                saveStreamingAsDraft();
                return false;
            }
        }
    });
}

// Compose Modal Functions
function showStreamingComposeModal() {
    document.getElementById('streaming-compose-modal').style.display = 'block';
    switchStreamingComposeMode('template');
    
    // Initialize editors if not already done
    if (!streamingQuillEditor) {
        initializeStreamingComposeEditors();
    }
}

function closeStreamingComposeModal() {
    document.getElementById('streaming-compose-modal').style.display = 'none';
    resetStreamingComposeForm();
}

function switchStreamingComposeMode(mode) {
    currentStreamingComposeMode = mode;
    
    // Update tab buttons
    document.querySelectorAll('#streaming-compose-modal .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#streaming-compose-modal [onclick="switchStreamingComposeMode('${mode}')"]`).classList.add('active');
    
    // Update mode content
    document.querySelectorAll('#streaming-compose-modal .compose-mode').forEach(modeDiv => modeDiv.classList.remove('active'));
    document.getElementById(`streaming-${mode}-mode`).classList.add('active');
    
    if (mode === 'html') {
        // Load draft HTML content or initialize default streaming HTML
        const draftHtml = streamingContentDraft?.htmlContent || generateDefaultStreamingHTML();
        streamingCodeMirrorEditor.setValue(draftHtml);
    }
}

function selectStreamingTemplate(templateType) {
    selectedStreamingTemplate = templateType;
    
    // Update template selection UI
    document.querySelectorAll('#streaming-template-mode .template-card').forEach(card => {
        card.classList.remove('selected');
        if (card.onclick.toString().includes(templateType)) {
            card.classList.add('selected');
        }
    });
    
    // Show template editor
    document.getElementById('streaming-template-editor').style.display = 'block';
    
    // Load template-specific form fields
    loadStreamingTemplateFields(templateType);
}

function loadStreamingTemplateFields(templateType) {
    const titleInput = document.getElementById('streaming-compose-title');
    const typeSelect = document.getElementById('streaming-compose-type');
    const episodesSection = document.getElementById('streaming-episodes-section');
    
    switch(templateType) {
        case 'movie-player':
            titleInput.placeholder = 'Enter movie title...';
            typeSelect.value = 'movie';
            episodesSection.style.display = 'none';
            break;
        case 'tv-show-player':
            titleInput.placeholder = 'Enter TV show title...';
            typeSelect.value = 'tv-show';
            episodesSection.style.display = 'block';
            break;
        case 'anime-player':
            titleInput.placeholder = 'Enter anime title...';
            typeSelect.value = 'anime';
            episodesSection.style.display = 'block';
            break;
        case 'custom-streaming':
            titleInput.placeholder = 'Enter streaming content title...';
            typeSelect.value = '';
            episodesSection.style.display = 'none';
            break;
    }
}

// Video Sources Management
function addStreamingVideoSource() {
    const container = document.getElementById('streaming-video-sources-container');
    const sourceId = 'source_' + Date.now();
    
    const sourceDiv = document.createElement('div');
    sourceDiv.className = 'video-source-item';
    sourceDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Source Name</label>
                <input type="text" name="source_name" placeholder="Primary Source">
            </div>
            <div class="form-group">
                <label>Quality</label>
                <select name="source_quality">
                    <option value="HD">HD</option>
                    <option value="4K">4K</option>
                    <option value="SD">SD</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <label>Source URL</label>
            <input type="url" name="source_url" placeholder="https://example.com/stream">
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Server Name</label>
                <input type="text" name="source_server" placeholder="Server 1">
            </div>
            <div class="form-group">
                <button type="button" class="btn btn-small btn-danger" onclick="removeStreamingVideoSource(this)">Remove</button>
            </div>
        </div>
    `;
    
    container.appendChild(sourceDiv);
}

function removeStreamingVideoSource(button) {
    button.closest('.video-source-item').remove();
}

// Episodes Management
function addStreamingEpisode() {
    const container = document.getElementById('streaming-episodes-container');
    const episodeId = 'ep_' + Date.now();
    
    const episodeDiv = document.createElement('div');
    episodeDiv.className = 'episode-item';
    episodeDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Episode Number</label>
                <input type="number" name="episode_number" min="1" value="1">
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" name="episode_duration" placeholder="45m">
            </div>
        </div>
        <div class="form-group">
            <label>Episode Title</label>
            <input type="text" name="episode_title" placeholder="Episode Title">
        </div>
        <div class="form-group">
            <label>Episode Description</label>
            <textarea name="episode_description" rows="2" placeholder="Episode description..."></textarea>
        </div>
        <div class="form-group">
            <button type="button" class="btn btn-small btn-danger" onclick="removeStreamingEpisode(this)">Remove Episode</button>
        </div>
    `;
    
    container.appendChild(episodeDiv);
}

function removeStreamingEpisode(button) {
    button.closest('.episode-item').remove();
}

// Sections Content Management
function addSectionContent(sectionType) {
    const container = document.getElementById(sectionType === 'youMayLikeThis' ? 'you-may-like-container' : 'recommended-container');
    const contentId = 'content_' + Date.now();
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'section-content-item';
    contentDiv.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Title</label>
                <input type="text" name="content_title" placeholder="Content title">
            </div>
            <div class="form-group">
                <label>Type</label>
                <select name="content_type">
                    <option value="movie">Movie</option>
                    <option value="tv-show">TV Show</option>
                    <option value="anime">Anime</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Year</label>
                <input type="number" name="content_year" min="1900" max="2030">
            </div>
            <div class="form-group">
                <label>Rating</label>
                <input type="number" name="content_rating" min="0" max="10" step="0.1">
            </div>
        </div>
        <div class="form-group">
            <label>Poster URL</label>
            <input type="url" name="content_poster" placeholder="Poster image URL">
        </div>
        <div class="form-group">
            <button type="button" class="btn btn-small btn-danger" onclick="removeSectionContent(this)">Remove Content</button>
        </div>
    `;
    
    container.appendChild(contentDiv);
}

function removeSectionContent(button) {
    button.closest('.section-content-item').remove();
}

// HTML Editor Functions for Streaming
function formatStreamingHTML() {
    const content = streamingCodeMirrorEditor.getValue();
    const formatted = formatHtmlContent(content);
    streamingCodeMirrorEditor.setValue(formatted);
    showNotification('Streaming HTML formatted successfully', 'success');
}

function validateStreamingHTML() {
    const content = streamingCodeMirrorEditor.getValue();
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const errors = doc.querySelectorAll('parsererror');
        
        if (errors.length > 0) {
            showNotification('Streaming HTML validation failed: ' + errors[0].textContent, 'error');
        } else {
            showNotification('Streaming HTML is valid', 'success');
        }
    } catch (error) {
        showNotification('Streaming HTML validation error: ' + error.message, 'error');
    }
}

function previewStreamingHTML() {
    const content = streamingCodeMirrorEditor.getValue();
    const previewDiv = document.getElementById('streaming-html-preview');
    const previewFrame = document.getElementById('streaming-preview-frame');
    
    previewFrame.srcdoc = content;
    previewDiv.style.display = 'block';
    
    // Scroll to preview
    previewDiv.scrollIntoView({ behavior: 'smooth' });
}

function generateDefaultStreamingHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Streaming Page - Content Title</title>
    <link rel="stylesheet" href="styles/streaming-page.css">
    <link rel="stylesheet" href="styles/details-page.css">
</head>
<body>
    <div class="streaming-container">
        <!-- Video Player -->
        <div class="video-player-container">
            <video id="main-video" controls>
                <source src="video-url" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="player-controls">
                <div class="video-info">
                    <h1 class="video-title">Content Title</h1>
                    <div class="video-meta">
                        <span class="year">2024</span>
                        <span class="rating">⭐ 8.5</span>
                        <span class="duration">2h 30m</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content Details -->
        <div class="content-details">
            <div class="poster-section">
                <img src="poster-url" alt="Content Poster" class="content-poster">
            </div>
            
            <div class="info-section">
                <h2>About</h2>
                <p class="description">
                    Content description goes here...
                </p>
                
                <div class="genres">
                    <span class="genre-tag">Action</span>
                    <span class="genre-tag">Drama</span>
                </div>
            </div>
        </div>

        <!-- Episodes Section (if applicable) -->
        <div class="episodes-section" id="episodes-section" style="display: none;">
            <h3>Episodes</h3>
            <div class="episodes-list">
                <!-- Episodes will be populated here -->
            </div>
        </div>

        <!-- You May Like This Section -->
        <div class="recommendations-section">
            <h3>You May Like This</h3>
            <div class="recommendations-grid">
                <!-- Related content will be populated here -->
            </div>
        </div>

        <!-- Recommended Section -->
        <div class="recommended-section">
            <h3>Recommended</h3>
            <div class="recommended-grid">
                <!-- Recommended content will be populated here -->
            </div>
        </div>
    </div>

    <script src="scripts/streaming-page.js"></script>
</body>
</html>`;
}

// Template Management for Streaming
function manageStreamingTemplates() {
    loadSavedStreamingTemplates();
    document.getElementById('streaming-templates-modal').style.display = 'block';
}

function closeStreamingTemplatesModal() {
    document.getElementById('streaming-templates-modal').style.display = 'none';
}

function loadSavedStreamingTemplates() {
    const templatesContainer = document.getElementById('saved-streaming-templates');
    if (!templatesContainer) return;
    
    templatesContainer.innerHTML = '';
    
    if (streamingTemplates.length === 0) {
        templatesContainer.innerHTML = '<p class="no-templates">No saved streaming templates found.</p>';
        return;
    }
    
    streamingTemplates.forEach((template, index) => {
        const templateCard = createStreamingTemplateCard(template, index);
        templatesContainer.appendChild(templateCard);
    });
}

function createStreamingTemplateCard(template, index) {
    const card = document.createElement('div');
    card.className = 'saved-template-card';
    card.innerHTML = `
        <div class="template-info">
            <h4>${template.name}</h4>
            <p>${template.type} streaming template</p>
            <span class="template-date">${new Date(template.created).toLocaleDateString()}</span>
        </div>
        <div class="template-actions">
            <button class="btn btn-small btn-secondary" onclick="editStreamingTemplate(${index})">Edit</button>
            <button class="btn btn-small btn-secondary" onclick="duplicateStreamingTemplate(${index})">Duplicate</button>
            <button class="btn btn-small btn-danger" onclick="deleteStreamingTemplate(${index})">Delete</button>
        </div>
    `;
    return card;
}

function createNewStreamingTemplate() {
    const templateName = prompt('Enter streaming template name:');
    if (!templateName) return;
    
    const template = {
        id: Date.now(),
        name: templateName,
        type: selectedStreamingTemplate || 'custom-streaming',
        html: streamingCodeMirrorEditor.getValue(),
        fields: collectStreamingFormData(),
        created: new Date().toISOString()
    };
    
    streamingTemplates.push(template);
    localStorage.setItem('quravel_streaming_templates', JSON.stringify(streamingTemplates));
    loadSavedStreamingTemplates();
    showNotification('Streaming template created successfully', 'success');
}

function editStreamingTemplate(index) {
    const template = streamingTemplates[index];
    if (!template) return;
    
    // Load template into compose mode
    switchStreamingComposeMode('html');
    streamingCodeMirrorEditor.setValue(template.html);
    
    // Load form fields if available
    if (template.fields) {
        populateStreamingFormFields(template.fields);
    }
    
    closeStreamingTemplatesModal();
    showStreamingComposeModal();
}

function duplicateStreamingTemplate(index) {
    const template = streamingTemplates[index];
    if (!template) return;
    
    const newTemplate = {
        ...template,
        id: Date.now(),
        name: template.name + ' (Copy)',
        created: new Date().toISOString()
    };
    
    streamingTemplates.push(newTemplate);
    localStorage.setItem('quravel_streaming_templates', JSON.stringify(streamingTemplates));
    loadSavedStreamingTemplates();
    showNotification('Streaming template duplicated successfully', 'success');
}

function deleteStreamingTemplate(index) {
    if (!confirm('Are you sure you want to delete this streaming template?')) return;
    
    streamingTemplates.splice(index, 1);
    localStorage.setItem('quravel_streaming_templates', JSON.stringify(streamingTemplates));
    loadSavedStreamingTemplates();
    showNotification('Streaming template deleted successfully', 'success');
}

function importStreamingTemplate() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const template = JSON.parse(e.target.result);
                template.id = Date.now();
                template.created = new Date().toISOString();
                
                streamingTemplates.push(template);
                localStorage.setItem('quravel_streaming_templates', JSON.stringify(streamingTemplates));
                loadSavedStreamingTemplates();
                showNotification('Streaming template imported successfully', 'success');
            } catch (error) {
                showNotification('Error importing streaming template: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function exportAllStreamingTemplates() {
    const dataStr = JSON.stringify(streamingTemplates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quravel-streaming-templates.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Content Publishing Functions for Streaming
function collectStreamingFormData() {
    const form = document.getElementById('streaming-template-form');
    const formData = new FormData(form);
    const data = {};
    
    // Collect basic form data
    for (let [key, value] of formData.entries()) {
        if (key === 'enableComments' || key === 'enableRelated' || key === 'isPremium') {
            data[key] = true;
        } else {
            data[key] = value;
        }
    }
    
    // Collect video sources
    const videoSources = [];
    const sourceItems = document.querySelectorAll('#streaming-video-sources-container .video-source-item');
    sourceItems.forEach((item, index) => {
        const source = {
            id: 'source' + (index + 1),
            name: item.querySelector('input[name="source_name"]').value || 'Source ' + (index + 1),
            url: item.querySelector('input[name="source_url"]').value,
            quality: item.querySelector('select[name="source_quality"]').value,
            server: item.querySelector('input[name="source_server"]').value || 'Server ' + (index + 1)
        };
        if (source.url) videoSources.push(source);
    });
    data.videoSources = videoSources;
    
    // Collect episodes
    const episodes = [];
    const episodeItems = document.querySelectorAll('#streaming-episodes-container .episode-item');
    episodeItems.forEach((item, index) => {
        const episode = {
            id: 'ep' + (index + 1),
            number: parseInt(item.querySelector('input[name="episode_number"]').value) || (index + 1),
            title: item.querySelector('input[name="episode_title"]').value || 'Episode ' + (index + 1),
            duration: item.querySelector('input[name="episode_duration"]').value || '45m',
            description: item.querySelector('textarea[name="episode_description"]').value || '',
            sources: ['source1'] // Default to first source
        };
        if (episode.title) episodes.push(episode);
    });
    data.episodes = episodes;
    
    // Collect sections content
    data.sections = {
        youMayLikeThis: collectSectionContent('you-may-like-container'),
        recommended: collectSectionContent('recommended-container')
    };
    
    // Add editor content
    if (currentStreamingComposeMode === 'template') {
        data.contentHtml = streamingQuillEditor.root.innerHTML;
        data.contentText = streamingQuillEditor.getText();
    } else {
        data.htmlContent = streamingCodeMirrorEditor.getValue();
    }
    
    return data;
}

function collectSectionContent(containerId) {
    const content = [];
    const items = document.querySelectorAll(`#${containerId} .section-content-item`);
    
    items.forEach((item, index) => {
        const contentItem = {
            id: 'content' + (index + 1),
            title: item.querySelector('input[name="content_title"]').value,
            type: item.querySelector('select[name="content_type"]').value,
            year: parseInt(item.querySelector('input[name="content_year"]').value) || new Date().getFullYear(),
            rating: parseFloat(item.querySelector('input[name="content_rating"]').value) || 0,
            poster: item.querySelector('input[name="content_poster"]').value,
            link: '#' // Default link
        };
        if (contentItem.title) content.push(contentItem);
    });
    
    return content;
}

function populateStreamingFormFields(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(`streaming-compose-${key}`) || document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = data[key];
            } else {
                element.value = data[key];
            }
        }
    });
    
    // Set rich text content
    if (data.contentHtml && streamingQuillEditor) {
        streamingQuillEditor.root.innerHTML = data.contentHtml;
    }
}

function saveStreamingAsDraft() {
    const data = collectStreamingFormData();
    data.mode = currentStreamingComposeMode;
    data.template = selectedStreamingTemplate;
    data.draft = true;
    data.lastModified = new Date().toISOString();
    
    // Save to localStorage drafts
    const drafts = JSON.parse(localStorage.getItem('quravel_streaming_drafts') || '[]');
    drafts.push(data);
    localStorage.setItem('quravel_streaming_drafts', JSON.stringify(drafts));
    
    showNotification('Streaming draft saved successfully', 'success');
}

function publishStreamingContent() {
    const data = collectStreamingFormData();
    data.published = true;
    data.publishedAt = new Date().toISOString();
    data.id = 'streaming_' + Date.now();
    
    // Add to streaming pages data
    const streamingData = JSON.parse(localStorage.getItem('quravel_streaming_pages') || '[]');
    streamingData.push(data);
    localStorage.setItem('quravel_streaming_pages', JSON.stringify(streamingData));
    
    // Clear draft if exists
    streamingContentDraft = null;
    
    closeStreamingComposeModal();
    showNotification('Streaming content published successfully', 'success');
    
    // Refresh page
    location.reload();
}

function resetStreamingComposeForm() {
    // Clear form fields
    document.getElementById('streaming-template-form').reset();
    
    // Clear containers
    document.getElementById('streaming-video-sources-container').innerHTML = '';
    document.getElementById('streaming-episodes-container').innerHTML = '';
    document.getElementById('you-may-like-container').innerHTML = '';
    document.getElementById('recommended-container').innerHTML = '';
    
    // Clear editors
    if (streamingQuillEditor) {
        streamingQuillEditor.setContents([]);
    }
    if (streamingCodeMirrorEditor) {
        streamingCodeMirrorEditor.setValue('');
    }
    
    // Hide template editor
    document.getElementById('streaming-template-editor').style.display = 'none';
    
    // Reset template selection
    document.querySelectorAll('#streaming-template-mode .template-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide HTML preview
    const preview = document.getElementById('streaming-html-preview');
    if (preview) {
        preview.style.display = 'none';
    }
    
    // Reset mode
    currentStreamingComposeMode = 'template';
    selectedStreamingTemplate = '';
}