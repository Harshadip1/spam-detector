// Profile Page JavaScript

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    checkProfileAccess();
    initializeProfile();
    loadUserData();
    initializeTabs();
});

// Check if user has access to profile page
function checkProfileAccess() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showAlert('Please log in to access your profile.', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
}

// Initialize profile functionality
function initializeProfile() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Edit profile button
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', toggleEditMode);
    }
    
    // Cancel edit button
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', cancelEdit);
    }
    
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', saveProfile);
    }
    
    // Change password modal
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordModal = document.getElementById('password-modal');
    const closePasswordModal = document.getElementById('close-password-modal');
    const cancelPasswordChange = document.getElementById('cancel-password-change');
    const changePasswordForm = document.getElementById('change-password-form');
    
    if (changePasswordBtn && passwordModal) {
        changePasswordBtn.addEventListener('click', () => {
            passwordModal.style.display = 'block';
        });
    }
    
    if (closePasswordModal && passwordModal) {
        closePasswordModal.addEventListener('click', () => {
            passwordModal.style.display = 'none';
        });
    }
    
    if (cancelPasswordChange && passwordModal) {
        cancelPasswordChange.addEventListener('click', () => {
            passwordModal.style.display = 'none';
        });
    }
    
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }
    
    // Close modal when clicking outside
    if (passwordModal) {
        passwordModal.addEventListener('click', (e) => {
            if (e.target === passwordModal) {
                passwordModal.style.display = 'none';
            }
        });
    }
    
    // Toggle switches
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', handleToggleChange);
    });
    
    // Theme selection
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', handleThemeChange);
    });
}

// Load user data into profile
function loadUserData() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update profile header
    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-email').textContent = currentUser.email;
    
    // Update member since
    const memberSince = document.getElementById('member-since');
    if (memberSince && currentUser.joinDate) {
        const joinYear = new Date(currentUser.joinDate).getFullYear();
        memberSince.textContent = joinYear;
    }
    
    // Load profile form data
    const profile = currentUser.profile || {};
    document.getElementById('first-name').value = profile.firstName || '';
    document.getElementById('last-name').value = profile.lastName || '';
    document.getElementById('email').value = currentUser.email;
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('bio').value = profile.bio || '';
    
    // Load user statistics
    loadUserStatistics();
    
    // Load activity timeline
    loadActivityTimeline();
    
    // Set account created date
    const accountCreatedDate = document.getElementById('account-created-date');
    if (accountCreatedDate && currentUser.joinDate) {
        accountCreatedDate.textContent = formatDate(currentUser.joinDate);
    }
}

// Load user statistics
function loadUserStatistics() {
    const userStats = Storage.get('userStats', {
        totalScans: 0,
        spamDetected: 0,
        safeMessages: 0,
        suspiciousMessages: 0
    });
    
    // Update stats in profile header
    document.getElementById('messages-scanned').textContent = userStats.totalScans;
    document.getElementById('threats-blocked').textContent = userStats.spamDetected + userStats.suspiciousMessages;
    
    // Update stats in activity tab
    document.getElementById('total-scans').textContent = userStats.totalScans;
    document.getElementById('spam-detected').textContent = userStats.spamDetected;
    document.getElementById('safe-messages').textContent = userStats.safeMessages;
}

// Load activity timeline
function loadActivityTimeline() {
    const currentUser = getCurrentUser();
    const timeline = document.getElementById('activity-timeline');
    
    if (!timeline) return;
    
    // Clear existing timeline except account creation
    const existingItems = timeline.querySelectorAll('.timeline-item:not(:last-child)');
    existingItems.forEach(item => item.remove());
    
    // Add recent activities (simulated)
    const activities = [
        {
            icon: 'fas fa-shield-alt',
            text: 'Spam message blocked',
            time: '2 hours ago'
        },
        {
            icon: 'fas fa-search',
            text: 'Message analyzed',
            time: '5 hours ago'
        },
        {
            icon: 'fas fa-check-circle',
            text: 'Safe message verified',
            time: '1 day ago'
        }
    ];
    
    activities.forEach(activity => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="timeline-content">
                <p>${activity.text}</p>
                <small>${activity.time}</small>
            </div>
        `;
        timeline.insertBefore(timelineItem, timeline.lastElementChild);
    });
}

// Initialize tabs functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.menu-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(`${tabId}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Toggle edit mode for profile
function toggleEditMode() {
    const formInputs = document.querySelectorAll('#profile-form input, #profile-form textarea');
    const editBtn = document.getElementById('edit-profile-btn');
    const formActions = document.getElementById('form-actions');
    
    formInputs.forEach(input => {
        if (input.id !== 'email') { // Don't allow email editing
            input.removeAttribute('readonly');
            input.style.background = 'var(--accent-bg)';
        }
    });
    
    editBtn.style.display = 'none';
    formActions.style.display = 'flex';
}

// Cancel edit mode
function cancelEdit() {
    const formInputs = document.querySelectorAll('#profile-form input, #profile-form textarea');
    const editBtn = document.getElementById('edit-profile-btn');
    const formActions = document.getElementById('form-actions');
    
    formInputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.style.background = 'transparent';
    });
    
    editBtn.style.display = 'inline-flex';
    formActions.style.display = 'none';
    
    // Reload original data
    loadUserData();
}

