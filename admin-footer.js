// Footer & Settings Management JavaScript

let redirects = [];
let selectedFooterLayout = 'detailed';
let websiteSettings = {};

// Default settings
const defaultSettings = {
    general: {
        websiteTitle: 'Quravel - Watch Movies & TV Shows Online',
        websiteDescription: 'Watch free movies and TV shows online. Stream your favorite content on Quravel.',
        websiteKeywords: 'movies, tv shows, streaming, free, online',
        favicon: '',
        timezone: 'UTC',
        language: 'en',
        contactEmail: 'contact@quravel.com',
        supportEmail: 'support@quravel.com',
        privacyEmail: 'privacy@quravel.com',
        phoneNumber: '',
        address: '',
        businessHours: '24/7'
    },
    seo: {
        metaDescription: 'Watch free movies and TV shows online on Quravel. Stream your favorite content anytime, anywhere.',
        metaKeywords: 'free movies, tv shows, streaming, online watch',
        metaAuthor: 'Quravel Team',
        ogTitle: 'Quravel - Free Movies & TV Shows',
        ogDescription: 'Watch free movies and TV shows online. Stream your favorite content on Quravel.',
        ogImage: '',
        homepageTitleTag: 'Quravel - Free Movies & TV Shows Online',
        archiveTitleTag: 'Archive - {site_name}',
        searchTitleTag: 'Search Results - {site_name}',
        postTitlePattern: '{post_title} - {site_name}',
        postMetaDescription: 'excerpt',
        googleSearchConsole: '',
        googleAnalyticsId: ''
    },
    tracking: {
        gtmContainerId: '',
        gtmCode: '',
        enableGtm: true,
        ga4MeasurementId: '',
        ga4ApiSecret: '',
        enableGa4: true,
        bingWebmasterKey: '',
        bingSiteVerification: '',
        bingAdsId: '',
        facebookPixel: '',
        customTrackingCode: '',
        enableCustomTracking: false
    },
    robots: {
        enableCustomRobots: false,
        customRobotsTxt: '',
        enableCustomRobotsHeader: false,
        defaultRobotsMeta: 'index,follow',
        enableAutoSitemap: true,
        sitemapUrl: 'https://yourdomain.com/sitemap.xml',
        includePosts: true,
        includePages: true,
        includeCategories: false,
        includeTags: false
    },
    errors: {
        enableCustom404: true,
        custom404Content: '<h1>404 - Page Not Found</h1><p>The page you are looking for does not exist.</p>',
        error404Title: '404 - Page Not Found',
        enableErrorLogging: true,
        errorNotificationEmail: 'admin@quravel.com',
        maxErrorLogs: 100
    },
    footer: {
        layout: 'detailed',
        copyrightText: '© 2025 Quravel',
        companyName: 'Quravel',
        legalLinks: 'Privacy Policy|Terms of Service|Contact Us',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        sections: [
            {
                id: 'footer-about',
                title: 'About Quravel',
                content: 'Your ultimate destination for free movies and TV shows.'
            },
            {
                id: 'footer-links',
                title: 'Quick Links',
                content: '<ul><li><a href="/movies">Movies</a></li><li><a href="/tv-shows">TV Shows</a></li><li><a href="/categories">Categories</a></li></ul>'
            },
            {
                id: 'footer-support',
                title: 'Support',
                content: '<ul><li><a href="/contact">Contact Us</a></li><li><a href="/dmca">DMCA</a></li><li><a href="/report">Report Issue</a></li></ul>'
            }
        ]
    }
};

// Initialize Settings Management
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    loadRedirects();
    setupEventListeners();
    initializeCharCounters();
    initializeTooltips();
});

// Load Settings
function loadSettings() {
    const saved = localStorage.getItem('quravel_website_settings');
    if (saved) {
        websiteSettings = { ...defaultSettings, ...JSON.parse(saved) };
    } else {
        websiteSettings = { ...defaultSettings };
    }
    populateSettingsForm();
}

