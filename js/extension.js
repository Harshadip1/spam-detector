// Browser Extension Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeExtensionPage();
    initializeNotificationForm();
    initializeTimeline();
    initializeBrowserMockup();
});

// Initialize extension page
function initializeExtensionPage() {
    // Initialize notify buttons
    const notifyButtons = document.querySelectorAll('#notify-btn, .notification-form button[type="submit"]');
    notifyButtons.forEach(button => {
        if (button.type !== 'submit') {
            button.addEventListener('click', showNotificationForm);
        }
    });
    
    // Initialize feature animations
    initializeFeatureAnimations();
    
    // Initialize platform cards
    initializePlatformCards();
}

// Show notification form
function showNotificationForm() {
    const signupSection = document.querySelector('.notification-signup');
    if (signupSection) {
        signupSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Focus on email input
        setTimeout(() => {
            const emailInput = document.getElementById('notify-email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 500);
    }
}

// Initialize notification form
function initializeNotificationForm() {
    const form = document.getElementById('notification-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleNotificationSignup();
    });
}

// Handle notification signup
function handleNotificationSignup() {
    const emailInput = document.getElementById('notify-email');
    const betaCheckbox = document.getElementById('beta-access');
    const updatesCheckbox = document.getElementById('updates');
    
    if (!emailInput || !emailInput.value) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    const email = emailInput.value;
    const preferences = {
        email: email,
        betaAccess: betaCheckbox ? betaCheckbox.checked : false,
        updates: updatesCheckbox ? updatesCheckbox.checked : false,
        signupDate: new Date().toISOString()
    };
    
    // Save to localStorage
    let notifications = Storage.get('extensionNotifications', []);
    
    // Check if email already exists
    const existingIndex = notifications.findIndex(n => n.email === email);
    if (existingIndex !== -1) {
        notifications[existingIndex] = preferences;
        showAlert('Your notification preferences have been updated!', 'success');
    } else {
        notifications.push(preferences);
        showAlert('Thank you! We\'ll notify you when the extension is available.', 'success');
    }
    
    Storage.set('extensionNotifications', notifications);
    
    // Log activity
    if (typeof logActivity === 'function') {
        logActivity('extension', `Signed up for extension notifications: ${email}`, 'info');
    }
    
    // Clear form
    emailInput.value = '';
    if (betaCheckbox) betaCheckbox.checked = false;
    if (updatesCheckbox) updatesCheckbox.checked = false;
    
    // Show success animation
    showSignupSuccess();
}

// Show signup success animation
function showSignupSuccess() {
    const form = document.getElementById('notification-form');
    if (!form) return;
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'signup-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>You're all set!</h3>
            <p>We'll send you an email as soon as the extension is ready.</p>
        </div>
    `;
    
    // Style the success message
    successMessage.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--card-bg);
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        opacity: 0;
        transform: scale(0.9);
        transition: all 0.3s ease;
        border: 2px solid var(--success-color);
    `;
    
    // Position form relatively
    form.style.position = 'relative';
    form.appendChild(successMessage);
    
    // Animate in
    setTimeout(() => {
        successMessage.style.opacity = '1';
        successMessage.style.transform = 'scale(1)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'scale(0.9)';
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 300);
    }, 3000);
}

// Initialize timeline animations
function initializeTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.5 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize browser mockup animations
function initializeBrowserMockup() {
    const mockup = document.querySelector('.browser-mockup');
    if (!mockup) return;
    
    // Animate email items
    const emailItems = mockup.querySelectorAll('.email-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateEmailItems(emailItems);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(mockup);
}

// Animate email items in browser mockup
function animateEmailItems(emailItems) {
    emailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
            
            // Animate spam indicator
            const indicator = item.querySelector('.spam-indicator');
            if (indicator) {
                setTimeout(() => {
                    indicator.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        indicator.style.transform = 'scale(1)';
                    }, 200);
                }, 300);
            }
        }, index * 500 + 500);
    });
}

// Initialize feature animations
function initializeFeatureAnimations() {
    const featureItems = document.querySelectorAll('.feature-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.3 });
    
    featureItems.forEach(item => {
        observer.observe(item);
    });
}

// Initialize platform cards
function initializePlatformCards() {
    const platformCards = document.querySelectorAll('.platform-card');
    
    platformCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const logo = card.querySelector('.platform-logo i');
            if (logo) {
                logo.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const logo = card.querySelector('.platform-logo i');
            if (logo) {
                logo.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
}

// Push notification system (if supported)
function initializePushNotifications() {
    if ('Notification' in window && 'serviceWorker' in navigator) {
        // Check if notifications are already granted
        if (Notification.permission === 'granted') {
            setupPushNotifications();
        } else if (Notification.permission !== 'denied') {
            // Request permission when user signs up
            const form = document.getElementById('notification-form');
            if (form) {
                form.addEventListener('submit', requestNotificationPermission);
            }
        }
    }
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                setupPushNotifications();
                showAlert('Browser notifications enabled! You\'ll get updates about the extension.', 'success');
            }
        });
    }
}

// Setup push notifications
function setupPushNotifications() {
    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('Service Worker registered:', registration);
            
            // Schedule demo notification
            scheduleDemoNotification();
        }).catch(error => {
            console.log('Service Worker registration failed:', error);
        });
    }
}

// Schedule demo notification
function scheduleDemoNotification() {
    // Send a demo notification after 30 seconds
    setTimeout(() => {
        if (Notification.permission === 'granted') {
            new Notification('SecureMessage AI Extension Update', {
                body: 'Thanks for your interest! We\'re making great progress on the browser extension.',
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'extension-update'
            });
        }
    }, 30000);
}

// Simulate extension development progress
function simulateProgress() {
    const progressItems = document.querySelectorAll('.timeline-item.in-progress');
    
    progressItems.forEach(item => {
        const marker = item.querySelector('.timeline-marker i');
        if (marker && marker.classList.contains('fa-spin')) {
            // Add progress animation
            setInterval(() => {
                marker.style.color = marker.style.color === 'var(--success-color)' 
                    ? 'var(--primary-color)' 
                    : 'var(--success-color)';
            }, 2000);
        }
    });
}

// Initialize push notifications on page load
document.addEventListener('DOMContentLoaded', function() {
    initializePushNotifications();
    simulateProgress();
});

// Utility function to show notifications
function showExtensionNotification(title, message, type = 'info') {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '/favicon.ico',
            tag: `extension-${type}`
        });
    }
    
    // Also show in-app notification
    showAlert(message, type);
}

// Export functions for global use
window.showExtensionNotification = showExtensionNotification;
