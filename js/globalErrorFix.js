// Global Error Fix - Comprehensive error prevention and handling
(function() {
    'use strict';

    // Global error handler
    window.addEventListener('error', function(event) {
        // Suppress common non-critical errors
        const suppressedErrors = [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured',
            'Script error',
            'Network request failed',
            'Loading chunk',
            'Loading CSS chunk'
        ];

        const shouldSuppress = suppressedErrors.some(error => 
            event.message && event.message.includes(error)
        );

        if (shouldSuppress) {
            event.preventDefault();
            return false;
        }

        // Log other errors for debugging
        console.warn('Caught error:', event.error || event.message);
        return false;
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        console.warn('Unhandled promise rejection:', event.reason);
        event.preventDefault();
    });

    // Ensure all critical functions exist
    function ensureCriticalFunctions() {
        // Authentication functions
        if (typeof window.getCurrentUser !== 'function') {
            window.getCurrentUser = function() {
                try {
                    const userData = localStorage.getItem('currentUser');
                    return userData ? JSON.parse(userData) : null;
                } catch (e) {
                    return null;
                }
            };
        }

        if (typeof window.updateAuthUI !== 'function') {
            window.updateAuthUI = function() {
                if (window.authManager && typeof window.authManager.updateNavigation === 'function') {
                    window.authManager.updateNavigation();
                }
            };
        }

        if (typeof window.logout !== 'function') {
            window.logout = function() {
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                localStorage.removeItem('refreshToken');
                window.location.href = 'index.html';
            };
        }

        // Utility functions
        if (typeof window.showNotification !== 'function') {
            window.showNotification = function(message, type = 'info') {
                console.log(`${type.toUpperCase()}: ${message}`);
                
                // Try to show a simple alert if no notification system exists
                if (type === 'error') {
                    alert('Error: ' + message);
                }
            };
        }

        if (typeof window.showAlert !== 'function') {
            window.showAlert = function(message, type = 'info') {
                window.showNotification(message, type);
            };
        }

        // Navigation functions
        if (typeof window.toggleMobileMenu !== 'function') {
            window.toggleMobileMenu = function() {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                
                if (hamburger && navMenu) {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                }
            };
        }

        if (typeof window.closeMobileMenu !== 'function') {
            window.closeMobileMenu = function() {
                const hamburger = document.querySelector('.hamburger');
                const navMenu = document.querySelector('.nav-menu');
                
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            };
        }

        // Profile functions
        if (typeof window.handleProfileCircleClick !== 'function') {
            window.handleProfileCircleClick = function(event) {
                event.preventDefault();
                
                // Try to toggle dropdown first
                const dropdown = document.querySelector('.user-dropdown');
                if (dropdown) {
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                } else {
                    // Fallback to profile page navigation
                    window.location.href = 'profile.html';
                }
            };
        }

        // Activity logging
        if (typeof window.logActivity !== 'function') {
            window.logActivity = function(type, action, details = {}) {
                try {
                    const activity = {
                        type: type,
                        action: action,
                        details: details,
                        timestamp: new Date().toISOString(),
                        page: window.location.pathname
                    };
                    
                    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
                    activities.unshift(activity);
                    
                    // Keep only last 100 activities
                    if (activities.length > 100) {
                        activities.splice(100);
                    }
                    
                    localStorage.setItem('userActivities', JSON.stringify(activities));
                } catch (e) {
                    console.warn('Failed to log activity:', e);
                }
            };
        }

        // Storage utilities
        if (typeof window.Storage === 'undefined') {
            window.Storage = {
                get: function(key) {
                    try {
                        const value = localStorage.getItem(key);
                        return value ? JSON.parse(value) : null;
                    } catch (e) {
                        return null;
                    }
                },
                set: function(key, value) {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
                remove: function(key) {
                    try {
                        localStorage.removeItem(key);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
            };
        }

        // Form validation
        if (typeof window.validateForm !== 'function') {
            window.validateForm = function(formElement) {
                if (!formElement) return false;
                
                const inputs = formElement.querySelectorAll('input[required], textarea[required], select[required]');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });
                
                return isValid;
            };
        }

        // Safe DOM query functions
        if (typeof window.safeQuerySelector !== 'function') {
            window.safeQuerySelector = function(selector) {
                try {
                    return document.querySelector(selector);
                } catch (e) {
                    console.warn('Invalid selector:', selector);
                    return null;
                }
            };
        }

        if (typeof window.safeQuerySelectorAll !== 'function') {
            window.safeQuerySelectorAll = function(selector) {
                try {
                    return document.querySelectorAll(selector);
                } catch (e) {
                    console.warn('Invalid selector:', selector);
                    return [];
                }
            };
        }

        // Safe event listener
        if (typeof window.safeAddEventListener !== 'function') {
            window.safeAddEventListener = function(element, event, handler) {
                if (element && typeof element.addEventListener === 'function') {
                    try {
                        element.addEventListener(event, handler);
                        return true;
                    } catch (e) {
                        console.warn('Failed to add event listener:', e);
                        return false;
                    }
                }
                return false;
            };
        }
    }

    // Fix common DOM issues
    function fixCommonDOMIssues() {
        // Ensure all forms have proper structure
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (!form.getAttribute('novalidate')) {
                form.setAttribute('novalidate', 'true');
            }
        });

        // Fix missing alt attributes on images
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            img.setAttribute('alt', '');
        });

        // Ensure all buttons have proper type
        const buttons = document.querySelectorAll('button:not([type])');
        buttons.forEach(button => {
            button.setAttribute('type', 'button');
        });

        // Fix missing href on anchor tags
        const anchors = document.querySelectorAll('a:not([href])');
        anchors.forEach(anchor => {
            anchor.setAttribute('href', '#');
        });
    }

    // Initialize error prevention
    function initializeErrorPrevention() {
        ensureCriticalFunctions();
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fixCommonDOMIssues);
        } else {
            fixCommonDOMIssues();
        }

        // Set up mobile menu handlers if they don't exist
        setTimeout(() => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            
            if (hamburger && navMenu && !hamburger.hasAttribute('data-initialized')) {
                hamburger.setAttribute('data-initialized', 'true');
                hamburger.addEventListener('click', window.toggleMobileMenu);
                
                // Close menu when clicking nav links
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', window.closeMobileMenu);
                });
            }

            // Set up profile circle handlers
            const profileCircles = document.querySelectorAll('.profile-circle');
            profileCircles.forEach(circle => {
                if (!circle.hasAttribute('data-initialized')) {
                    circle.setAttribute('data-initialized', 'true');
                    circle.addEventListener('click', window.handleProfileCircleClick);
                }
            });
        }, 100);

        console.log('✅ Global error prevention initialized');
    }

    // Start initialization
    initializeErrorPrevention();

})();