// Save Settings
function saveSettings() {
    localStorage.setItem('quravel_website_settings', JSON.stringify(websiteSettings));
}

// Load Redirects
function loadRedirects() {
    const saved = localStorage.getItem('quravel_redirects');
    if (saved) {
        redirects = JSON.parse(saved);
    }
    renderRedirectsList();
}

// Save Redirects
function saveRedirects() {
    localStorage.setItem('quravel_redirects', JSON.stringify(redirects));
}

// Populate Settings Form
function populateSettingsForm() {
    // General Settings
    document.getElementById('website-title').value = websiteSettings.general.websiteTitle;
    document.getElementById('website-description').value = websiteSettings.general.websiteDescription;
    document.getElementById('website-keywords').value = websiteSettings.general.websiteKeywords;
    document.getElementById('timezone').value = websiteSettings.general.timezone;
    document.getElementById('language').value = websiteSettings.general.language;
    document.getElementById('contact-email').value = websiteSettings.general.contactEmail;
    document.getElementById('support-email').value = websiteSettings.general.supportEmail;
    document.getElementById('privacy-email').value = websiteSettings.general.privacyEmail;
    document.getElementById('phone-number').value = websiteSettings.general.phoneNumber;
    document.getElementById('address').value = websiteSettings.general.address;
    document.getElementById('business-hours').value = websiteSettings.general.businessHours;

    // SEO Settings
    document.getElementById('meta-description').value = websiteSettings.seo.metaDescription;
    document.getElementById('meta-keywords').value = websiteSettings.seo.metaKeywords;
    document.getElementById('meta-author').value = websiteSettings.seo.metaAuthor;
    document.getElementById('og-title').value = websiteSettings.seo.ogTitle;
    document.getElementById('og-description').value = websiteSettings.seo.ogDescription;
    document.getElementById('og-image').value = websiteSettings.seo.ogImage;
    document.getElementById('homepage-title-tag').value = websiteSettings.seo.homepageTitleTag;
    document.getElementById('archive-title-tag').value = websiteSettings.seo.archiveTitleTag;
    document.getElementById('search-title-tag').value = websiteSettings.seo.searchTitleTag;
    document.getElementById('post-title-pattern').value = websiteSettings.seo.postTitlePattern;
    document.getElementById('post-meta-description').value = websiteSettings.seo.postMetaDescription;
    document.getElementById('google-search-console').value = websiteSettings.seo.googleSearchConsole;
    document.getElementById('google-analytics-id').value = websiteSettings.seo.googleAnalyticsId;

    // Tracking Settings
    document.getElementById('gtm-container-id').value = websiteSettings.tracking.gtmContainerId;
    document.getElementById('gtm-code').value = websiteSettings.tracking.gtmCode;
    document.getElementById('enable-gtm').checked = websiteSettings.tracking.enableGtm;
    document.getElementById('ga4-measurement-id').value = websiteSettings.tracking.ga4MeasurementId;
    document.getElementById('ga4-api-secret').value = websiteSettings.tracking.ga4ApiSecret;
    document.getElementById('enable-ga4').checked = websiteSettings.tracking.enableGa4;
    document.getElementById('bing-webmaster-key').value = websiteSettings.tracking.bingWebmasterKey;
    document.getElementById('bing-site-verification').value = websiteSettings.tracking.bingSiteVerification;
    document.getElementById('bing-ads-id').value = websiteSettings.tracking.bingAdsId;
    document.getElementById('facebook-pixel').value = websiteSettings.tracking.facebookPixel;
    document.getElementById('custom-tracking-code').value = websiteSettings.tracking.customTrackingCode;
    document.getElementById('enable-custom-tracking').checked = websiteSettings.tracking.enableCustomTracking;

    // Robots Settings
    document.getElementById('enable-custom-robots').checked = websiteSettings.robots.enableCustomRobots;
    document.getElementById('custom-robots-txt').value = websiteSettings.robots.customRobotsTxt;
    document.getElementById('enable-custom-robots-header').checked = websiteSettings.robots.enableCustomRobotsHeader;
    document.getElementById('default-robots-meta').value = websiteSettings.robots.defaultRobotsMeta;
    document.getElementById('enable-auto-sitemap').checked = websiteSettings.robots.enableAutoSitemap;
    document.getElementById('sitemap-url').value = websiteSettings.robots.sitemapUrl;
    document.getElementById('include-posts').checked = websiteSettings.robots.includePosts;
    document.getElementById('include-pages').checked = websiteSettings.robots.includePages;
    document.getElementById('include-categories').checked = websiteSettings.robots.includeCategories;
    document.getElementById('include-tags').checked = websiteSettings.robots.includeTags;

    // Errors Settings
    document.getElementById('enable-custom-404').checked = websiteSettings.errors.enableCustom404;
    document.getElementById('custom-404-content').value = websiteSettings.errors.custom404Content;
    document.getElementById('404-page-title').value = websiteSettings.errors.error404Title;
    document.getElementById('enable-error-logging').checked = websiteSettings.errors.enableErrorLogging;
    document.getElementById('error-notification-email').value = websiteSettings.errors.errorNotificationEmail;
    document.getElementById('max-error-logs').value = websiteSettings.errors.maxErrorLogs;

    // Footer Settings
    selectedFooterLayout = websiteSettings.footer.layout;
    selectFooterLayout(selectedFooterLayout);
    document.getElementById('copyright-text').value = websiteSettings.footer.copyrightText;
    document.getElementById('company-name').value = websiteSettings.footer.companyName;
    document.getElementById('legal-links').value = websiteSettings.footer.legalLinks;
    document.getElementById('facebook-url').value = websiteSettings.footer.facebookUrl;
    document.getElementById('twitter-url').value = websiteSettings.footer.twitterUrl;
    document.getElementById('instagram-url').value = websiteSettings.footer.instagramUrl;
    document.getElementById('youtube-url').value = websiteSettings.footer.youtubeUrl;
    
    renderFooterSections();
    updateCharCounters();
}

