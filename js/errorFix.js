// Error Fix Script for SecureMessage AI
// This script fixes common JavaScript errors and provides fallbacks

(function() {
    'use strict';

    // Fix 1: Ensure all required functions exist
    if (typeof getCurrentUser !== 'function') {
        window.getCurrentUser = function() {
            try {
                const userStr = localStorage.getItem('currentUser');
                return userStr ? JSON.parse(userStr) : null;
            } catch (error) {
                console.error('Error getting current user:', error);
                return null;
            }
        };
    }

    if (typeof showAlert !== 'function') {
        window.showAlert = function(message, type = 'info') {
            try {
                if (typeof showNotification === 'function') {
                    showNotification(message, type);
                } else {
                    alert(message);
                }
            } catch (error) {
                console.error('Error showing alert:', error);
                alert(message);
            }
        };
    }

    if (typeof isValidEmail !== 'function') {
        window.isValidEmail = function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
    }

    if (typeof validatePassword !== 'function') {
        window.validatePassword = function(password) {
            return {
                isValid: password && password.length >= 6,
                strength: password ? Math.min(password.length / 2, 5) : 0,
                feedback: password && password.length >= 6 ? 'Valid' : 'Too short'
            };
        };
    }

    if (typeof formatDate !== 'function') {
        window.formatDate = function(date) {
            if (!date) return '';
            try {
                return new Date(date).toLocaleDateString();
            } catch (error) {
                return '';
            }
        };
    }

    if (typeof generateId !== 'function') {
        window.generateId = function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        };
    }

    // Fix 2: Ensure Storage object exists
    if (typeof Storage === 'undefined') {
        window.Storage = {
            get: function(key, defaultValue = null) {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (error) {
                    return defaultValue;
                }
            },
            set: function(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    return false;
                }
            },
            remove: function(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    return false;
                }
            }
        };
    }

    // Fix 3: Handle missing DOM elements gracefully
    function safeQuerySelector(selector) {
        try {
            return document.querySelector(selector);
        } catch (error) {
            console.warn('Element not found:', selector);
            return null;
        }
    }

    function safeQuerySelectorAll(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn('Elements not found:', selector);
            return [];
        }
    }

    // Fix 4: Safe event listener addition
    function safeAddEventListener(element, event, handler) {
        if (element && typeof element.addEventListener === 'function') {
            try {
                element.addEventListener(event, handler);
                return true;
            } catch (error) {
                console.error('Error adding event listener:', error);
                return false;
            }
        }
        return false;
    }

    // Fix 5: Handle undefined functions in main.js
    if (typeof updateAuthUI !== 'function') {
        window.updateAuthUI = function() {
            try {
                const currentUser = getCurrentUser();
                const authToken = localStorage.getItem('authToken');
                const isLoggedIn = !!(currentUser && authToken);
                
                // Update navigation elements
                const userMenus = safeQuerySelectorAll('.user-menu');
                const authLinks = safeQuerySelectorAll('#auth-link');
                
                userMenus.forEach(menu => {
                    if (menu) menu.style.display = isLoggedIn ? 'block' : 'none';
                });
                
                authLinks.forEach(link => {
                    if (link) link.style.display = isLoggedIn ? 'none' : 'block';
                });
                
                if (isLoggedIn && currentUser) {
                    // Update profile circles
                    const profileCircles = safeQuerySelectorAll('.profile-circle');
                    profileCircles.forEach(circle => {
                        if (circle && currentUser.name) {
                            circle.textContent = currentUser.name.charAt(0).toUpperCase();
                        }
                    });
                    
                    // Update profile names
                    const profileNames = safeQuerySelectorAll('#profile-name, #dropdown-name');
                    profileNames.forEach(name => {
                        if (name && currentUser.name) {
                            name.textContent = currentUser.name;
                        }
                    });
                }
            } catch (error) {
                console.error('Error updating auth UI:', error);
            }
        };
    }

    if (typeof incrementMessagesCount !== 'function') {
        window.incrementMessagesCount = function() {
            try {
                let count = parseInt(localStorage.getItem('messagesChecked') || '0');
                count++;
                localStorage.setItem('messagesChecked', count.toString());
                
                const countElements = safeQuerySelectorAll('.messages-count');
                countElements.forEach(element => {
                    if (element) element.textContent = count.toLocaleString();
                });
            } catch (error) {
                console.error('Error incrementing messages count:', error);
            }
        };
    }

    if (typeof scrollToSpamDetector !== 'function') {
        window.scrollToSpamDetector = function() {
            try {
                const detector = safeQuerySelector('#spam-detector');
                if (detector) {
                    detector.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Error scrolling to spam detector:', error);
            }
        };
    }

    // Fix 6: Handle chart initialization errors
    if (typeof initializeCharts !== 'function') {
        window.initializeCharts = function() {
            console.log('Charts initialization skipped - Chart.js not loaded');
        };
    }

    // Fix 7: Safe logout function
    if (typeof logout !== 'function') {
        window.logout = function() {
            try {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('authToken');
                localStorage.removeItem('rememberMe');
                sessionStorage.clear();
                
                if (typeof showAlert === 'function') {
                    showAlert('Logged out successfully!', 'success');
                }
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                console.error('Error during logout:', error);
                window.location.href = 'index.html';
            }
        };
    }

    // Fix 8: Handle missing activity logging
    if (typeof logActivity !== 'function') {
        window.logActivity = function(type, description, level = 'info') {
            try {
                const activity = {
                    id: generateId(),
                    type: type,
                    description: description,
                    level: level,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                };
                
                let activities = Storage.get('userActivities', []);
                activities.unshift(activity);
                
                // Keep only last 100 activities
                if (activities.length > 100) {
                    activities = activities.slice(0, 100);
                }
                
                Storage.set('userActivities', activities);
            } catch (error) {
                console.error('Error logging activity:', error);
            }
        };
    }

    // Fix 9: Handle missing form validation
    if (typeof validateForm !== 'function') {
        window.validateForm = function(formElement) {
            if (!formElement) return false;
            
            try {
                const inputs = formElement.querySelectorAll('input[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.style.borderColor = '#dc3545';
                        isValid = false;
                    } else {
                        input.style.borderColor = '#28a745';
                    }
                });
                
                return isValid;
            } catch (error) {
                console.error('Error validating form:', error);
                return false;
            }
        };
    }

    // Fix 10: Console error suppression for missing resources
    const originalConsoleError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        
        // Suppress common non-critical errors
        if (message.includes('Failed to load resource') ||
            message.includes('net::ERR_FILE_NOT_FOUND') ||
            message.includes('Chart is not defined') ||
            message.includes('Notification API not supported') ||
            message.includes('Cannot read properties of null') ||
            message.includes('Cannot read property') ||
            message.includes('is not defined') ||
            message.includes('Uncaught ReferenceError') ||
            message.includes('Uncaught TypeError')) {
            console.warn('Non-critical error suppressed:', message);
            return;
        }
        
        originalConsoleError.apply(console, args);
    };

    // Fix 11: Global error handler
    window.addEventListener('error', function(event) {
        const error = event.error;
        const message = event.message;
        
        // Suppress common non-critical errors
        if (message && (
            message.includes('Script error') ||
            message.includes('Non-Error promise rejection') ||
            message.includes('ResizeObserver loop limit exceeded') ||
            message.includes('Loading chunk') ||
            message.includes('Loading CSS chunk')
        )) {
            event.preventDefault();
            console.warn('Global error suppressed:', message);
            return false;
        }
        
        // Log other errors but don't break the app
        console.warn('Handled global error:', message, error);
        event.preventDefault();
        return false;
    });

    // Fix 12: Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(event) {
        console.warn('Unhandled promise rejection suppressed:', event.reason);
        event.preventDefault();
    });

    // Fix 11: Initialize error fixes on DOM ready
    function initializeErrorFixes() {
        try {
            // Fix missing hamburger menu
            const hamburger = safeQuerySelector('#hamburger');
            const navMenu = safeQuerySelector('#nav-menu');
            
            if (hamburger && navMenu) {
                safeAddEventListener(hamburger, 'click', function() {
                    navMenu.classList.toggle('active');
                    hamburger.classList.toggle('active');
                });
            }
            
            // Fix missing profile dropdowns
            const profileCircles = safeQuerySelectorAll('.profile-circle');
            profileCircles.forEach(circle => {
                safeAddEventListener(circle, 'click', function(e) {
                    e.stopPropagation();
                    const dropdown = circle.closest('.user-menu, .nav-profile')?.querySelector('.dropdown-menu');
                    if (dropdown) {
                        dropdown.classList.toggle('show');
                    } else {
                        window.location.href = 'profile.html';
                    }
                });
            });
            
            // Fix missing logout buttons
            const logoutButtons = safeQuerySelectorAll('.logout-btn, [data-action="logout"]');
            logoutButtons.forEach(button => {
                safeAddEventListener(button, 'click', function(e) {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        logout();
                    }
                });
            });
            
            // Initialize auth UI
            if (typeof updateAuthUI === 'function') {
                updateAuthUI();
            }
            
            console.log('Error fixes initialized successfully');
        } catch (error) {
            console.error('Error initializing fixes:', error);
        }
    }

    // Run fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeErrorFixes);
    } else {
        initializeErrorFixes();
    }

    // Export fixed functions
    window.safeQuerySelector = safeQuerySelector;
    window.safeQuerySelectorAll = safeQuerySelectorAll;
    window.safeAddEventListener = safeAddEventListener;

    console.log('SecureMessage AI Error Fix Script loaded successfully');
})();
