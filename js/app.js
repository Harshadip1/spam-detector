// SecureMessage AI - Complete Application JavaScript
// Modern, clean implementation with full functionality

// Global variables
let messagesScanned = 0;
let threatsBlocked = 0;
let isAnalyzing = false;

// Spam detection database
const SPAM_KEYWORDS = {
    high: [
        'congratulations', 'winner', 'lottery', 'prize', 'jackpot', 'million', 'billion',
        'inheritance', 'beneficiary', 'urgent', 'immediate', 'act now', 'limited time',
        'click here', 'download now', 'free money', 'cash prize', 'guaranteed',
        'no risk', 'risk free', 'amazing deal', 'incredible offer', 'once in lifetime',
        'nigerian prince', 'transfer funds', 'wire transfer', 'western union',
        'verify account', 'suspended account', 'confirm identity', 'update payment',
        'phishing', 'malware', 'virus', 'trojan', 'ransomware', 'scam', 'fraud'
    ],
    medium: [
        'free', 'offer', 'deal', 'discount', 'save money', 'earn money', 'make money',
        'work from home', 'business opportunity', 'investment', 'profit',
        'click', 'link', 'website', 'visit', 'download', 'install',
        'password', 'login', 'account', 'bank', 'credit card', 'social security',
        'urgent action', 'respond immediately', 'time sensitive', 'expires',
        'limited offer', 'exclusive', 'special promotion', 'bonus'
    ],
    low: [
        'buy', 'sell', 'cheap', 'affordable', 'sale', 'promotion',
        'subscribe', 'newsletter', 'update', 'notification',
        'message', 'email', 'text', 'sms', 'call', 'phone'
    ]
};

// Suspicious patterns (regex)
const SUSPICIOUS_PATTERNS = [
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit card numbers
    /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, // SSN patterns
    /\b[A-Z]{2}\d{6,8}\b/g, // Account numbers
    /https?:\/\/[^\s]+/gi, // URLs
    /\b\w+@\w+\.\w+\b/gi, // Email addresses
    /\$\d+(?:,\d{3})*(?:\.\d{2})?/g, // Money amounts
    /\b(?:call|text|sms)\s+(?:now|today|immediately)\b/gi,
    /\b(?:act|respond|reply)\s+(?:now|today|immediately|fast|quick)\b/gi
];

// Security tips database
const SECURITY_TIPS = [
    {
        tip: "Always verify the sender before clicking links in emails or messages.",
        category: "Email Security"
    },
    {
        tip: "Never share your passwords or personal information via email or text.",
        category: "Password Security"
    },
    {
        tip: "Be suspicious of urgent messages asking for immediate action.",
        category: "Phishing Prevention"
    },
    {
        tip: "Check URLs carefully before clicking - look for misspellings or suspicious domains.",
        category: "Link Safety"
    },
    {
        tip: "Enable two-factor authentication on all your important accounts.",
        category: "Account Security"
    },
    {
        tip: "Keep your software and antivirus programs up to date.",
        category: "System Security"
    },
    {
        tip: "Be cautious of unexpected prize notifications or lottery winnings.",
        category: "Scam Prevention"
    },
    {
        tip: "Never download attachments from unknown or suspicious senders.",
        category: "Malware Prevention"
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    console.log('SecureMessage AI - Initializing...');
    
    // Initialize theme system
    initializeTheme();
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize spam detector
    initializeSpamDetector();
    
    // Initialize security tips
    initializeSecurityTips();
    
    // Initialize counters
    initializeCounters();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize 3D effects
    initialize3DEffects();
    
    console.log('SecureMessage AI - Initialized successfully!');
}

// Initialize navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Initialize spam detector
function initializeSpamDetector() {
    const messageInput = document.getElementById('message-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const demoBtn = document.getElementById('demo-btn');
    
    if (messageInput) {
        // Real-time word and character count
        messageInput.addEventListener('input', updateInputStats);
        
        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 400) + 'px';
        });
    }
    
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeMessage);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearMessage);
    }
    
    if (demoBtn) {
        demoBtn.addEventListener('click', showDemo);
    }
}

