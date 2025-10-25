// Spam Detection JavaScript

// Spam keywords database
const SPAM_KEYWORDS = {
    high: [
        'congratulations', 'winner', 'lottery', 'prize', 'jackpot', 'million', 'billion',
        'inheritance', 'beneficiary', 'urgent', 'immediate', 'act now', 'limited time',
        'click here', 'download now', 'free money', 'cash prize', 'guaranteed',
        'no risk', 'risk free', 'amazing deal', 'incredible offer', 'once in lifetime',
        'nigerian prince', 'transfer funds', 'wire transfer', 'western union',
        'verify account', 'suspended account', 'confirm identity', 'update payment',
        'phishing', 'malware', 'virus', 'trojan', 'ransomware'
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

// Suspicious patterns
const SUSPICIOUS_PATTERNS = [
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/, // Credit card numbers
    /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/, // SSN patterns
    /\b[A-Z]{2}\d{6,8}\b/, // Account numbers
    /https?:\/\/[^\s]+/gi, // URLs
    /\b\w+@\w+\.\w+\b/gi, // Email addresses
    /\$\d+(?:,\d{3})*(?:\.\d{2})?/g, // Money amounts
    /\b(?:call|text|sms)\s+(?:now|today|immediately)\b/gi,
    /\b(?:act|respond|reply)\s+(?:now|today|immediately|fast|quick)\b/gi
];

// Initialize spam detector
document.addEventListener('DOMContentLoaded', function() {
    initializeSpamDetector();
});

function initializeSpamDetector() {
    const checkButton = document.getElementById('analyze-btn');
    const clearButton = document.getElementById('clear-btn');
    const messageInput = document.getElementById('message-input');
    
    // Also handle other tab buttons
    const headerAnalyzeBtn = document.getElementById('analyze-header-btn');
    const urlScanBtn = document.getElementById('scan-url-btn');
    const clearHeaderBtn = document.getElementById('clear-header-btn');
    const clearUrlBtn = document.getElementById('clear-url-btn');
    
    if (checkButton) {
        checkButton.addEventListener('click', analyzeMessage);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearMessage);
    }
    
    if (headerAnalyzeBtn) {
        headerAnalyzeBtn.addEventListener('click', analyzeEmailHeader);
    }
    
    if (urlScanBtn) {
        urlScanBtn.addEventListener('click', analyzeURL);
    }
    
    if (clearHeaderBtn) {
        clearHeaderBtn.addEventListener('click', clearEmailHeader);
    }
    
    if (clearUrlBtn) {
        clearUrlBtn.addEventListener('click', clearURL);
    }
    
    if (messageInput) {
        // Real-time word highlighting
        messageInput.addEventListener('input', debounce(highlightSuspiciousWords, 300));
        
        // Word counter for textarea
        messageInput.addEventListener('input', updateWordCount);
    }
    
    // Setup tab switching
    setupTabSwitching();
}

// Main spam analysis function
function analyzeMessage() {
    const messageInput = document.getElementById('message-input');
    const resultsSection = document.getElementById('analysis-result');
    const checkButton = document.getElementById('analyze-btn');
    
    if (!messageInput || !resultsSection) return;
    
    const message = messageInput.value.trim();
    
    if (!message) {
        showAlert('Please enter a message to analyze.', 'warning');
        return;
    }
    
    // Show loading state
    checkButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    checkButton.disabled = true;
    
    // Simulate AI processing delay
    setTimeout(() => {
        const analysis = performSpamAnalysis(message);
        displayResults(analysis);
        
        // Reset button
        checkButton.innerHTML = '<i class="fas fa-search"></i> Deep Analysis';
        checkButton.disabled = false;
        
        // Show results section with animation
        resultsSection.style.display = 'block';
        resultsSection.style.opacity = '0';
        resultsSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            resultsSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            resultsSection.style.opacity = '1';
            resultsSection.style.transform = 'translateY(0)';
        }, 100);
        
        // Increment counter
        incrementMessagesCount();
        
        // Update user stats if logged in
        updateUserStats(analysis);
        
    }, 1500); // Simulate processing time
}

