// Dashboard Analytics with Chart.js

// Chart instances
let spamTrendsChart = null;
let classificationChart = null;
let threatTypesChart = null;

// Dashboard data
let dashboardData = {
    totalScans: 0,
    spamDetected: 0,
    safeMessages: 0,
    suspiciousMessages: 0,
    accuracyRate: 99.7,
    trends: [],
    threatTypes: {},
    recentActivity: []
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadUserStats();
    loadRecentActivity();
    setupEventListeners();
    updateUserInterface();
    
    // Initialize charts after a short delay to ensure DOM is ready
    setTimeout(() => {
        initializeCharts();
        initializeControls();
        startRealTimeUpdates();
    }, 500);
});

function initializeDashboard() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update user greeting
    updateUserGreeting(currentUser);
    
    // Load dashboard data
    loadDashboardData();
}

// Load recent activity (alias for generateRecentActivity)
function loadRecentActivity() {
    generateRecentActivity();
}

// Update user greeting
function updateUserGreeting(user) {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        const name = user.name || 'User';
        welcomeMessage.textContent = `Welcome back, ${name}!`;
    }
}

// Update user interface with logged-in user data
function updateUserInterface() {
    const currentUser = getCurrentUser();
    const authToken = localStorage.getItem('authToken');
    
    if (currentUser && authToken) {
        // Update navigation to show logout
        updateNavigationForLoggedInUser(currentUser);
        
        // Update profile sections
        updateProfileSections(currentUser);
        
        // Show user-specific content
        showLoggedInContent();
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
}

// Update navigation for logged-in users
function updateNavigationForLoggedInUser(user) {
    // Update profile circle with user initial
    const profileCircles = document.querySelectorAll('.profile-circle');
    profileCircles.forEach(circle => {
        const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
        circle.textContent = initial;
        circle.title = user.name || 'User Profile';
    });
    
    // Update profile dropdown or menu
    const profileName = document.getElementById('profile-name');
    if (profileName) {
        profileName.textContent = user.name || 'User';
    }
    
    // Update user email in profile
    const profileEmail = document.getElementById('profile-email');
    if (profileEmail) {
        profileEmail.textContent = user.email || '';
    }
    
    // Add logout functionality to logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
}

// Update profile sections with user data
function updateProfileSections(user) {
    // Update welcome message
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${user.name || 'User'}!`;
    }
    
    // Update user stats display
    const userNameDisplay = document.getElementById('user-name-display');
    if (userNameDisplay) {
        userNameDisplay.textContent = user.name || 'User';
    }
    
    // Update member since date
    const memberSince = document.getElementById('member-since');
    if (memberSince && user.joinDate) {
        const joinDate = new Date(user.joinDate);
        memberSince.textContent = `Member since ${joinDate.toLocaleDateString()}`;
    }
    
    // Update last login
    const lastLogin = document.getElementById('last-login');
    if (lastLogin && user.lastLogin) {
        const loginDate = new Date(user.lastLogin);
        lastLogin.textContent = `Last login: ${loginDate.toLocaleString()}`;
    }
}

// Show content for logged-in users
function showLoggedInContent() {
    // Hide login/signup buttons
    const authButtons = document.querySelectorAll('.auth-btn, .login-btn, .signup-btn');
    authButtons.forEach(btn => {
        btn.style.display = 'none';
    });
    
    // Show user menu/profile dropdown
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.style.display = 'block';
    }
    
    // Show logout button
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.style.display = 'inline-block';
    });
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        performLogout();
    }
}

// Perform logout
function performLogout() {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    
    // Clear any other user-specific data
    sessionStorage.clear();
    
    // Show success message
    showAlert('Logged out successfully!', 'success');
    
    // Redirect to home page after short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && hamburger && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

function loadUserStats() {
    const userStats = Storage.get('userStats', {
        totalScans: 0,
        spamDetected: 0,
        safeMessages: 0,
        suspiciousMessages: 0
    });
    
    dashboardData = {
        ...userStats,
        totalScans: Math.max(userStats.totalScans, 15847),
        spamDetected: Math.max(userStats.spamDetected, 3291),
        safeMessages: Math.max(userStats.safeMessages, 11234),
        suspiciousMessages: Math.max(userStats.suspiciousMessages, 1322),
        accuracyRate: 99.7
    };
    
    // Generate trend data
    generateTrendData();
    generateThreatTypeData();
    generateRecentActivity();
}

// Load and display dashboard data
function loadDashboardData() {
    // Animate counters using utility function
    const totalScansEl = document.getElementById('total-scans-count');
    const spamDetectedEl = document.getElementById('spam-detected-count');
    const safeMessagesEl = document.getElementById('safe-messages-count');
    const accuracyRateEl = document.getElementById('accuracy-rate');
    
    if (typeof animateCounter === 'function') {
        if (totalScansEl) animateCounter(totalScansEl, dashboardData.totalScans);
        if (spamDetectedEl) animateCounter(spamDetectedEl, dashboardData.spamDetected);
        if (safeMessagesEl) animateCounter(safeMessagesEl, dashboardData.safeMessages);
    } else {
        // Fallback if animateCounter not available
        if (totalScansEl) totalScansEl.textContent = dashboardData.totalScans.toLocaleString();
        if (spamDetectedEl) spamDetectedEl.textContent = dashboardData.spamDetected.toLocaleString();
        if (safeMessagesEl) safeMessagesEl.textContent = dashboardData.safeMessages.toLocaleString();
    }
    
    // Update accuracy rate
    if (accuracyRateEl) {
        accuracyRateEl.textContent = dashboardData.accuracyRate + '%';
    }
}

// Dashboard specific counter animation (removed duplicate - using utils.js version)

// Generate trend data for charts
function generateTrendData() {
    const days = 7;
    const trends = [];
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Generate realistic data with some randomness
        const baseScans = 2000 + Math.random() * 500;
        const spamRate = 0.15 + Math.random() * 0.1; // 15-25% spam rate
        
        trends.push({
            date: date.toISOString().split('T')[0],
            totalScans: Math.floor(baseScans),
            spamDetected: Math.floor(baseScans * spamRate),
            safeMessages: Math.floor(baseScans * (0.7 + Math.random() * 0.1)),
            suspiciousMessages: Math.floor(baseScans * (0.05 + Math.random() * 0.05))
        });
    }
    
    dashboardData.trends = trends;
}

// Generate threat type data
function generateThreatTypeData() {
    dashboardData.threatTypes = {
        'Financial Scams': 1247,
        'Phishing Attempts': 892,
        'Malicious URLs': 567,
        'Promotional Spam': 423,
        'Fake Offers': 234,
        'Tech Support Scams': 156
    };
}

// Generate recent activity
function generateRecentActivity() {
    const activities = [
        { type: 'spam', message: 'High-risk financial scam detected', time: '2 minutes ago', confidence: 94 },
        { type: 'safe', message: 'Business email verified as safe', time: '5 minutes ago', confidence: 98 },
        { type: 'suspicious', message: 'Promotional email flagged', time: '8 minutes ago', confidence: 67 },
        { type: 'spam', message: 'Phishing attempt blocked', time: '12 minutes ago', confidence: 89 },
        { type: 'safe', message: 'Newsletter classified as safe', time: '15 minutes ago', confidence: 95 },
        { type: 'spam', message: 'Malicious URL detected', time: '18 minutes ago', confidence: 91 }
    ];
    
    dashboardData.recentActivity = activities;
    updateActivityFeed();
}

// Initialize charts
function initializeCharts() {
    initializeSpamTrendsChart();
    initializeClassificationChart();
    initializeThreatTypesChart();
}

// Initialize spam trends chart
function initializeSpamTrendsChart() {
    const canvas = document.getElementById('spam-trends-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const labels = dashboardData.trends.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    spamTrendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Total Scans',
                    data: dashboardData.trends.map(item => item.totalScans),
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Spam Detected',
                    data: dashboardData.trends.map(item => item.spamDetected),
                    borderColor: '#ff4757',
                    backgroundColor: 'rgba(255, 71, 87, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Safe Messages',
                    data: dashboardData.trends.map(item => item.safeMessages),
                    borderColor: '#2ed573',
                    backgroundColor: 'rgba(46, 213, 115, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#a0aec0',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 212, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(0, 212, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Initialize classification pie chart
function initializeClassificationChart() {
    const canvas = document.getElementById('classification-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const total = dashboardData.totalScans;
    const safePercentage = ((dashboardData.safeMessages / total) * 100).toFixed(1);
    const spamPercentage = ((dashboardData.spamDetected / total) * 100).toFixed(1);
    const suspiciousPercentage = ((dashboardData.suspiciousMessages / total) * 100).toFixed(1);
    
    classificationChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Safe', 'Spam', 'Suspicious'],
            datasets: [{
                data: [dashboardData.safeMessages, dashboardData.spamDetected, dashboardData.suspiciousMessages],
                backgroundColor: ['#2ed573', '#ff4757', '#ffd700'],
                borderColor: ['#2ed573', '#ff4757', '#ffd700'],
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const percentage = ((context.raw / total) * 100).toFixed(1);
                            return `${context.label}: ${context.raw.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// Initialize threat types horizontal bar chart
function initializeThreatTypesChart() {
    const canvas = document.getElementById('threat-types-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    const labels = Object.keys(dashboardData.threatTypes);
    const data = Object.values(dashboardData.threatTypes);
    
    threatTypesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Threats Detected',
                data: data,
                backgroundColor: [
                    '#ff4757',
                    '#ff6b35',
                    '#ffd700',
                    '#ff9f43',
                    '#ff7675',
                    '#e17055'
                ],
                borderColor: [
                    '#ff4757',
                    '#ff6b35',
                    '#ffd700',
                    '#ff9f43',
                    '#ff7675',
                    '#e17055'
                ],
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(0, 212, 255, 0.1)'
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#a0aec0'
                    }
                }
            }
        }
    });
}

