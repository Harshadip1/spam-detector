// FAQ Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeFAQ();
    loadFAQs();
    setupSearch();
    setupCategoryFilters();
});

// FAQ Database
const FAQ_DATA = [
    // Spam Detection
    {
        id: 1,
        category: 'spam',
        question: 'How does SecureMessage AI detect spam?',
        answer: 'Our AI uses advanced machine learning algorithms to analyze multiple factors including sender reputation, content patterns, language analysis, and behavioral indicators. The system processes over 50 different signals to determine if a message is spam with 99.9% accuracy.',
        tags: ['detection', 'ai', 'algorithm'],
        popular: true
    },
    {
        id: 2,
        category: 'spam',
        question: 'What types of spam can SecureMessage AI detect?',
        answer: 'We can detect various types of spam including promotional emails, phishing attempts, malware attachments, social engineering attacks, romance scams, investment fraud, and more. Our system is continuously updated to recognize new spam patterns.',
        tags: ['types', 'detection'],
        popular: true
    },
    {
        id: 3,
        category: 'spam',
        question: 'How accurate is the spam detection?',
        answer: 'Our spam detection system achieves 99.9% accuracy with less than 0.1% false positives. We continuously improve our algorithms based on user feedback and new threat intelligence.',
        tags: ['accuracy', 'performance'],
        popular: false
    },
    {
        id: 4,
        category: 'spam',
        question: 'Can I report false positives or missed spam?',
        answer: 'Yes! You can easily report false positives or missed spam through our feedback system. This helps improve our AI and ensures better accuracy for all users. Use the "Report" button in your scan results.',
        tags: ['feedback', 'reporting'],
        popular: false
    },
    {
        id: 5,
        category: 'spam',
        question: 'How often is the spam detection updated?',
        answer: 'Our AI models are updated continuously in real-time as new threats are detected. Major algorithm updates are deployed weekly, and our threat intelligence database is refreshed every few hours.',
        tags: ['updates', 'real-time'],
        popular: false
    },
    {
        id: 6,
        category: 'spam',
        question: 'Does SecureMessage AI work with all email providers?',
        answer: 'Yes, our web-based scanner works with any email content regardless of the provider. Our browser extension supports Gmail, Outlook, Yahoo Mail, and other major webmail services.',
        tags: ['compatibility', 'email providers'],
        popular: true
    },
    {
        id: 7,
        category: 'spam',
        question: 'Can I scan emails in bulk?',
        answer: 'Premium users can scan multiple emails at once using our batch processing feature. Free users can scan emails individually with a daily limit.',
        tags: ['bulk', 'premium', 'limits'],
        popular: false
    },
    {
        id: 8,
        category: 'spam',
        question: 'What happens to my email data during scanning?',
        answer: 'Your email content is processed securely and never stored permanently. We analyze the content using encrypted connections and delete all data immediately after providing results. See our Privacy Policy for details.',
        tags: ['privacy', 'data', 'security'],
        popular: true
    },

    // Phishing Protection
    {
        id: 9,
        category: 'phishing',
        question: 'What is phishing and how can I protect myself?',
        answer: 'Phishing is a cybercrime where attackers impersonate legitimate organizations to steal personal information. Protect yourself by verifying sender addresses, not clicking suspicious links, and using our phishing detection tools.',
        tags: ['definition', 'protection'],
        popular: true
    },
    {
        id: 10,
        category: 'phishing',
        question: 'How do I identify phishing emails?',
        answer: 'Look for red flags like urgent language, generic greetings, suspicious sender addresses, spelling errors, and requests for personal information. Our system automatically highlights these indicators.',
        tags: ['identification', 'red flags'],
        popular: true
    },
    {
        id: 11,
        category: 'phishing',
        question: 'What should I do if I receive a phishing email?',
        answer: 'Do not click any links or download attachments. Report the email using our scam reporting tool, delete it from your inbox, and warn others if it\'s a widespread attack.',
        tags: ['response', 'reporting'],
        popular: true
    },
    {
        id: 12,
        category: 'phishing',
        question: 'Can SecureMessage AI detect all phishing attempts?',
        answer: 'We detect over 99% of known phishing attempts and many zero-day attacks. However, new sophisticated attacks may occasionally bypass detection, which is why user education is also important.',
        tags: ['detection rate', 'limitations'],
        popular: false
    },
    {
        id: 13,
        category: 'phishing',
        question: 'What is spear phishing?',
        answer: 'Spear phishing is a targeted attack where criminals research specific individuals or organizations to create convincing, personalized phishing emails. These are harder to detect but our AI looks for subtle behavioral patterns.',
        tags: ['spear phishing', 'targeted attacks'],
        popular: false
    },
    {
        id: 14,
        category: 'phishing',
        question: 'How can I verify if a website is legitimate?',
        answer: 'Check for HTTPS encryption (lock icon), verify the URL spelling, look for contact information, check reviews, and use our website verification tool. Be suspicious of urgent requests for personal information.',
        tags: ['website verification', 'legitimacy'],
        popular: true
    },

    // Account & Billing
    {
        id: 15,
        category: 'account',
        question: 'How do I create an account?',
        answer: 'Click "Sign Up" on our homepage, enter your email and create a password. You\'ll receive a verification email to activate your account. Premium features require a subscription.',
        tags: ['signup', 'registration'],
        popular: true
    },
    {
        id: 16,
        category: 'account',
        question: 'What\'s the difference between free and premium accounts?',
        answer: 'Free accounts include basic spam detection with daily limits. Premium accounts offer unlimited scans, advanced features, priority support, and access to our mobile apps and browser extension.',
        tags: ['pricing', 'features', 'premium'],
        popular: true
    },
    {
        id: 17,
        category: 'account',
        question: 'How do I upgrade to premium?',
        answer: 'Go to your account settings and click "Upgrade to Premium". Choose your preferred plan and payment method. You can cancel anytime and your premium features will remain active until the end of your billing period.',
        tags: ['upgrade', 'premium', 'billing'],
        popular: false
    },
    {
        id: 18,
        category: 'account',
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees, and you\'ll retain premium access until your current billing period ends.',
        tags: ['cancellation', 'billing'],
        popular: false
    },
    {
        id: 19,
        category: 'account',
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email. If you don\'t receive it, check your spam folder or contact support.',
        tags: ['password', 'reset', 'login'],
        popular: true
    },

    // Security & Privacy
    {
        id: 20,
        category: 'security',
        question: 'How is my data protected?',
        answer: 'We use enterprise-grade encryption, secure data centers, and follow strict privacy policies. Your email content is never stored permanently and is processed using encrypted connections.',
        tags: ['data protection', 'encryption', 'privacy'],
        popular: true
    },
    {
        id: 21,
        category: 'security',
        question: 'Do you store my emails?',
        answer: 'No, we do not store your email content. Emails are processed in real-time for analysis and immediately deleted. Only anonymized metadata may be retained for improving our algorithms.',
        tags: ['storage', 'privacy', 'emails'],
        popular: true
    },
    {
        id: 22,
        category: 'security',
        question: 'Is two-factor authentication available?',
        answer: 'Yes, we strongly recommend enabling two-factor authentication (2FA) for your account. You can set it up in your security settings using an authenticator app or SMS.',
        tags: ['2fa', 'authentication', 'security'],
        popular: false
    },
    {
        id: 23,
        category: 'security',
        question: 'What information do you collect?',
        answer: 'We collect minimal information necessary for our service: account details, usage statistics, and anonymized threat intelligence. We never sell personal data to third parties.',
        tags: ['data collection', 'privacy policy'],
        popular: false
    },
    {
        id: 24,
        category: 'security',
        question: 'How do you handle data breaches?',
        answer: 'We have comprehensive incident response procedures, immediate notification systems, and work with cybersecurity experts. Users are notified immediately if any breach affects their data.',
        tags: ['data breach', 'incident response'],
        popular: false
    },
    {
        id: 25,
        category: 'security',
        question: 'Can I delete my account and data?',
        answer: 'Yes, you can permanently delete your account and all associated data from your account settings. This action is irreversible and will remove all your data within 30 days.',
        tags: ['account deletion', 'data removal'],
        popular: false
    },
    {
        id: 26,
        category: 'security',
        question: 'Is SecureMessage AI GDPR compliant?',
        answer: 'Yes, we are fully GDPR compliant. We provide data portability, deletion rights, and transparent privacy practices. EU users have additional protections under GDPR regulations.',
        tags: ['gdpr', 'compliance', 'privacy'],
        popular: false
    },

    // Technical Support
    {
        id: 27,
        category: 'technical',
        question: 'Why is the website loading slowly?',
        answer: 'Slow loading can be caused by internet connection, browser cache, or high server load. Try refreshing the page, clearing your browser cache, or using a different browser. Contact support if issues persist.',
        tags: ['performance', 'loading', 'troubleshooting'],
        popular: true
    },
    {
        id: 28,
        category: 'technical',
        question: 'Which browsers are supported?',
        answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, use the latest version of your preferred browser with JavaScript enabled.',
        tags: ['browser support', 'compatibility'],
        popular: false
    },
    {
        id: 29,
        category: 'technical',
        question: 'The scan results seem incorrect. What should I do?',
        answer: 'If you believe our scan results are incorrect, please use the feedback option to report it. This helps improve our AI. You can also try scanning again or contact our support team for assistance.',
        tags: ['accuracy', 'feedback', 'results'],
        popular: false
    },
    {
        id: 30,
        category: 'technical',
        question: 'How do I contact technical support?',
        answer: 'You can contact technical support through live chat, email (support@securemessage.ai), or by submitting a support ticket in your account dashboard. Premium users get priority support.',
        tags: ['support', 'contact', 'help'],
        popular: true
    },

    // Mobile Apps
    {
        id: 31,
        category: 'mobile',
        question: 'Are mobile apps available?',
        answer: 'Yes, we have mobile apps for iOS and Android devices. Premium subscribers get full access to mobile features including real-time protection and offline scanning.',
        tags: ['mobile apps', 'ios', 'android'],
        popular: true
    },
    {
        id: 32,
        category: 'mobile',
        question: 'How do I download the mobile app?',
        answer: 'You can download our apps from the App Store (iOS) or Google Play Store (Android). QR codes for quick download are available on our download page.',
        tags: ['download', 'app store', 'installation'],
        popular: true
    },
    {
        id: 33,
        category: 'mobile',
        question: 'Do mobile apps work offline?',
        answer: 'Basic spam detection works offline using cached threat intelligence. However, real-time updates and advanced features require an internet connection for optimal protection.',
        tags: ['offline', 'functionality', 'internet'],
        popular: false
    }
];

