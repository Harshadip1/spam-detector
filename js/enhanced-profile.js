// Enhanced Profile Features with 2FA, Activity Tracking, Avatar Upload, Dark Mode, and Ranking System

// User data structure
let userData = {
    profile: {},
    stats: {},
    activities: [],
    achievements: [],
    settings: {
        theme: 'dark',
        notifications: {
            email: true,
            browser: false
        },
        privacy: {
            analytics: false
        }
    },
    security: {
        twoFactorEnabled: true,
        lastPasswordChange: null
    }
};

// Achievement system
const ACHIEVEMENTS = {
    'first_scan': {
        id: 'first_scan',
        name: 'First Scan',
        description: 'Completed your first message scan',
        icon: 'fas fa-search',
        xp: 10,
        condition: (stats) => stats.totalScans >= 1
    },
    'spam_hunter': {
        id: 'spam_hunter',
        name: 'Spam Hunter',
        description: 'Detected 10 spam messages',
        icon: 'fas fa-exclamation-triangle',
        xp: 25,
        condition: (stats) => stats.spamDetected >= 10
    },
    'security_conscious': {
        id: 'security_conscious',
        name: 'Security Conscious',
        description: 'Enabled 2FA on your account',
        icon: 'fas fa-shield-check',
        xp: 50,
        condition: (user) => user.security.twoFactorEnabled
    },
    'analyzer': {
        id: 'analyzer',
        name: 'Analyzer',
        description: 'Scanned 50 messages',
        icon: 'fas fa-chart-line',
        xp: 50,
        condition: (stats) => stats.totalScans >= 50
    },
    'daily_user': {
        id: 'daily_user',
        name: 'Daily User',
        description: 'Used the service for 7 consecutive days',
        icon: 'fas fa-calendar-check',
        xp: 75,
        condition: (activities) => checkConsecutiveDays(activities, 7)
    },
    'threat_expert': {
        id: 'threat_expert',
        name: 'Threat Expert',
        description: 'Detect 100 spam messages',
        icon: 'fas fa-shield-alt',
        xp: 100,
        condition: (stats) => stats.spamDetected >= 100
    },
    'power_user': {
        id: 'power_user',
        name: 'Power User',
        description: 'Scan 500 messages',
        icon: 'fas fa-bolt',
        xp: 200,
        condition: (stats) => stats.totalScans >= 500
    },
    'security_master': {
        id: 'security_master',
        name: 'Security Master',
        description: 'Reach Security Expert rank',
        icon: 'fas fa-crown',
        xp: 500,
        condition: (user) => user.rank === 'Security Expert'
    }
};

// Ranking system
const RANKS = [
    { name: 'Novice', minXP: 0, maxXP: 99, icon: 'fas fa-user' },
    { name: 'Security Aware', minXP: 100, maxXP: 299, icon: 'fas fa-eye' },
    { name: 'Security Expert', minXP: 700, maxXP: 1499, icon: 'fas fa-star' },
    { name: 'Security Master', minXP: 3000, maxXP: Infinity, icon: 'fas fa-crown' }
];

// Initialize Enhanced Profile Management
document.addEventListener('DOMContentLoaded', function() {
    // Initialize enhanced profile features
    function initializeEnhancedProfile() {
        initializeTabNavigation();
        initializeProfileStats();
        initializeUserRank();
        loadUserActivities();
        loadUserAchievements();
        initializeSecuritySettings();
        initializePreferences();
        stats: Storage.get('userStats', {
            totalScans: 87,
            spamDetected: 23,
            safeMessages: 64,
            suspiciousMessages: 0
        })
    };
    
    // Initialize theme
    applyTheme(userData.settings.theme);
    
    // Initialize activity tracking
    if (!userData.activities) {
        userData.activities = generateInitialActivities();
    }
    
    // Update displays
    updateProfileDisplay();
    updateActivityLog();
    updateAchievementsDisplay();
}

// Load and display user data
function loadUserData() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        document.getElementById('profile-name').textContent = currentUser.name || 'User Profile';
        document.getElementById('profile-email').textContent = currentUser.email || 'user@example.com';
        
        // Update stats
        document.getElementById('messages-scanned').textContent = userData.stats.totalScans || 0;
        document.getElementById('threats-blocked').textContent = userData.stats.spamDetected || 0;
        
        // Update member since
        const memberSince = currentUser.memberSince || new Date().getFullYear();
        document.getElementById('member-since').textContent = memberSince;
    }
}

