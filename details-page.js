// Details Page JavaScript

class DetailsPage {
    constructor() {
        this.contentId = this.getContentIdFromURL();
        this.contentData = null;
        this.init();
    }

    init() {
        this.loadContent();
        this.setupEventListeners();
    }

    getContentIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadContent() {
        try {
            // Show loading state
            document.getElementById('loadingState').style.display = 'flex';
            document.getElementById('contentContainer').style.display = 'none';
            document.getElementById('errorState').style.display = 'none';

            // Load content data from JSON
            this.contentData = await this.getContentById(this.contentId);
            
            if (!this.contentData) {
                throw new Error('Content not found');
            }

            this.renderContent();
            
            // Hide loading, show content
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('contentContainer').style.display = 'block';

        } catch (error) {
            // Error loading content
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('errorState').style.display = 'flex';
        }
    }

    async getContentById(id) {
        try {
            // Load posts data from JSON file
            const response = await fetch('data/posts.json');
            const data = await response.json();
            const posts = data.posts || [];
            
            // Find post by ID
            const post = posts.find(p => p.id === id);
            if (!post) {
                // Content not found
                return null;
            }

            // Convert to details page format
            return {
                id: post.id,
                title: post.title,
                year: post.year,
                rating: post.rating,
                quality: this.getQualityFromRating(post.rating),
                type: post.type,
                duration: post.duration,
                poster: post.poster,
                backdrop: post.backdrop,
                description: post.description,
                genres: post.genres || [],
                director: post.director,
                cast: post.cast || [],
                studio: post.studio || 'Production Studio',
                // Generate episodes for TV shows/anime
                episodes: this.generateEpisodes(post)
            };
        } catch (error) {
            // Error loading content by ID
            return null;
        }
    }

    getQualityFromRating(rating) {
        if (!rating) return 'HD';
        if (rating >= 8.5) return 'UHD';
        if (rating >= 7.5) return '4K';
        if (rating >= 6.5) return 'HD';
        return 'SD';
    }

    generateEpisodes(post) {
        if (post.type === 'movie') {
            return [{
                number: 1,
                title: "Full Movie",
                duration: post.duration,
                description: post.description || `Full movie: ${post.title}`
            }];
        } else if (post.type === 'anime' || post.type === 'tv-show') {
            // Generate episodes for TV shows/anime
            const episodeCount = Math.min(parseInt(post.duration) || 12, 24);
            const episodes = [];
            for (let i = 1; i <= episodeCount; i++) {
                episodes.push({
                    number: i,
                    title: `Episode ${i}`,
                    duration: "24 min",
                    description: `Episode ${i} of ${post.title}. ${this.generateEpisodeDescription(post.title)}`
                });
            }
            return episodes;
        }
        return [{
            number: 1,
            title: "Full Content",
            duration: post.duration,
            description: post.description || `Content: ${post.title}`
        }];
    }



    renderContent() {
        const content = this.contentData;
        
        // Update page title
        document.getElementById('pageTitle').textContent = `${content.title} - Quravel`;
        
        // Update hero section
        document.getElementById('contentTitle').textContent = content.title;
        document.getElementById('contentRating').textContent = `★ ${content.rating || 'N/A'}`;
        document.getElementById('contentYear').textContent = content.year;
        document.getElementById('contentDuration').textContent = content.duration || '120 min';
        document.getElementById('contentType').textContent = content.type;
        
        // Update quality badge
        const qualityElement = document.getElementById('contentQuality');
        qualityElement.textContent = content.quality;
        qualityElement.className = `quality badge-${content.quality.toLowerCase()}`;
        
        // Update poster and backdrop
        document.getElementById('contentPoster').src = content.poster;
        document.getElementById('contentPoster').alt = content.title;
        document.getElementById('heroBackdrop').style.backgroundImage = `url('${content.backdrop || content.poster}')`;
        
        // Update description
        document.getElementById('contentDescription').textContent = content.description || this.generateDescription(content);
        
        // Update details grid
        this.renderDetails(content);
        
        // Show episodes section for TV shows
        if (content.type === 'TV Show' || content.type === 'Anime') {
            document.getElementById('episodesSection').style.display = 'block';
            this.renderEpisodes(content);
        }
    }

