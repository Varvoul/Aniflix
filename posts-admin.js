// Posts Admin Management with Compose and HTML Editor
let quillEditor;
let codeMirrorEditor;
let currentComposeMode = 'template';
let selectedTemplate = '';
let savedTemplates = JSON.parse(localStorage.getItem('quravel_templates') || '[]');
let contentDraft = null;

// Initialize Posts Admin
document.addEventListener('DOMContentLoaded', function() {
    // Initialize compose editors with a slight delay to ensure DOM is ready
    setTimeout(() => {
        initializeComposeEditors();
    }, 100);
    loadSavedTemplates();
    loadCategories();
});

// Initialize Rich Text Editor and Code Editor
function initializeComposeEditors() {
    // Initialize Quill.js for rich text editing
    const quillOptions = {
        theme: 'snow',
        placeholder: 'Start writing your content...',
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
    
    quillEditor = new Quill('#content-editor', quillOptions);
    
    // Initialize CodeMirror for HTML editing
    codeMirrorEditor = CodeMirror.fromTextArea(document.getElementById('html-editor'), {
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
                saveAsDraft();
                return false;
            }
        }
    });
}

// Compose Modal Functions
function showComposeModal() {
    document.getElementById('compose-modal').style.display = 'block';
    switchComposeMode('template');
}

function closeComposeModal() {
    document.getElementById('compose-modal').style.display = 'none';
    resetComposeForm();
}

function switchComposeMode(mode) {
    currentComposeMode = mode;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchComposeMode('${mode}')"]`).classList.add('active');
    
    // Update mode content
    document.querySelectorAll('.compose-mode').forEach(modeDiv => modeDiv.classList.remove('active'));
    document.getElementById(`${mode}-mode`).classList.add('active');
    
    if (mode === 'html') {
        // Load draft HTML content or initialize empty
        const draftHtml = contentDraft?.htmlContent || generateDefaultHTML();
        codeMirrorEditor.setValue(draftHtml);
    }
}

function selectTemplate(templateType) {
    selectedTemplate = templateType;
    
    // Update template selection UI
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
        if (card.onclick.toString().includes(templateType)) {
            card.classList.add('selected');
        }
    });
    
    // Show template editor
    document.getElementById('template-editor').style.display = 'block';
    
    // Load template-specific form fields
    loadTemplateFields(templateType);
}

function loadTemplateFields(templateType) {
    const form = document.getElementById('template-form');
    const titleInput = document.getElementById('compose-title');
    const typeSelect = document.getElementById('compose-type');
    
    switch(templateType) {
        case 'movie-card':
            titleInput.placeholder = 'Enter movie title...';
            typeSelect.value = 'movie';
            break;
        case 'tv-show':
            titleInput.placeholder = 'Enter TV show title...';
            typeSelect.value = 'tv-show';
            break;
        case 'news-article':
            titleInput.placeholder = 'Enter article title...';
            typeSelect.value = 'news';
            break;
        case 'custom':
            titleInput.placeholder = 'Enter custom content title...';
            typeSelect.value = '';
            break;
    }
}

// HTML Editor Functions
function formatHTML() {
    // Simple HTML formatting
    const content = codeMirrorEditor.getValue();
    const formatted = formatHtmlContent(content);
    codeMirrorEditor.setValue(formatted);
    showNotification('HTML formatted successfully', 'success');
}

function validateHTML() {
    const content = codeMirrorEditor.getValue();
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const errors = doc.querySelectorAll('parsererror');
        
        if (errors.length > 0) {
            showNotification('HTML validation failed: ' + errors[0].textContent, 'error');
        } else {
            showNotification('HTML is valid', 'success');
        }
    } catch (error) {
        showNotification('HTML validation error: ' + error.message, 'error');
    }
}

function previewHTML() {
    const content = codeMirrorEditor.getValue();
    const previewDiv = document.getElementById('html-preview');
    const previewFrame = document.getElementById('preview-frame');
    
    previewFrame.srcdoc = content;
    previewDiv.style.display = 'block';
    
    // Scroll to preview
    previewDiv.scrollIntoView({ behavior: 'smooth' });
}

function formatHtmlContent(html) {
    // Basic HTML formatting (indentation and line breaks)
    return html
        .replace(/></g, '>\n<')
        .replace(/\n\s*\n/g, '\n')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map((line, index) => {
            const indent = Math.max(0, line.match(/^<(\/?)([^/>]+)>/g)?.length || 0) * 2;
            return ' '.repeat(indent) + line;
        })
        .join('\n');
}

function generateDefaultHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Content Title</title>
    <link rel="stylesheet" href="styles/details-page.css">
