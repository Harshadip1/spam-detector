// Premium Page JavaScript

// Initialize premium page
document.addEventListener('DOMContentLoaded', function() {
    initializePricingToggle();
    initializePlanButtons();
    initializeFAQ();
    animateStats();
    initializePlanComparison();
    initializeScrollAnimations();
    initializeHoverEffects();
});

// Initialize pricing toggle (monthly/annual)
function initializePricingToggle() {
    const pricingToggle = document.getElementById('pricing-toggle');
    const monthlyPrices = document.querySelectorAll('.monthly-price');
    const annualPrices = document.querySelectorAll('.annual-price');
    
    if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
            const isAnnual = this.checked;
            
            monthlyPrices.forEach(price => {
                price.style.display = isAnnual ? 'none' : 'inline';
            });
            
            annualPrices.forEach(price => {
                price.style.display = isAnnual ? 'inline' : 'none';
            });
            
            // Add animation effect
            document.querySelectorAll('.pricing-card').forEach(card => {
                card.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }
}

// Initialize plan selection buttons
function initializePlanButtons() {
    const planButtons = document.querySelectorAll('.plan-btn');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const planCard = this.closest('.pricing-card');
            const planName = planCard.querySelector('h3').textContent;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Handle different plan actions
            if (planName === 'Enterprise') {
                handleEnterprisePlan();
            } else {
                handleStandardPlan(planName);
            }
        });
    });
}

// Handle standard plan selection
function handleStandardPlan(planName) {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        showAlert('Please log in to subscribe to a premium plan.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    // Show subscription modal
    showSubscriptionModal(planName);
}

// Handle enterprise plan contact
function handleEnterprisePlan() {
    showAlert('Redirecting to contact sales...', 'info');
    setTimeout(() => {
        window.location.href = 'contact.html?plan=enterprise';
    }, 1500);
}

// Show subscription modal
function showSubscriptionModal(planName) {
    const modal = createSubscriptionModal(planName);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
}

// Create subscription modal
function createSubscriptionModal(planName) {
    const modal = document.createElement('div');
    modal.className = 'subscription-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    `;
    
    const planInfo = getPlanInfo(planName);
    
    modal.innerHTML = `
        <div class="modal-content" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--card-bg);
            border-radius: var(--radius-lg);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transition: transform 0.3s ease;
            border: 1px solid rgba(0, 212, 255, 0.3);
        ">
            <div style="margin-bottom: 1.5rem;">
                <div style="width: 80px; height: 80px; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2rem; color: white;">
                    ${planInfo.icon}
                </div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Subscribe to ${planName}</h3>
                <p style="color: var(--text-secondary);">You're about to subscribe to the ${planName} plan</p>
            </div>
            
            <div style="background: var(--accent-bg); padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span style="color: var(--text-secondary);">${planName} Plan</span>
                    <span style="color: var(--primary-color); font-size: 1.5rem; font-weight: 600;">₹${planInfo.price}/month</span>
                </div>
                <div style="text-align: left; color: var(--text-secondary); font-size: 0.875rem;">
                    <p><i class="fas fa-info-circle"></i> Demo Notice: This is a demonstration. No actual payment will be processed.</p>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="confirmSubscription('${planName}')" class="btn btn-primary">
                    <i class="fas fa-credit-card"></i> Subscribe Now
                </button>
                <button onclick="closeSubscriptionModal(this.closest('.subscription-modal'))" class="btn btn-outline">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        </div>
    `;
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSubscriptionModal(modal);
        }
    });
    
    return modal;
}

// Get plan information
function getPlanInfo(planName) {
    const plans = {
        'Basic': {
            icon: '<i class="fas fa-shield"></i>',
            price: '749'
        },
        'Pro': {
            icon: '<i class="fas fa-shield-alt"></i>',
            price: '2,399'
        },
        'Enterprise': {
            icon: '<i class="fas fa-crown"></i>',
            price: '8,199'
        }
    };
    
    return plans[planName] || plans['Basic'];
}

// Confirm subscription
function confirmSubscription(planName) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Update user's subscription in localStorage
    const updatedUser = {
        ...currentUser,
        subscription: {
            plan: planName,
            status: 'active',
            startDate: new Date().toISOString(),
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
    };
    
    Storage.set('currentUser', updatedUser);
    
    // Update users array
    const users = Storage.get('users', []);
    const updatedUsers = users.map(user => 
        user.id === currentUser.id ? updatedUser : user
    );
    Storage.set('users', updatedUsers);
    
    // Close modal and show success
    const modal = document.querySelector('.subscription-modal');
    closeSubscriptionModal(modal);
    
    showAlert(`Successfully subscribed to ${planName} plan!`, 'success');
    
    // Redirect to profile after delay
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

// Close subscription modal
function closeSubscriptionModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherAnswer.style.maxHeight = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
        
        // Initialize styles
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        icon.style.transition = 'transform 0.3s ease';
    });
}

