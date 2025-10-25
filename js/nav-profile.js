// Navigation Profile Management
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeNavProfile();
        loadUserProfile();
    } catch (error) {
        console.error('Error initializing nav profile:', error);
    }
});

function initializeNavProfile() {
    try {
        const profileCircle = document.getElementById('profile-circle');
        const profileDropdown = document.getElementById('profile-dropdown');
        const navLogoutBtn = document.getElementById('nav-logout-btn');
        
        // Only proceed if we have the basic elements
        if (!profileCircle) {
            console.log('Profile circle not found, skipping nav profile initialization');
            return;
        }
        
        // Toggle dropdown on click (with safety check)
        profileCircle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (profileDropdown) {
                profileDropdown.classList.toggle('show');
            }
        });
        
        // Close dropdown when clicking outside (with safety checks)
        document.addEventListener('click', function(e) {
            if (profileDropdown && 
                !profileDropdown.contains(e.target) && 
                !profileCircle.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });
        
        // Handle logout (with safety check)
        if (navLogoutBtn) {
            navLogoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleLogout();
            });
        }
        
        // Update profile visibility based on auth status
        updateProfileVisibility();
    } catch (error) {
        console.error('Error in initializeNavProfile:', error);
    }
}

function loadUserProfile() {
    try {
        // Get user data safely
        const userData = (typeof Storage !== 'undefined') ? Storage.get('userData', {}) : {};
        const currentUser = getCurrentUser();
        const userInfo = currentUser || userData;
        
        // Update profile name and email with safety checks
        const dropdownName = document.getElementById('dropdown-name');
        const dropdownEmail = document.getElementById('dropdown-email');
        const profileName = document.getElementById('profile-name');
        const profileEmail = document.getElementById('profile-email');
        
        if (dropdownName && userInfo.name) {
            dropdownName.textContent = userInfo.name;
        }
        
        if (dropdownEmail && userInfo.email) {
            dropdownEmail.textContent = userInfo.email;
        }
        
        if (profileName && userInfo.name) {
            profileName.textContent = userInfo.name;
        }
        
        if (profileEmail && userInfo.email) {
            profileEmail.textContent = userInfo.email;
        }
        
        // Update avatar images safely
        const avatarData = (typeof Storage !== 'undefined') ? Storage.get('userAvatar', '') : '';
        updateNavAvatar(avatarData);
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

function updateNavAvatar(avatarData) {
    const navAvatarImage = document.getElementById('nav-avatar-image');
    const navAvatarIcon = document.getElementById('nav-avatar-icon');
    const dropdownAvatarImage = document.getElementById('dropdown-avatar-image');
    const dropdownAvatarIcon = document.getElementById('dropdown-avatar-icon');
    
    if (avatarData) {
        // Show avatar images
        if (navAvatarImage) {
            navAvatarImage.src = avatarData;
            navAvatarImage.style.display = 'block';
        }
        if (navAvatarIcon) {
            navAvatarIcon.style.display = 'none';
        }
        if (dropdownAvatarImage) {
            dropdownAvatarImage.src = avatarData;
            dropdownAvatarImage.style.display = 'block';
        }
        if (dropdownAvatarIcon) {
            dropdownAvatarIcon.style.display = 'none';
        }
    } else {
        // Show default icons
        if (navAvatarImage) {
            navAvatarImage.style.display = 'none';
        }
        if (navAvatarIcon) {
            navAvatarIcon.style.display = 'block';
        }
        if (dropdownAvatarImage) {
            dropdownAvatarImage.style.display = 'none';
        }
        if (dropdownAvatarIcon) {
            dropdownAvatarIcon.style.display = 'block';
        }
    }
}

function updateProfileVisibility() {
    try {
        // Check authentication status safely
        const currentUser = getCurrentUser();
        const authToken = localStorage.getItem('authToken');
        const isLoggedIn = !!(currentUser && authToken);
        
        const navProfile = document.getElementById('nav-profile');
        const userMenu = document.getElementById('user-menu');
        const authLink = document.getElementById('auth-link');
        const profileIconLink = document.getElementById('profile-icon-link');
        
        if (isLoggedIn) {
            // Show profile circle, hide login and profile icon
            if (navProfile) navProfile.style.display = 'block';
            if (userMenu) userMenu.style.display = 'block';
            if (authLink && authLink.parentElement) authLink.parentElement.style.display = 'none';
            if (profileIconLink && profileIconLink.parentElement) profileIconLink.parentElement.style.display = 'none';
            
            // Add online status
            const profileCircle = document.getElementById('profile-circle');
            if (profileCircle) {
                profileCircle.classList.add('online');
            }
        } else {
            // Show login and profile icon, hide profile circle
            if (navProfile) navProfile.style.display = 'none';
            if (userMenu) userMenu.style.display = 'none';
            if (authLink && authLink.parentElement) authLink.parentElement.style.display = 'block';
            if (profileIconLink && profileIconLink.parentElement) profileIconLink.parentElement.style.display = 'block';
        }
    } catch (error) {
        console.error('Error updating profile visibility:', error);
    }
}

function handleLogout() {
    // Clear user data
    Storage.remove('isLoggedIn');
    Storage.remove('userData');
    Storage.remove('userAvatar');
    Storage.remove('userStats');
    Storage.remove('userActivities');
    Storage.remove('userAchievements');
    Storage.remove('userRank');
    Storage.remove('twoFactorEnabled');
    Storage.remove('backupCodes');
    
    // Log activity
    if (typeof logActivity === 'function') {
        logActivity('logout', 'User logged out', 'info');
    }
    
    // Show success message
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Update profile when avatar changes (called from profile page)
function updateProfileAvatar(avatarData) {
    updateNavAvatar(avatarData);
}

// Update profile info when user data changes
function updateProfileInfo(userData) {
    const dropdownName = document.getElementById('dropdown-name');
    const dropdownEmail = document.getElementById('dropdown-email');
    
    if (dropdownName && userData.name) {
        dropdownName.textContent = userData.name;
    }
    
    if (dropdownEmail && userData.email) {
        dropdownEmail.textContent = userData.email;
    }
}

// CSS for dropdown show state
const style = document.createElement('style');
style.textContent = `
    .profile-dropdown.show {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