// Update activity feed
function updateActivityFeed() {
    const activityFeed = document.getElementById('activity-feed');
    if (!activityFeed) return;
    
    const activityHTML = dashboardData.recentActivity.map(activity => {
        const iconClass = activity.type === 'spam' ? 'fa-exclamation-triangle' : 
                         activity.type === 'suspicious' ? 'fa-exclamation-circle' : 'fa-check-circle';
        const colorClass = activity.type === 'spam' ? 'danger' : 
                          activity.type === 'suspicious' ? 'warning' : 'success';
        
        return `
            <div class="activity-item ${colorClass}">
                <div class="activity-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-message">${activity.message}</div>
                    <div class="activity-meta">
                        <span class="activity-time">${activity.time}</span>
                        <span class="activity-confidence">Confidence: ${activity.confidence}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    activityFeed.innerHTML = activityHTML;
}

// Initialize dashboard controls
function initializeControls() {
    // Time range selector
    const timeRange = document.getElementById('time-range');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            updateDashboardData(this.value);
        });
    }
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-data');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
            this.disabled = true;
            
            setTimeout(() => {
                refreshDashboardData();
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
                this.disabled = false;
            }, 1500);
        });
    }
    
    // Chart type toggles
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart');
            const parentCard = this.closest('.chart-card');
            
            // Update active state
            parentCard.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart type
            if (spamTrendsChart && parentCard.querySelector('#spam-trends-chart')) {
                updateChartType(spamTrendsChart, chartType);
            }
        });
    });
}

// Update chart type
function updateChartType(chart, newType) {
    chart.config.type = newType;
    chart.update('active');
}

// Update dashboard data based on time range
function updateDashboardData(timeRange) {
    // Simulate data update based on time range
    let multiplier = 1;
    switch (timeRange) {
        case '24h':
            multiplier = 0.1;
            break;
        case '7d':
            multiplier = 1;
            break;
        case '30d':
            multiplier = 4;
            break;
        case '90d':
            multiplier = 12;
            break;
    }
    
    // Update data
    const baseData = Storage.get('userStats', {
        totalScans: 15847,
        spamDetected: 3291,
        safeMessages: 11234,
        suspiciousMessages: 1322
    });
    
    dashboardData.totalScans = Math.floor(baseData.totalScans * multiplier);
    dashboardData.spamDetected = Math.floor(baseData.spamDetected * multiplier);
    dashboardData.safeMessages = Math.floor(baseData.safeMessages * multiplier);
    dashboardData.suspiciousMessages = Math.floor(baseData.suspiciousMessages * multiplier);
    
    // Regenerate trend data
    generateTrendData();
    
    // Update displays
    loadDashboardData();
    updateCharts();
}

// Refresh dashboard data
function refreshDashboardData() {
    // Add some randomness to simulate real updates
    const variance = 0.05; // 5% variance
    
    Object.keys(dashboardData).forEach(key => {
        if (typeof dashboardData[key] === 'number' && key !== 'accuracyRate') {
            const change = (Math.random() - 0.5) * 2 * variance;
            dashboardData[key] = Math.floor(dashboardData[key] * (1 + change));
        }
    });
    
    generateRecentActivity();
    loadDashboardData();
    updateCharts();
}

// Update all charts
function updateCharts() {
    if (spamTrendsChart) {
        spamTrendsChart.data.datasets[0].data = dashboardData.trends.map(item => item.totalScans);
        spamTrendsChart.data.datasets[1].data = dashboardData.trends.map(item => item.spamDetected);
        spamTrendsChart.data.datasets[2].data = dashboardData.trends.map(item => item.safeMessages);
        spamTrendsChart.update('active');
    }
    
    if (classificationChart) {
        classificationChart.data.datasets[0].data = [
            dashboardData.safeMessages,
            dashboardData.spamDetected,
            dashboardData.suspiciousMessages
        ];
        classificationChart.update('active');
    }
    
    if (threatTypesChart) {
        threatTypesChart.update('active');
    }
}

// Start real-time updates
function startRealTimeUpdates() {
    // Update activity feed every 30 seconds
    setInterval(() => {
        addNewActivity();
    }, 30000);
    
    // Update statistics every 2 minutes
    setInterval(() => {
        updateStatistics();
    }, 120000);
}

// Add new activity to feed
function addNewActivity() {
    const newActivities = [
        { type: 'spam', message: 'Suspicious email blocked automatically', confidence: 87 },
        { type: 'safe', message: 'Corporate newsletter verified', confidence: 96 },
        { type: 'suspicious', message: 'Marketing email requires review', confidence: 73 },
        { type: 'spam', message: 'Phishing attempt detected and blocked', confidence: 92 }
    ];
    
    const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
    randomActivity.time = 'Just now';
    
    // Add to beginning of array
    dashboardData.recentActivity.unshift(randomActivity);
    
    // Keep only last 6 activities
    dashboardData.recentActivity = dashboardData.recentActivity.slice(0, 6);
    
    // Update display
    updateActivityFeed();
    
    // Animate new item
    setTimeout(() => {
        const firstItem = document.querySelector('.activity-item');
        if (firstItem) {
            firstItem.style.animation = 'slideInRight 0.5s ease';
        }
    }, 100);
}

// Update statistics with small increments
function updateStatistics() {
    // Small random increments
    dashboardData.totalScans += Math.floor(Math.random() * 10) + 1;
    
    if (Math.random() > 0.7) {
        dashboardData.spamDetected += Math.floor(Math.random() * 3) + 1;
    }
    
    dashboardData.safeMessages += Math.floor(Math.random() * 8) + 1;
    
    if (Math.random() > 0.8) {
        dashboardData.suspiciousMessages += Math.floor(Math.random() * 2) + 1;
    }
    
    // Update displays
    animateCounter('total-scans-count', dashboardData.totalScans, 1000);
    animateCounter('spam-detected-count', dashboardData.spamDetected, 1000);
    animateCounter('safe-messages-count', dashboardData.safeMessages, 1000);
}

// Export dashboard data for other modules
window.getDashboardData = () => dashboardData;
window.updateDashboardStats = (stats) => {
    Object.assign(dashboardData, stats);
    loadDashboardData();
    updateCharts();
};