// Initialize avatar upload functionality
function initializeAvatarUpload() {
    const avatarEditBtn = document.getElementById('avatar-edit-btn');
    const avatarInput = document.getElementById('avatar-input');
    const avatarImage = document.getElementById('avatar-image');
    const avatarIcon = document.getElementById('avatar-icon');
    
    if (avatarEditBtn && avatarInput) {
        avatarEditBtn.addEventListener('click', function() {
            avatarInput.click();
        });
        
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleAvatarUpload(file);
            }
        });
    }
    
    // Load existing avatar
    const savedAvatar = Storage.get('userAvatar');
    if (savedAvatar && avatarImage && avatarIcon) {
        avatarImage.src = savedAvatar;
        avatarImage.style.display = 'block';
        avatarIcon.style.display = 'none';
    }
}

// Handle avatar upload
function handleAvatarUpload(file) {
    if (!file.type.startsWith('image/')) {
        showAlert('Please select a valid image file.', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showAlert('Image size must be less than 5MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // Update avatar display
        const avatarImage = document.getElementById('avatar-image');
        const avatarIcon = document.getElementById('avatar-icon');
        
        if (avatarImage && avatarIcon) {
            avatarImage.src = e.target.result;
            avatarImage.style.display = 'block';
            avatarIcon.style.display = 'none';
        }
        
        // Save to localStorage
        Storage.set('userAvatar', e.target.result);
        
        // Update navigation profile avatar
        if (typeof updateProfileAvatar === 'function') {
            updateProfileAvatar(e.target.result);
        }
        
        showNotification('Avatar updated successfully!', 'success');
    };
    
    reader.readAsDataURL(file);
}

// Initialize theme toggle
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeOptions = document.querySelectorAll('input[name="theme"]');
    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            toggleTheme();
        });
    }
    
    // Theme option handlers
    themeOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                setTheme(this.value);
            }
        });
    });
    
    // Set initial theme option
    const currentTheme = userData.settings.theme || 'dark';
    const themeOption = document.querySelector(`input[name="theme"][value="${currentTheme}"]`);
    if (themeOption) {
        themeOption.checked = true;
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = userData.settings.theme;
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Set theme
function setTheme(theme) {
    userData.settings.theme = theme;
    applyTheme(theme);
    
    // Update button text
    const themeText = document.getElementById('theme-text');
    const themeIcon = document.querySelector('#theme-toggle-btn i');
    
    if (themeText && themeIcon) {
        if (theme === 'dark') {
            themeText.textContent = 'Light Mode';
            themeIcon.className = 'fas fa-sun';
        } else {
            themeText.textContent = 'Dark Mode';
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // Save settings
    Storage.set('userData', userData);
    
    // Log activity
    logActivity('settings', `Switched to ${theme} theme`, 'info');
    
    showAlert(`Switched to ${theme} theme`, 'success');
}

// Apply theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    if (theme === 'light') {
        document.documentElement.style.setProperty('--primary-bg', '#ffffff');
        document.documentElement.style.setProperty('--secondary-bg', '#f8fafc');
        document.documentElement.style.setProperty('--card-bg', '#ffffff');
        document.documentElement.style.setProperty('--accent-bg', '#f1f5f9');
        document.documentElement.style.setProperty('--text-primary', '#1e293b');
        document.documentElement.style.setProperty('--text-secondary', '#475569');
        document.documentElement.style.setProperty('--text-muted', '#64748b');
    } else {
        // Reset to dark theme (default CSS variables)
        document.documentElement.style.removeProperty('--primary-bg');
        document.documentElement.style.removeProperty('--secondary-bg');
        document.documentElement.style.removeProperty('--card-bg');
        document.documentElement.style.removeProperty('--accent-bg');
        document.documentElement.style.removeProperty('--text-primary');
        document.documentElement.style.removeProperty('--text-secondary');
        document.documentElement.style.removeProperty('--text-muted');
    }
}

// Initialize 2FA setup
function initialize2FA() {
    const setup2FABtn = document.getElementById('setup-2fa-btn');
    const twoFactorToggle = document.getElementById('two-factor-toggle');
    const regenerateCodesBtn = document.getElementById('regenerate-codes-btn');
    
    if (setup2FABtn) {
        setup2FABtn.addEventListener('click', function() {
            show2FAModal();
        });
    }
    
    if (twoFactorToggle) {
        twoFactorToggle.addEventListener('change', function() {
            if (this.checked && !userData.security.twoFactorEnabled) {
                show2FAModal();
            } else if (!this.checked && userData.security.twoFactorEnabled) {
                disable2FA();
            }
        });
    }
    
    if (regenerateCodesBtn) {
        regenerateCodesBtn.addEventListener('click', function() {
            regenerateBackupCodes();
        });
    }
    
    // Initialize 2FA modal navigation
    initialize2FAModal();
}

// Show 2FA setup modal
function show2FAModal() {
    const modal = document.getElementById('2fa-modal');
    if (modal) {
        modal.style.display = 'flex';
        reset2FAModal();
    }
}

// Initialize 2FA modal navigation
function initialize2FAModal() {
    // Step navigation
    document.getElementById('next-step-1')?.addEventListener('click', () => show2FAStep(2));
    document.getElementById('back-step-2')?.addEventListener('click', () => show2FAStep(1));
    document.getElementById('next-step-2')?.addEventListener('click', () => show2FAStep(3));
    document.getElementById('back-step-3')?.addEventListener('click', () => show2FAStep(2));
    document.getElementById('verify-2fa')?.addEventListener('click', verify2FACode);
    document.getElementById('finish-2fa')?.addEventListener('click', finish2FASetup);
    
    // Copy code functionality
    document.getElementById('copy-code')?.addEventListener('click', function() {
        const code = document.getElementById('manual-code').textContent;
        navigator.clipboard.writeText(code).then(() => {
            showAlert('Code copied to clipboard!', 'success');
        });
    });
    
    // Download backup codes
    document.getElementById('download-codes')?.addEventListener('click', downloadBackupCodes);
    
    // Close modal
    document.getElementById('close-2fa-modal')?.addEventListener('click', close2FAModal);
}

// Show specific 2FA step
function show2FAStep(stepNumber) {
    document.querySelectorAll('.tfa-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step-${stepNumber}`)?.classList.add('active');
}

// Verify 2FA code
function verify2FACode() {
    const code = document.getElementById('verification-code').value;
    
    if (!code || code.length !== 6) {
        showAlert('Please enter a valid 6-digit code.', 'error');
        return;
    }
    
    // Simulate verification (in real app, this would be server-side)
    if (code === '123456' || code.match(/^\d{6}$/)) {
        show2FAStep(4);
        generateBackupCodes();
    } else {
        showAlert('Invalid verification code. Please try again.', 'error');
    }
}

// Generate backup codes
function generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 6; i++) {
        const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0') + '-' +
                    Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        codes.push(code);
    }
    
    const codesContainer = document.getElementById('backup-codes');
    if (codesContainer) {
        codesContainer.innerHTML = codes.map(code => `<code>${code}</code>`).join('');
    }
    
    return codes;
}

