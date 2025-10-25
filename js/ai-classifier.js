// Advanced AI Spam Classifier with TensorFlow.js

// Initialize TensorFlow.js model (simulated for demo)
let spamModel = null;
let isModelLoaded = false;

// Advanced spam patterns and weights
const ADVANCED_SPAM_PATTERNS = {
    // High-risk patterns
    financial: {
        patterns: ['lottery', 'winner', 'prize', 'million', 'inheritance', 'bank transfer', 'urgent payment'],
        weight: 0.9,
        color: '#ff4757'
    },
    phishing: {
        patterns: ['verify account', 'suspended', 'click here', 'update payment', 'confirm identity'],
        weight: 0.85,
        color: '#ff6b35'
    },
    urgency: {
        patterns: ['urgent', 'immediate', 'expires today', 'limited time', 'act now', 'hurry'],
        weight: 0.7,
        color: '#ffd700'
    },
    // Medium-risk patterns
    promotional: {
        patterns: ['free', 'discount', 'offer', 'deal', 'sale', 'promotion', 'limited offer'],
        weight: 0.5,
        color: '#ff9f43'
    },
    suspicious: {
        patterns: ['no obligation', 'risk free', 'guarantee', 'easy money', 'work from home'],
        weight: 0.6,
        color: '#ff7675'
    },
    // Technical indicators
    technical: {
        patterns: ['bit.ly', 'tinyurl', 'suspicious-domain.com', 'temp-email'],
        weight: 0.8,
        color: '#e17055'
    }
};

// Email header suspicious patterns
const EMAIL_HEADER_PATTERNS = {
    spoofing: [
        /From:.*<.*@(?!.*gmail\.com|.*yahoo\.com|.*outlook\.com)/i,
        /Reply-To:.*@(?!.*gmail\.com|.*yahoo\.com|.*outlook\.com)/i
    ],
    suspicious_domains: [
        /\.tk$/i, /\.ml$/i, /\.ga$/i, /\.cf$/i, // Free domains
        /temp-mail/i, /10minutemail/i, /guerrillamail/i // Temporary email services
    ],
    encoding_tricks: [
        /=\?UTF-8\?B\?/i, // Base64 encoding in headers
        /=\?UTF-8\?Q\?/i  // Quoted-printable encoding
    ]
};

// URL patterns for safety checking
const MALICIOUS_URL_PATTERNS = [
    /bit\.ly/i, /tinyurl/i, /t\.co/i, // URL shorteners
    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/i, // IP addresses
    /\.tk$/i, /\.ml$/i, /\.ga$/i, /\.cf$/i, // Suspicious TLDs
    /phishing|malware|virus|trojan/i // Obvious malicious terms
];

// Initialize AI classifier
async function initializeAIClassifier() {
    try {
        // Simulate TensorFlow.js model loading
        showLoadingStatus('Loading AI model...');
        
        // In a real implementation, you would load a pre-trained model:
        // spamModel = await tf.loadLayersModel('/models/spam-classifier/model.json');
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        isModelLoaded = true;
        showLoadingStatus('AI model loaded successfully!', 'success');
        
        // Initialize real-time analyzer
        initializeRealTimeAnalyzer();
        
    } catch (error) {
        console.error('Failed to load AI model:', error);
        showLoadingStatus('Using fallback classification system', 'warning');
        isModelLoaded = false;
    }
}

// Advanced spam classification with confidence scoring
function classifySpamAdvanced(text) {
    if (!text || text.trim().length === 0) {
        return {
            classification: 'safe',
            confidence: 0,
            details: {
                patterns: [],
                riskFactors: [],
                technicalScore: 0
            }
        };
    }
    
    const lowerText = text.toLowerCase();
    let totalScore = 0;
    let maxCategoryScore = 0;
    const detectedPatterns = [];
    const riskFactors = [];
    
    // Analyze against advanced patterns
    Object.entries(ADVANCED_SPAM_PATTERNS).forEach(([category, data]) => {
        let categoryScore = 0;
        const categoryMatches = [];
        
        data.patterns.forEach(pattern => {
            const regex = new RegExp(pattern, 'gi');
            const matches = text.match(regex);
            if (matches) {
                const patternScore = matches.length * data.weight;
                categoryScore += patternScore;
                categoryMatches.push({
                    pattern,
                    matches: matches.length,
                    positions: getPatternPositions(text, pattern)
                });
            }
        });
        
        if (categoryScore > 0) {
            totalScore += categoryScore;
            maxCategoryScore = Math.max(maxCategoryScore, categoryScore);
            detectedPatterns.push({
                category,
                score: categoryScore,
                matches: categoryMatches,
                color: data.color
            });
            riskFactors.push(`${category.charAt(0).toUpperCase() + category.slice(1)} indicators detected`);
        }
    });
    
    // Technical analysis
    const technicalScore = analyzeTechnicalIndicators(text);
    totalScore += technicalScore;
    
    // Normalize confidence score (0-100)
    const confidence = Math.min(Math.round((totalScore / 5) * 100), 100);
    
    // Determine classification
    let classification;
    if (confidence >= 80) {
        classification = 'spam';
    } else if (confidence >= 40) {
        classification = 'suspicious';
    } else {
        classification = 'safe';
    }
    
    return {
        classification,
        confidence,
        details: {
            patterns: detectedPatterns,
            riskFactors,
            technicalScore,
            totalScore
        }
    };
}