</head>
<body>
    <div class="content-container">
        <header class="content-header">
            <h1 class="content-title">Your Content Title</h1>
            <div class="content-meta">
                <span class="content-type">Type</span>
                <span class="content-year">2024</span>
                <span class="content-rating">Rating: 8.5</span>
            </div>
        </header>
        
        <div class="content-main">
            <div class="content-poster">
                <img src="poster-url" alt="Content Poster">
            </div>
            
            <div class="content-details">
                <p class="content-description">
                    Your content description goes here...
                </p>
                
                <div class="content-genres">
                    <span class="genre-tag">Genre 1</span>
                    <span class="genre-tag">Genre 2</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// Template Management
function manageTemplates() {
    loadSavedTemplates();
    document.getElementById('templates-modal').style.display = 'block';
}

function closeTemplatesModal() {
    document.getElementById('templates-modal').style.display = 'none';
}

function loadSavedTemplates() {
    const templatesContainer = document.getElementById('saved-templates');
    if (!templatesContainer) return;
    
    templatesContainer.innerHTML = '';
    
    if (savedTemplates.length === 0) {
        templatesContainer.innerHTML = '<p class="no-templates">No saved templates found.</p>';
        return;
    }
    
    savedTemplates.forEach((template, index) => {
        const templateCard = createTemplateCard(template, index);
        templatesContainer.appendChild(templateCard);
    });
}

function createTemplateCard(template, index) {
    const card = document.createElement('div');
    card.className = 'saved-template-card';
    card.innerHTML = `
        <div class="template-info">
            <h4>${template.name}</h4>
            <p>${template.type} template</p>
            <span class="template-date">${new Date(template.created).toLocaleDateString()}</span>
        </div>
        <div class="template-actions">
            <button class="btn btn-small btn-secondary" onclick="editTemplate(${index})">Edit</button>
            <button class="btn btn-small btn-secondary" onclick="duplicateTemplate(${index})">Duplicate</button>
            <button class="btn btn-small btn-danger" onclick="deleteTemplate(${index})">Delete</button>
        </div>
    `;
    return card;
}

function createNewTemplate() {
    const templateName = prompt('Enter template name:');
    if (!templateName) return;
    
    const template = {
        id: Date.now(),
        name: templateName,
        type: selectedTemplate || 'custom',
        html: codeMirrorEditor.getValue(),
        fields: collectFormData(),
        created: new Date().toISOString()
    };
    
    savedTemplates.push(template);
    localStorage.setItem('quravel_templates', JSON.stringify(savedTemplates));
    loadSavedTemplates();
    showNotification('Template created successfully', 'success');
}

function editTemplate(index) {
    const template = savedTemplates[index];
    if (!template) return;
    
    // Load template into compose mode
    switchComposeMode('html');
    codeMirrorEditor.setValue(template.html);
    
    // Load form fields if available
    if (template.fields) {
        populateFormFields(template.fields);
    }
    
    closeTemplatesModal();
    showComposeModal();
}

function duplicateTemplate(index) {
    const template = savedTemplates[index];
    if (!template) return;
    
    const newTemplate = {
        ...template,
        id: Date.now(),
        name: template.name + ' (Copy)',
        created: new Date().toISOString()
    };
    
    savedTemplates.push(newTemplate);
    localStorage.setItem('quravel_templates', JSON.stringify(savedTemplates));
    loadSavedTemplates();
    showNotification('Template duplicated successfully', 'success');
}

function deleteTemplate(index) {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    savedTemplates.splice(index, 1);
    localStorage.setItem('quravel_templates', JSON.stringify(savedTemplates));
    loadSavedTemplates();
    showNotification('Template deleted successfully', 'success');
}

function importTemplate() {
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
                
                savedTemplates.push(template);
                localStorage.setItem('quravel_templates', JSON.stringify(savedTemplates));
                loadSavedTemplates();
                showNotification('Template imported successfully', 'success');
            } catch (error) {
                showNotification('Error importing template: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function exportAllTemplates() {
    const dataStr = JSON.stringify(savedTemplates, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'quravel-templates.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Content Publishing Functions
function collectFormData() {
    const form = document.getElementById('template-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'isFeatured' || key === 'isRecommended' || key === 'isTopAiring') {
            data[key] = true;
        } else {
            data[key] = value;
        }
    }
    
    // Add rich text content
    if (currentComposeMode === 'template') {
        data.contentHtml = quillEditor.root.innerHTML;
        data.contentText = quillEditor.getText();
    } else {
        data.htmlContent = codeMirrorEditor.getValue();
    }
    
    return data;
}

function populateFormFields(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(`compose-${key}`) || document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = data[key];
            } else {
                element.value = data[key];
            }
        }
    });
    
    // Set rich text content
    if (data.contentHtml && quillEditor) {
        quillEditor.root.innerHTML = data.contentHtml;
    }
}