// Download backup codes
function downloadBackupCodes() {
    const codes = Array.from(document.querySelectorAll('#backup-codes code'))
        .map(el => el.textContent);
    
    const content = `SecureMessage AI - Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${codes.join('\n')}\n\nKeep these codes safe and secure.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'securemessage-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// Finish 2FA setup
function finish2FASetup() {
    userData.security.twoFactorEnabled = true;
    Storage.set('userData', userData);
    
    // Update UI
    const status = document.getElementById('2fa-status');
    if (status) {
        status.innerHTML = `
            <div class="status-indicator enabled">
                <i class="fas fa-check-circle"></i>
                <span>Enabled</span>
            </div>
        `;
    }
    
    // Hide setup button, show regenerate button
    const setupBtn = document.getElementById('setup-2fa-btn');
    const regenerateBtn = document.getElementById('regenerate-codes-btn');
    if (setupBtn) setupBtn.style.display = 'none';
    if (regenerateBtn) regenerateBtn.style.display = 'inline-block';
    
    // Log activity
    logActivity('security', 'Enabled Two-Factor Authentication', 'success');
    
    // Check for achievement
    checkAchievements();
    
    close2FAModal();
    showAlert('Two-Factor Authentication enabled successfully!', 'success');
}

// Close 2FA modal
function close2FAModal() {
    const modal = document.getElementById('2fa-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Reset 2FA modal
function reset2FAModal() {
    show2FAStep(1);
    document.getElementById('verification-code').value = '';
}

// Initialize activity tracking
function initializeActivityTracking() {
    // Load activities from storage
    userData.activities = Storage.get('userActivities', userData.activities || []);
    
    // Update activity displays
    updateActivityLog();
    updateRecentActivity();
    
    // Initialize activity filters
    const activityFilter = document.getElementById('activity-filter');
    if (activityFilter) {
        activityFilter.addEventListener('change', function() {
            filterActivities(this.value);
        });
    }
    
    // Clear activity button
    const clearActivityBtn = document.getElementById('clear-activity-btn');
    if (clearActivityBtn) {
        clearActivityBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your activity history?')) {
                clearActivityHistory();
            }
        });
    }
}

// Log activity
function logActivity(type, description, status = 'info') {
    const activity = {
        id: Date.now(),
        type,
        description,
        status,
        timestamp: new Date().toISOString(),
        ip: '192.168.1.1', // Simulated
        userAgent: navigator.userAgent.split(' ')[0]
    };
    
    userData.activities.unshift(activity);
    
    // Keep only last 100 activities
    if (userData.activities.length > 100) {
        userData.activities = userData.activities.slice(0, 100);
    }
    
    // Save to storage
    Storage.set('userActivities', userData.activities);
    
    // Update displays
    updateActivityLog();
    updateRecentActivity();
}

// Update activity log
function updateActivityLog() {
    const activityList = document.getElementById('activity-list');
    if (!activityList || !userData.activities) return;
    
    const activitiesHTML = userData.activities.slice(0, 20).map(activity => {
        const timeAgo = getTimeAgo(new Date(activity.timestamp));
        const iconClass = getActivityIcon(activity.type);
        const statusClass = activity.status;
        
        return `
            <div class="activity-item ${statusClass}">
                <div class="activity-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-meta">
                        <span class="activity-time">${timeAgo}</span>
                        <span class="activity-type">${activity.type}</span>
                        ${activity.ip ? `<span class="activity-ip">${activity.ip}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    activityList.innerHTML = activitiesHTML || '<p class="no-activities">No activities found.</p>';
}

// Update recent activity (for overview tab)
function updateRecentActivity() {
    const recentActivity = document.getElementById('recent-activity');
    if (!recentActivity || !userData.activities) return;
    
    const recentActivitiesHTML = userData.activities.slice(0, 5).map(activity => {
        const timeAgo = getTimeAgo(new Date(activity.timestamp));
        const iconClass = getActivityIcon(activity.type);
        
        return `
            <div class="recent-activity-item">
                <i class="${iconClass}"></i>
                <div>
                    <p>${activity.description}</p>
                    <small>${timeAgo}</small>
                </div>
            </div>
        `;
    }).join('');
    
    recentActivity.innerHTML = recentActivitiesHTML || '<p>No recent activity</p>';
}

// Get activity icon
function getActivityIcon(type) {
    const icons = {
        'scan': 'fas fa-search',
        'login': 'fas fa-sign-in-alt',
        'logout': 'fas fa-sign-out-alt',
        'security': 'fas fa-shield-alt',
        'profile': 'fas fa-user',
        'settings': 'fas fa-cog',
        'achievement': 'fas fa-trophy'
    };
    return icons[type] || 'fas fa-info-circle';
}

// Filter activities
function filterActivities(filterType) {
    let filteredActivities = userData.activities;
    
    if (filterType !== 'all') {
        filteredActivities = userData.activities.filter(activity => 
            activity.type === filterType
        );
    }
    
    // Update display with filtered activities
    const activityList = document.getElementById('activity-list');
    if (activityList) {
        const activitiesHTML = filteredActivities.slice(0, 20).map(activity => {
            const timeAgo = getTimeAgo(new Date(activity.timestamp));
            const iconClass = getActivityIcon(activity.type);
            const statusClass = activity.status;
            
            return `
                <div class="activity-item ${statusClass}">
                    <div class="activity-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-description">${activity.description}</div>
                        <div class="activity-meta">
                            <span class="activity-time">${timeAgo}</span>
                            <span class="activity-type">${activity.type}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        activityList.innerHTML = activitiesHTML || '<p class="no-activities">No activities found for this filter.</p>';
    }
}

