// Website Status & Analytics JavaScript

let trafficChart;
let behaviorChart;
let topContentChart;
let leastContentChart;
let userTypeChart;
let behaviorTrendChart;
let currentPeriod = '30days';

// Sample analytics data
let analyticsData = {
    visitors: {
        today: 1250,
        '7days': 8750,
        '30days': 34500,
        '90days': 98760,
        '180days': 187540,
        '1year': 356780,
        '3years': 987650
    },
    pageViews: {
        today: 2100,
        '7days': 14700,
        '30days': 58300,
        '90days': 167890,
        '180days': 318900,
        '1year': 612340,
        '3years': 1654320
    },
    topContent: [
        { title: 'Stranger Things', views: 15420, watchTime: '45.2h' },
        { title: 'The Dark Knight', views: 12890, watchTime: '32.1h' },
        { title: 'Breaking Bad', views: 11567, watchTime: '58.9h' },
        { title: 'Inception', views: 9823, watchTime: '28.4h' },
        { title: 'The Office', views: 8756, watchTime: '67.3h' },
        { title: 'Game of Thrones', views: 8234, watchTime: '89.7h' },
        { title: 'Interstellar', views: 7892, watchTime: '34.6h' },
        { title: 'Friends', views: 7456, watchTime: '124.5h' },
        { title: 'The Matrix', views: 7123, watchTime: '29.8h' },
        { title: 'Peaky Blinders', views: 6890, watchTime: '52.1h' }
    ],
    leastContent: [
        { title: 'Old Documentary', views: 23, watchTime: '0.2h' },
        { title: 'Beta Series', views: 45, watchTime: '0.5h' },
        { title: 'Test Content', views: 67, watchTime: '0.8h' },
        { title: 'Rare Movie', views: 89, watchTime: '1.2h' },
        { title: 'Short Film', views: 112, watchTime: '1.5h' }
    ],
    userTypes: {
        new: 3420,
        returning: 6580,
        retentionRate: 65.8
    },
    behavior: {
        avgSessionDuration: 720, // seconds
        pagesPerSession: 3.4,
        returnFrequency: 4.2, // days
        bounceRate: 32.5
    },
    realTime: {
        activeUsers: 127,
        currentPageViews: 89,
        bounceCount: 12
    },
    systemStatus: {
        website: { status: 'online', uptime: 99.9 },
        database: { status: 'online', responseTime: 45 },
        cdn: { status: 'online', coverage: 'global' },
        storage: { status: 'warning', used: 75, total: 20 }
    }
};

// Initialize Analytics Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDateRangePicker();
    initializeCharts();
    loadAnalyticsData();
    startRealTimeUpdates();
});

// Initialize Date Range Picker
function initializeDateRangePicker() {
    $('#dateRange').daterangepicker({
        startDate: moment().subtract(30, 'days'),
        endDate: moment(),
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'Last 90 Days': [moment().subtract(89, 'days'), moment()],
            'Last 6 Months': [moment().subtract(5, 'months'), moment()],
            'Last Year': [moment().subtract(1, 'year'), moment()]
        }
    }, function(start, end) {
        updateAnalyticsData(start, end);
    });
}