// Update input statistics
function updateInputStats() {
    const messageInput = document.getElementById('message-input');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    
    if (messageInput && wordCountEl && charCountEl) {
        const text = messageInput.value.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        const charCount = messageInput.value.length;
        
        wordCountEl.textContent = `${wordCount} words`;
        charCountEl.textContent = `${charCount} characters`;
    }
}

// Analyze message for spam
async function analyzeMessage() {
    const messageInput = document.getElementById('message-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultDiv = document.getElementById('detector-result');
    
    if (!messageInput || !messageInput.value.trim()) {
        showAlert('Please enter a message to analyze.', 'warning');
        return;
    }
    
    if (isAnalyzing) {
        return;
    }
    
    isAnalyzing = true;
    
    // Update button state
    if (analyzeBtn) {
        analyzeBtn.innerHTML = '<span class="loading"></span> Analyzing...';
        analyzeBtn.disabled = true;
    }
    
    try {
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const message = messageInput.value.trim();
        const analysis = performSpamAnalysis(message);
        
        displayResults(analysis);
        
        // Update statistics
        messagesScanned++;
        if (analysis.riskLevel !== 'safe') {
            threatsBlocked++;
        }
        updateCounters();
        
        // Show result
        if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
    } catch (error) {
        console.error('Analysis error:', error);
        showAlert('An error occurred during analysis. Please try again.', 'error');
    } finally {
        isAnalyzing = false;
        
        // Reset button state
        if (analyzeBtn) {
            analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Message';
            analyzeBtn.disabled = false;
        }
    }
}

// Perform spam analysis
function performSpamAnalysis(message) {
    const lowerMessage = message.toLowerCase();
    let riskScore = 0;
    let detectedKeywords = [];
    let detectedPatterns = [];
    let riskFactors = [];
    
    // Check for spam keywords
    Object.keys(SPAM_KEYWORDS).forEach(level => {
        SPAM_KEYWORDS[level].forEach(keyword => {
            if (lowerMessage.includes(keyword.toLowerCase())) {
                const weight = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
                riskScore += weight;
                detectedKeywords.push({ keyword, level });
            }
        });
    });
    
    // Check for suspicious patterns
    SUSPICIOUS_PATTERNS.forEach((pattern, index) => {
        const matches = message.match(pattern);
        if (matches) {
            riskScore += matches.length * 2;
            detectedPatterns.push({
                type: getPatternType(index),
                matches: matches.length
            });
        }
    });
    
    // Additional risk factors
    if (message.length > 1000) {
        riskScore += 1;
        riskFactors.push('Unusually long message');
    }
    
    if ((message.match(/[A-Z]/g) || []).length > message.length * 0.5) {
        riskScore += 2;
        riskFactors.push('Excessive use of capital letters');
    }
    
    if ((message.match(/!/g) || []).length > 5) {
        riskScore += 1;
        riskFactors.push('Multiple exclamation marks');
    }
    
    // Determine risk level and confidence
    let riskLevel, confidence, description;
    
    if (riskScore === 0) {
        riskLevel = 'safe';
        confidence = 95;
        description = 'This message appears to be legitimate and safe.';
    } else if (riskScore <= 3) {
        riskLevel = 'low';
        confidence = 80;
        description = 'This message has some suspicious elements but is likely safe.';
    } else if (riskScore <= 7) {
        riskLevel = 'medium';
        confidence = 85;
        description = 'This message contains several red flags and should be treated with caution.';
    } else {
        riskLevel = 'high';
        confidence = 92;
        description = 'This message shows strong indicators of spam or phishing attempts.';
    }
    
    return {
        riskLevel,
        confidence,
        description,
        riskScore,
        detectedKeywords,
        detectedPatterns,
        riskFactors,
        message
    };
}

// Get pattern type description
function getPatternType(index) {
    const types = [
        'Credit Card Number',
        'Social Security Number',
        'Account Number',
        'Suspicious URL',
        'Email Address',
        'Money Amount',
        'Urgent Call to Action',
        'Immediate Response Request'
    ];
    return types[index] || 'Suspicious Pattern';
}

// Display analysis results
function displayResults(analysis) {
    // Update status icon and info
    const statusIcon = document.getElementById('status-icon');
    const resultTitle = document.getElementById('result-title');
    const resultDescription = document.getElementById('result-description');
    const confidenceScore = document.getElementById('confidence-score');
    const scoreCircle = document.getElementById('score-circle');
    
    if (statusIcon) {
        statusIcon.className = `status-icon ${analysis.riskLevel}`;
        const icons = {
            safe: 'fas fa-shield-alt',
            low: 'fas fa-exclamation-triangle',
            medium: 'fas fa-exclamation-triangle',
            high: 'fas fa-times-circle'
        };
        statusIcon.innerHTML = `<i class="${icons[analysis.riskLevel]}"></i>`;
    }
    
    if (resultTitle) {
        const titles = {
            safe: 'Safe',
            low: 'Low Risk',
            medium: 'Medium Risk',
            high: 'High Risk'
        };
        resultTitle.textContent = titles[analysis.riskLevel];
    }
    
    if (resultDescription) {
        resultDescription.textContent = analysis.description;
    }
    
    if (confidenceScore) {
        confidenceScore.textContent = `${analysis.confidence}%`;
    }
    
    if (scoreCircle) {
        const angle = (analysis.confidence / 100) * 360;
        scoreCircle.style.setProperty('--score-angle', `${angle}deg`);
    }
    
    // Update threat analysis
    updateThreatAnalysis(analysis);
    
    // Update suspicious words
    updateSuspiciousWords(analysis);
    
    // Update recommendations
    updateRecommendations(analysis);
}

// Update threat analysis section
function updateThreatAnalysis(analysis) {
    const threatList = document.getElementById('threat-list');
    
    if (!threatList) return;
    
    let threats = [];
    
    if (analysis.detectedPatterns.length > 0) {
        analysis.detectedPatterns.forEach(pattern => {
            threats.push(`${pattern.type} detected (${pattern.matches} instances)`);
        });
    }
    
    if (analysis.riskFactors.length > 0) {
        threats = threats.concat(analysis.riskFactors);
    }
    
    if (threats.length === 0) {
        threats.push('No significant threats detected');
    }
    
    threatList.innerHTML = threats.map(threat => 
        `<div class="threat-item">
            <i class="fas fa-info-circle"></i>
            <span>${threat}</span>
        </div>`
    ).join('');
}

// Update suspicious words section
function updateSuspiciousWords(analysis) {
    const suspiciousSection = document.getElementById('suspicious-section');
    const wordTags = document.getElementById('word-tags');
    
    if (!suspiciousSection || !wordTags) return;
    
    if (analysis.detectedKeywords.length > 0) {
        suspiciousSection.style.display = 'block';
        
        wordTags.innerHTML = analysis.detectedKeywords.map(item => 
            `<span class="word-tag ${item.level}">${item.keyword}</span>`
        ).join('');
    } else {
        suspiciousSection.style.display = 'none';
    }
}

// Update recommendations section
function updateRecommendations(analysis) {
    const recommendationList = document.getElementById('recommendation-list');
    
    if (!recommendationList) return;
    
    let recommendations = [];
    
    switch (analysis.riskLevel) {
        case 'safe':
            recommendations = [
                'This message appears safe, but always stay vigilant',
                'Verify sender identity if you don\'t recognize them',
                'Be cautious of any unexpected requests for information'
            ];
            break;
        case 'low':
            recommendations = [
                'Exercise normal caution with this message',
                'Verify any links before clicking them',
                'Don\'t provide personal information unless certain of sender'
            ];
            break;
        case 'medium':
            recommendations = [
                'Be very cautious with this message',
                'Do not click any links or download attachments',
                'Verify sender through alternative communication method',
                'Consider reporting this message as suspicious'
            ];
            break;
        case 'high':
            recommendations = [
                'Do not interact with this message',
                'Do not click links or download attachments',
                'Do not provide any personal information',
                'Report this message to relevant authorities',
                'Delete the message after reporting'
            ];
            break;
    }
    
    recommendationList.innerHTML = recommendations.map(rec => 
        `<li>${rec}</li>`
    ).join('');
}

// Clear message input
function clearMessage() {
    const messageInput = document.getElementById('message-input');
    const resultDiv = document.getElementById('detector-result');
    
    if (messageInput) {
        messageInput.value = '';
        messageInput.style.height = 'auto';
        updateInputStats();
        messageInput.focus();
    }
    
    if (resultDiv) {
        resultDiv.style.display = 'none';
    }
}

// Show demo message
function showDemo() {
    const messageInput = document.getElementById('message-input');
    
    if (!messageInput) return;
    
    const demoMessages = [
        "CONGRATULATIONS! You've won $1,000,000 in our lottery! Click here immediately to claim your prize before it expires! Send your bank details now!",
        "Your account has been temporarily suspended due to suspicious activity. Please verify your identity by clicking the link below and entering your password immediately.",
        "Hi John, I hope you're doing well. Just wanted to follow up on our meeting yesterday. Let me know when you're available to discuss the project details."
    ];
    
    const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
    messageInput.value = randomMessage;
    updateInputStats();
    
    // Auto-resize textarea
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 400) + 'px';
    
    // Scroll to textarea
    messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Initialize security tips
function initializeSecurityTips() {
    const refreshBtn = document.getElementById('refresh-tip');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', showRandomTip);
    }
    
    // Show initial tip
    showRandomTip();
}