// Perform spam analysis
function performSpamAnalysis(message) {
    const lowerMessage = message.toLowerCase();
    let spamScore = 0;
    let suspiciousWords = [];
    let patterns = [];
    
    // Check for spam keywords
    SPAM_KEYWORDS.high.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            spamScore += 3;
            suspiciousWords.push({ word: keyword, severity: 'high' });
        }
    });
    
    SPAM_KEYWORDS.medium.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            spamScore += 2;
            suspiciousWords.push({ word: keyword, severity: 'medium' });
        }
    });
    
    SPAM_KEYWORDS.low.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            spamScore += 1;
            suspiciousWords.push({ word: keyword, severity: 'low' });
        }
    });
    
    // Check for suspicious patterns
    SUSPICIOUS_PATTERNS.forEach((pattern, index) => {
        const matches = message.match(pattern);
        if (matches) {
            spamScore += 2;
            patterns.push({
                type: getPatternType(index),
                matches: matches.length
            });
        }
    });
    
    // Additional heuristics
    const urgencyWords = ['urgent', 'immediate', 'now', 'today', 'asap', 'quickly'];
    const urgencyCount = urgencyWords.filter(word => lowerMessage.includes(word)).length;
    spamScore += urgencyCount * 1.5;
    
    // Excessive punctuation
    const exclamationCount = (message.match(/!/g) || []).length;
    const questionCount = (message.match(/\?/g) || []).length;
    if (exclamationCount > 3 || questionCount > 3) {
        spamScore += 2;
    }
    
    // All caps detection
    const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (capsRatio > 0.3 && message.length > 20) {
        spamScore += 2;
    }
    
    // Determine classification
    let classification, confidence;
    if (spamScore >= 8) {
        classification = 'spam';
        confidence = Math.min(95 + (spamScore - 8) * 2, 99);
    } else if (spamScore >= 4) {
        classification = 'suspicious';
        confidence = 60 + (spamScore - 4) * 8;
    } else {
        classification = 'safe';
        confidence = Math.max(85 - spamScore * 10, 70);
    }
    
    return {
        classification,
        confidence,
        spamScore,
        suspiciousWords: suspiciousWords.slice(0, 10), // Limit to 10 words
        patterns,
        message: message
    };
}

