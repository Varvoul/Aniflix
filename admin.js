// Admin Panel JavaScript

let postsData = [];
let categoriesData = {};
let streamingPagesData = [];

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    loadPostsData();
    loadStreamingPagesData();
    loadCategories();
    updateStats();
    setupFormHandlers();
});

// Load streaming pages data
async function loadStreamingPagesData() {
    try {
        // In a real application, this would be an API call
        // For now, we'll use localStorage or generate sample data
        const saved = localStorage.getItem('quravel_streaming_pages');
        if (saved) {
            streamingPagesData = JSON.parse(saved);
        } else {
            // Generate sample streaming pages from existing posts
            streamingPagesData = postsData.filter(post => post.streamingUrl).map(post => ({
                id: post.id,
                title: post.title,
                type: post.type,
                year: post.year,
                rating: post.rating,
                description: post.description,
                poster: post.poster,
                backdrop: post.backdrop,
                genres: post.genres || [],
                videoSources: [
                    {
                        id: 'source1',
                        name: 'Primary Source',
                        url: `https://example.com/stream/${post.id}`,
                        quality: 'HD',
                        server: 'Server 1'
                    }
                ],
                episodes: post.type === 'tv-show' ? [
                    {
                        id: 'ep1',
                        number: 1,
                        title: 'Episode 1',
                        duration: '45m',
                        sources: ['source1']
                    }
                ] : [],
                settings: {
                    enableComments: true,
                    enableRelated: false,
                    isPremium: false
                },
                dateCreated: new Date().toISOString(),
                views: Math.floor(Math.random() * 10000),
                likes: Math.floor(Math.random() * 500)
            }));
        }
        updateStreamingPagesStats();
    } catch (error) {
        // Error loading streaming pages data
    }
}

// Load posts data from JSON file
async function loadPostsData() {
    try {
        const response = await fetch('data/posts.json');
        const data = await response.json();
        postsData = data.posts || [];
        categoriesData = data.categories || {};
        updatePostsTable();
        updateStats();
    } catch (error) {
        // Error loading posts data
        showNotification('Error loading posts data', 'error');
    }
}

// Load categories and populate dropdown
function loadCategories() {
    const categorySelect = document.getElementById('post-category');
    const typeSelect = document.getElementById('post-type');
    
    typeSelect.addEventListener('change', function() {
        const selectedType = this.value;
        populateCategoryDropdown(selectedType);
    });
}

// Populate category dropdown based on content type
function populateCategoryDropdown(type) {
    const categorySelect = document.getElementById('post-category');
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    if (categoriesData[type]) {
        categoriesData[type].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    }
}

// Update statistics display
function updateStats() {
    const totalPosts = postsData.length;
    const slideshowPosts = postsData.filter(post => post.flags?.isSlideshow).length;
    const topAiringPosts = postsData.filter(post => post.flags?.isTopAiring).length;
    const recommendedPosts = postsData.filter(post => post.flags?.isRecommended).length;
    
    // Load streaming pages data if available
    const saved = localStorage.getItem('quravel_streaming_pages');
    const streamingPagesCount = saved ? JSON.parse(saved).length : 0;
    
    document.getElementById('total-posts').textContent = totalPosts;
    document.getElementById('slideshow-posts').textContent = slideshowPosts;
    document.getElementById('top-airing').textContent = topAiringPosts;
    document.getElementById('recommended').textContent = recommendedPosts;
    document.getElementById('streaming-pages').textContent = streamingPagesCount;
}

// Update streaming pages statistics
function updateStreamingPagesStats() {
    document.getElementById('streaming-pages').textContent = streamingPagesData.length;
}

