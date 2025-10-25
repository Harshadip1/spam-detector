// Community Forum Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunity();
    updateWaitlistCount();
    setupWaitlistForm();
});

// Initialize community features
function initializeCommunity() {
    // Join waitlist button in hero
    const joinWaitlistBtn = document.getElementById('join-waitlist');
    if (joinWaitlistBtn) {
        joinWaitlistBtn.addEventListener('click', function() {
            const waitlistSection = document.querySelector('.waitlist-signup');
            waitlistSection.scrollIntoView({ behavior: 'smooth' });
            
            setTimeout(() => {
                document.getElementById('waitlist-email').focus();
            }, 500);
        });
    }
    
    // Animate forum preview on scroll
    setupForumPreviewAnimation();
    
    // Animate feature cards
    setupFeatureAnimations();
}

// Setup waitlist form
function setupWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleWaitlistSignup();
    });
}

// Handle waitlist signup
function handleWaitlistSignup() {
    const emailInput = document.getElementById('waitlist-email');
    const betaCheckbox = document.getElementById('beta-tester');
    const expertCheckbox = document.getElementById('expert-contributor');
    
    if (!emailInput || !emailInput.value) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    const email = emailInput.value;
    const signupData = {
        email: email,
        betaTester: betaCheckbox ? betaCheckbox.checked : false,
        expertContributor: expertCheckbox ? expertCheckbox.checked : false,
        signupDate: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save signup locally
        saveWaitlistSignup(signupData);
        
        // Show success message
        showWaitlistSuccess(signupData);
        
        // Reset form
        emailInput.value = '';
        if (betaCheckbox) betaCheckbox.checked = false;
        if (expertCheckbox) expertCheckbox.checked = false;
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Update waitlist count
        updateWaitlistCount();
        
        // Log activity
        if (typeof logActivity === 'function') {
            logActivity('community', `Joined community forum waitlist: ${email}`, 'success');
        }
    }, 2000);
}

// Save waitlist signup
function saveWaitlistSignup(signupData) {
    let waitlist = Storage.get('communityWaitlist', []);
    
    // Check if email already exists
    const existingIndex = waitlist.findIndex(signup => signup.email === signupData.email);
    if (existingIndex !== -1) {
        waitlist[existingIndex] = signupData;
    } else {
        waitlist.push(signupData);
    }
    
    Storage.set('communityWaitlist', waitlist);
}

// Show waitlist success message
function showWaitlistSuccess(signupData) {
    const modal = document.createElement('div');
    modal.className = 'modal waitlist-success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-header">
                <i class="fas fa-check-circle"></i>
                <h2>Welcome to the Waitlist!</h2>
            </div>
            <div class="success-body">
                <p>Thank you for joining our community forum waitlist. You'll be among the first to know when we launch!</p>
                
                <div class="signup-summary">
                    <h3>Your Signup Details:</h3>
                    <div class="summary-item">
                        <strong>Email:</strong> ${signupData.email}
                    </div>
                    ${signupData.betaTester ? '<div class="summary-item"><strong>Beta Tester:</strong> Yes</div>' : ''}
                    ${signupData.expertContributor ? '<div class="summary-item"><strong>Expert Contributor:</strong> Yes</div>' : ''}
                    <div class="summary-item">
                        <strong>Position:</strong> #${getWaitlistPosition()}
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3>What's Next?</h3>
                    <ul>
                        <li>We'll email you when the forum launches (Q2 2024)</li>
                        <li>Beta testers will get early access 2 weeks before launch</li>
                        <li>Expert contributors will receive special moderator privileges</li>
                        <li>You'll get a founding member badge when you join</li>
                    </ul>
                </div>
                
                <div class="current-support">
                    <h3>Need Help Now?</h3>
                    <p>While you wait, use our current support options:</p>
                    <div class="support-buttons">
                        <button class="btn btn-primary btn-sm" onclick="toggleChat(); closeWaitlistModal();">
                            <i class="fas fa-comments"></i>
                            Live Chat
                        </button>
                        <button class="btn btn-outline btn-sm" onclick="window.location.href='faq.html'; closeWaitlistModal();">
                            <i class="fas fa-question-circle"></i>
                            FAQ
                        </button>
                    </div>
                </div>
            </div>
            <div class="success-actions">
                <button class="btn btn-primary" onclick="closeWaitlistModal()">
                    <i class="fas fa-check"></i>
                    Got it, thanks!
                </button>
                <button class="btn btn-outline" onclick="shareWaitlist()">
                    <i class="fas fa-share"></i>
                    Share with Friends
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Auto-close after 15 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            closeWaitlistModal();
        }
    }, 15000);
}

