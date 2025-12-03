// Admin Header & Menu Management Functions

// Menu items data structure
let menuItemsData = [
    {
        id: 1,
        text: 'Home',
        menuId: 'home',
        url: '#',
        active: true,
        order: 1
    },
    {
        id: 2,
        text: 'Top IMDB',
        menuId: 'top-imdb',
        url: '#',
        active: false,
        order: 2
    },
    {
        id: 3,
        text: 'Top Rated',
        menuId: 'top-rated',
        url: '#',
        active: false,
        order: 3
    },
    {
        id: 4,
        text: 'Top Anime',
        menuId: 'top-anime',
        url: '#',
        active: false,
        order: 4
    }
];

// Header configuration
let headerConfig = {
    backgroundColor: '#1c1f24',
    textColor: '#ffffff',
    activeColor: '#22D3EE',
    logoUrl: 'images/logo.png'
};

// Current editing item
let editingMenuItem = null;

// Load menu items from localStorage
function loadMenuItems() {
    const savedItems = localStorage.getItem('quravel_menu_items');
    if (savedItems) {
        menuItemsData = JSON.parse(savedItems);
    }
    renderMenuItemsTable();
    updatePreview();
    updateMenuItemsCount();
}

// Save menu items to localStorage
function saveMenuItems() {
    localStorage.setItem('quravel_menu_items', JSON.stringify(menuItemsData));
}

// Update menu items count in dashboard
function updateMenuItemsCount() {
    const countElement = document.getElementById('menu-items');
    if (countElement) {
        countElement.textContent = menuItemsData.length;
    }
}