// Collect Settings Data
function collectSettingsData() {
    // General Settings
    websiteSettings.general.websiteTitle = document.getElementById('website-title').value;
    websiteSettings.general.websiteDescription = document.getElementById('website-description').value;
    websiteSettings.general.websiteKeywords = document.getElementById('website-keywords').value;
    websiteSettings.general.timezone = document.getElementById('timezone').value;
    websiteSettings.general.language = document.getElementById('language').value;
    websiteSettings.general.contactEmail = document.getElementById('contact-email').value;
    websiteSettings.general.supportEmail = document.getElementById('support-email').value;
    websiteSettings.general.privacyEmail = document.getElementById('privacy-email').value;
    websiteSettings.general.phoneNumber = document.getElementById('phone-number').value;
    websiteSettings.general.address = document.getElementById('address').value;
    websiteSettings.general.businessHours = document.getElementById('business-hours').value;

    // SEO Settings
    websiteSettings.seo.metaDescription = document.getElementById('meta-description').value;
    websiteSettings.seo.metaKeywords = document.getElementById('meta-keywords').value;
    websiteSettings.seo.metaAuthor = document.getElementById('meta-author').value;
    websiteSettings.seo.ogTitle = document.getElementById('og-title').value;
    websiteSettings.seo.ogDescription = document.getElementById('og-description').value;
    websiteSettings.seo.ogImage = document.getElementById('og-image').value;
    websiteSettings.seo.homepageTitleTag = document.getElementById('homepage-title-tag').value;
    websiteSettings.seo.archiveTitleTag = document.getElementById('archive-title-tag').value;
    websiteSettings.seo.searchTitleTag = document.getElementById('search-title-tag').value;
    websiteSettings.seo.postTitlePattern = document.getElementById('post-title-pattern').value;
    websiteSettings.seo.postMetaDescription = document.getElementById('post-meta-description').value;
    websiteSettings.seo.googleSearchConsole = document.getElementById('google-search-console').value;
    websiteSettings.seo.googleAnalyticsId = document.getElementById('google-analytics-id').value;

    // Tracking Settings
    websiteSettings.tracking.gtmContainerId = document.getElementById('gtm-container-id').value;
    websiteSettings.tracking.gtmCode = document.getElementById('gtm-code').value;
    websiteSettings.tracking.enableGtm = document.getElementById('enable-gtm').checked;
    websiteSettings.tracking.ga4MeasurementId = document.getElementById('ga4-measurement-id').value;
    websiteSettings.tracking.ga4ApiSecret = document.getElementById('ga4-api-secret').value;
    websiteSettings.tracking.enableGa4 = document.getElementById('enable-ga4').checked;
    websiteSettings.tracking.bingWebmasterKey = document.getElementById('bing-webmaster-key').value;
    websiteSettings.tracking.bingSiteVerification = document.getElementById('bing-site-verification').value;
    websiteSettings.tracking.bingAdsId = document.getElementById('bing-ads-id').value;
    websiteSettings.tracking.facebookPixel = document.getElementById('facebook-pixel').value;
    websiteSettings.tracking.customTrackingCode = document.getElementById('custom-tracking-code').value;
    websiteSettings.tracking.enableCustomTracking = document.getElementById('enable-custom-tracking').checked;

    // Robots Settings
    websiteSettings.robots.enableCustomRobots = document.getElementById('enable-custom-robots').checked;
    websiteSettings.robots.customRobotsTxt = document.getElementById('custom-robots-txt').value;
    websiteSettings.robots.enableCustomRobotsHeader = document.getElementById('enable-custom-robots-header').checked;
    websiteSettings.robots.defaultRobotsMeta = document.getElementById('default-robots-meta').value;
    websiteSettings.robots.enableAutoSitemap = document.getElementById('enable-auto-sitemap').checked;
    websiteSettings.robots.sitemapUrl = document.getElementById('sitemap-url').value;
    websiteSettings.robots.includePosts = document.getElementById('include-posts').checked;
    websiteSettings.robots.includePages = document.getElementById('include-pages').checked;
    websiteSettings.robots.includeCategories = document.getElementById('include-categories').checked;
    websiteSettings.robots.includeTags = document.getElementById('include-tags').checked;

    // Errors Settings
    websiteSettings.errors.enableCustom404 = document.getElementById('enable-custom-404').checked;
    websiteSettings.errors.custom404Content = document.getElementById('custom-404-content').value;
    websiteSettings.errors.error404Title = document.getElementById('404-page-title').value;
    websiteSettings.errors.enableErrorLogging = document.getElementById('enable-error-logging').checked;
    websiteSettings.errors.errorNotificationEmail = document.getElementById('error-notification-email').value;
    websiteSettings.errors.maxErrorLogs = parseInt(document.getElementById('max-error-logs').value);

    // Footer Settings
    websiteSettings.footer.copyrightText = document.getElementById('copyright-text').value;
    websiteSettings.footer.companyName = document.getElementById('company-name').value;
    websiteSettings.footer.legalLinks = document.getElementById('legal-links').value;
    websiteSettings.footer.facebookUrl = document.getElementById('facebook-url').value;
    websiteSettings.footer.twitterUrl = document.getElementById('twitter-url').value;
    websiteSettings.footer.instagramUrl = document.getElementById('instagram-url').value;
    websiteSettings.footer.youtubeUrl = document.getElementById('youtube-url').value;
}