// Animate statistics in hero section
function animateStats() {
    const stats = document.querySelectorAll('.hero-stats .stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
}

// Animate individual stat number
function animateStatNumber(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasPlus = text.includes('+');
    const hasSlash = text.includes('/');
    
    let targetValue = 0;
    let suffix = '';
    
    if (hasPercent) {
        targetValue = parseFloat(text);
        suffix = '%';
    } else if (hasPlus) {
        if (text.includes('M')) {
            targetValue = parseFloat(text) * 1000000;
            suffix = 'M+';
        } else {
            targetValue = parseInt(text);
            suffix = '+';
        }
    } else if (hasSlash) {
        element.textContent = text; // Don't animate text with slashes
        return;
    }
    
    if (targetValue === 0) return;
    
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        let currentValue = startValue + (targetValue - startValue) * easeOut;
        
        if (hasPercent) {
            element.textContent = currentValue.toFixed(1) + suffix;
        } else if (hasPlus && text.includes('M')) {
            element.textContent = (currentValue / 1000000).toFixed(0) + suffix;
        } else {
            element.textContent = Math.floor(currentValue) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Initialize plan comparison interactions
function initializePlanComparison() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Highlight corresponding column in comparison table
            const planName = card.querySelector('h3').textContent.toLowerCase();
            highlightTableColumn(planName);
        });
        
        card.addEventListener('mouseleave', () => {
            // Remove highlight from comparison table
            removeTableHighlight();
        });
    });
}

// Highlight table column
function highlightTableColumn(planName) {
    const table = document.querySelector('.comparison-table');
    if (!table) return;
    
    const headers = table.querySelectorAll('th');
    let columnIndex = -1;
    
    headers.forEach((header, index) => {
        if (header.textContent.toLowerCase() === planName) {
            columnIndex = index;
        }
    });
    
    if (columnIndex > -1) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cell = row.children[columnIndex];
            if (cell) {
                cell.style.background = 'rgba(0, 212, 255, 0.1)';
            }
        });
    }
}

// Remove table highlight
function removeTableHighlight() {
    const table = document.querySelector('.comparison-table');
    if (!table) return;
    
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
        cell.style.background = '';
    });
}

// Initialize scroll animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.pricing-card, .testimonial-card, .faq-item, .trust-indicators');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize hover effects
function initializeHoverEffects() {
    // Add parallax effect to hero section
    const hero = document.querySelector('.premium-hero');
    if (hero) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            hero.style.background = `
                radial-gradient(circle at ${x}% ${y}%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                var(--hero-gradient)
            `;
        });
    }
    
    // Add floating animation to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
        // Stagger the animation delay
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add subtle floating animation
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            if (card.classList.contains('popular')) {
                card.style.transform = 'scale(1.05)';
            } else {
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Add glow effect to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.boxShadow = '';
        });
    });
}

// Enhanced FAQ functionality with better animations
function initializeFAQEnhanced() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        // Add staggered entrance animation
        item.style.animationDelay = `${index * 0.1}s`;
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items with animation
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    
                    otherAnswer.style.maxHeight = '0';
                    otherAnswer.style.padding = '0 var(--space-xl)';
                    otherIcon.style.transform = 'rotate(0deg)';
                    
                    // Remove border after animation
                    setTimeout(() => {
                        otherAnswer.style.borderTop = 'none';
                    }, 300);
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
                answer.style.padding = '0 var(--space-xl)';
                answer.style.borderTop = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 40 + 'px'; // Add padding
                answer.style.padding = '0 var(--space-xl) var(--space-xl)';
                answer.style.borderTop = '1px solid var(--border-light)';
                icon.style.transform = 'rotate(180deg)';
            }
        });
        
        // Initialize styles with smooth transitions
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        answer.style.padding = '0 var(--space-xl)';
        icon.style.transition = 'transform 0.3s ease';
    });
}

// Add pricing card interactions
function enhancePricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        // Add click to expand effect
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.plan-btn')) {
                // Highlight the card temporarily
                card.style.borderColor = 'var(--primary-color)';
                card.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow-strong)';
                
                // Reset after animation
                setTimeout(() => {
                    if (!card.classList.contains('popular')) {
                        card.style.borderColor = '';
                        card.style.boxShadow = '';
                    }
                }, 1000);
            }
        });
        
        // Add feature highlight on hover
        const features = card.querySelectorAll('.plan-features li');
        features.forEach(feature => {
            feature.addEventListener('mouseenter', () => {
                if (!feature.classList.contains('unavailable')) {
                    feature.style.backgroundColor = 'rgba(0, 212, 255, 0.1)';
                    feature.style.transform = 'translateX(5px)';
                }
            });
            
            feature.addEventListener('mouseleave', () => {
                feature.style.backgroundColor = '';
                feature.style.transform = '';
            });
        });
    });
}

// Initialize all enhanced features
function initializeEnhancedFeatures() {
    initializeFAQEnhanced();
    enhancePricingCards();
    
    // Add smooth scrolling to anchor links
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
    
    // Add loading animation to plan buttons
    const planButtons = document.querySelectorAll('.plan-btn');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });
}

// Call enhanced features on load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeEnhancedFeatures, 500);
});

// Make functions available globally
window.confirmSubscription = confirmSubscription;
window.closeSubscriptionModal = closeSubscriptionModal;