// Render menu items table
function renderMenuItemsTable() {
    const tbody = document.getElementById('menuItemsTableBody');
    if (!tbody) return;

    // Sort by order
    const sortedItems = [...menuItemsData].sort((a, b) => a.order - b.order);
    
    tbody.innerHTML = sortedItems.map(item => `
        <tr>
            <td>${item.text}</td>
            <td><code>${item.menuId}</code></td>
            <td>${item.url || '-'}</td>
            <td>${item.active ? '<span class="status-badge active">Active</span>' : '<span class="status-badge inactive">Inactive</span>'}</td>
            <td>${item.order}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editMenuItem(${item.id})" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="deleteMenuItem(${item.id})" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Show add menu item modal
function showAddMenuItemModal() {
    editingMenuItem = null;
    document.getElementById('menuItemModalTitle').textContent = 'Add Menu Item';
    document.getElementById('menuItemForm').reset();
    document.getElementById('menuActive').checked = true;
    document.getElementById('addMenuItemModal').style.display = 'block';
}

// Edit menu item
function editMenuItem(id) {
    const item = menuItemsData.find(item => item.id === id);
    if (!item) return;

    editingMenuItem = item;
    document.getElementById('menuItemModalTitle').textContent = 'Edit Menu Item';
    document.getElementById('menuText').value = item.text;
    document.getElementById('menuId').value = item.menuId;
    document.getElementById('menuUrl').value = item.url || '';
    document.getElementById('menuOrder').value = item.order;
    document.getElementById('menuActive').checked = item.active;
    document.getElementById('addMenuItemModal').style.display = 'block';
}

// Close menu item modal
function closeMenuItemModal() {
    document.getElementById('addMenuItemModal').style.display = 'none';
    editingMenuItem = null;
}

// Save menu item
function saveMenuItem(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const menuItem = {
        text: formData.get('menuText'),
        menuId: formData.get('menuId'),
        url: formData.get('menuUrl'),
        order: parseInt(formData.get('menuOrder')) || 1,
        active: formData.get('menuActive') === 'on'
    };

    if (editingMenuItem) {
        // Update existing item
        const index = menuItemsData.findIndex(item => item.id === editingMenuItem.id);
        if (index !== -1) {
            menuItem.id = editingMenuItem.id;
            menuItemsData[index] = menuItem;
        }
    } else {
        // Add new item
        menuItem.id = Date.now();
        menuItemsData.push(menuItem);
    }

    saveMenuItems();
    renderMenuItemsTable();
    updatePreview();
    updateMenuItemsCount();
    closeMenuItemModal();
    
    showNotification('Menu item saved successfully!', 'success');
}

// Delete menu item
function deleteMenuItem(id) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        menuItemsData = menuItemsData.filter(item => item.id !== id);
        saveMenuItems();
        renderMenuItemsTable();
        updatePreview();
        updateMenuItemsCount();
        showNotification('Menu item deleted successfully!', 'success');
    }
}

// Update header background color
function updateHeaderBgColor(color) {
    headerConfig.backgroundColor = color;
    document.getElementById('header-bg-color').value = color;
    document.getElementById('header-bg-color-picker').value = color;
    updatePreview();
    saveHeaderConfig();
}

// Update header text color
function updateHeaderTextColor(color) {
    headerConfig.textColor = color;
    document.getElementById('header-text-color').value = color;
    document.getElementById('header-text-color-picker').value = color;
    updatePreview();
    saveHeaderConfig();
}

// Update header active color
function updateHeaderActiveColor(color) {
    headerConfig.activeColor = color;
    document.getElementById('header-active-color').value = color;
    document.getElementById('header-active-color-picker').value = color;
    updatePreview();
    saveHeaderConfig();
}

// Update logo URL
function updateLogoUrl(url) {
    headerConfig.logoUrl = url;
    document.getElementById('logo-url').value = url;
    updatePreview();
    saveHeaderConfig();
}

// Save header configuration
function saveHeaderConfig() {
    localStorage.setItem('quravel_header_config', JSON.stringify(headerConfig));
}

// Load header configuration
function loadHeaderConfig() {
    const saved = localStorage.getItem('quravel_header_config');
    if (saved) {
        headerConfig = { ...headerConfig, ...JSON.parse(saved) };
        
        // Update form values
        document.getElementById('header-bg-color').value = headerConfig.backgroundColor;
        document.getElementById('header-bg-color-picker').value = headerConfig.backgroundColor;
        document.getElementById('header-text-color').value = headerConfig.textColor;
        document.getElementById('header-text-color-picker').value = headerConfig.textColor;
        document.getElementById('header-active-color').value = headerConfig.activeColor;
        document.getElementById('header-active-color-picker').value = headerConfig.activeColor;
        document.getElementById('logo-url').value = headerConfig.logoUrl;
    }
}

// Update preview
function updatePreview() {
    const previewMenuList = document.getElementById('previewMenuList');
    if (!previewMenuList) return;

    const sortedItems = [...menuItemsData].sort((a, b) => a.order - b.order);
    
    previewMenuList.innerHTML = sortedItems.map(item => `
        <li>
            <a href="${item.url}" class="preview-menu-item ${item.active ? 'active' : ''}" data-menu="${item.menuId}">
                ${item.text}
            </a>
        </li>
    `).join('');
    
    // Apply header colors to preview
    const previewMenu = document.getElementById('previewMenu');
    if (previewMenu) {
        previewMenu.style.backgroundColor = headerConfig.backgroundColor;
    }
    
    // Apply colors to menu items
    const previewItems = previewMenuList.querySelectorAll('.preview-menu-item');
    previewItems.forEach(item => {
        item.style.color = headerConfig.textColor;
        if (item.classList.contains('active')) {
            item.style.color = headerConfig.activeColor;
        }
    });
}

// Initialize color pickers
function initializeColorPickers() {
    loadHeaderConfig();
    
    // Color input event listeners
    document.getElementById('header-bg-color').addEventListener('input', function() {
        if (this.value.match(/^#[0-9A-F]{6}$/i)) {
            updateHeaderBgColor(this.value);
        }
    });
    
    document.getElementById('header-text-color').addEventListener('input', function() {
        if (this.value.match(/^#[0-9A-F]{6}$/i)) {
            updateHeaderTextColor(this.value);
        }
    });
    
    document.getElementById('header-active-color').addEventListener('input', function() {
        if (this.value.match(/^#[0-9A-F]{6}$/i)) {
            updateHeaderActiveColor(this.value);
        }
    });
    
    document.getElementById('logo-url').addEventListener('change', function() {
        updateLogoUrl(this.value);
    });
}

// Export header configuration
function exportHeaderConfig() {
    const config = {
        menuItems: menuItemsData,
        headerConfig: headerConfig
    };
    
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quravel-header-config.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Header configuration exported!', 'success');
}

// Import header configuration
function importHeaderConfig() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const config = JSON.parse(e.target.result);
                
                if (config.menuItems) {
                    menuItemsData = config.menuItems;
                }
                
                if (config.headerConfig) {
                    headerConfig = { ...headerConfig, ...config.headerConfig };
                }
                
                saveMenuItems();
                saveHeaderConfig();
                loadHeaderConfig();
                renderMenuItemsTable();
                updatePreview();
                updateMenuItemsCount();
                
                showNotification('Header configuration imported successfully!', 'success');
            } catch (error) {
                showNotification('Error importing configuration: Invalid JSON file', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('addMenuItemModal');
    if (event.target === modal) {
        closeMenuItemModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMenuItemModal();
    }
});