function saveAsDraft() {
    const data = collectFormData();
    data.mode = currentComposeMode;
    data.template = selectedTemplate;
    data.draft = true;
    data.lastModified = new Date().toISOString();
    
    // Save to localStorage drafts
    const drafts = JSON.parse(localStorage.getItem('quravel_content_drafts') || '[]');
    drafts.push(data);
    localStorage.setItem('quravel_content_drafts', JSON.stringify(drafts));
    
    showNotification('Draft saved successfully', 'success');
}

function publishContent() {
    const data = collectFormData();
    data.published = true;
    data.publishedAt = new Date().toISOString();
    data.id = Date.now();
    
    // Add to posts data
    const postsData = JSON.parse(localStorage.getItem('quravel_posts') || '[]');
    postsData.push(data);
    localStorage.setItem('quravel_posts', JSON.stringify(postsData));
    
    // Clear draft if exists
    contentDraft = null;
    
    closeComposeModal();
    showNotification('Content published successfully', 'success');
    
    // Refresh posts table
    location.reload();
}

function resetComposeForm() {
    // Clear form fields
    document.getElementById('template-form').reset();
    
    // Clear editors
    if (quillEditor) {
        quillEditor.setContents([]);
    }
    if (codeMirrorEditor) {
        codeMirrorEditor.setValue('');
    }
    
    // Hide template editor
    document.getElementById('template-editor').style.display = 'none';
    
    // Reset template selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Hide HTML preview
    const preview = document.getElementById('html-preview');
    if (preview) {
        preview.style.display = 'none';
    }
    
    // Reset mode
    currentComposeMode = 'template';
    selectedTemplate = '';
}

// Utility Functions
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

// Template Preview Styles
const style = document.createElement('style');
style.textContent = `
    .compose-tabs {
        display: flex;
        border-bottom: 2px solid var(--border-subtle, #334155);
        margin-bottom: 20px;
    }
    
    .tab-btn {
        background: none;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
        color: var(--text-secondary, #94A3B8);
        font-weight: 500;
        border-bottom: 2px solid transparent;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .tab-btn:hover {
        color: var(--text-primary, #E4E4E7);
    }
    
    .tab-btn.active {
        color: var(--interactive-500, #22D3EE);
        border-bottom-color: var(--interactive-500, #22D3EE);
    }
    
    .compose-mode {
        display: none;
    }
    
    .compose-mode.active {
        display: block;
    }
    
    .template-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin: 20px 0;
    }
    
    .template-card {
        border: 2px solid var(--border-subtle, #334155);
        border-radius: 12px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
    }
    
    .template-card:hover {
        border-color: var(--interactive-500, #22D3EE);
        transform: translateY(-2px);
    }
    
    .template-card.selected {
        border-color: var(--interactive-500, #22D3EE);
        background: var(--bg-surface, #101828);
    }
    
    .template-preview h4 {
        color: var(--text-primary, #E4E4E7);
        margin-bottom: 8px;
    }
    
    .template-preview p {
        color: var(--text-secondary, #94A3B8);
        font-size: 14px;
    }
    
    .html-editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    
    .html-editor-container {
        border: 2px solid var(--border-subtle, #334155);
        border-radius: 8px;
        overflow: hidden;
    }
    
    .html-preview {
        margin-top: 20px;
        border: 2px solid var(--border-subtle, #334155);
        border-radius: 8px;
        padding: 16px;
    }
    
    .html-preview iframe {
        width: 100%;
        height: 400px;
        border: none;
        border-radius: 4px;
        background: white;
    }
    
    .saved-templates-grid {
        display: grid;
        gap: 16px;
    }
    
    .saved-template-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border: 2px solid var(--border-subtle, #334155);
        border-radius: 12px;
        background: var(--bg-surface, #101828);
    }
    
    .template-info h4 {
        color: var(--text-primary, #E4E4E7);
        margin-bottom: 4px;
    }
    
    .template-info p {
        color: var(--text-secondary, #94A3B8);
        font-size: 14px;
    }
    
    .template-date {
        color: var(--text-muted, #64748B);
        font-size: 12px;
    }
    
    .template-actions {
        display: flex;
        gap: 8px;
    }
    
    .no-templates {
        text-align: center;
        color: var(--text-secondary, #94A3B8);
        padding: 40px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        color: white;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    }
    
    .notification-success {
        background: var(--semantic-success, #22C55E);
    }
    
    .notification-error {
        background: var(--semantic-error, #EF4444);
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .modal-large .modal-content {
        max-width: 1200px;
    }
`;
document.head.appendChild(style);