let currentCategory = 'all';
let filteredFAQs = [...FAQ_DATA];

// Initialize FAQ functionality
function initializeFAQ() {
    // Category card clicks
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterFAQs(category);
            updateActiveCategory(category);
        });
    });
    
    // Quick links
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', function() {
            const category = this.dataset.category;
            filterFAQs(category);
            updateActiveCategory(category);
            
            // Scroll to FAQ content
            document.querySelector('.faq-content').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
    
    // Show all button
    document.getElementById('show-all-faqs').addEventListener('click', function() {
        filterFAQs('all');
        updateActiveCategory('all');
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('faq-search');
    const clearButton = document.getElementById('clear-search');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length > 0) {
            clearButton.style.display = 'block';
            searchFAQs(query);
        } else {
            clearButton.style.display = 'none';
            filterFAQs(currentCategory);
        }
    });
    
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        filterFAQs(currentCategory);
        searchInput.focus();
    });
    
    // Enter key search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query.length > 0) {
                searchFAQs(query);
            }
        }
    });
}

// Setup category filters
function setupCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Filter FAQs
            filterFAQs(category);
            updateActiveCategory(category);
        });
    });
}

// Load and display FAQs
function loadFAQs() {
    displayFAQs(FAQ_DATA);
}

// Display FAQs
function displayFAQs(faqs) {
    const faqList = document.getElementById('faq-list');
    const noResults = document.getElementById('no-results');
    const showingCount = document.getElementById('showing-count');
    
    if (faqs.length === 0) {
        faqList.style.display = 'none';
        noResults.style.display = 'block';
        showingCount.textContent = '0';
        return;
    }
    
    faqList.style.display = 'block';
    noResults.style.display = 'none';
    showingCount.textContent = faqs.length;
    
    faqList.innerHTML = faqs.map(faq => `
        <div class="faq-item" data-category="${faq.category}">
            <div class="faq-question" onclick="toggleFAQ(${faq.id})">
                <h3>${faq.question}</h3>
                <div class="faq-meta">
                    ${faq.popular ? '<span class="popular-badge">Popular</span>' : ''}
                    <span class="category-badge">${getCategoryName(faq.category)}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            <div class="faq-answer" id="faq-${faq.id}">
                <div class="answer-content">
                    <p>${faq.answer}</p>
                    <div class="answer-actions">
                        <button class="helpful-btn" onclick="markHelpful(${faq.id}, true)">
                            <i class="fas fa-thumbs-up"></i>
                            Helpful
                        </button>
                        <button class="helpful-btn" onclick="markHelpful(${faq.id}, false)">
                            <i class="fas fa-thumbs-down"></i>
                            Not Helpful
                        </button>
                        <button class="contact-btn" onclick="toggleChat()">
                            <i class="fas fa-comments"></i>
                            Still need help?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter FAQs by category
function filterFAQs(category) {
    currentCategory = category;
    
    if (category === 'all') {
        filteredFAQs = [...FAQ_DATA];
    } else {
        filteredFAQs = FAQ_DATA.filter(faq => faq.category === category);
    }
    
    displayFAQs(filteredFAQs);
}

// Search FAQs
function searchFAQs(query) {
    const searchTerms = query.toLowerCase().split(' ');
    
    const results = FAQ_DATA.filter(faq => {
        const searchText = `${faq.question} ${faq.answer} ${faq.tags.join(' ')}`.toLowerCase();
        return searchTerms.every(term => searchText.includes(term));
    });
    
    // Sort by relevance (question matches first, then answer matches)
    results.sort((a, b) => {
        const aQuestionMatch = a.question.toLowerCase().includes(query.toLowerCase());
        const bQuestionMatch = b.question.toLowerCase().includes(query.toLowerCase());
        
        if (aQuestionMatch && !bQuestionMatch) return -1;
        if (!aQuestionMatch && bQuestionMatch) return 1;
        
        return 0;
    });
    
    filteredFAQs = results;
    displayFAQs(results);
    
    // Update category display
    document.getElementById('current-category').textContent = `Search results for "${query}"`;
}

// Toggle FAQ answer
function toggleFAQ(faqId) {
    const answer = document.getElementById(`faq-${faqId}`);
    const question = answer.previousElementSibling;
    const icon = question.querySelector('i');
    
    if (answer.classList.contains('active')) {
        answer.classList.remove('active');
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Close other open FAQs
        document.querySelectorAll('.faq-answer.active').forEach(openAnswer => {
            openAnswer.classList.remove('active');
            openAnswer.previousElementSibling.querySelector('i').style.transform = 'rotate(0deg)';
        });
        
        // Open clicked FAQ
        answer.classList.add('active');
        icon.style.transform = 'rotate(180deg)';
        
        // Scroll into view
        setTimeout(() => {
            answer.scrollIntoView({ 
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300);
    }
    
    // Log FAQ interaction
    if (typeof logActivity === 'function') {
        const faq = FAQ_DATA.find(f => f.id === faqId);
        logActivity('support', `Viewed FAQ: ${faq.question}`, 'info');
    }
}

// Mark FAQ as helpful
function markHelpful(faqId, isHelpful) {
    const faq = FAQ_DATA.find(f => f.id === faqId);
    
    // Save feedback
    let feedback = Storage.get('faqFeedback', {});
    feedback[faqId] = {
        helpful: isHelpful,
        timestamp: new Date().toISOString()
    };
    Storage.set('faqFeedback', feedback);
    
    // Show feedback message
    const message = isHelpful ? 
        'Thank you for your feedback! This helps us improve our FAQ.' :
        'Thank you for your feedback. Would you like to contact support for more help?';
    
    showAlert(message, isHelpful ? 'success' : 'info');
    
    // Log feedback
    if (typeof logActivity === 'function') {
        logActivity('support', `FAQ feedback: ${faq.question} - ${isHelpful ? 'Helpful' : 'Not Helpful'}`, 'info');
    }
    
    // If not helpful, suggest contacting support
    if (!isHelpful) {
        setTimeout(() => {
            if (confirm('Would you like to start a live chat for more personalized help?')) {
                toggleChat();
            }
        }, 2000);
    }
}

// Update active category
function updateActiveCategory(category) {
    const categoryName = category === 'all' ? 'All Questions' : getCategoryName(category);
    document.getElementById('current-category').textContent = categoryName;
    
    // Update sidebar active state
    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.category === category);
    });
}

// Get category display name
function getCategoryName(category) {
    const names = {
        spam: 'Spam Detection',
        phishing: 'Phishing Protection',
        account: 'Account & Billing',
        security: 'Security & Privacy',
        technical: 'Technical Support',
        mobile: 'Mobile Apps'
    };
    return names[category] || category;
}

// Clear search
function clearSearch() {
    const searchInput = document.getElementById('faq-search');
    const clearButton = document.getElementById('clear-search');
    
    searchInput.value = '';
    clearButton.style.display = 'none';
    filterFAQs(currentCategory);
    searchInput.focus();
}

// Make functions available globally
window.toggleFAQ = toggleFAQ;
window.markHelpful = markHelpful;
window.clearSearch = clearSearch;