// Initialize Charts
function initializeCharts() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    trafficChart = new Chart(trafficCtx, {
        type: 'line',
        data: {
            labels: generateDateLabels(currentPeriod),
            datasets: [{
                label: 'Visitors',
                data: generateChartData('visitors'),
                borderColor: '#22D3EE',
                backgroundColor: 'rgba(34, 211, 238, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#E4E4E7'
                    }
                }
            }
        }
    });

    // Behavior Chart
    const behaviorCtx = document.getElementById('behaviorChart').getContext('2d');
    behaviorChart = new Chart(behaviorCtx, {
        type: 'doughnut',
        data: {
            labels: ['Desktop', 'Mobile', 'Tablet'],
            datasets: [{
                data: [45, 40, 15],
                backgroundColor: ['#22D3EE', '#A94451', '#F59E0B']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#E4E4E7'
                    }
                }
            }
        }
    });

    // Top Content Chart
    const topContentCtx = document.getElementById('topContentChart').getContext('2d');
    topContentChart = new Chart(topContentCtx, {
        type: 'bar',
        data: {
            labels: analyticsData.topContent.slice(0, 5).map(item => item.title),
            datasets: [{
                label: 'Views',
                data: analyticsData.topContent.slice(0, 5).map(item => item.views),
                backgroundColor: '#22D3EE'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#E4E4E7'
                    }
                }
            }
        }
    });

    // Least Content Chart
    const leastContentCtx = document.getElementById('leastContentChart').getContext('2d');
    leastContentChart = new Chart(leastContentCtx, {
        type: 'bar',
        data: {
            labels: analyticsData.leastContent.map(item => item.title),
            datasets: [{
                label: 'Views',
                data: analyticsData.leastContent.map(item => item.views),
                backgroundColor: '#EF4444'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#E4E4E7'
                    }
                }
            }
        }
    });

    // User Type Chart
    const userTypeCtx = document.getElementById('userTypeChart').getContext('2d');
    userTypeChart = new Chart(userTypeCtx, {
        type: 'pie',
        data: {
            labels: ['New Users', 'Returning Users'],
            datasets: [{
                data: [analyticsData.userTypes.new, analyticsData.userTypes.returning],
                backgroundColor: ['#A94451', '#22D3EE']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#E4E4E7'
                    }
                }
            }
        }
    });

    // Behavior Trend Chart
    const behaviorTrendCtx = document.getElementById('behaviorTrendChart').getContext('2d');
    behaviorTrendChart = new Chart(behaviorTrendCtx, {
        type: 'line',
        data: {
            labels: generateDateLabels(currentPeriod),
            datasets: [{
                label: 'Session Duration (minutes)',
                data: generateTrendData(analyticsData.behavior.avgSessionDuration / 60),
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#E4E4E7'
                    }
                }
            }
        }
    });
}

// Load Analytics Data
function loadAnalyticsData() {
    updateMetricsOverview();
    updateContentLists();
    updateUserTypeData();
    updateBehaviorData();
    updateSystemStatus();
}

// Update Metrics Overview
function updateMetricsOverview() {
    const visitors = analyticsData.visitors[currentPeriod];
    const pageViews = analyticsData.pageViews[currentPeriod];
    const avgSession = analyticsData.behavior.avgSessionDuration;
    const bounceRate = analyticsData.behavior.bounceRate;

    document.getElementById('total-visitors').textContent = formatNumber(visitors);
    document.getElementById('page-views').textContent = formatNumber(pageViews);
    document.getElementById('avg-session').textContent = formatDuration(avgSession);
    document.getElementById('bounce-rate').textContent = bounceRate + '%';

    // Update trends (mock data)
    updateTrend('visitors-trend', Math.floor(Math.random() * 20) - 10);
    updateTrend('views-trend', Math.floor(Math.random() * 20) - 10);
    updateTrend('session-trend', Math.floor(Math.random() * 20) - 10);
    updateTrend('bounce-trend', Math.floor(Math.random() * 20) - 10);
}

// Update Trend Display
function updateTrend(elementId, change) {
    const element = document.getElementById(elementId);
    const isPositive = change > 0;
    const arrow = isPositive ? '↑' : '↓';
    const className = isPositive ? 'trend-up' : 'trend-down';
    
    element.className = `metric-trend ${className}`;
    element.textContent = `${arrow}${Math.abs(change)}%`;
}