    renderDetails(content) {
        const detailsGrid = document.getElementById('detailsGrid');
        
        const details = [
            { label: 'Type', value: content.type },
            { label: 'Year', value: content.year },
            { label: 'Rating', value: `★ ${content.rating}` },
            { label: 'Quality', value: content.quality },
            { label: 'Duration', value: content.duration || '120 min' },
            { label: 'Language', value: 'English' },
            { label: 'Subtitles', value: 'English, Spanish, French' },
            { label: 'Genres', value: this.formatGenres(content.genres || ['Action', 'Drama']) },
            { label: 'Director', value: content.director || 'Various' },
            { label: 'Cast', value: content.cast || 'Star Cast' },
            { label: 'Studio', value: content.studio || 'Production Studio' }
        ];

        detailsGrid.innerHTML = details.map(detail => `
            <div class="detail-item">
                <div class="detail-label">${detail.label}</div>
                <div class="detail-value">${detail.value}</div>
            </div>
        `).join('');
    }

    renderEpisodes(content) {
        const episodesList = document.getElementById('episodesList');
        
        // Use episodes from content data
        const episodes = content.episodes || [];

        episodesList.innerHTML = episodes.map(episode => `
            <div class="episode-card" onclick="detailsPage.playEpisode(${episode.number})">
                <div class="episode-header">
                    <div class="episode-number">${episode.number}</div>
                    <div>
                        <div class="episode-title">${episode.title}</div>
                        <div class="episode-duration">${episode.duration}</div>
                    </div>
                </div>
                <div class="episode-description">${episode.description}</div>
            </div>
        `).join('');
    }

    formatGenres(genres) {
        if (Array.isArray(genres)) {
            return `<div class="genres">${genres.map(genre => 
                `<span class="genre-tag">${genre}</span>`
            ).join('')}</div>`;
        }
        return genres;
    }

    generateDescription(content) {
        const descriptions = {
            'Movie': `Experience ${content.title}, a captivating ${content.type.toLowerCase()} that brings together compelling storytelling and stunning visuals. Set in a world where ${content.genres ? content.genres.join(', ').toLowerCase() : 'action and drama'} collide, this film offers an unforgettable journey through compelling narratives and breathtaking sequences.`,
            'TV Show': `Dive into the world of ${content.title}, a thrilling ${content.type.toLowerCase()} series that has captivated audiences worldwide. With complex characters and gripping plotlines, each episode delivers intense drama and exceptional performances that keep viewers on the edge of their seats.`,
            'Anime': `Enter the extraordinary universe of ${content.title}, a groundbreaking ${content.type.toLowerCase()} series that combines stunning animation with profound storytelling. Featuring rich character development and epic adventures, this series pushes the boundaries of animated entertainment.`
        };

        return descriptions[content.type] || descriptions['Movie'];
    }

    generateEpisodeDescription(title) {
        const descriptions = [
            `The plot thickens as our protagonist faces unexpected challenges.`,
            `A shocking revelation changes everything our characters thought they knew.`,
            `New allies and enemies emerge in this thrilling continuation.`,
            `The stakes are higher than ever in this action-packed episode.`,
            `Emotional moments balance with intense action sequences.`,
            `A crucial turning point that will affect the entire series.`,
            `Surprising character development and plot twists await.`,
            `The climax builds with non-stop excitement and drama.`
        ];
        return descriptions[Math.floor(Math.random() * descriptions.length)];
    }

