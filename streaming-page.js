// Streaming Page JavaScript

class StreamingPage {
    constructor() {
        this.contentId = this.getContentIdFromURL();
        this.episodeNumber = this.getEpisodeFromURL();
        this.seasonNumber = this.getSeasonFromURL();
        this.contentData = null;
        this.currentAnime = null;
        this.currentSeason = 1;
        this.currentEpisode = 1;
        this.currentType = "sub";
        this.currentServer = "hd01";
        this.watchlist = JSON.parse(localStorage.getItem('quravel_watchlist')) || {};
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeVideoPlayer();
        this.loadStreamingPageData();
        this.loadAnimeSections();
    }

    // Load streaming page data from admin panel
    async loadStreamingPageData() {
        if (!this.contentId) {
            // No content ID found
            return;
        }

        try {
            // Try to load from admin-managed streaming pages
            const saved = localStorage.getItem('quravel_streaming_pages');
            if (saved) {
                const streamingPages = JSON.parse(saved);
                const page = streamingPages.find(p => p.id === this.contentId);
                
                if (page) {
                    this.contentData = page;
                    this.populatePageContent(page);
                    this.updateVideoSources(page.videoSources || []);
                    
                    // If it's a TV show with episodes/seasons, set up episode navigation
                    if (page.type === 'tv-show' || page.type === 'anime') {
                        // Check if it has multiple seasons
                        if (page.seasons && page.seasons.length > 1) {
                            // Multi-season content - load current season's episodes
                            const currentSeason = page.seasons.find(s => s.number === this.seasonNumber) || page.seasons[0];
                            this.setupEpisodeNavigation(currentSeason.episodes || []);
                        } else if (page.episodes && page.episodes.length > 0) {
                            // Single season or regular episodes
                            this.setupEpisodeNavigation(page.episodes);
                        }
                    }
                    
                    return;
                }
            }
            
            // Fallback: try to load from posts data
            const postsResponse = await fetch('data/posts.json');
            const postsData = await postsResponse.json();
            const post = postsData.posts?.find(p => p.id === this.contentId);
            
            if (post) {
                this.contentData = post;
                this.populatePageContent(post);
            } else {
                // Content not found in streaming pages or posts
            }
        } catch (error) {
            // Error loading streaming page data
        }
    }

    // Populate page content with streaming page data
    populatePageContent(data) {
        // Update page title
        document.title = `${data.title} - Quravel Streaming`;
        
        // Update meta information
        const titleElement = document.querySelector('.anime-title');
        if (titleElement) {
            titleElement.textContent = data.title;
        }
        
        // Update description
        const descriptionElement = document.querySelector('.anime-description');
        if (descriptionElement && data.description) {
            descriptionElement.textContent = data.description;
        }
        
        // Update year and rating
        const yearElement = document.querySelector('.anime-year');
        if (yearElement && data.year) {
            yearElement.textContent = data.year;
        }
        
        const ratingElement = document.querySelector('.anime-rating');
        if (ratingElement && data.rating) {
            ratingElement.innerHTML = `<span class="rating-number">${data.rating}</span>/10`;
        }
        
        // Update backdrop image
        const backdropElement = document.querySelector('.anime-backdrop');
        if (backdropElement && data.backdrop) {
            backdropElement.src = data.backdrop;
        }
        
        // Update poster image
        const posterElement = document.querySelector('.anime-poster');
        if (posterElement && data.poster) {
            posterElement.src = data.poster;
        }
        
        // Update genres
        const genreElement = document.querySelector('.anime-genres');
        if (genreElement && data.genres) {
            genreElement.innerHTML = data.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('');
        }
        
        // Setup season selector if content has multiple seasons
        this.setupSeasonSelector(data);
    }

    // Update video sources based on admin data
    updateVideoSources(sources) {
        if (!sources || sources.length === 0) return;
        
        // Clear existing sources
        this.videoSources = { raw: { hd01: [] } };
        
        // Add admin-managed sources
        sources.forEach((source, index) => {
            const serverKey = `hd0${index + 1}`;
            this.videoSources.raw[serverKey] = [source.url];
            
            // Update server selector if it exists
            const serverSelect = document.querySelector('#server-select');
            if (serverSelect) {
                const option = document.createElement('option');
                option.value = serverKey;
                option.textContent = `${source.name} (${source.quality})`;
                serverSelect.appendChild(option);
            }
        });
    }