// Display analysis results
function displayResults(analysis) {
    const resultIcon = document.querySelector('#analysis-result .result-icon');
    const resultTitle = document.getElementById('result-classification');
    const resultDescription = document.getElementById('result-description');
    const confidenceText = document.getElementById('confidence-percentage');
    const suspiciousWordsSection = document.getElementById('suspicious-words');
    const wordTags = document.getElementById('word-tags');
    const threatCategories = document.getElementById('threat-categories');
    const recommendationsList = document.getElementById('recommendation-list');
    
    if (!resultTitle) return;
    
    // Set classification-specific content
    switch (analysis.classification) {
        case 'safe':
            if (resultIcon) resultIcon.innerHTML = '<i class="fas fa-shield-alt"></i>';
            resultTitle.textContent = 'Safe';
            if (resultDescription) resultDescription.textContent = 'This message appears to be legitimate and safe. No significant spam indicators detected.';
            break;
            
        case 'suspicious':
            if (resultIcon) resultIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            resultTitle.textContent = 'Suspicious';
            if (resultDescription) resultDescription.textContent = 'This message contains some suspicious elements. Exercise caution and verify the sender before taking any action.';
            break;
            
        case 'spam':
            if (resultIcon) resultIcon.innerHTML = '<i class="fas fa-ban"></i>';
            resultTitle.textContent = 'Spam Detected';
            if (resultDescription) resultDescription.textContent = 'This message is likely spam or a phishing attempt. Do not click any links or provide personal information.';
            break;
    }
    
    // Update confidence percentage
    if (confidenceText) {
        confidenceText.textContent = `${Math.round(analysis.confidence)}%`;
    }
    
    // Show suspicious words if any
    if (analysis.suspiciousWords.length > 0 && suspiciousWordsSection && wordTags) {
        suspiciousWordsSection.style.display = 'block';
        wordTags.innerHTML = '';
        
        analysis.suspiciousWords.forEach(item => {
            const tag = document.createElement('span');
            tag.className = `word-tag ${item.severity}`;
            tag.textContent = item.word;
            tag.style.cssText = `
                display: inline-block;
                padding: 4px 8px;
                margin: 2px;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 500;
                background: ${item.severity === 'high' ? '#ff4757' : item.severity === 'medium' ? '#ffa502' : '#2ed573'};
                color: white;
            `;
            wordTags.appendChild(tag);
        });
    } else if (suspiciousWordsSection) {
        suspiciousWordsSection.style.display = 'none';
    }
    
    // Add threat categories
    if (threatCategories) {
        threatCategories.innerHTML = '';
        const categories = [];
        
        if (analysis.patterns.length > 0) {
            analysis.patterns.forEach(pattern => {
                categories.push(`${pattern.type} (${pattern.matches} found)`);
            });
        }
        
        if (categories.length > 0) {
            categories.forEach(category => {
                const div = document.createElement('div');
                div.textContent = category;
                div.style.cssText = `
                    padding: 8px 12px;
                    margin: 4px 0;
                    background: rgba(255, 71, 87, 0.1);
                    border-left: 3px solid #ff4757;
                    border-radius: 4px;
                `;
                threatCategories.appendChild(div);
            });
        } else {
            threatCategories.innerHTML = '<p style="color: #2ed573;">No specific threats detected</p>';
        }
    }
    
    // Add recommendations
    if (recommendationsList) {
        recommendationsList.innerHTML = '';
        const recommendations = getRecommendations(analysis);
        
        recommendations.forEach(rec => {
            const li = document.createElement('li');
            li.textContent = rec;
            li.style.marginBottom = '8px';
            recommendationsList.appendChild(li);
        });
    }
}

// Clear message and results
function clearMessage() {
    const messageInput = document.getElementById('message-input');
    const resultsSection = document.getElementById('analysis-result');
    
    if (messageInput) {
        messageInput.value = '';
        messageInput.focus();
    }
    
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
    
    // Clear word count
    updateWordCount();
}

// Highlight suspicious words in real-time
function highlightSuspiciousWords() {
    const messageInput = document.getElementById('message-input');
    if (!messageInput) return;
    
    const message = messageInput.value.toLowerCase();
    let foundWords = [];
    
    // Check for suspicious words
    [...SPAM_KEYWORDS.high, ...SPAM_KEYWORDS.medium].forEach(keyword => {
        if (message.includes(keyword)) {
            foundWords.push(keyword);
        }
    });
    
    // Update input styling based on found words
    if (foundWords.length > 0) {
        messageInput.style.borderColor = 'var(--warning-color)';
        messageInput.style.boxShadow = '0 0 0 3px rgba(255, 215, 0, 0.2)';
    } else {
        messageInput.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        messageInput.style.boxShadow = 'none';
    }
}

// Update word count
function updateWordCount() {
    const messageInput = document.getElementById('message-input');
    const wordCount = document.getElementById('word-count');
    
    if (messageInput && wordCount) {
        const text = messageInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCount.textContent = words;
        
        // Change color based on word count
        if (words > 200) {
            wordCount.style.color = 'var(--danger-color)';
        } else if (words > 100) {
            wordCount.style.color = 'var(--warning-color)';
        } else {
            wordCount.style.color = 'var(--text-secondary)';
        }
    }
}

// Get pattern type for display
function getPatternType(index) {
    const types = [
        'Credit Card Number',
        'Social Security Number',
        'Account Number',
        'Suspicious URL',
        'Email Address',
        'Money Amount',
        'Urgent Call-to-Action',
        'Immediate Response Request'
    ];
    return types[index] || 'Suspicious Pattern';
}

