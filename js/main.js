// Main JavaScript functionality for SecureMessage AI

// Global variables
let messagesChecked = parseInt(localStorage.getItem('messagesChecked') || '0');

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateAuthUI();
    updateMessagesCount();
});

// Initialize the application
function initializeApp() {
    // Ensure utility functions are available
    ensureUtilityFunctions();
    // Mobile navigation toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(26, 31, 46, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 31, 46, 0.95)';
        }
    });
    
    // Initialize animations on scroll
    initializeScrollAnimations();
}

// Update authentication UI based on login status
function updateAuthUI() {
    const user = getCurrentUser();
    const authLink = document.getElementById('auth-link');
    const profileItem = document.getElementById('profile-item');
    
    if (user && authLink && profileItem) {
        authLink.textContent = user.name;
        authLink.href = 'profile.html';
        profileItem.style.display = 'block';
    } else if (authLink) {
        authLink.textContent = 'Login';
        authLink.href = 'login.html';
        if (profileItem) {
            profileItem.style.display = 'none';
        }
    }
}

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Update messages checked count
function updateMessagesCount() {
    const messagesCountElement = document.getElementById('messages-checked');
    if (messagesCountElement) {
        messagesCountElement.textContent = messagesChecked;
    }
}

// Increment messages checked counter
function incrementMessagesCount() {
    messagesChecked++;
    localStorage.setItem('messagesChecked', messagesChecked.toString());
    updateMessagesCount();
}

// Scroll to spam detector section
function scrollToSpamDetector() {
    const spamDetector = document.getElementById('spam-detector');
    if (spamDetector) {
        spamDetector.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .stat-card, .team-member, .value-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container') || createAlertContainer();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    alertContainer.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}

// Create alert container if it doesn't exist
function createAlertContainer() {
    const container = document.createElement('div');
    container.id = 'alert-container';
    container.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 1001;
        max-width: 400px;
    `;
    document.body.appendChild(container);
    return container;
}

// Get alert icon based on type
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggle = input.nextElementSibling;
    const icon = toggle.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Use utility functions from utils.js if available, otherwise provide fallbacks
function ensureUtilityFunctions() {
    // Only create functions if they don't already exist
    if (typeof window.formatDate !== 'function') {
        window.formatDate = function(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
    }
    
    if (typeof window.isValidEmail !== 'function') {
        window.isValidEmail = function(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };
    }
    
    if (typeof window.validatePassword !== 'function') {
        window.validatePassword = function(password) {
            const minLength = password.length >= 6;
            const hasUpper = /[A-Z]/.test(password);
            const hasLower = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            
            let strength = 0;
            if (minLength) strength++;
            if (hasUpper) strength++;
            if (hasLower) strength++;
            if (hasNumber) strength++;
            if (hasSpecial) strength++;
            
            return {
                isValid: minLength,
                strength: strength,
                feedback: getPasswordFeedback(strength, minLength)
            };
        };
    }
    
    if (typeof window.debounce !== 'function') {
        window.debounce = function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
    }
    
    if (typeof window.throttle !== 'function') {
        window.throttle = function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
    }
    
    // Use Storage from storage.js if available, otherwise create fallback
    if (typeof window.Storage === 'undefined') {
        window.Storage = {
            set: (key, value) => {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e) {
                    console.error('Storage error:', e);
                    return false;
                }
            },
            
            get: (key, defaultValue = null) => {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : defaultValue;
                } catch (e) {
                    console.error('Storage error:', e);
                    return defaultValue;
                }
            },
            
            remove: (key) => {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (e) {
                    console.error('Storage error:', e);
                    return false;
                }
            }
        };
    }
}

// Get password strength feedback
function getPasswordFeedback(strength, minLength) {
    if (!minLength) return 'Password must be at least 6 characters';
    
    const levels = [
        'Very Weak',
        'Weak', 
        'Fair',
        'Good',
        'Strong'
    ];
    
    return levels[Math.min(strength - 1, 4)] || 'Very Weak';
}

// Toggle chat function (fallback if chatbot.js not loaded)
function toggleChatFallback() {
    try {
        // Try to use chatbot.js function if available
        if (typeof window.toggleChat === 'function' && window.toggleChat !== toggleChatFallback) {
            window.toggleChat();
        } else {
            // Fallback: show alert or redirect to contact page
            showAlert('Live chat is currently unavailable. Please visit our contact page for support.', 'info');
        }
    } catch (error) {
        console.error('Error toggling chat:', error);
        showAlert('Live chat is currently unavailable. Please visit our contact page for support.', 'info');
    }
}

// Make toggleChat available globally (only if not already defined)
if (typeof window.toggleChat !== 'function') {
    window.toggleChat = toggleChatFallback;
}

// Export functions for use in other files
window.SecureMessageAI = {
    getCurrentUser,
    updateAuthUI,
    incrementMessagesCount,
    scrollToSpamDetector,
    toggleChat: window.toggleChat
};