// Clear activity history
function clearActivityHistory() {
    userData.activities = [];
    Storage.set('userActivities', userData.activities);
    updateActivityLog();
    updateRecentActivity();
    showAlert('Activity history cleared successfully.', 'success');
}

// Initialize achievements system
function initializeAchievements() {
    checkAchievements();
    updateAchievementsDisplay();
}

// Check and award achievements
function checkAchievements() {
    let newAchievements = [];
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
        if (!userData.achievements.includes(achievement.id)) {
            let earned = false;
            
            // Check achievement condition
            if (achievement.condition.length === 1) {
                // Single parameter (stats or user data)
                earned = achievement.condition(userData.stats) || achievement.condition(userData);
            } else {
                // Multiple parameters
                earned = achievement.condition(userData.stats, userData.activities, userData);
            }
            
            if (earned) {
                userData.achievements.push(achievement.id);
                newAchievements.push(achievement);
                
                // Award XP
                userData.xp = (userData.xp || 0) + achievement.xp;
                
                // Log activity
                logActivity('achievement', `Earned "${achievement.name}" badge`, 'success');
            }
        }
    });
    
    // Save progress
    Storage.set('userData', userData);
    
    // Show achievement notifications
    newAchievements.forEach(achievement => {
        showAchievementNotification(achievement);
    });
    
    // Update rank
    updateRankingSystem();
    
    return newAchievements;
}