// Switch Settings Tab
function switchSettingsTab(tabName) {
    // Update active tab
    document.querySelectorAll('.settings-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchSettingsTab('${tabName}')"]`).classList.add('active');
    
    // Update active content
    document.querySelectorAll('.settings-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-settings`).classList.add('active');
}

// Switch Meta Tab
function switchMetaTab(tabName) {
    // Update active tab
    document.querySelectorAll('.page-meta-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchMetaTab('${tabName}')"]`).classList.add('active');
    
    // Update active content
    document.querySelectorAll('.meta-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tabName}-meta`).classList.add('active');
}

// Save All Settings
function saveAllSettings() {
    collectSettingsData();
    saveSettings();
    showNotification('All settings saved successfully', 'success');
}

// Reset to Defaults
function resetToDefaults() {
    if (!confirm('Are you sure you want to reset all settings to defaults? This will overwrite your current settings.')) return;
    
    websiteSettings = { ...defaultSettings };
    saveSettings();
    populateSettingsForm();
    showNotification('Settings reset to defaults', 'success');
}

// Export Settings
function exportSettings() {
    collectSettingsData();
    const exportData = {
        settings: websiteSettings,
        redirects: redirects,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quravel-settings-export.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Settings exported successfully', 'success');
}

// Import Settings
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (importData.settings) {
                    websiteSettings = { ...defaultSettings, ...importData.settings };
                    saveSettings();
                    populateSettingsForm();
                }
                
                if (importData.redirects) {
                    redirects = importData.redirects;
                    saveRedirects();
                    renderRedirectsList();
                }
                
                showNotification('Settings imported successfully', 'success');
            } catch (error) {
                showNotification('Error importing settings: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Select Footer Layout
function selectFooterLayout(layoutType) {
    selectedFooterLayout = layoutType;
    websiteSettings.footer.layout = layoutType;
    
    // Update layout selection
    document.querySelectorAll('.footer-layout-options .layout-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.querySelector(`[onclick="selectFooterLayout('${layoutType}')"]`).classList.add('selected');
}

// Render Footer Sections
function renderFooterSections() {
    const container = document.getElementById('footer-sections');
    container.innerHTML = '';
    
    websiteSettings.footer.sections.forEach((section, index) => {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'footer-section-editor';
        sectionElement.innerHTML = `
            <div class="section-header">
                <h4>${section.title}</h4>
                <div class="section-controls">
                    <button class="btn btn-small btn-secondary" onclick="editFooterSection('${section.id}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deleteFooterSection('${section.id}')">Delete</button>
                </div>
            </div>
            <div class="section-content-preview">
                ${section.content}
            </div>
        `;
        container.appendChild(sectionElement);
    });
}

// Add Footer Section
function addFooterSection() {
    const sectionName = prompt('Enter section name:');
    if (!sectionName) return;
    
    const sectionContent = prompt('Enter section content (HTML allowed):');
    if (!sectionContent) return;
    
    const newSection = {
        id: 'footer_' + Date.now(),
        title: sectionName,
        content: sectionContent
    };
    
    websiteSettings.footer.sections.push(newSection);
    renderFooterSections();
    saveSettings();
    
    showNotification('Footer section added successfully', 'success');
}

// Edit Footer Section
function editFooterSection(sectionId) {
    const section = websiteSettings.footer.sections.find(s => s.id === sectionId);
    if (!section) return;
    
    const newTitle = prompt('Enter section name:', section.title);
    if (!newTitle) return;
    
    const newContent = prompt('Enter section content (HTML allowed):', section.content);
    if (!newContent) return;
    
    section.title = newTitle;
    section.content = newContent;
    
    renderFooterSections();
    saveSettings();
    
    showNotification('Footer section updated successfully', 'success');
}

// Delete Footer Section
function deleteFooterSection(sectionId) {
    if (!confirm('Are you sure you want to delete this footer section?')) return;
    
    websiteSettings.footer.sections = websiteSettings.footer.sections.filter(s => s.id !== sectionId);
    renderFooterSections();
    saveSettings();
    
    showNotification('Footer section deleted successfully', 'success');
}

// Redirects Management
function renderRedirectsList() {
    const container = document.getElementById('redirects-list');
    container.innerHTML = '';
    
    if (redirects.length === 0) {
        container.innerHTML = '<p class="no-redirects">No redirects configured</p>';
        return;
    }
    
    redirects.forEach((redirect, index) => {
        const redirectElement = document.createElement('div');
        redirectElement.className = 'redirect-item';
        redirectElement.innerHTML = `
            <div class="redirect-info">
                <div class="redirect-url">
                    <span class="from-url">${redirect.from}</span>
                    <span class="redirect-arrow">→</span>
                    <span class="to-url">${redirect.to}</span>
                </div>
                <div class="redirect-meta">
                    <span class="redirect-type">${redirect.type}</span>
                    <span class="redirect-date">${new Date(redirect.created).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="redirect-controls">
                <button class="btn btn-small btn-secondary" onclick="editRedirect(${index})">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteRedirect(${index})">Delete</button>
            </div>
        `;
        container.appendChild(redirectElement);
    });
}

// Add Redirect
function showAddRedirectModal() {
    document.getElementById('add-redirect-modal').style.display = 'block';
}

// Close Add Redirect Modal
function closeAddRedirectModal() {
    document.getElementById('add-redirect-modal').style.display = 'none';
    document.getElementById('add-redirect-form').reset();
}

// Add Redirect
function addRedirect(event) {
    event.preventDefault();
    
    const from = document.getElementById('redirect-from').value;
    const to = document.getElementById('redirect-to').value;
    const type = document.getElementById('redirect-type').value;
    
    const newRedirect = {
        from: from,
        to: to,
        type: type,
        created: new Date().toISOString()
    };
    
    redirects.push(newRedirect);
    saveRedirects();
    renderRedirectsList();
    
    closeAddRedirectModal();
    showNotification('Redirect added successfully', 'success');
}

// Edit Redirect
function editRedirect(index) {
    const redirect = redirects[index];
    if (!redirect) return;
    
    const newFrom = prompt('From URL:', redirect.from);
    if (!newFrom) return;
    
    const newTo = prompt('To URL:', redirect.to);
    if (!newTo) return;
    
    const newType = prompt('Redirect Type (301, 302, 307, 410):', redirect.type);
    if (!newType) return;
    
    redirect.from = newFrom;
    redirect.to = newTo;
    redirect.type = newType;
    
    saveRedirects();
    renderRedirectsList();
    
    showNotification('Redirect updated successfully', 'success');
}

// Delete Redirect
function deleteRedirect(index) {
    if (!confirm('Are you sure you want to delete this redirect?')) return;
    
    redirects.splice(index, 1);
    saveRedirects();
    renderRedirectsList();
    
    showNotification('Redirect deleted successfully', 'success');
}

// Initialize Character Counters
function initializeCharCounters() {
    const metaDescription = document.getElementById('meta-description');
    if (metaDescription) {
        metaDescription.addEventListener('input', updateCharCounters);
        updateCharCounters();
    }
}

// Update Character Counters
function updateCharCounters() {
    const metaDescription = document.getElementById('meta-description');
    if (metaDescription) {
        const charCount = metaDescription.value.length;
        const charCounter = document.querySelector('.char-count');
        if (charCounter) {
            charCounter.textContent = `${charCount}/160 characters`;
            charCounter.style.color = charCount > 160 ? '#EF4444' : '#94A3B8';
        }
    }
}

// Initialize Tooltips
function initializeTooltips() {
    // Add tooltips to form elements
    const tooltips = {
        'post-title-pattern': 'Use {post_title}, {site_name}, {category} variables',
        'sitemap-url': 'Usually yourdomain.com/sitemap.xml',
        'gtm-container-id': 'Format: GTM-XXXXXXX',
        'ga4-measurement-id': 'Format: G-XXXXXXXXXX'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
        }
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Add redirect form
    document.getElementById('add-redirect-form').addEventListener('submit', addRedirect);
    
    // Favicon upload
    document.getElementById('favicon-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.querySelector('#favicon-preview img');
                if (preview) {
                    preview.src = e.target.result;
                }
                websiteSettings.general.favicon = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Auto-save on input change
    document.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('change', function() {
            collectSettingsData();
            saveSettings();
        });
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}