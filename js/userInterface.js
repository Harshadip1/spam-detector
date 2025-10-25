// User Interface Management
// Handles user authentication state and UI updates

// Initialize user interface on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeUserInterface();
});

function initializeUserInterface() {
    checkAuthenticationState();
    setupNavigationEvents();
    updatePageForAuthState();
}

// Check current authentication state
function checkAuthenticationState() {
    const currentUser = getCurrentUser();
    const authToken = localStorage.getItem('authToken');
    
    if (currentUser && authToken) {
        // User is logged in
        updateUIForLoggedInUser(currentUser);
    } else {
        // User is not logged in
        updateUIForGuestUser();
    }
}

// Update UI for logged-in users
function updateUIForLoggedInUser(user) {
    // Update navigation
    updateNavigation(user, true);
    
    // Update profile sections
    updateProfileSections(user);
    
    // Show/hide appropriate elements
    showLoggedInElements();
    hideGuestElements();
    
    // Update page-specific content
    updatePageContent(user);
}

// Update UI for guest users
function updateUIForGuestUser() {
    // Update navigation
    updateNavigation(null, false);
    
    // Show/hide appropriate elements
    showGuestElements();
    hideLoggedInElements();
}

// Update navigation based on auth state
function updateNavigation(user, isLoggedIn) {
    if (isLoggedIn && user) {
        // Update profile circle
        const profileCircles = document.querySelectorAll('.profile-circle');
        profileCircles.forEach(circle => {
            const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
            circle.textContent = initial;
            circle.title = user.name || 'User Profile';
        });
        
        // Update profile name and email in dropdowns
        const profileNames = document.querySelectorAll('#profile-name, #dropdown-name');
        profileNames.forEach(element => {
            element.textContent = user.name || 'User';
        });
        
        const profileEmails = document.querySelectorAll('#profile-email, #dropdown-email');
        profileEmails.forEach(element => {
            element.textContent = user.email || '';
        });
        
        // Show user menu
        const userMenus = document.querySelectorAll('.user-menu, .nav-profile');
        userMenus.forEach(menu => {
            menu.style.display = 'block';
        });
        
        // Hide login/signup links
        const authLinks = document.querySelectorAll('#auth-link, .login-btn, .signup-btn');
        authLinks.forEach(link => {
            link.style.display = 'none';
        });
        
    } else {
        // Hide user menu
        const userMenus = document.querySelectorAll('.user-menu, .nav-profile');
        userMenus.forEach(menu => {
            menu.style.display = 'none';
        });
        
        // Show login/signup links
        const authLinks = document.querySelectorAll('#auth-link, .login-btn, .signup-btn');
        authLinks.forEach(link => {
            link.style.display = 'block';
        });
    }
}

// Update profile sections with user data
function updateProfileSections(user) {
    // Welcome messages
    const welcomeMessages = document.querySelectorAll('#welcome-message, .welcome-text');
    welcomeMessages.forEach(element => {
        element.textContent = `Welcome back, ${user.name || 'User'}!`;
    });
    
    // User name displays
    const userNameDisplays = document.querySelectorAll('#user-name-display, .user-name');
    userNameDisplays.forEach(element => {
        element.textContent = user.name || 'User';
    });
    
    // Member since date
    const memberSinceElements = document.querySelectorAll('#member-since');
    memberSinceElements.forEach(element => {
        if (user.joinDate) {
            const joinDate = new Date(user.joinDate);
            element.textContent = `Member since ${joinDate.toLocaleDateString()}`;
        }
    });
    
    // Last login
    const lastLoginElements = document.querySelectorAll('#last-login');
    lastLoginElements.forEach(element => {
        if (user.lastLogin) {
            const loginDate = new Date(user.lastLogin);
            element.textContent = `Last login: ${loginDate.toLocaleString()}`;
        }
    });
    
    // Profile page specific updates
    updateProfilePageContent(user);
}

// Update profile page content
function updateProfilePageContent(user) {
    // Profile form fields
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        const nameField = document.getElementById('profile-name-field');
        const emailField = document.getElementById('profile-email-field');
        const phoneField = document.getElementById('profile-phone-field');
        const bioField = document.getElementById('profile-bio-field');
        
        if (nameField) nameField.value = user.name || '';
        if (emailField) emailField.value = user.email || '';
        if (phoneField && user.profile) phoneField.value = user.profile.phone || '';
        if (bioField && user.profile) bioField.value = user.profile.bio || '';
    }
    
    // Profile stats
    const statsElements = {
        'total-scans': user.stats?.totalScans || 0,
        'threats-blocked': user.stats?.threatsBlocked || 0,
        'security-score': user.stats?.securityScore || 0
    };
    
    Object.entries(statsElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });
}

// Show elements for logged-in users
function showLoggedInElements() {
    const elements = document.querySelectorAll('.logged-in-only, .user-content');
    elements.forEach(element => {
        element.style.display = 'block';
    });
}