// Update Content Lists
function updateContentLists() {
    // Top Content List
    const topContentList = document.getElementById('topContentList');
    topContentList.innerHTML = analyticsData.topContent.map((item, index) => `
        <div class="content-item">
            <div class="content-rank">#${index + 1}</div>
            <div class="content-info">
                <h5>${item.title}</h5>
                <div class="content-stats">
                    <span>${formatNumber(item.views)} views</span>
                    <span>${item.watchTime} watch time</span>
                </div>
            </div>
        </div>
    `).join('');

    // Least Content List
    const leastContentList = document.getElementById('leastContentList');
    leastContentList.innerHTML = analyticsData.leastContent.map((item, index) => `
        <div class="content-item">
            <div class="content-rank">#${index + 1}</div>
            <div class="content-info">
                <h5>${item.title}</h5>
                <div class="content-stats">
                    <span>${formatNumber(item.views)} views</span>
                    <span>${item.watchTime} watch time</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Update User Type Data
function updateUserTypeData() {
    const total = analyticsData.userTypes.new + analyticsData.userTypes.returning;
    const newPercentage = Math.round((analyticsData.userTypes.new / total) * 100);
    const returningPercentage = Math.round((analyticsData.userTypes.returning / total) * 100);

    document.getElementById('new-users-count').textContent = formatNumber(analyticsData.userTypes.new);
    document.getElementById('new-users-percentage').textContent = newPercentage + '%';
    document.getElementById('returning-users-count').textContent = formatNumber(analyticsData.userTypes.returning);
    document.getElementById('returning-users-percentage').textContent = returningPercentage + '%';
    document.getElementById('retention-rate').textContent = analyticsData.userTypes.retentionRate + '%';
    document.getElementById('retention-change').textContent = '+' + (Math.floor(Math.random() * 5) + 1) + '%';
}

// Update Behavior Data
function updateBehaviorData() {
    document.getElementById('avg-session-duration').textContent = formatDuration(analyticsData.behavior.avgSessionDuration);
    document.getElementById('pages-per-session').textContent = analyticsData.behavior.pagesPerSession.toFixed(1);
    document.getElementById('return-frequency').textContent = analyticsData.behavior.returnFrequency.toFixed(1) + ' days';

    // Update changes
    updateChange('session-change', Math.floor(Math.random() * 20) - 10);
    updateChange('pages-change', Math.floor(Math.random() * 20) - 10);
    updateChange('frequency-change', Math.floor(Math.random() * 20) - 10);
}

// Update Change Display
function updateChange(elementId, change) {
    const element = document.getElementById(elementId);
    const isPositive = change > 0;
    const arrow = isPositive ? '↑' : '↓';
    const className = isPositive ? 'change-up' : 'change-down';
    
    element.className = `metric-change ${className}`;
    element.textContent = `${arrow}${Math.abs(change)}%`;
}

// Update System Status
function updateSystemStatus() {
    // Update storage status
    const storage = analyticsData.systemStatus.storage;
    const storageCard = document.querySelector('.status-card:nth-child(4) .status-indicator');
    if (storage.used > 80) {
        storageCard.className = 'status-indicator critical';
    } else if (storage.used > 70) {
        storageCard.className = 'status-indicator warning';
    } else {
        storageCard.className = 'status-indicator online';
    }
}

// Period Selection
function selectPeriod(period) {
    currentPeriod = period;
    
    // Update active button
    document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="selectPeriod('${period}')"]`).classList.add('active');
    
    // Update charts and data
    updateAnalyticsData();
}

// Performance Tab Switching
function switchPerformanceTab(tab) {
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="switchPerformanceTab('${tab}')"]`).classList.add('active');
    
    // Update active content
    document.querySelectorAll('.performance-content').forEach(content => content.classList.remove('active'));
    document.getElementById(`${tab}-performance`).classList.add('active');
}

// Update Traffic Chart
function updateTrafficChart() {
    const chartType = document.getElementById('trafficChartType').value;
    const data = generateChartData(chartType);
    
    trafficChart.data.datasets[0].label = chartType.charAt(0).toUpperCase() + chartType.slice(1);
    trafficChart.data.datasets[0].data = data;
    trafficChart.update();
}

// Update Behavior Chart
function updateBehaviorChart() {
    const chartType = document.getElementById('behaviorChartType').value;
    let data, labels, colors;
    
    switch(chartType) {
        case 'device':
            labels = ['Desktop', 'Mobile', 'Tablet'];
            data = [45, 40, 15];
            colors = ['#22D3EE', '#A94451', '#F59E0B'];
            break;
        case 'browser':
            labels = ['Chrome', 'Firefox', 'Safari', 'Edge'];
            data = [60, 25, 10, 5];
            colors = ['#22D3EE', '#A94451', '#F59E0B', '#22C55E'];
            break;
        case 'country':
            labels = ['USA', 'UK', 'Canada', 'Australia', 'Other'];
            data = [40, 20, 15, 10, 15];
            colors = ['#22D3EE', '#A94451', '#F59E0B', '#22C55E', '#8B5CF6'];
            break;
    }
    
    behaviorChart.data.labels = labels;
    behaviorChart.data.datasets[0].data = data;
    behaviorChart.data.datasets[0].backgroundColor = colors;
    behaviorChart.update();
}

// Update Analytics Data
function updateAnalyticsData(start, end) {
    // This would typically fetch new data based on date range
    loadAnalyticsData();
    updateCharts();
}

// Update Charts
function updateCharts() {
    // Update date labels
    const labels = generateDateLabels(currentPeriod);
    
    trafficChart.data.labels = labels;
    behaviorTrendChart.data.labels = labels;
    
    // Update data
    trafficChart.data.datasets[0].data = generateChartData('visitors');
    behaviorTrendChart.data.datasets[0].data = generateTrendData(analyticsData.behavior.avgSessionDuration / 60);
    
    trafficChart.update();
    behaviorTrendChart.update();
}

// Real-time Updates
function startRealTimeUpdates() {
    setInterval(() => {
        // Update real-time stats with small random changes
        document.getElementById('active-users').textContent = analyticsData.realTime.activeUsers + Math.floor(Math.random() * 10) - 5;
        document.getElementById('current-page-views').textContent = analyticsData.realTime.currentPageViews + Math.floor(Math.random() * 5) - 2;
        document.getElementById('bounce-count').textContent = analyticsData.realTime.bounceCount + Math.floor(Math.random() * 3);
    }, 30000); // Update every 30 seconds
}

// Export Analytics
function exportAnalytics() {
    const data = {
        period: currentPeriod,
        generated: new Date().toISOString(),
        metrics: {
            visitors: analyticsData.visitors[currentPeriod],
            pageViews: analyticsData.pageViews[currentPeriod],
            topContent: analyticsData.topContent,
            leastContent: analyticsData.leastContent,
            userTypes: analyticsData.userTypes,
            behavior: analyticsData.behavior
        }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `analytics-report-${currentPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Analytics report exported successfully', 'success');
}