// Update posts table
function updatePostsTable() {
    const tbody = document.getElementById('posts-table-body');
    tbody.innerHTML = '';
    
    postsData.forEach(post => {
        const row = document.createElement('tr');
        
        // Content flags
        const flags = [];
        if (post.flags?.isSlideshow) flags.push('<span class="flag flag-slideshow">Slideshow</span>');
        if (post.flags?.isTopAiring) flags.push('<span class="flag flag-top-airing">Top Airing</span>');
        if (post.flags?.isLatestMovie) flags.push('<span class="flag flag-latest">Latest</span>');
        if (post.flags?.isRecommended) flags.push('<span class="flag flag-recommended">Recommended</span>');
        
        row.innerHTML = `
            <td>${post.title}</td>
            <td><span class="post-type-badge post-type-${post.type}">${post.type}</span></td>
            <td>${post.category}</td>
            <td>${flags.join(' ')}</td>
            <td>${post.popularity || 0}</td>
            <td>${formatDate(post.dateAdded)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-edit" onclick="editPost('${post.id}')">Edit</button>
                    <button class="btn btn-small btn-delete" onclick="deletePost('${post.id}')">Delete</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
}

// Show Add Post Modal
function showAddPostModal() {
    document.getElementById('add-post-modal').style.display = 'block';
    populateCategoryDropdown('');
}

// Close Add Post Modal
function closeAddPostModal() {
    document.getElementById('add-post-modal').style.display = 'none';
    document.getElementById('add-post-form').reset();
    document.getElementById('popularity-value').textContent = '50';
}

// Setup form handlers
function setupFormHandlers() {
    // Popularity slider
    const popularitySlider = document.getElementById('post-popularity');
    const popularityValue = document.getElementById('popularity-value');
    
    popularitySlider.addEventListener('input', function() {
        popularityValue.textContent = this.value;
    });
    
    // Add post form
    const addPostForm = document.getElementById('add-post-form');
    addPostForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewPost();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('add-post-modal');
        if (e.target === modal) {
            closeAddPostModal();
        }
    });
}

// Add new post
async function addNewPost() {
    const formData = new FormData(document.getElementById('add-post-form'));
    
    // Generate unique ID
    const id = generateId(formData.get('title'));
    
    // Create new post object
    const newPost = {
        id: id,
        title: formData.get('title'),
        type: formData.get('type'),
        category: formData.get('category'),
        year: parseInt(formData.get('year')) || new Date().getFullYear(),
        duration: formData.get('duration'),
        rating: parseFloat(formData.get('rating')) || 0,
        description: formData.get('description'),
        poster: formData.get('poster'),
        backdrop: formData.get('backdrop'),
        genres: formData.get('genres') ? formData.get('genres').split(',').map(g => g.trim()) : [],
        director: formData.get('director'),
        cast: formData.get('cast') ? formData.get('cast').split(',').map(c => c.trim()) : [],
        trailer: formData.get('trailer'),
        streamingUrl: `streaming.html?id=${id}`,
        dateAdded: new Date().toISOString().split('T')[0],
        popularity: parseInt(formData.get('popularity')) || 50,
        flags: {
            isFeatured: formData.get('isFeatured') === 'on',
            isSlideshow: formData.get('isSlideshow') === 'on',
            isTopAiring: formData.get('isTopAiring') === 'on',
            isLatestMovie: formData.get('isLatestMovie') === 'on',
            isRecommended: formData.get('isRecommended') === 'on'
        },
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : []
    };
    
    // Add to posts array
    postsData.push(newPost);
    
    // Save to localStorage for now (in production, this would be an API call)
    savePostsToStorage();
    
    // Update display
    updatePostsTable();
    updateStats();
    
    // Close modal and show success message
    closeAddPostModal();
    showNotification('Post added successfully!', 'success');
    
    // New post added successfully
}

// Generate ID from title
function generateId(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
}

// Edit post
function editPost(postId) {
    const post = postsData.find(p => p.id === postId);
    if (!post) return;
    
    // Pre-fill form with post data
    document.getElementById('post-title').value = post.title;
    document.getElementById('post-type').value = post.type;
    populateCategoryDropdown(post.type);
    document.getElementById('post-category').value = post.category;
    document.getElementById('post-year').value = post.year;
    document.getElementById('post-duration').value = post.duration;
    document.getElementById('post-rating').value = post.rating;
    document.getElementById('post-description').value = post.description;
    document.getElementById('post-poster').value = post.poster;
    document.getElementById('post-backdrop').value = post.backdrop;
    document.getElementById('post-genres').value = post.genres.join(', ');
    document.getElementById('post-director').value = post.director;
    document.getElementById('post-trailer').value = post.trailer;
    document.getElementById('post-cast').value = post.cast.join(', ');
    document.getElementById('post-tags').value = post.tags.join(', ');
    document.getElementById('post-popularity').value = post.popularity;
    document.getElementById('popularity-value').textContent = post.popularity;
    
    // Set flags
    document.querySelector('input[name="isFeatured"]').checked = post.flags?.isFeatured || false;
    document.querySelector('input[name="isSlideshow"]').checked = post.flags?.isSlideshow || false;
    document.querySelector('input[name="isTopAiring"]').checked = post.flags?.isTopAiring || false;
    document.querySelector('input[name="isLatestMovie"]').checked = post.flags?.isLatestMovie || false;
    document.querySelector('input[name="isRecommended"]').checked = post.flags?.isRecommended || false;
    
    // Update form to handle editing
    document.querySelector('#add-post-form button[type="submit"]').textContent = 'Update Post';
    document.querySelector('#add-post-form button[type="submit"]').onclick = () => updatePost(postId);
    
    // Show modal
    showAddPostModal();
}

// Update existing post
function updatePost(postId) {
    const formData = new FormData(document.getElementById('add-post-form'));
    const postIndex = postsData.findIndex(p => p.id === postId);
    
    if (postIndex === -1) return;
    
    // Update post object
    postsData[postIndex] = {
        ...postsData[postIndex],
        title: formData.get('title'),
        type: formData.get('type'),
        category: formData.get('category'),
        year: parseInt(formData.get('year')) || new Date().getFullYear(),
        duration: formData.get('duration'),
        rating: parseFloat(formData.get('rating')) || 0,
        description: formData.get('description'),
        poster: formData.get('poster'),
        backdrop: formData.get('backdrop'),
        genres: formData.get('genres') ? formData.get('genres').split(',').map(g => g.trim()) : [],
        director: formData.get('director'),
        cast: formData.get('cast') ? formData.get('cast').split(',').map(c => c.trim()) : [],
        trailer: formData.get('trailer'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
        popularity: parseInt(formData.get('popularity')) || 50,
        flags: {
            isFeatured: formData.get('isFeatured') === 'on',
            isSlideshow: formData.get('isSlideshow') === 'on',
            isTopAiring: formData.get('isTopAiring') === 'on',
            isLatestMovie: formData.get('isLatestMovie') === 'on',
            isRecommended: formData.get('isRecommended') === 'on'
        }
    };
    
    // Save to storage
    savePostsToStorage();
    
    // Update display
    updatePostsTable();
    updateStats();
    
    // Reset form and close modal
    closeAddPostModal();
    showNotification('Post updated successfully!', 'success');
    
    // Reset form button
    document.querySelector('#add-post-form button[type="submit"]').textContent = 'Add Post';
    document.querySelector('#add-post-form button[type="submit"]').onclick = addNewPost;
}

// Delete post
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        postsData = postsData.filter(p => p.id !== postId);
        savePostsToStorage();
        updatePostsTable();
        updateStats();
        showNotification('Post deleted successfully!', 'success');
    }
}

// Save posts to localStorage (temporary storage)
function savePostsToStorage() {
    const dataToSave = {
        posts: postsData,
        categories: categoriesData,
        contentFlags: {
            slideshow: "Featured content for homepage hero carousel",
            topAiring: "Currently popular/running series",
            latestMovie: "Recently released movies",
            recommended: "Editor picks and recommendations"
        }
    };
    localStorage.setItem('quravel-posts', JSON.stringify(dataToSave));
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
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
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Quick action functions
function manageSlideshow() {
    window.location.href = 'admin-slideshow.html';
}

function manageCategories() {
    window.location.href = 'admin-categories.html';
}

function bulkActions() {
    showNotification('Bulk actions feature coming soon!', 'info');
}

function analytics() {
    showNotification('Analytics feature coming soon!', 'info');
}

// Import/Export functions
function importPosts() {
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
                    if (data.posts) {
                        postsData = data.posts;
                        savePostsToStorage();
                        updatePostsTable();
                        updateStats();
                        showNotification('Posts imported successfully!', 'success');
                    }
                } catch (error) {
                    showNotification('Error importing posts: Invalid JSON format', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function exportPosts() {
    const dataToExport = {
        posts: postsData,
        categories: categoriesData,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quravel-posts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Posts exported successfully!', 'success');
}

// ===== STREAMING PAGE MANAGEMENT FUNCTIONS =====

// Show Add Streaming Modal
function showAddStreamingModal() {
    document.getElementById('add-streaming-modal').style.display = 'block';
    // Add first video source by default
    addVideoSource();
    
    // Show/hide episodes section based on content type
    const typeSelect = document.getElementById('streaming-type');
    typeSelect.addEventListener('change', toggleEpisodesSection);
}

// Close Add Streaming Modal
function closeAddStreamingModal() {
    document.getElementById('add-streaming-modal').style.display = 'none';
    document.getElementById('add-streaming-form').reset();
    document.getElementById('video-sources-container').innerHTML = '';
    document.getElementById('episodes-container').innerHTML = '';
    document.getElementById('episodes-section').style.display = 'none';
}

// Toggle episodes section based on content type
function toggleEpisodesSection() {
    const type = document.getElementById('streaming-type').value;
    const episodesSection = document.getElementById('episodes-section');
    
    if (type === 'tv-show' || type === 'anime') {
        episodesSection.style.display = 'block';
        if (document.getElementById('episodes-container').children.length === 0) {
            addEpisode();
        }
    } else {
        episodesSection.style.display = 'none';
    }
}

// Add video source
function addVideoSource() {
    const container = document.getElementById('video-sources-container');
    const sourceId = 'source_' + Date.now();
    
    const sourceItem = document.createElement('div');
    sourceItem.className = 'video-source-item';
    sourceItem.innerHTML = `
        <div class="source-header">
            <span class="source-title">Video Source</span>
            <button type="button" class="remove-source" onclick="removeVideoSource(this)">Remove</button>
        </div>
        <div class="source-fields">
            <div class="form-group">
                <label>Source Name</label>
                <input type="text" name="source_name_${sourceId}" placeholder="e.g., Primary Source" required>
            </div>
            <div class="form-group">
                <label>Video URL</label>
                <input type="url" name="source_url_${sourceId}" placeholder="https://..." required>
            </div>
            <div class="form-group">
                <label>Quality</label>
                <select name="source_quality_${sourceId}">
                    <option value="SD">SD</option>
                    <option value="HD" selected>HD</option>
                    <option value="4K">4K</option>
                </select>
            </div>
            <div class="form-group">
                <label>Server</label>
                <input type="text" name="source_server_${sourceId}" placeholder="e.g., Server 1">
            </div>
        </div>
    `;
    
    container.appendChild(sourceItem);
}

// Remove video source
function removeVideoSource(button) {
    button.closest('.video-source-item').remove();
}

// Add episode
function addEpisode() {
    const container = document.getElementById('episodes-container');
    const episodeId = 'episode_' + Date.now();
    const episodeNumber = container.children.length + 1;
    
    const episodeItem = document.createElement('div');
    episodeItem.className = 'episode-item';
    episodeItem.innerHTML = `
        <div class="source-header">
            <span class="episode-title">Episode ${episodeNumber}</span>
            <button type="button" class="remove-episode" onclick="removeEpisode(this)">Remove</button>
        </div>
        <div class="episode-fields">
            <div class="form-group">
                <label>Episode Title</label>
                <input type="text" name="episode_title_${episodeId}" placeholder="Episode ${episodeNumber}" required>
            </div>
            <div class="form-group">
                <label>Episode Number</label>
                <input type="number" name="episode_number_${episodeId}" value="${episodeNumber}" min="1" required>
            </div>
            <div class="form-group">
                <label>Duration</label>
                <input type="text" name="episode_duration_${episodeId}" placeholder="e.g., 45m">
            </div>
            <div class="form-group">
                <label>Video Source</label>
                <select name="episode_source_${episodeId}">
                    <option value="">Select Source</option>
                </select>
            </div>
        </div>
    `;
    
    container.appendChild(episodeItem);
    updateEpisodeSourceOptions();
}

// Remove episode
function removeEpisode(button) {
    button.closest('.episode-item').remove();
    updateEpisodeSourceOptions();
}

// Update episode source options
function updateEpisodeSourceOptions() {
    const sources = document.querySelectorAll('.video-source-item input[name^="source_name_"]');
    const episodeSources = document.querySelectorAll('select[name^="episode_source_"]');
    
    episodeSources.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select Source</option>';
        
        sources.forEach((source, index) => {
            const option = document.createElement('option');
            option.value = `source_${index + 1}`;
            option.textContent = source.value || `Source ${index + 1}`;
            select.appendChild(option);
        });
        
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

// Handle streaming form submission
document.addEventListener('DOMContentLoaded', function() {
    const streamingForm = document.getElementById('add-streaming-form');
    if (streamingForm) {
        streamingForm.addEventListener('submit', handleStreamingFormSubmit);
    }
});

// Handle streaming form submit
function handleStreamingFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const type = formData.get('type');
    
    // Create streaming page object
    const streamingPage = {
        id: generateId(title),
        title: title,
        type: type,
        year: parseInt(formData.get('year')) || new Date().getFullYear(),
        rating: parseFloat(formData.get('rating')) || 0,
        description: formData.get('description'),
        poster: formData.get('poster'),
        backdrop: formData.get('backdrop'),
        genres: formData.get('genres') ? formData.get('genres').split(',').map(g => g.trim()) : [],
        videoSources: [],
        episodes: [],
        seasons: [],
        sections: {
            youMayLikeThis: [],
            recommended: []
        },
        settings: {
            enableComments: formData.get('enableComments') === 'on',
            enableRelated: formData.get('enableRelated') === 'on',
            isPremium: formData.get('isPremium') === 'on'
        },
        dateCreated: new Date().toISOString(),
        views: 0,
        likes: 0
    };
    
    // Collect video sources
    const sourceContainers = document.querySelectorAll('.video-source-item');
    sourceContainers.forEach((container, index) => {
        const name = container.querySelector(`input[name^="source_name_"]`).value;
        const url = container.querySelector(`input[name^="source_url_"]`).value;
        const quality = container.querySelector(`select[name^="source_quality_"]`).value;
        const server = container.querySelector(`input[name^="source_server_"]`).value;
        
        if (name && url) {
            streamingPage.videoSources.push({
                id: `source_${index + 1}`,
                name: name,
                url: url,
                quality: quality,
                server: server
            });
        }
    });
    
    // Collect episodes/seasons based on content type and episode type
    if (type === 'tv-show' || type === 'anime') {
        const episodeType = formData.get('episode_type') || 'single-season';
        
        if (episodeType === 'multi-season') {
            // Handle multi-season content
            const seasonContainers = document.querySelectorAll('.season-item');
            seasonContainers.forEach((seasonContainer, seasonIndex) => {
                const seasonTitle = seasonContainer.querySelector(`input[name^="season_title_"]`).value;
                const seasonNumber = parseInt(seasonContainer.querySelector(`input[name^="season_number_"]`).value);
                
                if (seasonTitle && seasonNumber) {
                    const season = {
                        id: `season_${seasonNumber}`,
                        number: seasonNumber,
                        title: seasonTitle,
                        episodes: []
                    };
                    
                    // Collect episodes for this season
                    const episodeContainers = seasonContainer.querySelectorAll('.season-episode-item');
                    episodeContainers.forEach((episodeContainer, episodeIndex) => {
                        const episodeTitle = episodeContainer.querySelector(`input[name^="season_episode_title_"]`).value;
                        const episodeNumber = parseInt(episodeContainer.querySelector(`input[name^="season_episode_number_"]`).value);
                        const episodeDuration = episodeContainer.querySelector(`input[name^="season_episode_duration_"]`).value;
                        
                        if (episodeTitle && episodeNumber) {
                            season.episodes.push({
                                id: `ep${seasonNumber}_${episodeNumber}`,
                                number: episodeNumber,
                                title: episodeTitle,
                                duration: episodeDuration
                            });
                        }
                    });
                    
                    streamingPage.seasons.push(season);
                }
            });
            
            // Create legacy episodes array for backward compatibility (first season episodes only)
            const firstSeason = streamingPage.seasons.find(s => s.number === 1);
            if (firstSeason) {
                streamingPage.episodes = [...firstSeason.episodes];
            }
        } else {
            // Handle single season content
            const episodeContainers = document.querySelectorAll('.episode-item');
            episodeContainers.forEach((container, index) => {
                const episodeTitle = container.querySelector(`input[name^="episode_title_"]`).value;
                const episodeNumber = parseInt(container.querySelector(`input[name^="episode_number_"]`).value);
                const episodeDuration = container.querySelector(`input[name^="episode_duration_"]`).value;
                const episodeSource = container.querySelector(`select[name^="episode_source_"]`).value;
                
                if (episodeTitle && episodeNumber) {
                    streamingPage.episodes.push({
                        id: `episode_${index + 1}`,
                        number: parseInt(episodeNumber),
                        title: episodeTitle,
                        duration: episodeDuration,
                        sources: episodeSource ? [episodeSource] : []
                    });
                    
                    // Create single season structure
                    streamingPage.seasons = [{
                        id: 'season1',
                        number: 1,
                        title: 'Season 1',
                        episodes: [...streamingPage.episodes]
                    }];
                }
            });
        }
    }
    
    // Collect "You May Like This" section content
    const youMayLikeItems = document.querySelectorAll('#you-may-like-container .section-content-item');
    youMayLikeItems.forEach((container, index) => {
        const title = container.querySelector('input[name^="you-may-like_title_"]').value;
        const contentType = container.querySelector('select[name^="you-may-like_type_"]').value;
        const poster = container.querySelector('input[name^="you-may-like_poster_"]').value;
        const year = container.querySelector('input[name^="you-may-like_year_"]').value;
        const rating = container.querySelector('input[name^="you-may-like_rating_"]').value;
        const link = container.querySelector('input[name^="you-may-like_link_"]').value;
        
        if (title) {
            streamingPage.sections.youMayLikeThis.push({
                id: `you-may-like-${index + 1}`,
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
    const recommendedItems = document.querySelectorAll('#recommended-container .section-content-item');
    recommendedItems.forEach((container, index) => {
        const title = container.querySelector('input[name^="recommended_title_"]').value;
        const contentType = container.querySelector('select[name^="recommended_type_"]').value;
        const poster = container.querySelector('input[name^="recommended_poster_"]').value;
        const year = container.querySelector('input[name^="recommended_year_"]').value;
        const rating = container.querySelector('input[name^="recommended_rating_"]').value;
        const link = container.querySelector('input[name^="recommended_link_"]').value;
        
        if (title) {
            streamingPage.sections.recommended.push({
                id: `recommended-${index + 1}`,
                title: title,
                type: contentType,
                poster: poster,
                year: parseInt(year) || new Date().getFullYear(),
                rating: parseFloat(rating) || 0,
                link: link
            });
        }
    });
    
    // Add to streaming pages data
    streamingPagesData.push(streamingPage);
    
    // Save to localStorage
    localStorage.setItem('quravel_streaming_pages', JSON.stringify(streamingPagesData));
    
    // Update display
    if (typeof updateStreamingTable === 'function') {
        updateStreamingTable();
    }
    if (typeof updateStreamingStats === 'function') {
        updateStreamingStats();
    }
    
    // Close modal and show success message
    closeAddStreamingModal();
    showNotification('Streaming page created successfully!', 'success');
    
    // New streaming page created successfully
}

// Toggle between single and multi-season episodes
function toggleEpisodeType() {
    const type = document.querySelector('select[name="episode_type"]').value;
    const singleSeason = document.getElementById('single-season-episodes');
    const multiSeason = document.getElementById('multi-season-episodes');
    
    if (type === 'multi-season') {
        singleSeason.style.display = 'none';
        multiSeason.style.display = 'block';
        if (document.getElementById('seasons-container').children.length === 0) {
            addSeason();
        }
    } else {
        singleSeason.style.display = 'block';
        multiSeason.style.display = 'none';
        if (document.getElementById('episodes-container').children.length === 0) {
            addEpisode();
        }
    }
}

// Add season for multi-season content
function addSeason() {
    const container = document.getElementById('seasons-container');
    const seasonId = 'season_' + Date.now();
    const seasonNumber = container.children.length + 1;
    
    const seasonItem = document.createElement('div');
    seasonItem.className = 'season-item';
    seasonItem.innerHTML = `
        <div class="source-header">
            <span class="season-title">Season ${seasonNumber}</span>
            <button type="button" class="remove-season" onclick="removeSeason(this)">Remove Season</button>
        </div>
        <div class="season-fields">
            <div class="form-row">
                <div class="form-group">
                    <label>Season Title</label>
                    <input type="text" name="season_title_${seasonId}" placeholder="Season ${seasonNumber}" value="Season ${seasonNumber}" required>
                </div>
                <div class="form-group">
                    <label>Season Number</label>
                    <input type="number" name="season_number_${seasonId}" value="${seasonNumber}" min="1" required>
                </div>
            </div>
            <div class="episodes-management">
                <h5>Episodes in Season ${seasonNumber}</h5>
                <div class="season-episodes-container" id="season-episodes-${seasonId}">
                    <!-- Episodes for this season will be added here -->
                </div>
                <button type="button" class="btn btn-secondary btn-small" onclick="addSeasonEpisode('${seasonId}')">Add Episode</button>
            </div>
        </div>
    `;
    
    container.appendChild(seasonItem);
    
    // Add first episode to the new season
    setTimeout(() => {
        addSeasonEpisode(seasonId);
    }, 100);
}

// Remove season
function removeSeason(button) {
    button.closest('.season-item').remove();
}

// Add episode to a specific season
function addSeasonEpisode(seasonId) {
    const container = document.getElementById(`season-episodes-${seasonId}`);
    const episodeId = 'season_episode_' + Date.now();
    const episodeNumber = container.children.length + 1;
    
    const episodeItem = document.createElement('div');
    episodeItem.className = 'season-episode-item';
    episodeItem.innerHTML = `
        <div class="episode-header">
            <span class="episode-title">Episode ${episodeNumber}</span>
            <button type="button" class="remove-season-episode" onclick="removeSeasonEpisode(this)">Remove</button>
        </div>
        <div class="episode-fields">
            <div class="form-row">
                <div class="form-group">
                    <label>Episode Title</label>
                    <input type="text" name="season_episode_title_${episodeId}" placeholder="Episode ${episodeNumber}" required>
                </div>
                <div class="form-group">
                    <label>Episode Number</label>
                    <input type="number" name="season_episode_number_${episodeId}" value="${episodeNumber}" min="1" required>
                </div>
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" name="season_episode_duration_${episodeId}" placeholder="24m">
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(episodeItem);
}

// Remove episode from season
function removeSeasonEpisode(button) {
    button.closest('.season-episode-item').remove();
    // Renumber remaining episodes
    const container = button.closest('.season-episodes-container');
    const episodes = container.querySelectorAll('.season-episode-item');
    episodes.forEach((episode, index) => {
        const number = index + 1;
        const titleInput = episode.querySelector('input[name*="season_episode_title_"]');
        const numberInput = episode.querySelector('input[name*="season_episode_number_"]');
        const titleSpan = episode.querySelector('.episode-title');
        
        titleSpan.textContent = `Episode ${number}`;
        titleInput.placeholder = `Episode ${number}`;
        titleInput.value = titleInput.value || `Episode ${number}`;
        numberInput.value = number;
    });
}

// Add content to streaming page sections
function addSectionContent(sectionType) {
    const containerId = sectionType === 'you-may-like' ? 'you-may-like-container' : 'recommended-container';
    const container = document.getElementById(containerId);
    const contentId = `${sectionType}_content_${Date.now()}`;
    
    const contentItem = document.createElement('div');
    contentItem.className = 'section-content-item';
    contentItem.innerHTML = `
        <div class="content-header">
            <span class="content-title">Content Item</span>
            <button type="button" class="remove-content" onclick="removeSectionContent(this)">Remove</button>
        </div>
        <div class="content-fields">
            <div class="form-row">
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" name="${sectionType}_title_${contentId}" placeholder="Content title" required>
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select name="${sectionType}_type_${contentId}">
                        <option value="movie">Movie</option>
                        <option value="tv-show">TV Show</option>
                        <option value="anime">Anime</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Poster URL</label>
                    <input type="url" name="${sectionType}_poster_${contentId}" placeholder="https://example.com/poster.jpg">
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="number" name="${sectionType}_year_${contentId}" min="1900" max="2030" value="2024">
                </div>
                <div class="form-group">
                    <label>Rating</label>
                    <input type="number" name="${sectionType}_rating_${contentId}" min="0" max="10" step="0.1" placeholder="8.0">
                </div>
            </div>
            <div class="form-group">
                <label>Link (Optional)</label>
                <input type="url" name="${sectionType}_link_${contentId}" placeholder="https://example.com/link">
            </div>
        </div>
    `;
    
    container.appendChild(contentItem);
}

// Remove content from section
function removeSectionContent(button) {
    button.closest('.section-content-item').remove();
}

// Quick action functions
function manageStreamingPages() {
    showAddStreamingModal();
}

// Utility function to generate ID
function generateId(title) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') + '-' + Date.now();
}

// Show notification function (if not already defined)
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
// POST COMPOSE FUNCTIONS (called from admin.html and admin-posts.html)
// =============================================================================

// Show compose modal (for backward compatibility)
function showComposeModal() {
    // Redirect to the dedicated posts management page
    window.location.href = 'admin-posts.html';
}

// Show templates modal (for backward compatibility)
function manageTemplates() {
    // Redirect to the dedicated posts management page
    window.location.href = 'admin-posts.html';
}

// Popularity range slider
document.addEventListener('DOMContentLoaded', function() {
    const popularitySlider = document.getElementById('post-popularity');
    const popularityValue = document.getElementById('popularity-value');
    
    if (popularitySlider && popularityValue) {
        popularitySlider.addEventListener('input', function() {
            popularityValue.textContent = this.value;
        });
    }
});

// =============================================================================
// UTILITY FUNCTIONS FOR ADMIN PANEL
// =============================================================================

// Generic notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Import/Export functions (basic implementations)
function importPosts() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                // Process the imported data
                localStorage.setItem('quravel_posts', JSON.stringify(data));
                showNotification('Posts imported successfully', 'success');
                location.reload();
            } catch (error) {
                showNotification('Error importing posts: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function exportPosts() {
    const postsData = JSON.parse(localStorage.getItem('quravel_posts') || '[]');
    const dataStr = JSON.stringify(postsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quravel-posts.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Posts exported successfully', 'success');
}