// Hide elements for logged-in users
function hideLoggedInElements() {
    const elements = document.querySelectorAll('.logged-in-only, .user-content');
    elements.forEach(element => {
        element.style.display = 'none';
    });
}

// Show elements for guest users
function showGuestElements() {
    const elements = document.querySelectorAll('.guest-only, .auth-buttons');
    elements.forEach(element => {
        element.style.display = 'block';
    });
}

// Hide elements for guest users
function hideGuestElements() {
    const elements = document.querySelectorAll('.guest-only, .auth-buttons');
    elements.forEach(element => {
        element.style.display = 'none';
    });
}

// Update page-specific content
function updatePageContent(user) {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'dashboard.html':
            updateDashboardContent(user);
            break;
        case 'profile.html':
            updateProfileContent(user);
            break;
        case 'index.html':
        case '':
            updateHomeContent(user);
            break;
    }
}

// Update dashboard content
function updateDashboardContent(user) {
    // Dashboard-specific user content updates
    const dashboardTitle = document.querySelector('.dashboard-header h1');
    if (dashboardTitle) {
        dashboardTitle.textContent = `${user.name}'s Security Dashboard`;
    }
}

// Update profile content
function updateProfileContent(user) {
    // Profile-specific content updates
    const profileHeader = document.querySelector('.profile-header h1');
    if (profileHeader) {
        profileHeader.textContent = `${user.name}'s Profile`;
    }
}

// Update home content
function updateHomeContent(user) {
    // Home page specific updates for logged-in users
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && user) {
        heroTitle.innerHTML = `Welcome back, <span class="highlight">${user.name}</span>!<br>Your messages are protected by AI`;
    }
}

// Setup navigation events
function setupNavigationEvents() {
    // Logout button events
    const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"], #nav-logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', handleLogout);
    });
    
    // Profile circle click events
    const profileCircles = document.querySelectorAll('.profile-circle');
    profileCircles.forEach(circle => {
        circle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleProfileDropdown(e);
        });
    });
    
    // Profile dropdown toggle
    const profileDropdowns = document.querySelectorAll('.user-menu, .nav-profile');
    profileDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleProfileDropdown(e);
        });
    });
    
    // Profile name/email clicks
    const profileNames = document.querySelectorAll('#profile-name, #dropdown-name');
    profileNames.forEach(name => {
        name.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            // Navigate to profile page
            window.location.href = 'profile.html';
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.user-menu, .nav-profile, .profile-dropdown')) {
            closeAllDropdowns();
        }
    });
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    // Show confirmation dialog
    const confirmed = confirm('Are you sure you want to logout?');
    if (confirmed) {
        performLogout();
    }
}

// Perform logout
function performLogout() {
    // Clear authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    
    // Clear session storage
    sessionStorage.clear();
    
    // Show success message
    showAlert('Logged out successfully!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Toggle profile dropdown
function toggleProfileDropdown(e) {
    try {
        e.stopPropagation();
        
        // Find the dropdown menu
        let dropdown = null;
        
        // Check if clicked element is the dropdown container
        if (e.currentTarget.classList.contains('user-menu') || e.currentTarget.classList.contains('nav-profile')) {
            dropdown = e.currentTarget.querySelector('.dropdown-menu');
        }
        // Check if clicked element is inside a dropdown container
        else {
            const container = e.target.closest('.user-menu, .nav-profile');
            if (container) {
                dropdown = container.querySelector('.dropdown-menu');
            }
        }
        
        if (dropdown) {
            // Close all other dropdowns first
            closeAllDropdowns();
            
            // Toggle this dropdown
            dropdown.classList.toggle('show');
        } else {
            console.warn('Dropdown menu not found');
        }
    } catch (error) {
        console.error('Error toggling profile dropdown:', error);
    }
}

// Close all dropdowns
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// Update page for authentication state
function updatePageForAuthState() {
    const currentUser = getCurrentUser();
    const authToken = localStorage.getItem('authToken');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Redirect logic
    if (currentUser && authToken) {
        // User is logged in
        if (currentPage === 'login.html') {
            // Redirect from login page to dashboard
            window.location.href = 'dashboard.html';
            return;
        }
    } else {
        // User is not logged in
        if (currentPage === 'dashboard.html' || currentPage === 'profile.html') {
            // Redirect protected pages to login
            window.location.href = 'login.html';
            return;
        }
    }
}

// Refresh user interface
function refreshUserInterface() {
    initializeUserInterface();
}

// Safe getCurrentUser function
function getCurrentUser() {
    try {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Safe showAlert function
function showAlert(message, type = 'info') {
    try {
        // Try to use existing notification system
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback to alert
            alert(message);
        }
    } catch (error) {
        console.error('Error showing alert:', error);
        alert(message);
    }
}

// Export functions for global use
window.refreshUserInterface = refreshUserInterface;
window.performLogout = performLogout;
window.getCurrentUser = getCurrentUser;
window.showAlert = showAlert;
