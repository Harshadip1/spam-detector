// Profile Click Handler - Prevents crashes when clicking profile elements
// This file provides safe handling for profile-related clicks

document.addEventListener('DOMContentLoaded', function() {
    initializeProfileClickHandlers();
});

function initializeProfileClickHandlers() {
    try {
        // Handle all profile circle clicks safely
        const profileCircles = document.querySelectorAll('.profile-circle');
        profileCircles.forEach(circle => {
            circle.addEventListener('click', handleProfileCircleClick);
        });
        
        // Handle profile name clicks safely
        const profileNames = document.querySelectorAll('#profile-name, #dropdown-name, .profile-name');
        profileNames.forEach(name => {
            name.addEventListener('click', handleProfileNameClick);
        });
        
        // Handle user menu clicks safely
        const userMenus = document.querySelectorAll('.user-menu, .nav-profile');
        userMenus.forEach(menu => {
            menu.addEventListener('click', handleUserMenuClick);
        });
        
        // Handle dropdown items safely
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', handleDropdownItemClick);
        });
        
        console.log('Profile click handlers initialized successfully');
    } catch (error) {
        console.error('Error initializing profile click handlers:', error);
    }
}

function handleProfileCircleClick(e) {
    try {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Profile circle clicked');
        
        // Find the dropdown menu
        const userMenu = e.target.closest('.user-menu, .nav-profile');
        if (userMenu) {
            const dropdown = userMenu.querySelector('.dropdown-menu');
            if (dropdown) {
                // Close all other dropdowns first
                closeAllDropdowns();
                
                // Toggle this dropdown
                dropdown.classList.toggle('show');
                console.log('Dropdown toggled');
            } else {
                console.warn('Dropdown menu not found');
                // Fallback: navigate to profile page
                window.location.href = 'profile.html';
            }
        } else {
            console.warn('User menu container not found');
            // Fallback: navigate to profile page
            window.location.href = 'profile.html';
        }
    } catch (error) {
        console.error('Error handling profile circle click:', error);
        // Safe fallback
        try {
            window.location.href = 'profile.html';
        } catch (fallbackError) {
            console.error('Fallback navigation failed:', fallbackError);
        }
    }
}

function handleProfileNameClick(e) {
    try {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Profile name clicked');
        
        // Navigate to profile page
        window.location.href = 'profile.html';
    } catch (error) {
        console.error('Error handling profile name click:', error);
    }
}

function handleUserMenuClick(e) {
    try {
        // Don't prevent default for dropdown items
        if (e.target.classList.contains('dropdown-item') || 
            e.target.closest('.dropdown-item')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        console.log('User menu clicked');
        
        const dropdown = e.currentTarget.querySelector('.dropdown-menu');
        if (dropdown) {
            // Close all other dropdowns first
            closeAllDropdowns();
            
            // Toggle this dropdown
            dropdown.classList.toggle('show');
        }
    } catch (error) {
        console.error('Error handling user menu click:', error);
    }
}

function handleDropdownItemClick(e) {
    try {
        const item = e.currentTarget;
        
        // Handle logout button
        if (item.classList.contains('logout-btn') || 
            item.getAttribute('data-action') === 'logout') {
            e.preventDefault();
            handleSafeLogout();
            return;
        }
        
        // Handle profile link
        if (item.href && item.href.includes('profile.html')) {
            // Let the default navigation happen
            return;
        }
        
        // Handle settings link
        if (item.href && item.href.includes('settings.html')) {
            // Let the default navigation happen
            return;
        }
        
        console.log('Dropdown item clicked:', item);
    } catch (error) {
        console.error('Error handling dropdown item click:', error);
    }
}

function handleSafeLogout() {
    try {
        // Show confirmation dialog
        const confirmed = confirm('Are you sure you want to logout?');
        if (confirmed) {
            // Clear authentication data
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('rememberMe');
            
            // Clear session storage
            sessionStorage.clear();
            
            // Show success message
            alert('Logged out successfully!');
            
            // Redirect to home page
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error during logout:', error);
        // Force logout even if there's an error
        try {
            localStorage.clear();
            window.location.href = 'index.html';
        } catch (fallbackError) {
            console.error('Fallback logout failed:', fallbackError);
        }
    }
}

function closeAllDropdowns() {
    try {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    } catch (error) {
        console.error('Error closing dropdowns:', error);
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    try {
        if (!e.target.closest('.user-menu, .nav-profile, .profile-dropdown')) {
            closeAllDropdowns();
        }
    } catch (error) {
        console.error('Error in document click handler:', error);
    }
});

// Export functions for global use
window.handleProfileCircleClick = handleProfileCircleClick;
window.handleSafeLogout = handleSafeLogout;
window.closeAllDropdowns = closeAllDropdowns;