// Analyze technical indicators
function analyzeTechnicalIndicators(text) {
    let score = 0;
    
    // Check for excessive capitalization
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.3) score += 0.5;
    
    // Check for excessive punctuation
    const punctRatio = (text.match(/[!?]{2,}/g) || []).length;
    if (punctRatio > 0) score += 0.3;
    
    // Check for suspicious URLs
    const urlMatches = text.match(/https?:\/\/[^\s]+/g) || [];
    urlMatches.forEach(url => {
        MALICIOUS_URL_PATTERNS.forEach(pattern => {
            if (pattern.test(url)) score += 0.8;
        });
    });
    
    // Check for phone numbers (potential scam indicator)
    const phonePattern = /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g;
    if (phonePattern.test(text)) score += 0.3;
    
    return score;
}

// Get pattern positions for highlighting
function getPatternPositions(text, pattern) {
    const positions = [];
    const regex = new RegExp(pattern, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
        positions.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
        });
    }
    
    return positions;
}

// Real-time message analyzer
function initializeRealTimeAnalyzer() {
    const messageInput = document.getElementById('message-input');
    if (!messageInput) return;
    
    let analysisTimeout;
    
    messageInput.addEventListener('input', function() {
        clearTimeout(analysisTimeout);
        
        // Debounce analysis
        analysisTimeout = setTimeout(() => {
            const text = this.value;
            if (text.length > 10) {
                highlightRiskyWords(text);
                showRealTimeScore(text);
            } else {
                clearHighlights();
            }
        }, 300);
    });
    
    // Add real-time indicator
    const indicator = document.createElement('div');
    indicator.id = 'realtime-indicator';
    indicator.className = 'realtime-indicator';
    indicator.innerHTML = `
        <div class="indicator-content">
            <i class="fas fa-brain"></i>
            <span>AI Analysis Active</span>
            <div class="pulse-dot"></div>
        </div>
    `;
    messageInput.parentNode.insertBefore(indicator, messageInput.nextSibling);
}

// Highlight risky words in real-time
function highlightRiskyWords(text) {
    const result = classifySpamAdvanced(text);
    const highlightContainer = document.getElementById('highlight-overlay') || createHighlightOverlay();
    
    let highlightedText = text;
    const highlights = [];
    
    // Collect all patterns to highlight
    result.details.patterns.forEach(patternGroup => {
        patternGroup.matches.forEach(match => {
            match.positions.forEach(pos => {
                highlights.push({
                    start: pos.start,
                    end: pos.end,
                    color: patternGroup.color,
                    category: patternGroup.category
                });
            });
        });
    });
    
    // Sort highlights by position (reverse order for proper replacement)
    highlights.sort((a, b) => b.start - a.start);
    
    // Apply highlights
    highlights.forEach(highlight => {
        const before = highlightedText.substring(0, highlight.start);
        const highlighted = highlightedText.substring(highlight.start, highlight.end);
        const after = highlightedText.substring(highlight.end);
        
        highlightedText = before + 
            `<span class="risk-highlight" style="background-color: ${highlight.color}20; color: ${highlight.color}; border-bottom: 2px solid ${highlight.color};" title="${highlight.category} indicator">${highlighted}</span>` + 
            after;
    });
    
    highlightContainer.innerHTML = highlightedText;
}