// Save profile changes
function saveProfile(e) {
    e.preventDefault();
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Get form data
    const formData = new FormData(e.target);
    const updatedProfile = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        phone: formData.get('phone'),
        bio: formData.get('bio')
    };
    
    // Update user data
    const updatedUser = {
        ...currentUser,
        name: `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim(),
        profile: updatedProfile
    };
    
    // Save to localStorage
    Storage.set('currentUser', updatedUser);
    
    // Update users array
    const users = Storage.get('users', []);
    const updatedUsers = users.map(user => 
        user.id === currentUser.id ? updatedUser : user
    );
    Storage.set('users', updatedUsers);
    
    // Update UI
    document.getElementById('profile-name').textContent = updatedUser.name;
    updateAuthUI();
    
    showAlert('Profile updated successfully!', 'success');
    cancelEdit();
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to log out?')) {
        logout();
    }
}

// Handle password change
function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Validate current password
    if (currentPassword !== currentUser.password) {
        showAlert('Current password is incorrect.', 'error');
        return;
    }
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        showAlert(passwordValidation.feedback, 'error');
        return;
    }
    
    // Check password confirmation
    if (newPassword !== confirmNewPassword) {
        showAlert('New passwords do not match.', 'error');
        return;
    }
    
    // Update password
    const updatedUser = {
        ...currentUser,
        password: newPassword
    };
    
    Storage.set('currentUser', updatedUser);
    
    // Update users array
    const users = Storage.get('users', []);
    const updatedUsers = users.map(user => 
        user.id === currentUser.id ? updatedUser : user
    );
    Storage.set('users', updatedUsers);
    
    // Close modal and show success
    document.getElementById('password-modal').style.display = 'none';
    document.getElementById('change-password-form').reset();
    showAlert('Password changed successfully!', 'success');
    
    // Update last changed date
    document.getElementById('password-last-changed').textContent = 'Just now';
}

// Handle toggle changes
function handleToggleChange(e) {
    const toggleId = e.target.id;
    const isChecked = e.target.checked;
    
    // Save preference to localStorage
    const preferences = Storage.get('userPreferences', {});
    preferences[toggleId] = isChecked;
    Storage.set('userPreferences', preferences);
    
    // Handle specific toggles
    switch (toggleId) {
        case 'two-factor-toggle':
            if (isChecked) {
                showAlert('Two-factor authentication would be enabled in a real application.', 'info');
            }
            break;
        case 'browser-notifications':
            if (isChecked && 'Notification' in window) {
                Notification.requestPermission();
            }
            break;
    }
}

// Handle theme change
function handleThemeChange(e) {
    const theme = e.target.value;
    
    // Save theme preference
    const preferences = Storage.get('userPreferences', {});
    preferences.theme = theme;
    Storage.set('userPreferences', preferences);
    
    // Apply theme (in a real app, this would change CSS variables)
    showAlert(`Theme changed to ${theme}. This would apply in a real application.`, 'info');
}

// Load user preferences
function loadUserPreferences() {
    const preferences = Storage.get('userPreferences', {});
    
    // Apply saved toggle states
    Object.keys(preferences).forEach(key => {
        const toggle = document.getElementById(key);
        if (toggle && typeof preferences[key] === 'boolean') {
            toggle.checked = preferences[key];
        }
    });
    
    // Apply saved theme
    if (preferences.theme) {
        const themeRadio = document.querySelector(`input[name="theme"][value="${preferences.theme}"]`);
        if (themeRadio) {
            themeRadio.checked = true;
        }
    }
}

// Initialize preferences after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadUserPreferences, 100);
});