    // Setup episode navigation for TV shows
    setupEpisodeNavigation(episodes) {
        const episodeList = document.querySelector('.episode-list');
        if (!episodeList || !episodes || !episodes.length) return;
        
        episodeList.innerHTML = episodes.map(episode => `
            <div class="episode-item" onclick="streamingPage.selectEpisode(${episode.number})">
                <span class="episode-number">Episode ${episode.number}</span>
                <span class="episode-title">${episode.title}</span>
                <span class="episode-duration">${episode.duration}</span>
            </div>
        `).join('');
    }

    getContentIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    getEpisodeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('episode')) || 1;
    }

    getSeasonFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('season')) || 1;
    }

    // Working video streaming URLs for testing
    videoSources = {
        raw: {
            hd01: [
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
            ],
            hd02: [
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4"
            ],
            hd03: [
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
            ]
        },
        sub: {
            hd01: [
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
            ],
            hd02: [
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4"
            ],
            hd03: [
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
            ]
        },
        dub: {
            hd01: [
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
            ],
            hd02: [
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_2mb.mp4",
                "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/360/big_buck_bunny_360p_5mb.mp4",
                "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_5mb.mp4"
            ],
            hd03: [
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
            ]
        }
    };

    updateVideoPlayer() {
        if (!this.currentAnime) return;

        const video = document.getElementById('main-video');
        const videoTitle = document.getElementById('currentVideoTitle');
        const videoType = document.getElementById('videoType');
        const videoDuration = document.getElementById('videoDuration');
        const videoQuality = document.getElementById('videoQuality');
        const videoRating = document.getElementById('videoRating');
        const currentEpisodeMessage = document.getElementById('currentEpisodeMessage');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const addToListBtn = document.getElementById('addToListBtn');

        // Update video info
        const seasonText = this.getCurrentSeasonData() && this.getCurrentSeasonData().seasonNumber > 1 
            ? `Season ${this.currentSeason} ` 
            : '';
            
        videoTitle.textContent = `${this.currentAnime.title} - ${seasonText}Episode ${this.currentEpisode}`;
        videoType.textContent = this.currentAnime.type || 'Anime';
        videoDuration.textContent = this.currentAnime.duration || '24m';
        videoQuality.textContent = this.getQualityFromRating(this.currentAnime.rating);
        videoRating.textContent = `★ ${this.currentAnime.rating || 'N/A'}`;
        
        currentEpisodeMessage.textContent = 
            `You are currently watching ${seasonText}Episode ${this.currentEpisode} (${this.currentType.charAt(0).toUpperCase() + this.currentType.slice(1)} - ${this.currentServer.toUpperCase()})`;

        // Enable/disable controls
        prevBtn.disabled = this.currentEpisode <= 1;
        nextBtn.disabled = this.currentEpisode >= (this.getCurrentSeasonData()?.episodes || 12);
        addToListBtn.disabled = false;

        // Load video
        this.loadVideo(this.currentEpisode);
    }

    loadVideo(episode) {
        const video = document.getElementById('main-video');
        const videoLoading = document.getElementById('videoLoading');
        const videoError = document.getElementById('videoError');
        
        videoLoading.classList.remove('hidden');
        videoError.classList.remove('show');
        
        try {
            // Get video URL from video sources
            const videoUrl = this.videoSources[this.currentType][this.currentServer][episode - 1];
            
            if (videoUrl) {
                // Clear current source
                video.innerHTML = '';
                
                // Add new source
                const source = document.createElement('source');
                source.src = videoUrl;
                source.type = 'video/mp4';
                video.appendChild(source);
                
                // Load and play video
                video.load();
                this.showToast(`Loading ${this.currentAnime.title} - Episode ${episode}...`);
                
            } else {
                this.showToast(`Episode ${episode} is not available on this server.`, 'error');
                videoError.classList.add('show');
            }
        } catch (error) {
            // Error loading video
            videoError.classList.add('show');
            this.showToast('Error loading video. Please try again.', 'error');
        }
    }

    getCurrentSeasonData() {
        if (this.contentData && this.contentData.seasons) {
            return this.contentData.seasons.find(season => 
                season.number === this.seasonNumber
            );
        } else if (this.currentAnime && this.currentAnime.episodes) {
            return this.currentAnime.episodes.find(season => 
                season.seasonNumber === this.currentSeason
            );
        }
        return null;
    }

    setupSeasonSelector(contentData = null) {
        const seasonSelector = document.getElementById('seasonSelector');
        const seasonButtons = document.getElementById('seasonButtons');
        
        if (!seasonSelector || !seasonButtons) return;
        
        // Use provided contentData or fall back to this.contentData
        const data = contentData || this.contentData;
        
        // Check if content has multiple seasons (seasons array)
        if (data && data.seasons && data.seasons.length > 1) {
            // Show season selector
            seasonSelector.classList.add('visible');
            
            // Generate season buttons
            seasonButtons.innerHTML = data.seasons.map(season => `
                <button class="season-btn ${season.number === this.seasonNumber ? 'active' : ''}" 
                        data-season="${season.number}">
                    Season ${season.number}
                </button>
            `).join('');
            
            // Setup click handlers for season buttons
            this.setupSeasonButtonHandlers();
            
        } else {
            // Hide season selector
            seasonSelector.classList.remove('visible');
        }
    }

    setupSeasonButtonHandlers() {
        const seasonButtons = document.querySelectorAll('.season-btn');
        seasonButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const seasonNum = parseInt(button.dataset.season);
                this.handleSeasonChange(seasonNum);
            });
        });
    }
    
    handleSeasonChange(newSeasonNumber) {
        // Update URL with new season
        const url = new URL(window.location);
        url.searchParams.set('season', newSeasonNumber);
        url.searchParams.set('episode', '1'); // Reset to first episode
        window.history.pushState({}, '', url);
        
        // Update current season
        this.seasonNumber = newSeasonNumber;
        this.currentEpisode = 1;
        
        // Update active season button
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-season="${newSeasonNumber}"]`).classList.add('active');
        
        // Load episodes for new season
        this.loadSeasonEpisodes(newSeasonNumber);
        
        // Update video player
        this.updateVideoPlayer();
        
        this.showToast(`Switched to Season ${newSeasonNumber}`);
    }
    
    loadSeasonEpisodes(seasonNumber) {
        if (this.contentData && this.contentData.seasons) {
            const seasonData = this.contentData.seasons.find(s => s.number === seasonNumber);
            if (seasonData && seasonData.episodes) {
                this.setupEpisodeNavigation(seasonData.episodes);
                return;
            }
        }
        
        // Fallback to default episode navigation
        this.setupEpisodeNavigation([]);
    }
    
    generateEpisodeList() {
        const container = document.getElementById('episodeList');
        if (!container) return;
        
        let episodesHTML = '';
        
        // Get current season data
        const currentSeasonData = this.getCurrentSeasonData();
        const episodes = currentSeasonData ? currentSeasonData.episodes : [];
        
        if (episodes && episodes.length > 0) {
            episodes.forEach(episode => {
                const activeClass = episode.number === this.currentEpisode ? 'active' : '';
                episodesHTML += `
                    <div class="episode-item ${activeClass}" data-episode="${episode.number}">
                        <span>Episode ${episode.number}</span>
                        <span>${episode.duration || '24m'}</span>
                    </div>
                `;
            });
        } else {
            // Fallback to default episodes if no season data
            const totalEpisodes = 12;
            for (let i = 1; i <= totalEpisodes; i++) {
                const activeClass = i === this.currentEpisode ? 'active' : '';
                episodesHTML += `
                    <div class="episode-item ${activeClass}" data-episode="${i}">
                        <span>Episode ${i}</span>
                        <span>${this.currentAnime?.duration || '24m'}</span>
                    </div>
                `;
            }
        }
        
        container.innerHTML = episodesHTML;
    }
        const container = document.getElementById('episodeList');
        if (!container) return;
        
        let episodesHTML = '';
        
        // Get current season data
        const currentSeasonData = this.getCurrentSeasonData();
        const episodes = currentSeasonData ? currentSeasonData.episodes : [];
        
        if (episodes && episodes.length > 0) {
            episodes.forEach(episode => {
                const activeClass = episode.number === this.currentEpisode ? 'active' : '';
                episodesHTML += `
                    <div class="episode-item ${activeClass}" data-episode="${episode.number}">
                        <span>Episode ${episode.number}</span>
                        <span>${episode.duration || '24m'}</span>
                    </div>
                `;
            });
        } else {
            // Fallback to default episodes if no season data
            const totalEpisodes = 12;
            for (let i = 1; i <= totalEpisodes; i++) {
                const activeClass = i === this.currentEpisode ? 'active' : '';
                episodesHTML += `
                    <div class="episode-item ${activeClass}" data-episode="${i}">
                        <span>Episode ${i}</span>
                        <span>${this.currentAnime?.duration || '24m'}</span>
                    </div>
                `;
            }
        }
        
        container.innerHTML = episodesHTML;
    }

    getQualityFromRating(rating) {
        if (!rating) return 'HD';
        if (rating >= 8.5) return '4K';
        if (rating >= 7.5) return 'UHD';
        return 'HD';
        if (rating >= 7.5) return '4K';
        if (rating >= 6.5) return 'HD';
        return 'SD';
    }

    createEpisodesStructure(post) {
        // Create episodes based on content type
        if (post.type === 'movie') {
            return [{
                number: 1,
                title: "Full Movie",
                duration: post.duration,
                thumbnail: post.poster
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
                    thumbnail: post.poster
                });
            }
            return episodes;
        }
        return [{
            number: 1,
            title: "Full Content",
            duration: post.duration,
            thumbnail: post.poster
        }];
    }



    renderContent() {
        const content = this.contentData;
        
        // Update page title
        document.getElementById('pageTitle').textContent = `${content.title} - Streaming`;
        
        // Update header
        document.getElementById('streamTitle').textContent = content.title;
        document.getElementById('streamYear').textContent = content.year;
        
        const qualityBadge = document.getElementById('streamQuality');
        qualityBadge.textContent = content.quality;
        qualityBadge.style.background = content.quality === '4K' ? 'var(--badge-4k)' : 'var(--badge-hd)';

        // Show episodes section for TV shows
        if (content.type === 'TV Show' || content.type === 'Anime') {
            document.getElementById('episodesSection').style.display = 'block';
        }
    }

    renderEpisodes() {
        const content = this.contentData;
        if (!content.episodes || content.episodes.length <= 1) return;

        const episodesList = document.getElementById('episodesList');
        
        episodesList.innerHTML = content.episodes.map(episode => `
            <div class="episode-item ${episode.number === this.episodeNumber ? 'active' : ''}" 
                 onclick="streamingPage.selectEpisode(${episode.number})">
                <div class="episode-number">${episode.number}</div>
                <div class="episode-info">
                    <div class="episode-title">${episode.title}</div>
                    <div class="episode-duration">${episode.duration}</div>
                </div>
            </div>
        `).join('');
    }

    async renderSimilarContent() {
        try {
            // Load all posts to find similar content
            const response = await fetch('data/posts.json');
            const data = await response.json();
            const posts = data.posts || [];
            
            // Get similar content based on type and genres
            const currentContent = this.contentData;
            let similarContent = posts.filter(post => {
                // Exclude current content
                if (post.id === currentContent.id) return false;
                
                // Prefer same type
                if (post.type === currentContent.type) return true;
                
                // Or same genres
                if (currentContent.genres && post.genres) {
                    return post.genres.some(genre => 
                        currentContent.genres.includes(genre)
                    );
                }
                
                return false;
            });

            // Sort by popularity and take top 6
            similarContent = similarContent
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                .slice(0, 6);

            const similarList = document.getElementById('similarContent');
            if (similarContent.length === 0) {
                similarList.innerHTML = '<p class="no-similar">No similar content found</p>';
                return;
            }

            similarList.innerHTML = similarContent.map(item => `
                <div class="similar-item" onclick="streamingPage.goToContent('${item.id}')">
                    <img src="${item.poster}" alt="${item.title}" class="similar-poster" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                    <div class="similar-info">
                        <div class="similar-title">${item.title}</div>
                        <div class="similar-meta">${item.year} • ★ ${item.rating || 'N/A'}</div>
                        <div class="similar-type">${item.type}</div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            // Error loading similar content
            document.getElementById('similarContent').innerHTML = '<p class="error-message">Error loading similar content</p>';
        }
    }

    initializePlayer() {
        const video = document.getElementById('videoElement');
        const videoSource = document.getElementById('videoSource');
        
        // Set video source from content data or fallback to demo video
        if (this.contentData && this.contentData.streamUrl) {
            videoSource.src = this.contentData.streamUrl;
        } else {
            // Fallback demo video
            videoSource.src = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        }
        
        video.load();
        
        // Show overlay initially
        document.getElementById('videoOverlay').classList.add('show');
        
        // Event listeners for video
        video.addEventListener('loadedmetadata', () => {
            this.duration = video.duration;
            this.updateDuration();
        });
        
        video.addEventListener('timeupdate', () => {
            this.currentTime = video.currentTime;
            this.updateProgress();
        });
        
        video.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            document.getElementById('videoOverlay').classList.remove('show');
        });
        
        video.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            document.getElementById('videoOverlay').classList.add('show');
        });
        
        video.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.onVideoEnded();
        });
    }

    setupEventListeners() {
        // Server selection
        document.querySelectorAll('.server-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                const server = e.target.dataset.server;
                this.selectServer(type, server);
            });
        });
        
        // Season selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.season-btn')) {
                const seasonBtn = e.target.closest('.season-btn');
                const season = parseInt(seasonBtn.dataset.season);
                this.selectSeason(season);
            }
        });
        
        // Episode selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.episode-item')) {
                const episodeItem = e.target.closest('.episode-item');
                const episode = parseInt(episodeItem.dataset.episode);
                this.selectEpisode(episode);
            }
        });
        
        // Video controls
        document.getElementById('prevBtn').addEventListener('click', () => this.prevEpisode());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextEpisode());
        
        // Add to List button
        document.getElementById('addToListBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('listDropdown');
            dropdown.classList.toggle('active');
            this.updateDropdownActiveState();
        });
        
        // Dropdown item clicks
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const status = item.dataset.status;
                this.setWatchlistStatus(status);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('listDropdown');
            const container = document.querySelector('.add-to-list-container');
            if (!container.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Close dropdown on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.getElementById('listDropdown').classList.remove('active');
            }
        });
        
        // Retry button for video errors
        document.getElementById('retryBtn').addEventListener('click', () => {
            document.getElementById('videoError').classList.remove('show');
            this.loadVideo(this.currentEpisode);
        });
        
        // Video event listeners
        const video = document.getElementById('main-video');
        const videoLoading = document.getElementById('videoLoading');
        const videoError = document.getElementById('videoError');
        
        video.addEventListener('waiting', () => {
            videoLoading.classList.remove('hidden');
            videoError.classList.remove('show');
        });
        
        video.addEventListener('canplay', () => {
            videoLoading.classList.add('hidden');
            videoError.classList.remove('show');
        });
        
        video.addEventListener('playing', () => {
            videoLoading.classList.add('hidden');
            videoError.classList.remove('show');
        });
        
        video.addEventListener('error', (e) => {
            // Video error occurred
            videoLoading.classList.add('hidden');
            videoError.classList.add('show');
            this.showToast('Error loading video. Please try another server.', 'error');
        });
    }

    loadAnimeSections() {
        this.loadPopularAnime();
        this.loadNewReleases();
    }

    loadPopularAnime() {
        const container = document.getElementById('popularAnime');
        const popularAnime = [...this.allPosts]
            .filter(post => post.isRecommended)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8);
        
        container.innerHTML = popularAnime.map(post => `
            <a href="post-details.html?id=${post.id}" class="anime-card" data-id="${post.id}">
                <img src="${post.poster}" alt="${post.title}" class="anime-poster" onerror="this.src='https://via.placeholder.com/280x400/333/fff?text=No+Image'">
                <div class="anime-info">
                    <div class="anime-name">${post.title}</div>
                    <div class="anime-meta">
                        <span>★ ${post.rating || 'N/A'}</span>
                        <span>${post.year}</span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    loadNewReleases() {
        const container = document.getElementById('newReleases');
        const newReleases = [...this.allPosts]
            .filter(post => post.isLatestMovie || post.year >= 2022)
            .slice(0, 8);
        
        container.innerHTML = newReleases.map(post => `
            <a href="post-details.html?id=${post.id}" class="anime-card" data-id="${post.id}">
                <img src="${post.poster}" alt="${post.title}" class="anime-poster" onerror="this.src='https://via.placeholder.com/280x400/333/fff?text=No+Image'">
                <div class="anime-info">
                    <div class="anime-name">${post.title}</div>
                    <div class="anime-meta">
                        <span>${post.duration || '24m'}</span>
                        <span class="episode-badge">New</span>
                    </div>
                </div>
            </a>
        `).join('');
    }

    selectServer(type, server) {
        // Update active server button for current type
        document.querySelectorAll(`[data-type="${type}"]`).forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"][data-server="${server}"]`).classList.add('active');
        
        this.currentType = type;
        this.currentServer = server;
        this.showToast(`Switched to ${type.toUpperCase()} - ${server.toUpperCase()}`);
        
        // Reload current episode with new server
        this.loadVideo(this.currentEpisode);
    }

    selectSeason(season) {
        // Update active season button
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-season="${season}"]`).classList.add('active');
        
        this.seasonNumber = season;
        this.currentSeason = season; // Keep both for backward compatibility
        this.currentEpisode = 1; // Reset to first episode of new season
        
        // Load episodes for new season
        this.loadSeasonEpisodes(season);
        
        this.showToast(`Switched to Season ${season}`);
        this.updateVideoPlayer();
    }

    selectEpisode(episode) {
        // Update active episode item
        document.querySelectorAll('.episode-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-episode="${episode}"]`).classList.add('active');
        
        this.currentEpisode = episode;
        this.updateVideoPlayer();
    }

    prevEpisode() {
        if (this.currentEpisode > 1) {
            this.currentEpisode--;
            this.selectEpisode(this.currentEpisode);
        } else {
            this.showToast('This is the first episode');
        }
    }

    nextEpisode() {
        const currentSeasonData = this.getCurrentSeasonData();
        const totalEpisodes = currentSeasonData && currentSeasonData.episodes 
            ? currentSeasonData.episodes.length 
            : 12;
        
        if (this.currentEpisode < totalEpisodes) {
            this.currentEpisode++;
            this.selectEpisode(this.currentEpisode);
        } else {
            this.showToast('This is the last episode available');
        }
    }

    setWatchlistStatus(status) {
        const statusMap = {
            'planning': 'Planning to watch',
            'watching': 'Watching',
            'completed': 'Completed',
            'rewatching': 'Re-watching',
            'dropped': 'Dropped'
        };
        
        const animeKey = `${this.currentAnime?.id}-season-${this.currentSeason}`;
        
        if (status === 'remove') {
            delete this.watchlist[animeKey];
            localStorage.setItem('quravel_watchlist', JSON.stringify(this.watchlist));
            this.showToast('Removed from your list', 'success');
        } else {
            this.watchlist[animeKey] = {
                status: status,
                date: new Date().toISOString(),
                episode: this.currentEpisode,
                season: this.currentSeason,
                animeId: this.currentAnime?.id
            };
            localStorage.setItem('quravel_watchlist', JSON.stringify(this.watchlist));
            this.showToast(`Added to ${statusMap[status]}`, 'success');
        }
        
        this.updateWatchlistButton();
        document.getElementById('listDropdown').classList.remove('active');
    }

    updateWatchlistButton() {
        const buttonText = document.getElementById('listButtonText');
        const button = document.getElementById('addToListBtn');
        
        if (!this.currentAnime) {
            buttonText.textContent = 'Select Content';
            button.classList.remove('active');
            return;
        }
        
        const animeKey = `${this.currentAnime.id}-season-${this.currentSeason}`;
        
        if (this.watchlist[animeKey]) {
            const statusMap = {
                'planning': 'Planning to watch',
                'watching': 'Watching',
                'completed': 'Completed',
                'rewatching': 'Re-watching',
                'dropped': 'Dropped'
            };
            buttonText.textContent = statusMap[this.watchlist[animeKey].status];
            button.classList.add('active');
        } else {
            buttonText.textContent = 'Add to List';
            button.classList.remove('active');
        }
    }

    updateDropdownActiveState() {
        const items = document.querySelectorAll('.dropdown-item:not(.remove)');
        items.forEach(item => {
            item.classList.remove('active');
        });
        
        if (!this.currentAnime) return;
        
        const animeKey = `${this.currentAnime.id}-season-${this.currentSeason}`;
        
        if (this.watchlist[animeKey]) {
            const statusMap = {
                'planning': 0,
                'watching': 1,
                'completed': 2,
                'rewatching': 3,
                'dropped': 4
            };
            const index = statusMap[this.watchlist[animeKey].status];
            if (index !== undefined) {
                items[index].classList.add('active');
            }
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast';
        
        if (type === 'success') {
            toast.classList.add('success');
            toast.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span>${message}</span>
            `;
        } else if (type === 'error') {
            toast.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>${message}</span>
            `;
        } else {
            toast.innerHTML = `<span>${message}</span>`;
        }
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    initializeVideoPlayer() {
        const video = document.getElementById('main-video');
        video.addEventListener('loadstart', () => {
            document.getElementById('videoLoading').classList.remove('hidden');
        });
        
        video.addEventListener('loadeddata', () => {
            document.getElementById('videoLoading').classList.add('hidden');
        });
        
        video.addEventListener('canplay', () => {
            document.getElementById('videoLoading').classList.add('hidden');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    window.streamingPage = new StreamingPage();
});
