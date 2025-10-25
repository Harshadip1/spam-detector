// Advanced Detector Integration

// Initialize advanced detector features
document.addEventListener('DOMContentLoaded', function() {
    initializeDetectorTabs();
    initializeAdvancedFeatures();
    enhanceSpamDetector();
    initializeEmailHeaderAnalyzer();
    initializeURLScanner();
});

// Initialize detector tabs
function initializeDetectorTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.detector-tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked button and corresponding tab
            this.classList.add('active');
            const targetTab = document.getElementById(`${tabId}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });
}

// Initialize advanced features
function initializeAdvancedFeatures() {
    // Word count for message input
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            updateWordCount(this.value);
            updateRealTimeAnalysis(this.value);
        });
    }
    
    // Header count for email input
    const emailInput = document.getElementById('email-header-input');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            updateHeaderCount(this.value);
        });
    }
    
    // URL validation
    const urlInput = document.getElementById('url-input');
    if (urlInput) {
        urlInput.addEventListener('input', function() {
            validateURL(this.value);
        });
    }
}

// Enhance existing spam detector with AI features
function enhanceSpamDetector() {
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
        // Replace existing click handler
        analyzeBtn.replaceWith(analyzeBtn.cloneNode(true));
        const newAnalyzeBtn = document.getElementById('analyze-btn');
        
        newAnalyzeBtn.addEventListener('click', function() {
            const messageText = document.getElementById('message-input').value;
            if (!messageText.trim()) {
                showAlert('Please enter a message to analyze.', 'warning');
                return;
            }
            
            performAdvancedAnalysis(messageText);
        });
    }
}

// Perform advanced AI analysis
async function performAdvancedAnalysis(text) {
    const analyzeBtn = document.getElementById('analyze-btn');
    const resultContainer = document.getElementById('analysis-result');
    
    // Show loading state
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
    analyzeBtn.disabled = true;
    
    try {
        // Use advanced AI classifier
        const result = classifySpamAdvanced(text);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Display results
        displayAdvancedResults(result);
        
        // Update statistics
        updateUserStatistics(result);
        
        // Show result container
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Analysis failed:', error);
        showAlert('Analysis failed. Please try again.', 'error');
    } finally {
        // Reset button
        analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Deep Analysis';
        analyzeBtn.disabled = false;
    }
}

// Display advanced analysis results
function displayAdvancedResults(result) {
    // Update classification
    const classificationElement = document.getElementById('result-classification');
    const descriptionElement = document.getElementById('result-description');
    const confidenceElement = document.getElementById('confidence-percentage');
    const iconElement = document.querySelector('.result-icon i');
    
    classificationElement.textContent = result.classification.toUpperCase();
    confidenceElement.textContent = result.confidence + '%';
    
    // Update colors and descriptions based on classification
    const resultHeader = document.querySelector('.result-header');
    resultHeader.className = 'result-header ' + result.classification;
    
    switch (result.classification) {
        case 'spam':
            descriptionElement.textContent = 'High-risk spam detected with multiple threat indicators';
            iconElement.className = 'fas fa-exclamation-triangle';
            break;
        case 'suspicious':
            descriptionElement.textContent = 'Potentially suspicious content requires careful review';
            iconElement.className = 'fas fa-exclamation-circle';
            break;
        case 'safe':
            descriptionElement.textContent = 'Message appears to be legitimate and safe';
            iconElement.className = 'fas fa-shield-check';
            break;
    }
    
    // Display threat categories
    displayThreatCategories(result.details.patterns);
    
    // Display suspicious words
    displaySuspiciousWords(result.details.patterns);
    
    // Display recommendations
    displayRecommendations(result);
}

// Display threat categories
function displayThreatCategories(patterns) {
    const categoriesContainer = document.getElementById('threat-categories');
    if (!categoriesContainer || patterns.length === 0) {
        document.getElementById('threat-analysis').style.display = 'none';
        return;
    }
    
    document.getElementById('threat-analysis').style.display = 'block';
    
    const categoriesHTML = patterns.map(pattern => {
        const percentage = Math.round((pattern.score / 5) * 100);
        return `
            <div class="threat-category">
                <div class="category-header">
                    <span class="category-name">${pattern.category.charAt(0).toUpperCase() + pattern.category.slice(1)}</span>
                    <span class="category-score">${percentage}%</span>
                </div>
                <div class="category-bar">
                    <div class="category-fill" style="width: ${percentage}%; background-color: ${pattern.color};"></div>
                </div>
                <div class="category-matches">
                    ${pattern.matches.length} indicator${pattern.matches.length !== 1 ? 's' : ''} found
                </div>
            </div>
        `;
    }).join('');
    
    categoriesContainer.innerHTML = categoriesHTML;
}

// Display suspicious words with highlighting
function displaySuspiciousWords(patterns) {
    const wordsContainer = document.getElementById('word-tags');
    const suspiciousSection = document.getElementById('suspicious-words');
    
    if (!patterns || patterns.length === 0) {
        suspiciousSection.style.display = 'none';
        return;
    }
    
    suspiciousSection.style.display = 'block';
    
    const allMatches = [];
    patterns.forEach(pattern => {
        pattern.matches.forEach(match => {
            match.positions.forEach(pos => {
                allMatches.push({
                    text: pos.text,
                    category: pattern.category,
                    color: pattern.color
                });
            });
        });
    });
    
    const tagsHTML = allMatches.map(match => 
        `<span class="word-tag" style="background-color: ${match.color}20; color: ${match.color}; border: 1px solid ${match.color};">
            ${match.text}
            <small>(${match.category})</small>
        </span>`
    ).join('');
    
    wordsContainer.innerHTML = tagsHTML;
}

// Display AI recommendations
function displayRecommendations(result) {
    const recommendationsList = document.getElementById('recommendation-list');
    const recommendations = [];
    
    switch (result.classification) {
        case 'spam':
            recommendations.push('🚫 Do not click any links or download attachments');
            recommendations.push('🗑️ Delete this message immediately');
            recommendations.push('📧 Report as spam to your email provider');
            recommendations.push('🔒 Check if your email account has been compromised');
            break;
        case 'suspicious':
            recommendations.push('⚠️ Exercise extreme caution with this message');
            recommendations.push('🔍 Verify sender identity through alternative means');
            recommendations.push('🚫 Avoid clicking links or providing personal information');
            recommendations.push('👥 Consult with IT security if in a corporate environment');
            break;
        case 'safe':
            recommendations.push('✅ Message appears legitimate and safe to read');
            recommendations.push('🔗 Links and attachments should be safe to access');
            recommendations.push('📱 You can proceed with normal interaction');
            if (result.confidence < 90) {
                recommendations.push('⚠️ Still exercise normal internet safety practices');
            }
            break;
    }
    
    recommendationsList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
}

// Initialize email header analyzer
function initializeEmailHeaderAnalyzer() {
    const analyzeHeaderBtn = document.getElementById('analyze-header-btn');
    const clearHeaderBtn = document.getElementById('clear-header-btn');
    
    if (analyzeHeaderBtn) {
        analyzeHeaderBtn.addEventListener('click', async function() {
            const headerText = document.getElementById('email-header-input').value;
            if (!headerText.trim()) {
                showAlert('Please paste email headers to analyze.', 'warning');
                return;
            }
            
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing Headers...';
            this.disabled = true;
            
            try {
                const result = analyzeEmailHeader(headerText);
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                displayHeaderResults(result);
                
                // Show result container
                const resultContainer = document.getElementById('header-analysis-result');
                resultContainer.style.display = 'block';
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
            } catch (error) {
                showAlert('Header analysis failed. Please try again.', 'error');
            } finally {
                this.innerHTML = '<i class="fas fa-envelope-open-text"></i> Analyze Headers';
                this.disabled = false;
            }
        });
    }
    
    if (clearHeaderBtn) {
        clearHeaderBtn.addEventListener('click', function() {
            document.getElementById('email-header-input').value = '';
            document.getElementById('header-analysis-result').style.display = 'none';
            updateHeaderCount('');
        });
    }
}

// Display header analysis results
function displayHeaderResults(result) {
    const classificationElement = document.getElementById('header-classification');
    const descriptionElement = document.getElementById('header-description');
    const confidenceElement = document.getElementById('header-confidence');
    const issuesList = document.getElementById('header-issues-list');
    
    // Update classification
    classificationElement.textContent = result.riskLevel.toUpperCase();
    confidenceElement.textContent = Math.max(0, 100 - result.score) + '%';
    
    // Update description
    const descriptions = {
        'high': 'Multiple security issues detected - high risk of spoofing or phishing',
        'medium': 'Some security concerns identified - proceed with caution',
        'low': 'Minor issues detected - generally appears legitimate',
        'safe': 'Headers appear legitimate with proper authentication',
        'unknown': 'Unable to analyze - insufficient header information'
    };
    
    descriptionElement.textContent = descriptions[result.riskLevel] || descriptions['unknown'];
    
    // Update result header class
    const resultHeader = document.querySelector('#header-analysis-result .result-header');
    resultHeader.className = 'result-header ' + (result.riskLevel === 'high' ? 'spam' : 
                                                  result.riskLevel === 'medium' ? 'suspicious' : 'safe');
    
    // Display issues
    issuesList.innerHTML = result.issues.map(issue => `<li>${issue}</li>`).join('');
}

// Initialize URL scanner
function initializeURLScanner() {
    const scanUrlBtn = document.getElementById('scan-url-btn');
    const clearUrlBtn = document.getElementById('clear-url-btn');
    
    if (scanUrlBtn) {
        scanUrlBtn.addEventListener('click', async function() {
            const url = document.getElementById('url-input').value;
            if (!url.trim()) {
                showAlert('Please enter a URL to scan.', 'warning');
                return;
            }
            
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning URL...';
            this.disabled = true;
            
            try {
                const result = await scanURL(url);
                
                displayURLResults(result, url);
                
                // Show result container
                const resultContainer = document.getElementById('url-analysis-result');
                resultContainer.style.display = 'block';
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
            } catch (error) {
                showAlert('URL scan failed. Please try again.', 'error');
            } finally {
                this.innerHTML = '<i class="fas fa-shield-alt"></i> Scan URL';
                this.disabled = false;
            }
        });
    }
    
    if (clearUrlBtn) {
        clearUrlBtn.addEventListener('click', function() {
            document.getElementById('url-input').value = '';
            document.getElementById('url-analysis-result').style.display = 'none';
            updateURLStatus('Ready to scan');
        });
    }
}

// Display URL scan results
function displayURLResults(result, url) {
    const classificationElement = document.getElementById('url-classification');
    const descriptionElement = document.getElementById('url-description');
    const confidenceElement = document.getElementById('url-confidence');
    const detailsList = document.getElementById('url-details-list');
    
    // Update classification
    const classification = result.safe ? 'SAFE' : result.risk.toUpperCase() + ' RISK';
    classificationElement.textContent = classification;
    confidenceElement.textContent = result.confidence + '%';
    
    // Update description
    const descriptions = {
        'high': 'High-risk URL detected - likely malicious or dangerous',
        'medium': 'Potentially risky URL - exercise caution before visiting',
        'low': 'Some risk indicators found - verify before proceeding',
        'invalid': 'Invalid URL format - cannot be analyzed'
    };
    
    if (result.safe) {
        descriptionElement.textContent = 'URL appears to be safe and legitimate';
    } else {
        descriptionElement.textContent = descriptions[result.risk] || 'Unknown risk level';
    }
    
    // Update result header class
    const resultHeader = document.querySelector('#url-analysis-result .result-header');
    resultHeader.className = 'result-header ' + (result.safe ? 'safe' : 
                                                  result.risk === 'high' ? 'spam' : 'suspicious');
    
    // Display details
    const details = [
        `URL: ${url}`,
        `Domain: ${extractDomain(url)}`,
        `Protocol: ${url.startsWith('https') ? 'HTTPS (Secure)' : 'HTTP (Unsecure)'}`,
        ...result.details
    ];
    
    detailsList.innerHTML = details.map(detail => `<li>${detail}</li>`).join('');
}

// Utility functions
function updateWordCount(text) {
    const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
    const wordCountElement = document.getElementById('word-count');
    if (wordCountElement) {
        wordCountElement.textContent = wordCount;
    }
}

function updateHeaderCount(text) {
    const headerCount = text.trim() ? text.split('\n').filter(line => line.includes(':')).length : 0;
    const headerCountElement = document.getElementById('header-count');
    if (headerCountElement) {
        headerCountElement.textContent = headerCount;
    }
}

function validateURL(url) {
    const statusElement = document.getElementById('url-status');
    if (!statusElement) return;
    
    if (!url.trim()) {
        updateURLStatus('Ready to scan');
        return;
    }
    
    try {
        new URL(url);
        updateURLStatus('Valid URL - ready to scan', 'success');
    } catch {
        updateURLStatus('Invalid URL format', 'error');
    }
}

function updateURLStatus(message, type = 'info') {
    const statusElement = document.getElementById('url-status');
    if (!statusElement) return;
    
    const icons = {
        info: 'fas fa-link',
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle'
    };
    
    const colors = {
        info: '#00d4ff',
        success: '#2ed573',
        error: '#ff4757'
    };
    
    statusElement.innerHTML = `
        <i class="${icons[type]}" style="color: ${colors[type]};"></i>
        <span>${message}</span>
    `;
}

function extractDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return 'Invalid URL';
    }
}

function updateRealTimeAnalysis(text) {
    if (text.length > 20) {
        const result = classifySpamAdvanced(text);
        highlightRiskyWords(text);
        
        // Update real-time confidence if element exists
        const realtimeScore = document.getElementById('realtime-score');
        if (realtimeScore) {
            showRealTimeScore(text);
        }
    }
}

// Update user statistics
function updateUserStatistics(result) {
    // Update localStorage statistics
    const userStats = Storage.get('userStats', {
        totalScans: 0,
        spamDetected: 0,
        safeMessages: 0,
        suspiciousMessages: 0
    });
    
    userStats.totalScans++;
    
    switch (result.classification) {
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
    
    // Log activity if function exists
    if (typeof logActivity === 'function') {
        const messagePreview = document.getElementById('message-input').value.substring(0, 50) + '...';
        logActivity('scan', `Analyzed message: "${messagePreview}" - Result: ${result.classification} (${result.confidence}% confidence)`, 'success');
    }
    
    // Update user stats if function exists
    if (typeof updateUserStats === 'function') {
        updateUserStats(userStats);
    }
    
    // Check achievements if function exists
    if (typeof checkAchievements === 'function') {
        checkAchievements();
    }
    
    // Update messages checked counter
    updateMessagesCount();
}
