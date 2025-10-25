// Authentication Manager - Controls navigation visibility based on login status
(function() {
    'use strict';

    class AuthManager {
        constructor() {
            this.isAuthenticated = false;
            this.currentUser = null;
            this.init();
        }

        async init() {
            await this.checkAuthStatus();
            this.updateNavigation();
            this.setupEventListeners();
            console.log('🔐 Auth Manager initialized');
        }

        async checkAuthStatus() {
            try {
                // Check PHP session via API
                const result = await window.apiService.checkAuthStatus();
                
                if (result.authenticated && result.user) {
                    this.currentUser = result.user;
                    this.isAuthenticated = true;
                    
                    // Store user data locally for offline access
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                } else {
                    // Fallback to local storage
                    const userData = localStorage.getItem('currentUser');
                    if (userData) {
                        this.currentUser = JSON.parse(userData);
                        this.isAuthenticated = true;
                    } else {
                        this.isAuthenticated = false;
                        this.currentUser = null;
                    }
                }
            } catch (error) {
                console.warn('Error checking auth status:', error);
                
                // Fallback to local storage on error
                const userData = localStorage.getItem('currentUser');
                if (userData) {
                    this.currentUser = JSON.parse(userData);
                    this.isAuthenticated = true;
                } else {
                    this.isAuthenticated = false;
                    this.currentUser = null;
                }
            }
        }

        updateNavigation() {
            this.updateProfileSection();
            this.updateAuthButtons();
            this.updateUserInfo();
        }

        updateProfileSection() {
            // Support current navbar structure in `index.html`
            const profileItem = document.getElementById('profile-item');
            const loginItem = document.getElementById('login-item');

            // Backward-compatible selectors (older markup)
            const userMenus = document.querySelectorAll('.user-menu, .nav-profile');
            const loginNavItems = document.querySelectorAll('#login-nav-item, #login-item, .login-btn');

            if (this.isAuthenticated) {
                // Show profile dropdown/menu
                if (profileItem) profileItem.style.display = '';
                userMenus.forEach(menu => { if (menu) menu.style.display = 'block'; });

                // Hide login link/button
                if (loginItem) loginItem.style.display = 'none';
                loginNavItems.forEach(item => { if (item) item.style.display = 'none'; });
            } else {
                // Hide profile dropdown/menu
                if (profileItem) profileItem.style.display = 'none';
                userMenus.forEach(menu => { if (menu) menu.style.display = 'none'; });

                // Show login link/button
                if (loginItem) loginItem.style.display = '';
                loginNavItems.forEach(item => { if (item) item.style.display = 'block'; });
            }
        }

        updateAuthButtons() {
            // Update navigation auth buttons
            const navItems = document.querySelectorAll('.nav-item');
            
            navItems.forEach(item => {
                const link = item.querySelector('a');
                if (link) {
                    const href = link.getAttribute('href');
                    const text = link.textContent.toLowerCase();
                    
                    // Hide login/signup links when authenticated
                    if (this.isAuthenticated && (href === 'login.html' || text.includes('login') || text.includes('sign up'))) {
                        item.style.display = 'none';
                    } else if (!this.isAuthenticated && (href === 'login.html' || text.includes('login'))) {
                        item.style.display = 'block';
                    }
                }
            });

            // Show/hide profile sections
            const profileSections = document.querySelectorAll('.nav-profile, #profile-item');
            profileSections.forEach(section => {
                if (section) {
                    section.style.display = this.isAuthenticated ? 'block' : 'none';
                }
            });
        }

        updateUserInfo() {
            if (this.isAuthenticated && this.currentUser) {
                // Update profile circles with user initials
                const profileCircles = document.querySelectorAll('.profile-circle');
                profileCircles.forEach(circle => {
                    if (circle && this.currentUser.name) {
                        const initials = this.currentUser.name.split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .substring(0, 2);
                        circle.textContent = initials;
                    }
                });

                // Update profile names
                const profileNames = document.querySelectorAll('.profile-name');
                profileNames.forEach(name => {
                    if (name && this.currentUser.name) {
                        name.textContent = this.currentUser.name;
                    }
                });

                // Update profile emails
                const profileEmails = document.querySelectorAll('.profile-email');
                profileEmails.forEach(email => {
                    if (email && this.currentUser.email) {
                        email.textContent = this.currentUser.email;
                    }
                });
            }
        }

        setupEventListeners() {
            // Listen for storage changes (cross-tab sync)
            window.addEventListener('storage', (e) => {
                if (e.key === 'authToken' || e.key === 'currentUser') {
                    this.checkAuthStatus();
                    this.updateNavigation();
                }
            });

            // Setup logout handlers
            this.setupLogoutHandlers();
        }

        setupLogoutHandlers() {
            const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"]');
            
            logoutButtons.forEach(button => {
                // Remove existing listeners to prevent duplicates
                button.removeEventListener('click', this.handleLogout);
                button.addEventListener('click', this.handleLogout.bind(this));
            });
        }

        handleLogout(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                this.logout();
            }
        }

        logout() {
            // Use API service to logout (destroys PHP session)
            window.apiService.logout();
            
            // Clear local auth data
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('refreshToken');
            
            // Update state
            this.isAuthenticated = false;
            this.currentUser = null;
            
            // Update UI
            this.updateNavigation();
        }

        // Public methods for external use
        getCurrentUser() {
            return this.currentUser;
        }

        isLoggedIn() {
            return this.isAuthenticated;
        }
    }

    // Create global instance
    window.authManager = new AuthManager();

    // Export functions for backward compatibility
    window.getCurrentUser = function() {
        return window.authManager.getCurrentUser();
    };

    window.updateAuthUI = function() {
        window.authManager.updateNavigation();
    };

    window.logout = function() {
        window.authManager.logout();
    };

    console.log('🔐 Auth Manager loaded');
})();
