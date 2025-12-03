// Homepage Management JavaScript

let homepageSections = [];
let selectedTemplate = '';
let editingSectionId = null;
let availableContent = [];
let assignedContent = [];

// Sample homepage sections data
const defaultSections = [
    {
        id: 'hero-section',
        name: 'Hero Section',
        title: 'Featured Content',
        description: 'Discover the latest and greatest content',
        template: 'hero',
        layout: 'banner',
        itemsCount: 5,
        showTitle: true,
        showDescription: true,
        infiniteScroll: false,
        styling: {
            background: '#1a2332',
            textColor: '#E4E4E7',
            padding: 24,
            margin: 16,
            borderRadius: 12
        },
        content: [
            { id: '1', title: 'Featured Movie 1', type: 'movie', poster: 'url1' },
            { id: '2', title: 'Featured TV Show 1', type: 'tv-show', poster: 'url2' }
        ],
        visible: true
    },
    {
        id: 'trending-section',
        name: 'Trending',
        title: 'Trending Now',
        description: 'What everyone is watching',
        template: 'content-grid',
        layout: 'grid',
        itemsCount: 12,
        showTitle: true,
        showDescription: true,
        infiniteScroll: true,
        styling: {
            background: '#252433',
            textColor: '#E4E4E7',
            padding: 24,
            margin: 16,
            borderRadius: 12
        },
        content: [],
        visible: true
    },
    {
        id: 'new-releases-section',
        name: 'New Releases',
        title: 'New Releases',
        description: 'Fresh content just added',
        template: 'content-list',
        layout: 'list',
        itemsCount: 10,
        showTitle: true,
        showDescription: false,
        infiniteScroll: false,
        styling: {
            background: '#2d3748',
            textColor: '#E4E4E7',
            padding: 20,
            margin: 12,
            borderRadius: 8
        },
        content: [],
        visible: true
    },
    {
        id: 'recommended-section',
        name: 'Recommended',
        title: 'Recommended for You',
        description: 'Curated content just for you',
        template: 'featured',
        layout: 'grid',
        itemsCount: 8,
        showTitle: true,
        showDescription: true,
        infiniteScroll: false,
        styling: {
            background: '#1a2332',
            textColor: '#E4E4E7',
            padding: 24,
            margin: 16,
            borderRadius: 12
        },
        content: [],
        visible: true
    }
];