    setupEventListeners() {
        // Watch Now button
        document.getElementById('watchNowBtn').addEventListener('click', () => {
            this.goToStreamingPage();
        });

        // Add to List button
        document.getElementById('addToListBtn').addEventListener('click', () => {
            this.addToList();
        });

        // Request button
        document.getElementById('requestBtn').addEventListener('click', () => {
            this.sendRequest();
        });

        // Escape key to go back
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.history.back();
            }
        });
    }

    goToStreamingPage() {
        if (this.contentData) {
            // Navigate to streaming page with content ID
            window.location.href = `streaming.html?id=${this.contentData.id}`;
        }
    }

    playEpisode(episodeNumber) {
        if (this.contentData) {
            // Navigate to specific episode
            window.location.href = `streaming.html?id=${this.contentData.id}&episode=${episodeNumber}`;
        }
    }

    addToList() {
        const content = this.contentData;
        const button = document.getElementById('addToListBtn');
        
        // Toggle between Add to List and Remove from List
        if (button.textContent.includes('Add')) {
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                </svg>
                Remove from List
            `;
            this.showNotification(`${content.title} added to your list!`);
        } else {
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                Add to List
            `;
            this.showNotification(`${content.title} removed from your list.`);
        }
    }

    sendRequest() {
        const content = this.contentData;
        this.showNotification(`Request sent for ${content.title}. We'll notify you when it's available!`);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-500);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            font-weight: 600;
            transform: translateX(100%);
            transition: transform 300ms ease-in-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Sample data methods (same as main page)
    getMovieData() {
        return [
            {
                id: 1,
                title: "Avatar: The Way of Water",
                year: 2022,
                rating: 7.6,
                quality: "4K",
                type: "Movie",
                duration: "192 min",
                director: "James Cameron",
                studio: "20th Century Studios",
                cast: "Sam Worthington, Zoe Saldana, Sigourney Weaver",
                genres: ["Action", "Adventure", "Fantasy"],
                poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure."
            },
            {
                id: 2,
                title: "Top Gun: Maverick",
                year: 2022,
                rating: 8.3,
                quality: "HD",
                type: "Movie",
                duration: "130 min",
                director: "Joseph Kosinski",
                studio: "Skydance, Paramount Pictures",
                cast: "Tom Cruise, Miles Teller, Jennifer Connelly",
                genres: ["Action", "Drama"],
                poster: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it."
            }
        ];
    }

    getLatestMovieData() {
        return [
            {
                id: 3,
                title: "Barbie",
                year: 2023,
                rating: 6.9,
                quality: "4K",
                type: "Movie",
                duration: "114 min",
                director: "Greta Gerwig",
                studio: "Warner Bros. Pictures",
                cast: "Margot Robbie, Ryan Gosling, America Ferrera",
                genres: ["Adventure", "Comedy", "Fantasy"],
                poster: "https://images.unsplash.com/photo-1635805737707-575885ab0820?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans."
            },
            {
                id: 4,
                title: "Oppenheimer",
                year: 2023,
                rating: 8.4,
                quality: "HD",
                type: "Movie",
                duration: "180 min",
                director: "Christopher Nolan",
                studio: "Universal Pictures",
                cast: "Cillian Murphy, Emily Blunt, Matt Damon",
                genres: ["Biography", "Drama", "History"],
                poster: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II."
            }
        ];
    }

    getTrendingData() {
        return [
            {
                id: 5,
                title: "Stranger Things",
                year: 2024,
                rating: 8.7,
                quality: "4K",
                type: "TV Show",
                duration: "51 min",
                studio: "Netflix",
                genres: ["Drama", "Fantasy", "Horror"],
                poster: "https://images.unsplash.com/photo-1489599571770-011b94d28b4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back."
            }
        ];
    }

    getLatestTVShowData() {
        return [
            {
                id: 6,
                title: "One Piece",
                year: 2023,
                rating: 8.9,
                quality: "4K",
                type: "TV Show",
                duration: "24 min",
                studio: "Toei Animation",
                genres: ["Animation", "Adventure", "Comedy"],
                poster: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger."
            }
        ];
    }

    getLatestAnimeData() {
        return [
            {
                id: 7,
                title: "Attack on Titan: Final Season",
                year: 2023,
                rating: 9.0,
                quality: "4K",
                type: "Anime",
                duration: "24 min",
                studio: "WIT Studio, MAPPA",
                genres: ["Animation", "Action", "Drama"],
                poster: "https://images.unsplash.com/photo-1534809027769-b00d750a6463?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
                description: "Humanity fights for survival against giant humanoid Titans that have brought civilization to the brink of extinction."
            }
        ];
    }

    getRecommendationData() {
        return [
            {
                id: 8,
                title: "The Dark Knight",
                year: 2008,
                rating: 9.0,
                quality: "4K",
                type: "Movie",
                duration: "152 min",
                director: "Christopher Nolan",
                studio: "Warner Bros. Pictures",
                cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.detailsPage = new DetailsPage();
});