// Show achievement notification
function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-popup">
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-content">
                <h4>Achievement Unlocked!</h4>
                <h5>${achievement.name}</h5>
                <p>${achievement.description}</p>
                <small>+${achievement.xp} XP</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Update achievements display
function updateAchievementsDisplay() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    const earnedCount = userData.achievements.length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;
    
    // Update progress
    const earnedBadges = document.getElementById('earned-badges');
    const totalBadges = document.getElementById('total-badges');
    if (earnedBadges) earnedBadges.textContent = earnedCount;
    if (totalBadges) totalBadges.textContent = totalCount;
    
    // Update grid (achievements are already in HTML, just update earned status)
    // This would be dynamically generated in a real app
}

// Update ranking system
function updateRankingSystem() {
    const currentXP = userData.xp || 650; // Default for demo
    const currentRank = getCurrentRank(currentXP);
    const nextRank = getNextRank(currentXP);
    
    // Update rank display
    const rankElement = document.getElementById('user-rank');
    if (rankElement) {
        rankElement.innerHTML = `
            <i class="${currentRank.icon}"></i>
            <span>${currentRank.name}</span>
        `;
    }
    
    // Update current rank in achievements tab
    const currentRankElement = document.getElementById('current-rank');
    if (currentRankElement) {
        currentRankElement.textContent = currentRank.name;
    }
    
    // Update progress bar
    if (nextRank) {
        const progress = ((currentXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100;
        const progressFill = document.querySelector('.rank-progress .progress-fill');
        const progressText = document.querySelector('.rank-progress .progress-text');
        
        if (progressFill) {
            progressFill.style.width = `${Math.min(progress, 100)}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${currentXP} / ${nextRank.minXP} XP`;
        }
        
        // Update next rank display
        const nextRankElement = document.querySelector('.next-rank strong');
        if (nextRankElement) {
            nextRankElement.textContent = nextRank.name;
        }
    }
}

// Get current rank based on XP
function getCurrentRank(xp) {
    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (xp >= RANKS[i].minXP) {
            return RANKS[i];
        }
    }
    return RANKS[0];
}

// Get next rank
function getNextRank(xp) {
    const currentRank = getCurrentRank(xp);
    const currentIndex = RANKS.indexOf(currentRank);
    return currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;
}

// Utility functions
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
}

function checkConsecutiveDays(activities, days) {
    // Simplified check - in real app would check actual consecutive usage
    return activities.length >= days;
}

function generateInitialActivities() {
    const activities = [
        {
            id: Date.now() - 86400000,
            type: 'login',
            description: 'Logged in to account',
            status: 'success',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            ip: '192.168.1.1'
        },
        {
            id: Date.now() - 7200000,
            type: 'scan',
            description: 'Scanned suspicious email message',
            status: 'success',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            ip: '192.168.1.1'
        },
        {
            id: Date.now() - 3600000,
            type: 'security',
            description: 'Enabled Two-Factor Authentication',
            status: 'success',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            ip: '192.168.1.1'
        }
    ];
    
    return activities;
}

function updateProfileDisplay() {
    // Update any additional profile displays
    updateRankingSystem();
}

// Export functions for global use
window.logActivity = logActivity;
window.checkAchievements = checkAchievements;
window.updateUserStats = function(newStats) {
    userData.stats = { ...userData.stats, ...newStats };
    Storage.set('userStats', userData.stats);
    checkAchievements();
    updateRankingSystem();
};