// Sample available content
const sampleContent = [
    { id: '1', title: 'The Dark Knight', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', year: 2008, rating: 9.0 },
    { id: '2', title: 'Stranger Things', type: 'tv-show', poster: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg', year: 2016, rating: 8.7 },
    { id: '3', title: 'Breaking Bad', type: 'tv-show', poster: 'https://image.tmdb.org/t/p/w500/3xnWaXZvj58X1iuhpM5b5G6ARZE.jpg', year: 2008, rating: 9.5 },
    { id: '4', title: 'Inception', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', year: 2010, rating: 8.8 },
    { id: '5', title: 'The Office', type: 'tv-show', poster: 'https://image.tmdb.org/t/p/w500/5N20nQjOKdRxqI7Kz4VPp8fL1s2.jpg', year: 2005, rating: 8.9 },
    { id: '6', title: 'Interstellar', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', year: 2014, rating: 8.6 },
    { id: '7', title: 'Friends', type: 'tv-show', poster: 'https://image.tmdb.org/t/p/w500/f496cm9enuEsZkSPzCwnTESEK5s.jpg', year: 1994, rating: 8.9 },
    { id: '8', title: 'The Matrix', type: 'movie', poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', year: 1999, rating: 8.7 },
    { id: '9', title: 'Game of Thrones', type: 'tv-show', poster: 'https://image.tmdb.org/t/p/w500/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg', year: 2011, rating: 9.3 },
    { id: '10', title: 'Peaky Blinders', type: 'tv-show', poster: 'https://image.tmdb.org/t/p/w500/wiBWz8M9cOejHA8l8pENclQhGOm.jpg', year: 2013, rating: 8.8 }
];

// Initialize Homepage Management
document.addEventListener('DOMContentLoaded', function() {
    loadHomepageSections();
    loadAvailableContent();
    setupEventListeners();
});

// Load Homepage Sections
function loadHomepageSections() {
    const saved = localStorage.getItem('quravel_homepage_sections');
    if (saved) {
        homepageSections = JSON.parse(saved);
    } else {
        homepageSections = [...defaultSections];
        saveHomepageSections();
    }
    renderSections();
    updateContentSectionSelect();
}

// Save Homepage Sections
function saveHomepageSections() {
    localStorage.setItem('quravel_homepage_sections', JSON.stringify(homepageSections));
}

// Load Available Content
function loadAvailableContent() {
    const saved = localStorage.getItem('quravel_content');
    if (saved) {
        availableContent = JSON.parse(saved);
    } else {
        availableContent = sampleContent;
    }
    renderAvailableContent();
}

// Render Sections
function renderSections() {
    const container = document.getElementById('sections-container');
    container.innerHTML = '';
    
    homepageSections.forEach(section => {
        const sectionElement = createSectionElement(section);
        container.appendChild(sectionElement);
    });
}

// Create Section Element
function createSectionElement(section) {
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'homepage-section-card';
    sectionDiv.innerHTML = `
        <div class="section-header">
            <div class="section-info">
                <h3>${section.title}</h3>
                <p>${section.description || 'No description'}</p>
                <div class="section-meta">
                    <span class="template-badge">${section.template}</span>
                    <span class="items-count">${section.itemsCount} items</span>
                    <span class="layout-badge">${section.layout}</span>
                </div>
            </div>
            <div class="section-controls">
                <label class="visibility-toggle">
                    <input type="checkbox" ${section.visible ? 'checked' : ''} onchange="toggleSectionVisibility('${section.id}')">
                    <span class="toggle-slider"></span>
                </label>
                <button class="btn btn-small btn-secondary" onclick="editSection('${section.id}')">Edit</button>
                <button class="btn btn-small btn-danger" onclick="deleteSection('${section.id}')">Delete</button>
            </div>
        </div>
        <div class="section-preview">
            <div class="content-preview" style="background: ${section.styling.background}; color: ${section.styling.textColor};">
                <h4 style="color: ${section.styling.textColor};">${section.title}</h4>
                <div class="preview-content">
                    ${renderPreviewContent(section)}
                </div>
            </div>
        </div>
    `;
    return sectionDiv;
}

// Render Preview Content
function renderPreviewContent(section) {
    if (section.content.length === 0) {
        return '<p style="color: #94A3B8; font-style: italic;">No content assigned</p>';
    }
    
    const contentPreview = section.content.slice(0, 3).map(item => `
        <div class="preview-item">
            <img src="${item.poster || 'https://via.placeholder.com/100x150?text=Poster'}" alt="${item.title}">
            <p>${item.title}</p>
        </div>
    `).join('');
    
    return `<div class="preview-grid">${contentPreview}</div>`;
}

// Update Content Section Select
function updateContentSectionSelect() {
    const select = document.getElementById('content-section-select');
    select.innerHTML = '<option value="">Choose a section...</option>';
    
    homepageSections.forEach(section => {
        const option = document.createElement('option');
        option.value = section.id;
        option.textContent = section.title;
        select.appendChild(option);
    });
}

// Show Add Section Modal
function showAddSectionModal() {
    document.getElementById('add-section-modal').style.display = 'block';
}

// Close Add Section Modal
function closeAddSectionModal() {
    document.getElementById('add-section-modal').style.display = 'none';
    document.getElementById('add-section-form').reset();
}

// Edit Section
function editSection(sectionId) {
    editingSectionId = sectionId;
    const section = homepageSections.find(s => s.id === sectionId);
    if (!section) return;
    
    document.getElementById('section-editor-title').textContent = `Edit ${section.title}`;
    populateSectionEditor(section);
    document.getElementById('section-editor-modal').style.display = 'block';
}

// Close Section Editor
function closeSectionEditor() {
    document.getElementById('section-editor-modal').style.display = 'none';
    editingSectionId = null;
    resetSectionEditor();
}

// Populate Section Editor
function populateSectionEditor(section) {
    document.getElementById('section-name').value = section.name;
    document.getElementById('section-title').value = section.title;
    document.getElementById('section-description').value = section.description || '';
    document.getElementById('section-items-count').value = section.itemsCount;
    document.getElementById('section-layout').value = section.layout;
    document.getElementById('section-show-title').checked = section.showTitle;
    document.getElementById('section-show-description').checked = section.showDescription;
    document.getElementById('section-infinite-scroll').checked = section.infiniteScroll;
    document.getElementById('section-background').value = section.styling.background;
    document.getElementById('section-text-color').value = section.styling.textColor;
    document.getElementById('section-padding').value = section.styling.padding;
    document.getElementById('section-margin').value = section.styling.margin;
    document.getElementById('section-border-radius').value = section.styling.borderRadius;
    
    renderSectionContentList(section.content);
}

// Reset Section Editor
function resetSectionEditor() {
    document.getElementById('section-name').value = '';
    document.getElementById('section-title').value = '';
    document.getElementById('section-description').value = '';
    document.getElementById('section-items-count').value = 10;
    document.getElementById('section-layout').value = 'grid';
    document.getElementById('section-show-title').checked = true;
    document.getElementById('section-show-description').checked = false;
    document.getElementById('section-infinite-scroll').checked = false;
    document.getElementById('section-background').value = '#1a2332';
    document.getElementById('section-text-color').value = '#E4E4E7';
    document.getElementById('section-padding').value = 24;
    document.getElementById('section-margin').value = 16;
    document.getElementById('section-border-radius').value = 12;
    
    document.getElementById('section-content-list').innerHTML = '';
}

// Switch Editor Tab
function switchEditorTab(tab) {
    // Update active tab button
    document.querySelectorAll('#section-editor-modal .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#section-editor-modal [onclick="switchEditorTab('${tab}')"]`).classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('#section-editor-modal .editor-tab').forEach(tabContent => tabContent.classList.remove('active'));
    document.getElementById(`editor-${tab}-tab`).classList.add('active');
}

// Select Section Template
function selectSectionTemplate(templateType) {
    selectedTemplate = templateType;
    
    // Update template selection
    document.querySelectorAll('.section-templates-section .template-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[onclick="selectSectionTemplate('${templateType}')"]`).classList.add('selected');
    
    // Show relevant options based on template
    showTemplateOptions(templateType);
}

// Show Template Options
function showTemplateOptions(templateType) {
    // This could show/hide specific form fields based on the template
    console.log('Selected template:', templateType);
}

// Add Section
function addSection() {
    const form = document.getElementById('add-section-form');
    const formData = new FormData(form);
    
    const newSection = {
        id: 'section_' + Date.now(),
        name: document.getElementById('new-section-name').value,
        title: document.getElementById('new-section-title').value,
        template: document.getElementById('new-section-template').value,
        layout: 'grid',
        itemsCount: 10,
        showTitle: true,
        showDescription: false,
        infiniteScroll: false,
        description: '',
        styling: {
            background: '#1a2332',
            textColor: '#E4E4E7',
            padding: 24,
            margin: 16,
            borderRadius: 12
        },
        content: [],
        visible: true
    };
    
    homepageSections.push(newSection);
    saveHomepageSections();
    renderSections();
    updateContentSectionSelect();
    
    closeAddSectionModal();
    showNotification('Section added successfully', 'success');
}

// Save Section
function saveSection() {
    if (!editingSectionId) return;
    
    const section = homepageSections.find(s => s.id === editingSectionId);
    if (!section) return;
    
    // Update section data
    section.name = document.getElementById('section-name').value;
    section.title = document.getElementById('section-title').value;
    section.description = document.getElementById('section-description').value;
    section.itemsCount = parseInt(document.getElementById('section-items-count').value);
    section.layout = document.getElementById('section-layout').value;
    section.showTitle = document.getElementById('section-show-title').checked;
    section.showDescription = document.getElementById('section-show-description').checked;
    section.infiniteScroll = document.getElementById('section-infinite-scroll').checked;
    section.styling.background = document.getElementById('section-background').value;
    section.styling.textColor = document.getElementById('section-text-color').value;
    section.styling.padding = parseInt(document.getElementById('section-padding').value);
    section.styling.margin = parseInt(document.getElementById('section-margin').value);
    section.styling.borderRadius = parseInt(document.getElementById('section-border-radius').value);
    
    saveHomepageSections();
    renderSections();
    
    closeSectionEditor();
    showNotification('Section saved successfully', 'success');
}

// Save Section Draft
function saveSectionDraft() {
    showNotification('Section draft saved', 'info');
}

// Delete Section
function deleteSection(sectionId) {
    if (!confirm('Are you sure you want to delete this section?')) return;
    
    homepageSections = homepageSections.filter(s => s.id !== sectionId);
    saveHomepageSections();
    renderSections();
    updateContentSectionSelect();
    
    showNotification('Section deleted successfully', 'success');
}

// Toggle Section Visibility
function toggleSectionVisibility(sectionId) {
    const section = homepageSections.find(s => s.id === sectionId);
    if (section) {
        section.visible = !section.visible;
        saveHomepageSections();
        renderSections();
    }
}

// Render Section Content List
function renderSectionContentList(content) {
    const container = document.getElementById('section-content-list');
    container.innerHTML = '';
    
    if (content.length === 0) {
        container.innerHTML = '<p style="color: #94A3B8; text-align: center; padding: 20px;">No content assigned to this section</p>';
        return;
    }
    
    content.forEach((item, index) => {
        const contentItem = document.createElement('div');
        contentItem.className = 'content-list-item';
        contentItem.innerHTML = `
            <div class="content-info">
                <img src="${item.poster || 'https://via.placeholder.com/50x75'}" alt="${item.title}">
                <div>
                    <h5>${item.title}</h5>
                    <span class="content-type">${item.type}</span>
                </div>
            </div>
            <button class="btn btn-small btn-danger" onclick="removeContentFromSection('${item.id}', ${index})">Remove</button>
        `;
        container.appendChild(contentItem);
    });
}

// Remove Content from Section
function removeContentFromSection(contentId, index) {
    const section = homepageSections.find(s => s.id === editingSectionId);
    if (section) {
        section.content.splice(index, 1);
        renderSectionContentList(section.content);
        saveHomepageSections();
    }
}

// Add Content to Section
function addContentToSection() {
    if (!editingSectionId) return;
    
    const selectedContentIds = Array.from(document.querySelectorAll('.content-select-checkbox:checked')).map(cb => cb.value);
    
    const section = homepageSections.find(s => s.id === editingSectionId);
    if (!section) return;
    
    selectedContentIds.forEach(contentId => {
        const content = availableContent.find(c => c.id === contentId);
        if (content && !section.content.find(c => c.id === contentId)) {
            section.content.push(content);
        }
    });
    
    renderSectionContentList(section.content);
    saveHomepageSections();
    
    // Uncheck all checkboxes
    document.querySelectorAll('.content-select-checkbox:checked').forEach(cb => cb.checked = false);
}

// Clear Section Content
function clearSectionContent() {
    if (!confirm('Are you sure you want to remove all content from this section?')) return;
    
    const section = homepageSections.find(s => s.id === editingSectionId);
    if (section) {
        section.content = [];
        renderSectionContentList(section.content);
        saveHomepageSections();
    }
}

// Remove Selected Content
function removeSelectedContent() {
    const selectedIds = Array.from(document.querySelectorAll('.assigned-content-checkbox:checked')).map(cb => cb.value);
    
    const section = homepageSections.find(s => s.id === editingSectionId);
    if (section) {
        section.content = section.content.filter(content => !selectedIds.includes(content.id));
        renderSectionContentList(section.content);
        saveHomepageSections();
        
        // Uncheck all checkboxes
        document.querySelectorAll('.assigned-content-checkbox:checked').forEach(cb => cb.checked = false);
    }
}

// Render Available Content
function renderAvailableContent(filteredContent = null) {
    const content = filteredContent || availableContent;
    const container = document.getElementById('content-selection-grid');
    container.innerHTML = '';
    
    content.forEach(item => {
        const contentCard = document.createElement('div');
        contentCard.className = 'content-select-card';
        contentCard.innerHTML = `
            <div class="content-select-info">
                <input type="checkbox" class="content-select-checkbox" value="${item.id}">
                <img src="${item.poster || 'https://via.placeholder.com/100x150'}" alt="${item.title}">
                <div>
                    <h5>${item.title}</h5>
                    <span class="content-type-badge">${item.type}</span>
                    <span class="content-meta">${item.year} • ${item.rating}★</span>
                </div>
            </div>
        `;
        container.appendChild(contentCard);
    });
}

// Filter Content
function filterContent() {
    const typeFilter = document.getElementById('content-type-filter').value;
    const searchTerm = document.getElementById('content-search').value.toLowerCase();
    
    let filtered = availableContent;
    
    if (typeFilter) {
        filtered = filtered.filter(item => item.type === typeFilter);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchTerm)
        );
    }
    
    renderAvailableContent(filtered);
}

// Preview Homepage
function previewHomepage() {
    // Create a preview window or modal
    const previewWindow = window.open('', '_blank', 'width=1200,height=800');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Homepage Preview</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #252433; color: #E4E4E7; }
                .section { margin-bottom: 40px; padding: 20px; border-radius: 12px; }
                .content-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
                .content-item { text-align: center; }
                .content-item img { width: 100%; height: 225px; object-fit: cover; border-radius: 8px; }
            </style>
        </head>
        <body>
            <h1>Homepage Preview</h1>
            ${generateHomepagePreview()}
        </body>
        </html>
    `);
}

// Generate Homepage Preview
function generateHomepagePreview() {
    return homepageSections.filter(s => s.visible).map(section => `
        <div class="section" style="background: ${section.styling.background}; color: ${section.styling.textColor};">
            ${section.showTitle ? `<h2>${section.title}</h2>` : ''}
            ${section.showDescription && section.description ? `<p>${section.description}</p>` : ''}
            <div class="content-grid">
                ${section.content.slice(0, section.itemsCount).map(item => `
                    <div class="content-item">
                        <img src="${item.poster || 'https://via.placeholder.com/150x225'}" alt="${item.title}">
                        <p>${item.title}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Reset to Default
function resetToDefault() {
    if (!confirm('Are you sure you want to reset to default homepage sections? This will remove all custom sections.')) return;
    
    homepageSections = [...defaultSections];
    saveHomepageSections();
    renderSections();
    updateContentSectionSelect();
    
    showNotification('Homepage reset to default', 'success');
}

// Save Homepage Settings
function saveHomepageSettings() {
    const settings = {
        layout: document.getElementById('homepage-layout').value,
        itemsPerPage: parseInt(document.getElementById('items-per-page').value),
        showFeatured: document.getElementById('show-featured').checked,
        showTrending: document.getElementById('show-trending').checked,
        showNewReleases: document.getElementById('show-new-releases').checked,
        showRecommended: document.getElementById('show-recommended').checked,
        autoRefresh: document.getElementById('auto-refresh').value,
        defaultSort: document.getElementById('default-sort').value,
        lazyLoading: document.getElementById('lazy-loading').checked,
        imageOptimization: document.getElementById('image-optimization').checked,
        cacheDuration: document.getElementById('cache-duration').value
    };
    
    localStorage.setItem('quravel_homepage_settings', JSON.stringify(settings));
    showNotification('Homepage settings saved successfully', 'success');
}

// Setup Event Listeners
function setupEventListeners() {
    // Add section form
    document.getElementById('add-section-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addSection();
    });
    
    // Content filtering
    document.getElementById('content-type-filter').addEventListener('change', filterContent);
    document.getElementById('content-search').addEventListener('input', filterContent);
    
    // Content assignment
    document.getElementById('content-section-select').addEventListener('change', function() {
        const sectionId = this.value;
        if (sectionId) {
            const section = homepageSections.find(s => s.id === sectionId);
            renderAssignedContent(section ? section.content : []);
        }
    });
}

// Render Assigned Content
function renderAssignedContent(content) {
    const container = document.getElementById('assigned-content-list');
    container.innerHTML = '';
    
    if (content.length === 0) {
        container.innerHTML = '<p style="color: #94A3B8; text-align: center; padding: 20px;">No content assigned to this section</p>';
        return;
    }
    
    content.forEach(item => {
        const contentItem = document.createElement('div');
        contentItem.className = 'assigned-content-item';
        contentItem.innerHTML = `
            <div class="content-info">
                <input type="checkbox" class="assigned-content-checkbox" value="${item.id}">
                <img src="${item.poster || 'https://via.placeholder.com/50x75'}" alt="${item.title}">
                <div>
                    <h5>${item.title}</h5>
                    <span class="content-type">${item.type}</span>
                </div>
            </div>
        `;
        container.appendChild(contentItem);
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