// Update user statistics
function updateUserStats(analysis) {
    const user = getCurrentUser();
    if (!user) return;
    
    let userStats = Storage.get('userStats', {
        totalScans: 0,
        spamDetected: 0,
        safeMessages: 0,
        suspiciousMessages: 0
    });
    
    userStats.totalScans++;
    
    switch (analysis.classification) {
        case 'spam':
            userStats.spamDetected++;
            break;
        case 'suspicious':
            userStats.suspiciousMessages++;
            break;
        case 'safe':
            userStats.safeMessages++;
            break;
    }
    
    Storage.set('userStats', userStats);
}

// Get recommendations based on analysis
function getRecommendations(analysis) {
    const recommendations = [];
    
    switch (analysis.classification) {
        case 'spam':
            recommendations.push('Do not click any links in this message');
            recommendations.push('Do not provide personal or financial information');
            recommendations.push('Delete this message immediately');
            recommendations.push('Report this as spam to your email provider');
            break;
            
        case 'suspicious':
            recommendations.push('Verify the sender through a separate communication channel');
            recommendations.push('Be cautious with any links or attachments');
            recommendations.push('Do not provide sensitive information without verification');
            recommendations.push('Consider marking as spam if sender is unknown');
            break;
            
        case 'safe':
            recommendations.push('Message appears legitimate and safe to read');
            recommendations.push('Still exercise caution with links from unknown senders');
            recommendations.push('Verify sender identity if requesting sensitive information');
            break;
    }
    
    return recommendations;
}

// Setup tab switching functionality
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.detector-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            button.classList.add('active');
            const targetTabElement = document.getElementById(`${targetTab}-tab`);
            if (targetTabElement) {
                targetTabElement.classList.add('active');
            }
        });
    });
}

// Email header analysis function
function analyzeEmailHeader() {
    const headerInput = document.getElementById('email-header-input');
    const resultsSection = document.getElementById('header-analysis-result');
    const analyzeButton = document.getElementById('analyze-header-btn');
    
    if (!headerInput || !resultsSection) return;
    
    const headers = headerInput.value.trim();
    if (!headers) {
        showAlert('Please enter email headers to analyze.', 'warning');
        return;
    }
    
    // Show loading state
    analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeButton.disabled = true;
    
    setTimeout(() => {
        // Simple header analysis
        const analysis = analyzeHeaders(headers);
        displayHeaderResults(analysis);
        
        // Reset button
        analyzeButton.innerHTML = '<i class="fas fa-envelope-open-text"></i> Analyze Headers';
        analyzeButton.disabled = false;
        
        // Show results
        resultsSection.style.display = 'block';
    }, 1000);
}

// URL analysis function
function analyzeURL() {
    const urlInput = document.getElementById('url-input');
    const resultsSection = document.getElementById('url-analysis-result');
    const scanButton = document.getElementById('scan-url-btn');
    
    if (!urlInput || !resultsSection) return;
    
    const url = urlInput.value.trim();
    if (!url) {
        showAlert('Please enter a URL to scan.', 'warning');
        return;
    }
    
    // Show loading state
    scanButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
    scanButton.disabled = true;
    
    setTimeout(() => {
        // Simple URL analysis
        const analysis = analyzeURLSafety(url);
        displayURLResults(analysis);
        
        // Reset button
        scanButton.innerHTML = '<i class="fas fa-shield-alt"></i> Scan URL';
        scanButton.disabled = false;
        
        // Show results
        resultsSection.style.display = 'block';
    }, 1000);
}

// Clear email header function
function clearEmailHeader() {
    const headerInput = document.getElementById('email-header-input');
    const resultsSection = document.getElementById('header-analysis-result');
    
    if (headerInput) {
        headerInput.value = '';
        headerInput.focus();
    }
    
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
}

// Clear URL function
function clearURL() {
    const urlInput = document.getElementById('url-input');
    const resultsSection = document.getElementById('url-analysis-result');
    
    if (urlInput) {
        urlInput.value = '';
        urlInput.focus();
    }
    
    if (resultsSection) {
        resultsSection.style.display = 'none';
    }
}

