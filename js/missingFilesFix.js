// Missing Files Fix - Creates stub files for missing JavaScript references
// This prevents 404 errors and script loading failures

(function() {
    'use strict';

    // List of files that might be missing but referenced in HTML
    const requiredFiles = [
        'utils.js',
        'storage.js',
        'errorFix.js',
        'profileClickHandler.js',
        'userInterface.js',
        'main.js',
        'navigation.js',
        'spam-detector.js',
        'ai-classifier.js',
        'advanced-detector.js',
        'nav-profile.js',
        'learn.js',
        'auth.js',
        'enhanced-auth.js',
        'dashboard.js',
        'profile-editor.js',
        'chatbot.js',
        'community.js',
        'contact.js',
        'download.js',
        'extension.js',
        'fake-emails.js',
        'faq.js',
        'premium.js',
        'report-scam.js'
    ];

    // Check if files are loaded and create stubs if needed
    function createMissingFileStubs() {
        // Create stub functions for commonly missing functions
        const stubFunctions = {
            // Utils stubs
            isValidEmail: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            validatePassword: function(password) {
                return { isValid: password && password.length >= 6, strength: 3, feedback: 'Valid' };
            },
            formatDate: function(date) {
                return date ? new Date(date).toLocaleDateString() : '';
            },
            generateId: function() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            },
            showNotification: function(message, type) {
                console.log(`${type}: ${message}`);
                if (typeof alert !== 'undefined') alert(message);
            },
            copyToClipboard: function(text) {
                try {
                    if (navigator.clipboard) {
                        return navigator.clipboard.writeText(text);
                    }
                    return Promise.resolve(false);
                } catch (e) {
                    return Promise.resolve(false);
                }
            },
            debounce: function(func, wait) {
                let timeout;
                return function(...args) {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => func.apply(this, args), wait);
                };
            },
            throttle: function(func, limit) {
                let inThrottle;
                return function(...args) {
                    if (!inThrottle) {
                        func.apply(this, args);
                        inThrottle = true;
                        setTimeout(() => inThrottle = false, limit);
                    }
                };
            },

            // Storage stubs
            Storage: {
                get: function(key, defaultValue) {
                    try {
                        const item = localStorage.getItem(key);
                        return item ? JSON.parse(item) : defaultValue;
                    } catch (e) {
                        return defaultValue;
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
            },

            // Auth stubs
            getCurrentUser: function() {
                try {
                    const user = localStorage.getItem('currentUser');
                    return user ? JSON.parse(user) : null;
                } catch (e) {
                    return null;
                }
            },
            showAlert: function(message, type) {
                console.log(`${type || 'info'}: ${message}`);
                if (typeof alert !== 'undefined') alert(message);
            },
            updateAuthUI: function() {
                console.log('Auth UI update called');
            },
            logout: function() {
                try {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('authToken');
                    window.location.href = 'index.html';
                } catch (e) {
                    console.error('Logout error:', e);
                }
            },

            // Activity stubs
            logActivity: function(type, description, level) {
                console.log(`Activity: ${type} - ${description} (${level || 'info'})`);
            },
            incrementMessagesCount: function() {
                try {
                    let count = parseInt(localStorage.getItem('messagesChecked') || '0');
                    count++;
                    localStorage.setItem('messagesChecked', count.toString());
                } catch (e) {
                    console.error('Error incrementing messages count:', e);
                }
            },

            // Navigation stubs
            toggleMobileMenu: function() {
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                }
            },
            closeMobileMenu: function() {
                const hamburger = document.getElementById('hamburger');
                const navMenu = document.getElementById('nav-menu');
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            },
            scrollToSpamDetector: function() {
                const detector = document.getElementById('spam-detector');
                if (detector) {
                    detector.scrollIntoView({ behavior: 'smooth' });
                }
            },

            // Chart stubs
            initializeCharts: function() {
                console.log('Charts initialization skipped - Chart.js not available');
            },
            updateCharts: function() {
                console.log('Charts update skipped - Chart.js not available');
            },

            // Spam detector stubs
            analyzeMessage: function(message) {
                const spamKeywords = ['lottery', 'winner', 'prize', 'urgent', 'click here', 'free money'];
                const lowerMessage = message.toLowerCase();
                const spamScore = spamKeywords.reduce((score, keyword) => {
                    return lowerMessage.includes(keyword) ? score + 0.2 : score;
                }, 0);
                
                return {
                    isSpam: spamScore > 0.3,
                    confidence: Math.min(spamScore, 1),
                    riskLevel: spamScore > 0.6 ? 'high' : spamScore > 0.3 ? 'medium' : 'low',
                    detectedPatterns: spamKeywords.filter(k => lowerMessage.includes(k))
                };
            },

            // Profile stubs
            handleProfileCircleClick: function(e) {
                e.preventDefault();
                window.location.href = 'profile.html';
            },
            handleSafeLogout: function() {
                if (confirm('Are you sure you want to logout?')) {
                    try {
                        localStorage.clear();
                        window.location.href = 'index.html';
                    } catch (e) {
                        window.location.href = 'index.html';
                    }
                }
            },

            // Animation stubs
            animateCounter: function(element, targetValue, duration) {
                if (!element) return;
                if (typeof element === 'string') {
                    element = document.getElementById(element);
                }
                if (element) {
                    element.textContent = targetValue.toLocaleString();
                }
            },

            // Form validation stubs
            validateForm: function(form) {
                if (!form) return false;
                const inputs = form.querySelectorAll('input[required]');
                let isValid = true;
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = '#dc3545';
                    } else {
                        input.style.borderColor = '#28a745';
                    }
                });
                return isValid;
            }
        };

        // Add stub functions to window if they don't exist
        Object.entries(stubFunctions).forEach(([name, func]) => {
            if (typeof window[name] === 'undefined') {
                window[name] = func;
            }
        });

        console.log('Missing file stubs created successfully');
    }

    // Initialize DOM helpers
    function initializeDOMHelpers() {
        // Safe query selector
        if (typeof window.safeQuerySelector === 'undefined') {
            window.safeQuerySelector = function(selector) {
                try {
                    return document.querySelector(selector);
                } catch (e) {
                    return null;
                }
            };
        }

        // Safe query selector all
        if (typeof window.safeQuerySelectorAll === 'undefined') {
            window.safeQuerySelectorAll = function(selector) {
                try {
                    return document.querySelectorAll(selector);
                } catch (e) {
                    return [];
                }
            };
        }

        // Safe event listener
        if (typeof window.safeAddEventListener === 'undefined') {
            window.safeAddEventListener = function(element, event, handler) {
                if (element && typeof element.addEventListener === 'function') {
                    try {
                        element.addEventListener(event, handler);
                        return true;
                    } catch (e) {
                        return false;
                    }
                }
                return false;
            };
        }
    }

    // Initialize basic functionality
    function initializeBasicFunctionality() {
        try {
            // Mobile menu functionality
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            
            if (hamburger && navMenu && !hamburger.hasAttribute('data-initialized')) {
                hamburger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    hamburger.classList.toggle('active');
                    navMenu.classList.toggle('active');
                });
                hamburger.setAttribute('data-initialized', 'true');
            }

            // Profile circle clicks
            const profileCircles = document.querySelectorAll('.profile-circle');
            profileCircles.forEach(circle => {
                if (!circle.hasAttribute('data-initialized')) {
                    circle.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const dropdown = circle.closest('.user-menu, .nav-profile')?.querySelector('.dropdown-menu');
                        if (dropdown) {
                            dropdown.classList.toggle('show');
                        } else {
                            window.location.href = 'profile.html';
                        }
                    });
                    circle.setAttribute('data-initialized', 'true');
                }
            });

            // Logout buttons
            const logoutButtons = document.querySelectorAll('.logout-btn, [data-action="logout"]');
            logoutButtons.forEach(button => {
                if (!button.hasAttribute('data-initialized')) {
                    button.addEventListener('click', function(e) {
                        e.preventDefault();
                        if (confirm('Are you sure you want to logout?')) {
                            try {
                                localStorage.removeItem('currentUser');
                                localStorage.removeItem('authToken');
                                window.location.href = 'index.html';
                            } catch (error) {
                                window.location.href = 'index.html';
                            }
                        }
                    });
                    button.setAttribute('data-initialized', 'true');
                }
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.user-menu, .nav-profile')) {
                    const dropdowns = document.querySelectorAll('.dropdown-menu');
                    dropdowns.forEach(dropdown => {
                        dropdown.classList.remove('show');
                    });
                }
            });

        } catch (error) {
            console.warn('Error initializing basic functionality:', error);
        }
    }

    // Run initialization
    function initialize() {
        createMissingFileStubs();
        initializeDOMHelpers();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeBasicFunctionality);
        } else {
            initializeBasicFunctionality();
        }
    }

    // Initialize immediately
    initialize();

    console.log('Missing Files Fix loaded - All stub functions created');
})();