// Get waitlist position
function getWaitlistPosition() {
    const waitlist = Storage.get('communityWaitlist', []);
    return 1247 + waitlist.length; // Base count + user signups
}

// Close waitlist modal
function closeWaitlistModal() {
    const modal = document.querySelector('.waitlist-success-modal');
    if (modal) {
        modal.remove();
    }
}

// Share waitlist
function shareWaitlist() {
    if (navigator.share) {
        navigator.share({
            title: 'SecureMessage AI Community Forum',
            text: 'Join me on the waitlist for the SecureMessage AI Community Forum - a place to learn and share cybersecurity knowledge!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        const shareText = `Join me on the waitlist for the SecureMessage AI Community Forum! ${window.location.href}`;
        navigator.clipboard.writeText(shareText).then(() => {
            showAlert('Share link copied to clipboard!', 'success');
        });
    }
    
    closeWaitlistModal();
}

// Update waitlist count
function updateWaitlistCount() {
    const waitlistCountElement = document.getElementById('waitlist-count');
    if (!waitlistCountElement) return;
    
    const userSignups = Storage.get('communityWaitlist', []).length;
    const totalCount = 1247 + userSignups;
    
    animateCounter(waitlistCountElement, totalCount);
}

// Animate counter
function animateCounter(element, targetValue) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Setup forum preview animation
function setupForumPreviewAnimation() {
    const forumMockup = document.querySelector('.forum-mockup');
    if (!forumMockup) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateForumPreview();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(forumMockup);
}

// Animate forum preview
function animateForumPreview() {
    const categories = document.querySelectorAll('.category-item');
    const topics = document.querySelectorAll('.topic-item');
    
    // Animate categories
    categories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            category.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            category.style.opacity = '1';
            category.style.transform = 'translateX(0)';
        }, index * 200);
    });
    
    // Animate topics
    topics.forEach((topic, index) => {
        topic.style.opacity = '0';
        topic.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            topic.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            topic.style.opacity = '1';
            topic.style.transform = 'translateY(0)';
        }, 600 + index * 150);
    });
}

// Setup feature animations
function setupFeatureAnimations() {
    const featureCards = document.querySelectorAll('.feature-card, .guideline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.3 });
    
    featureCards.forEach(card => {
        observer.observe(card);
    });
}

// Simulate forum activity
function simulateForumActivity() {
    const topicStats = document.querySelectorAll('.topic-stats .stat span');
    
    // Randomly update view counts and likes
    setInterval(() => {
        topicStats.forEach(stat => {
            if (Math.random() < 0.1) { // 10% chance to update
                const currentValue = parseInt(stat.textContent);
                const newValue = currentValue + Math.floor(Math.random() * 3) + 1;
                
                // Animate the change
                stat.style.transform = 'scale(1.2)';
                stat.style.color = 'var(--primary-color)';
                stat.textContent = newValue;
                
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                    stat.style.color = '';
                }, 300);
            }
        });
    }, 5000); // Update every 5 seconds
}

// Initialize forum activity simulation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(simulateForumActivity, 3000); // Start after 3 seconds
});

// Make functions available globally
window.closeWaitlistModal = closeWaitlistModal;
window.shareWaitlist = shareWaitlist;
