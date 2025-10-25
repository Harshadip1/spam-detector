// Theme Manager - Dark/Light Mode Toggle System
// Default: Dark Mode

(function() {
    'use strict';

    // Theme configuration
    const THEMES = {
        dark: {
            name: 'dark',
            label: 'Dark Mode',
            icon: 'fas fa-moon',
            colors: {
                '--primary-bg': '#1a1a1a',
                '--secondary-bg': '#2d2d2d',
                '--card-bg': '#333333',
                '--text-primary': '#ffffff',
                '--text-secondary': '#b0b0b0',
                '--text-muted': '#888888',
                '--border-color': '#444444',
                '--accent-color': '#667eea',
                '--accent-hover': '#5a6fd8',
                '--success-color': '#28a745',
                '--error-color': '#dc3545',
                '--warning-color': '#ffc107',
                '--shadow': 'rgba(0, 0, 0, 0.3)',
                '--shadow-light': 'rgba(0, 0, 0, 0.1)',
                '--gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '--gradient-bg': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
                '--navbar-bg': 'rgba(26, 26, 26, 0.95)',
                '--footer-bg': '#1a1a1a',
                '--input-bg': '#2d2d2d',
                '--input-border': '#444444',
                '--input-focus': '#667eea'
            }
        },
        light: {
            name: 'light',
            label: 'Light Mode',
            icon: 'fas fa-sun',
            colors: {
                '--primary-bg': '#ffffff',
                '--secondary-bg': '#f8f9fa',
                '--card-bg': '#ffffff',
                '--text-primary': '#333333',
                '--text-secondary': '#666666',
                '--text-muted': '#999999',
                '--border-color': '#e1e5e9',
                '--accent-color': '#667eea',
                '--accent-hover': '#5a6fd8',
                '--success-color': '#28a745',
                '--error-color': '#dc3545',
                '--warning-color': '#ffc107',
                '--shadow': 'rgba(0, 0, 0, 0.1)',
                '--shadow-light': 'rgba(0, 0, 0, 0.05)',
                '--gradient-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '--gradient-bg': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                '--navbar-bg': 'rgba(255, 255, 255, 0.95)',
                '--footer-bg': '#f8f9fa',
                '--input-bg': '#f8f9fa',
                '--input-border': '#e1e5e9',
                '--input-focus': '#667eea'
            }
        }
    };

    // Theme Manager Class
    class ThemeManager {
        constructor() {
            this.currentTheme = 'dark'; // Default to dark mode
            this.toggleButtons = [];
            this.init();
        }

        init() {
            this.loadSavedTheme();
            this.applyTheme(this.currentTheme);
            this.createThemeToggle();
            this.setupEventListeners();
            console.log('🌙 Theme Manager initialized - Default: Dark Mode');
        }

        loadSavedTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme && THEMES[savedTheme]) {
                this.currentTheme = savedTheme;
            } else {
                // Set dark as default if no saved theme
                this.currentTheme = 'dark';
                localStorage.setItem('theme', 'dark');
            }
        }

        applyTheme(themeName) {
            const theme = THEMES[themeName];
            if (!theme) return;

            const root = document.documentElement;
            
            // Apply CSS custom properties
            Object.entries(theme.colors).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });

            // Update body class
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            document.body.classList.add(`theme-${themeName}`);

            // Update meta theme-color for mobile browsers
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                metaThemeColor.name = 'theme-color';
                document.head.appendChild(metaThemeColor);
            }
            metaThemeColor.content = theme.colors['--primary-bg'];

            this.currentTheme = themeName;
            localStorage.setItem('theme', themeName);
            
            // Update all toggle buttons
            this.updateToggleButtons();
            
            console.log(`🎨 Theme applied: ${theme.label}`);
        }

        createThemeToggle() {
            // Create theme toggle for navbar
            const navbar = document.querySelector('.navbar .nav-container');
            if (navbar && !document.getElementById('theme-toggle')) {
                const themeToggle = document.createElement('button');
                themeToggle.id = 'theme-toggle';
                themeToggle.className = 'theme-toggle-btn';
                themeToggle.innerHTML = `<i class="${THEMES[this.getOppositeTheme()].icon}"></i>`;
                themeToggle.title = `Switch to ${THEMES[this.getOppositeTheme()].label}`;
                
                // Add styles
                themeToggle.style.cssText = `
                    background: var(--card-bg);
                    border: 2px solid var(--border-color);
                    color: var(--text-primary);
                    padding: 8px 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-left: 1rem;
                    font-size: 1rem;
                `;

                navbar.appendChild(themeToggle);
                this.toggleButtons.push(themeToggle);
            }

            // Create floating theme toggle
            this.createFloatingToggle();
        }

        createFloatingToggle() {
            if (document.getElementById('floating-theme-toggle')) return;

            const floatingToggle = document.createElement('button');
            floatingToggle.id = 'floating-theme-toggle';
            floatingToggle.className = 'floating-theme-toggle';
            floatingToggle.innerHTML = `<i class="${THEMES[this.getOppositeTheme()].icon}"></i>`;
            floatingToggle.title = `Switch to ${THEMES[this.getOppositeTheme()].label}`;
            
            floatingToggle.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: var(--accent-color);
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px var(--shadow);
                transition: all 0.3s ease;
                z-index: 1000;
                font-size: 1.2rem;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // Hover effects
            floatingToggle.addEventListener('mouseenter', () => {
                floatingToggle.style.transform = 'scale(1.1)';
                floatingToggle.style.background = 'var(--accent-hover)';
            });

            floatingToggle.addEventListener('mouseleave', () => {
                floatingToggle.style.transform = 'scale(1)';
                floatingToggle.style.background = 'var(--accent-color)';
            });

            document.body.appendChild(floatingToggle);
            this.toggleButtons.push(floatingToggle);
        }

        setupEventListeners() {
            // Add click listeners to all toggle buttons
            this.toggleButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.toggleTheme();
                });
            });

            // Keyboard shortcut: Ctrl + Shift + T
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });

            // System theme change detection
            if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                mediaQuery.addEventListener('change', (e) => {
                    // Only auto-switch if user hasn't manually set a preference
                    const hasManualPreference = localStorage.getItem('theme-manual');
                    if (!hasManualPreference) {
                        this.applyTheme(e.matches ? 'dark' : 'light');
                    }
                });
            }
        }

        toggleTheme() {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
            
            // Mark as manual preference
            localStorage.setItem('theme-manual', 'true');
            
            // Show notification
            this.showThemeNotification(THEMES[newTheme].label);
            
            // Animate toggle
            this.animateToggle();
        }

        getOppositeTheme() {
            return this.currentTheme === 'dark' ? 'light' : 'dark';
        }

        updateToggleButtons() {
            const oppositeTheme = this.getOppositeTheme();
            this.toggleButtons.forEach(button => {
                if (button) {
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = THEMES[oppositeTheme].icon;
                    }
                    button.title = `Switch to ${THEMES[oppositeTheme].label}`;
                }
            });
        }

        animateToggle() {
            this.toggleButtons.forEach(button => {
                if (button) {
                    button.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                }
            });
        }

        showThemeNotification(themeName) {
            // Remove existing notification
            const existing = document.getElementById('theme-notification');
            if (existing) {
                existing.remove();
            }

            // Create notification
            const notification = document.createElement('div');
            notification.id = 'theme-notification';
            notification.innerHTML = `
                <i class="${THEMES[this.currentTheme].icon}"></i>
                <span>Switched to ${themeName}</span>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--card-bg);
                color: var(--text-primary);
                padding: 12px 16px;
                border-radius: 8px;
                box-shadow: 0 4px 12px var(--shadow);
                border: 1px solid var(--border-color);
                z-index: 1001;
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 500;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Animate out and remove
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.remove();
                    }
                }, 300);
            }, 2000);
        }

        // Public API
        getCurrentTheme() {
            return this.currentTheme;
        }

        setTheme(themeName) {
            if (THEMES[themeName]) {
                this.applyTheme(themeName);
                localStorage.setItem('theme-manual', 'true');
            }
        }

        isDarkMode() {
            return this.currentTheme === 'dark';
        }

        isLightMode() {
            return this.currentTheme === 'light';
        }
    }

    // Initialize theme manager
    let themeManager;

    function initializeThemeManager() {
        if (!themeManager) {
            themeManager = new ThemeManager();
            
            // Make it globally available
            window.themeManager = themeManager;
            
            // Add to window for backward compatibility
            window.toggleTheme = () => themeManager.toggleTheme();
            window.setTheme = (theme) => themeManager.setTheme(theme);
            window.getCurrentTheme = () => themeManager.getCurrentTheme();
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeThemeManager);
    } else {
        initializeThemeManager();
    }

    // Also initialize immediately for early access
    initializeThemeManager();

    console.log('🌙 Theme Manager loaded - Dark mode is default');
})();