// Create highlight overlay
function createHighlightOverlay() {
    const messageInput = document.getElementById('message-input');
    const container = messageInput.parentNode;
    
    const overlay = document.createElement('div');
    overlay.id = 'highlight-overlay';
    overlay.className = 'highlight-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 1rem;
        pointer-events: none;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        color: transparent;
        z-index: 1;
        border-radius: var(--radius-md);
    `;
    
    // Make container relative
    container.style.position = 'relative';
    messageInput.style.background = 'transparent';
    messageInput.style.position = 'relative';
    messageInput.style.zIndex = '2';
    
    container.insertBefore(overlay, messageInput);
    return overlay;
}

// Show real-time confidence score
function showRealTimeScore(text) {
    const result = classifySpamAdvanced(text);
    const scoreIndicator = document.getElementById('realtime-score') || createScoreIndicator();
    
    const color = result.classification === 'spam' ? '#ff4757' : 
                  result.classification === 'suspicious' ? '#ffd700' : '#2ed573';
    
    scoreIndicator.innerHTML = `
        <div class="score-content">
            <div class="score-circle" style="border-color: ${color};">
                <span class="score-number" style="color: ${color};">${result.confidence}%</span>
            </div>
            <div class="score-label">
                <span class="classification ${result.classification}">${result.classification.toUpperCase()}</span>
                <span class="confidence">Confidence: ${result.confidence}%</span>
            </div>
        </div>
    `;
}

// Create score indicator
function createScoreIndicator() {
    const container = document.querySelector('.spam-detector');
    const indicator = document.createElement('div');
    indicator.id = 'realtime-score';
    indicator.className = 'realtime-score';
    
    const inputContainer = document.querySelector('.input-container');
    inputContainer.appendChild(indicator);
    
    return indicator;
}

// Clear highlights and indicators
function clearHighlights() {
    const overlay = document.getElementById('highlight-overlay');
    const scoreIndicator = document.getElementById('realtime-score');
    
    if (overlay) overlay.innerHTML = '';
    if (scoreIndicator) scoreIndicator.innerHTML = '';
}

// Email header analyzer
function analyzeEmailHeader(headerText) {
    if (!headerText || headerText.trim().length === 0) {
        return {
            riskLevel: 'unknown',
            issues: ['No header data provided'],
            score: 0,
            details: {}
        };
    }
    
    const issues = [];
    let riskScore = 0;
    const details = {
        sender: null,
        replyTo: null,
        domains: [],
        encoding: [],
        routing: []
    };
    
    // Extract sender information
    const fromMatch = headerText.match(/From:\s*(.+)/i);
    if (fromMatch) {
        details.sender = fromMatch[1].trim();
        
        // Check for domain spoofing
        EMAIL_HEADER_PATTERNS.spoofing.forEach(pattern => {
            if (pattern.test(fromMatch[1])) {
                issues.push('Potential sender spoofing detected');
                riskScore += 30;
            }
        });
    }
    
    // Check for suspicious domains
    EMAIL_HEADER_PATTERNS.suspicious_domains.forEach(pattern => {
        if (pattern.test(headerText)) {
            issues.push('Suspicious domain detected');
            riskScore += 25;
        }
    });
    
    // Check for encoding tricks
    EMAIL_HEADER_PATTERNS.encoding_tricks.forEach(pattern => {
        if (pattern.test(headerText)) {
            issues.push('Suspicious encoding detected');
            riskScore += 20;
        }
    });
    
    // Check for missing SPF/DKIM
    if (!headerText.includes('SPF') && !headerText.includes('spf')) {
        issues.push('Missing SPF authentication');
        riskScore += 15;
    }
    
    if (!headerText.includes('DKIM') && !headerText.includes('dkim')) {
        issues.push('Missing DKIM signature');
        riskScore += 15;
    }
    
    // Determine risk level
    let riskLevel;
    if (riskScore >= 60) {
        riskLevel = 'high';
    } else if (riskScore >= 30) {
        riskLevel = 'medium';
    } else if (riskScore > 0) {
        riskLevel = 'low';
    } else {
        riskLevel = 'safe';
    }
    
    return {
        riskLevel,
        issues: issues.length > 0 ? issues : ['No significant issues detected'],
        score: riskScore,
        details
    };
}

// URL safety scanner
async function scanURL(url) {
    if (!url || !isValidURL(url)) {
        return {
            safe: false,
            risk: 'invalid',
            details: ['Invalid URL format'],
            confidence: 0
        };
    }
    
    const risks = [];
    let riskScore = 0;
    
    // Check against malicious patterns
    MALICIOUS_URL_PATTERNS.forEach(pattern => {
        if (pattern.test(url)) {
            risks.push(`Matches suspicious pattern: ${pattern.source}`);
            riskScore += 25;
        }
    });
    
    // Check for URL shorteners
    if (/bit\.ly|tinyurl|t\.co|goo\.gl/i.test(url)) {
        risks.push('URL shortener detected - destination unknown');
        riskScore += 30;
    }
    
    // Check for suspicious TLDs
    if (/\.(tk|ml|ga|cf|click|download)$/i.test(url)) {
        risks.push('Suspicious top-level domain');
        riskScore += 20;
    }
    
    // Check for IP addresses instead of domains
    if (/https?:\/\/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(url)) {
        risks.push('Direct IP address instead of domain name');
        riskScore += 35;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const safe = riskScore < 30;
    const risk = riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    
    return {
        safe,
        risk,
        details: risks.length > 0 ? risks : ['No significant risks detected'],
        confidence: Math.min(100, riskScore + 20)
    };
}

// Utility functions
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showLoadingStatus(message, type = 'info') {
    const statusElement = document.getElementById('ai-status') || createStatusElement();
    const colors = {
        info: '#00d4ff',
        success: '#2ed573',
        warning: '#ffd700',
        error: '#ff4757'
    };
    
    statusElement.innerHTML = `
        <div class="status-content" style="color: ${colors[type]};">
            <i class="fas fa-${type === 'info' ? 'spinner fa-spin' : type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.opacity = '0';
            setTimeout(() => statusElement.remove(), 300);
        }, 3000);
    }
}

function createStatusElement() {
    const status = document.createElement('div');
    status.id = 'ai-status';
    status.className = 'ai-status';
    status.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: var(--card-bg);
        padding: 1rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-md);
        border: 1px solid rgba(0, 212, 255, 0.3);
        z-index: 1001;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(status);
    return status;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAIClassifier();
});

// Export functions for global use
window.classifySpamAdvanced = classifySpamAdvanced;
window.analyzeEmailHeader = analyzeEmailHeader;
window.scanURL = scanURL;