// Refresh Analytics
function refreshAnalytics() {
    showNotification('Refreshing analytics data...', 'info');
    setTimeout(() => {
        loadAnalyticsData();
        updateCharts();
        showNotification('Analytics data refreshed', 'success');
    }, 1500);
}

// Generate Report
function generateReport() {
    showNotification('Generating comprehensive report...', 'info');
    setTimeout(() => {
        // Create a comprehensive report
        const report = {
            title: 'Website Analytics Report',
            period: currentPeriod,
            generated: new Date().toLocaleDateString(),
            summary: {
                totalVisitors: analyticsData.visitors[currentPeriod],
                totalPageViews: analyticsData.pageViews[currentPeriod],
                avgSessionDuration: formatDuration(analyticsData.behavior.avgSessionDuration),
                bounceRate: analyticsData.behavior.bounceRate + '%',
                topContent: analyticsData.topContent.slice(0, 5),
                userTypes: analyticsData.userTypes
            },
            recommendations: generateRecommendations()
        };
        
        // Download report
        const dataStr = JSON.stringify(report, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `website-analytics-report-${new Date().toISOString().split('T')[0]}.json`);
        linkElement.click();
        
        showNotification('Comprehensive report generated and downloaded', 'success');
    }, 2000);
}

// Generate Recommendations
function generateRecommendations() {
    const recommendations = [];
    
    if (analyticsData.behavior.bounceRate > 40) {
        recommendations.push('High bounce rate detected. Consider improving page loading speed and content relevance.');
    }
    
    if (analyticsData.behavior.pagesPerSession < 2) {
        recommendations.push('Low pages per session. Add related content suggestions and internal linking.');
    }
    
    if (analyticsData.userTypes.retentionRate < 50) {
        recommendations.push('Low user retention rate. Focus on improving content quality and user engagement.');
    }
    
    return recommendations.length > 0 ? recommendations : ['Great performance! Keep up the good work.'];
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

function generateDateLabels(period) {
    const labels = [];
    const now = new Date();
    const days = getDaysForPeriod(period);
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
    }
    
    return labels;
}

function getDaysForPeriod(period) {
    switch(period) {
        case 'today': return 1;
        case '7days': return 7;
        case '30days': return 30;
        case '90days': return 90;
        case '180days': return 180;
        case '1year': return 365;
        case '3years': return 1095;
        default: return 30;
    }
}

function generateChartData(type) {
    const days = getDaysForPeriod(currentPeriod);
    const baseValue = analyticsData[type][currentPeriod];
    const data = [];
    
    for (let i = 0; i < days; i++) {
        data.push(Math.floor(baseValue / days * (0.8 + Math.random() * 0.4)));
    }
    
    return data;
}

function generateTrendData(baseValue) {
    const days = getDaysForPeriod(currentPeriod);
    const data = [];
    
    for (let i = 0; i < days; i++) {
        data.push(Math.floor(baseValue * (0.9 + Math.random() * 0.2)));
    }
    
    return data;
}

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