// Simple header analysis
function analyzeHeaders(headers) {
    const issues = [];
    let riskLevel = 'safe';
    
    // Check for common spoofing indicators
    if (headers.toLowerCase().includes('received: from') && 
        headers.toLowerCase().includes('by') && 
        !headers.toLowerCase().includes('spf=pass')) {
        issues.push('SPF validation may have failed');
        riskLevel = 'suspicious';
    }
    
    if (headers.toLowerCase().includes('return-path:') && 
        headers.toLowerCase().includes('from:')) {
        const returnPath = headers.match(/return-path:\s*([^\n\r]+)/i);
        const fromHeader = headers.match(/from:\s*([^\n\r]+)/i);
        
        if (returnPath && fromHeader && 
            !returnPath[1].toLowerCase().includes(fromHeader[1].toLowerCase().split('@')[1])) {
            issues.push('Return-Path domain differs from From domain');
            riskLevel = 'suspicious';
        }
    }
    
    return {
        classification: riskLevel,
        confidence: riskLevel === 'safe' ? 85 : 65,
        issues: issues
    };
}

// Simple URL analysis
function analyzeURLSafety(url) {
    const suspiciousDomains = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co'];
    const phishingKeywords = ['secure', 'verify', 'update', 'confirm', 'login'];
    
    let riskLevel = 'safe';
    let confidence = 90;
    const details = [];
    
    try {
        const urlObj = new URL(url);
        
        // Check for suspicious domains
        if (suspiciousDomains.some(domain => urlObj.hostname.includes(domain))) {
            riskLevel = 'suspicious';
            confidence = 60;
            details.push('Uses URL shortening service');
        }
        
        // Check for phishing keywords
        if (phishingKeywords.some(keyword => url.toLowerCase().includes(keyword))) {
            riskLevel = 'suspicious';
            confidence = Math.min(confidence, 70);
            details.push('Contains phishing-related keywords');
        }
        
        // Check for HTTPS
        if (urlObj.protocol === 'http:') {
            details.push('Uses insecure HTTP protocol');
            confidence = Math.min(confidence, 75);
        } else {
            details.push('Uses secure HTTPS protocol');
        }
        
        // Check domain structure
        if (urlObj.hostname.split('.').length > 3) {
            riskLevel = 'suspicious';
            confidence = Math.min(confidence, 65);
            details.push('Suspicious subdomain structure');
        }
        
    } catch (error) {
        riskLevel = 'spam';
        confidence = 30;
        details.push('Invalid URL format');
    }
    
    return {
        classification: riskLevel,
        confidence: confidence,
        details: details
    };
}

// Display header results
function displayHeaderResults(analysis) {
    const classification = document.getElementById('header-classification');
    const description = document.getElementById('header-description');
    const confidence = document.getElementById('header-confidence');
    const issuesList = document.getElementById('header-issues-list');
    
    if (classification) classification.textContent = analysis.classification.charAt(0).toUpperCase() + analysis.classification.slice(1);
    if (description) description.textContent = `Email headers appear ${analysis.classification}`;
    if (confidence) confidence.textContent = `${Math.round(analysis.confidence)}%`;
    
    if (issuesList) {
        issuesList.innerHTML = '';
        if (analysis.issues.length > 0) {
            analysis.issues.forEach(issue => {
                const li = document.createElement('li');
                li.textContent = issue;
                issuesList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No security issues detected';
            li.style.color = '#2ed573';
            issuesList.appendChild(li);
        }
    }
}

// Display URL results
function displayURLResults(analysis) {
    const classification = document.getElementById('url-classification');
    const description = document.getElementById('url-description');
    const confidence = document.getElementById('url-confidence');
    const detailsList = document.getElementById('url-details-list');
    
    if (classification) classification.textContent = analysis.classification.charAt(0).toUpperCase() + analysis.classification.slice(1);
    if (description) description.textContent = `URL appears to be ${analysis.classification}`;
    if (confidence) confidence.textContent = `${Math.round(analysis.confidence)}%`;
    
    if (detailsList) {
        detailsList.innerHTML = '';
        analysis.details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            detailsList.appendChild(li);
        });
    }
}

// Debounce function (if not available from main.js)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