// Show random security tip
function showRandomTip() {
    const tipElement = document.getElementById('security-tip');
    const categoryElement = document.getElementById('tip-category');
    
    if (!tipElement || !categoryElement) return;
    
    const randomTip = SECURITY_TIPS[Math.floor(Math.random() * SECURITY_TIPS.length)];
    
    tipElement.textContent = randomTip.tip;
    categoryElement.textContent = randomTip.category;
}

// Initialize counters
function initializeCounters() {
    updateCounters();
}

// Update statistics counters
function updateCounters() {
    animateCounter('messages-scanned', messagesScanned);
    animateCounter('threats-blocked', threatsBlocked);
}

// Animate counter
function animateCounter(elementId, targetValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = parseInt(element.textContent) || 0;
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

// Initialize smooth scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// Utility functions
function scrollToDetector() {
    const detector = document.getElementById('detector');
    if (detector) {
        detector.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="alert-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        color: #333;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${getAlertColor(type)};
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }
    }, 5000);
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getAlertColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#2563eb'
    };
    return colors[type] || '#2563eb';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .alert-close {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        padding: 0.25rem;
        border-radius: 0.25rem;
        transition: background-color 0.15s ease;
    }
    
    .alert-close:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);

// Initialize theme system
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
    
    showAlert(`Switched to ${newTheme} theme`, 'success');
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize 3D effects
function initialize3DEffects() {
    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const speed = scrolled * 0.5;
            hero.style.transform = `translateY(${speed}px)`;
        }
    });
    
    // Add mouse tracking for 3D tilt effect
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.detector-input, .detector-result, .feature-card');
        
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            } else {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            }
        });
    });
}

// Add CSS for light theme
const lightThemeCSS = `
[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --bg-tertiary: #f1f5f9;
    --bg-card: #ffffff;
    --bg-glass: rgba(255, 255, 255, 0.8);
    
    --text-primary: #1e293b;
    --text-secondary: #64748b;
    --text-muted: #94a3b8;
    
    --border-light: rgba(37, 99, 235, 0.2);
    --border-medium: rgba(37, 99, 235, 0.4);
    
    --card-gradient: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
    --hero-gradient: linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%);
    
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.2);
    --shadow-xl: 0 16px 32px rgba(0, 0, 0, 0.25);
}

[data-theme="light"] .navbar {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: var(--shadow-lg), 0 0 30px rgba(37, 99, 235, 0.1);
}
`;

// Inject light theme CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = lightThemeCSS;
document.head.appendChild(styleSheet);

// Export functions for global access
window.SecureMessageAI = {
    analyzeMessage,
    clearMessage,
    showDemo,
    scrollToDetector,
    showAlert,
    updateCounters,
    toggleTheme
};

console.log('SecureMessage AI - App.js loaded successfully!');
