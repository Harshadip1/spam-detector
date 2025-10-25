// Learn Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeLearnPage();
    loadDailyTip();
    loadArticles();
    initializeQuiz();
    initializeChecklist();
});

// Security Tips Database
const SECURITY_TIPS = [
    {
        text: "Never click on suspicious links in emails or messages from unknown senders.",
        category: "Phishing"
    },
    {
        text: "Use strong, unique passwords for each of your online accounts.",
        category: "Passwords"
    },
    {
        text: "Enable two-factor authentication (2FA) on all important accounts.",
        category: "Authentication"
    },
    {
        text: "Keep your software and operating system updated with the latest security patches.",
        category: "Updates"
    },
    {
        text: "Be cautious when downloading files or software from the internet.",
        category: "Downloads"
    },
    {
        text: "Use a reputable antivirus program and keep it updated.",
        category: "Antivirus"
    },
    {
        text: "Avoid using public Wi-Fi for sensitive activities like online banking.",
        category: "Wi-Fi"
    },
    {
        text: "Regularly backup your important data to a secure location.",
        category: "Backup"
    },
    {
        text: "Be skeptical of unexpected phone calls asking for personal information.",
        category: "Social Engineering"
    },
    {
        text: "Check website URLs carefully before entering sensitive information.",
        category: "Web Safety"
    },
    {
        text: "Use privacy settings on social media to control who can see your information.",
        category: "Privacy"
    },
    {
        text: "Never share your passwords or PINs with anyone.",
        category: "Passwords"
    },
    {
        text: "Log out of accounts when using shared or public computers.",
        category: "General"
    },
    {
        text: "Be cautious of USB drives from unknown sources - they may contain malware.",
        category: "Hardware"
    },
    {
        text: "Verify the identity of people requesting sensitive information via email or phone.",
        category: "Verification"
    }
];

// Quiz Questions Database
const QUIZ_QUESTIONS = [
    {
        question: "What is phishing?",
        options: [
            "A type of fishing technique",
            "A method to catch malicious software",
            "A fraudulent attempt to obtain sensitive information",
            "A way to improve internet speed"
        ],
        correct: 2,
        explanation: "Phishing is a fraudulent attempt to obtain sensitive information like passwords and credit card details by disguising as a trustworthy entity."
    },
    {
        question: "Which of these is the strongest password?",
        options: [
            "password123",
            "MyP@ssw0rd!2024",
            "12345678",
            "qwerty"
        ],
        correct: 1,
        explanation: "Strong passwords should be long, contain a mix of uppercase, lowercase, numbers, and special characters."
    },
    {
        question: "What should you do if you receive a suspicious email?",
        options: [
            "Click on all links to investigate",
            "Forward it to all your contacts",
            "Delete it immediately and report it",
            "Reply asking for more information"
        ],
        correct: 2,
        explanation: "Suspicious emails should be deleted immediately and reported to prevent potential security threats."
    },
    {
        question: "What is two-factor authentication (2FA)?",
        options: [
            "Using two different passwords",
            "An extra layer of security requiring two forms of identification",
            "Having two email accounts",
            "Using two different browsers"
        ],
        correct: 1,
        explanation: "2FA adds an extra layer of security by requiring two different forms of identification to access an account."
    },
    {
        question: "Which of these is a red flag in an email?",
        options: [
            "Proper grammar and spelling",
            "Urgent language demanding immediate action",
            "Clear sender identification",
            "Relevant content to your interests"
        ],
        correct: 1,
        explanation: "Urgent language creating pressure for immediate action is a common tactic used in phishing emails."
    },
    {
        question: "How often should you update your passwords?",
        options: [
            "Never",
            "Every 10 years",
            "Every 3-6 months for important accounts",
            "Only when you forget them"
        ],
        correct: 2,
        explanation: "Important account passwords should be updated every 3-6 months to maintain security."
    },
    {
        question: "What is malware?",
        options: [
            "A type of hardware component",
            "Malicious software designed to harm your computer",
            "A legitimate software update",
            "A type of internet connection"
        ],
        correct: 1,
        explanation: "Malware is malicious software designed to damage, disrupt, or gain unauthorized access to computer systems."
    },
    {
        question: "Is it safe to use public Wi-Fi for online banking?",
        options: [
            "Yes, it's always safe",
            "No, public Wi-Fi can be insecure",
            "Only on weekends",
            "Only if the network has a password"
        ],
        correct: 1,
        explanation: "Public Wi-Fi networks are often unsecured and can be monitored by malicious actors, making them unsafe for sensitive activities."
    },
    {
        question: "What should you do before clicking a link in an email?",
        options: [
            "Click it immediately",
            "Hover over it to see the actual URL",
            "Forward the email first",
            "Close your browser"
        ],
        correct: 1,
        explanation: "Always hover over links to verify the actual URL before clicking, as malicious links often disguise their true destination."
    },
    {
        question: "Which is the best way to handle software updates?",
        options: [
            "Never update software",
            "Only update when forced",
            "Install updates promptly from official sources",
            "Wait several years before updating"
        ],
        correct: 2,
        explanation: "Software updates often contain important security patches and should be installed promptly from official sources."
    }
];

// Articles Database
const ARTICLES = [
    {
        id: 1,
        title: "Understanding Phishing Attacks",
        excerpt: "Learn how to identify and protect yourself from phishing attempts that try to steal your personal information.",
        category: "phishing",
        readTime: "5 min read",
        date: "2024-01-15",
        content: `
            <h3>What is Phishing?</h3>
            <p>Phishing is a cybercrime where attackers impersonate legitimate organizations to steal sensitive information such as usernames, passwords, and credit card details.</p>
            
            <h3>Common Phishing Tactics</h3>
            <ul>
                <li><strong>Email Phishing:</strong> Fake emails that appear to be from trusted sources</li>
                <li><strong>Spear Phishing:</strong> Targeted attacks on specific individuals or organizations</li>
                <li><strong>Smishing:</strong> Phishing via SMS text messages</li>
                <li><strong>Vishing:</strong> Voice phishing through phone calls</li>
            </ul>
            
            <h3>How to Protect Yourself</h3>
            <ol>
                <li>Always verify the sender's identity before clicking links</li>
                <li>Check URLs carefully for misspellings or suspicious domains</li>
                <li>Never provide sensitive information via email or phone</li>
                <li>Use email filters and security software</li>
                <li>Keep your software updated</li>
            </ol>
        `
    },
    {
        id: 2,
        title: "Creating Strong Passwords",
        excerpt: "Master the art of creating unbreakable passwords that keep your accounts secure from hackers.",
        category: "passwords",
        readTime: "4 min read",
        date: "2024-01-10",
        content: `
            <h3>Why Strong Passwords Matter</h3>
            <p>Weak passwords are one of the easiest ways for cybercriminals to gain access to your accounts. A strong password is your first line of defense.</p>
            
            <h3>Password Best Practices</h3>
            <ul>
                <li><strong>Length:</strong> Use at least 12 characters</li>
                <li><strong>Complexity:</strong> Mix uppercase, lowercase, numbers, and symbols</li>
                <li><strong>Uniqueness:</strong> Use different passwords for each account</li>
                <li><strong>Unpredictability:</strong> Avoid personal information and common words</li>
            </ul>
            
            <h3>Password Creation Techniques</h3>
            <ol>
                <li><strong>Passphrase Method:</strong> Use multiple random words (e.g., "Coffee$Elephant#Moon9")</li>
                <li><strong>Substitution Method:</strong> Replace letters with numbers and symbols</li>
                <li><strong>Password Managers:</strong> Let software generate and store complex passwords</li>
            </ol>
        `
    },
    {
        id: 3,
        title: "Recognizing Online Scams",
        excerpt: "Stay ahead of scammers by learning to identify common online scams and fraudulent schemes.",
        category: "scams",
        readTime: "6 min read",
        date: "2024-01-08",
        content: `
            <h3>Common Online Scams</h3>
            <p>Online scams are constantly evolving, but many follow similar patterns designed to exploit human psychology.</p>
            
            <h3>Types of Scams</h3>
            <ul>
                <li><strong>Romance Scams:</strong> Fake relationships to steal money</li>
                <li><strong>Investment Scams:</strong> Fraudulent investment opportunities</li>
                <li><strong>Tech Support Scams:</strong> Fake technical support calls</li>
                <li><strong>Prize/Lottery Scams:</strong> Fake winnings requiring upfront payments</li>
                <li><strong>Shopping Scams:</strong> Fake online stores selling non-existent products</li>
            </ul>
            
            <h3>Red Flags to Watch For</h3>
            <ol>
                <li>Requests for immediate action or payment</li>
                <li>Offers that seem too good to be true</li>
                <li>Poor grammar and spelling in communications</li>
                <li>Requests for personal or financial information</li>
                <li>Pressure to keep the opportunity secret</li>
            </ol>
        `
    },
    {
        id: 4,
        title: "Malware Protection Guide",
        excerpt: "Comprehensive guide to understanding, preventing, and removing malware from your devices.",
        category: "malware",
        readTime: "7 min read",
        date: "2024-01-05",
        content: `
            <h3>Understanding Malware</h3>
            <p>Malware (malicious software) is designed to damage, disrupt, or gain unauthorized access to computer systems.</p>
            
            <h3>Types of Malware</h3>
            <ul>
                <li><strong>Viruses:</strong> Self-replicating programs that attach to other files</li>
                <li><strong>Trojans:</strong> Disguised malicious programs</li>
                <li><strong>Ransomware:</strong> Encrypts files and demands payment</li>
                <li><strong>Spyware:</strong> Secretly monitors user activity</li>
                <li><strong>Adware:</strong> Displays unwanted advertisements</li>
            </ul>
            
            <h3>Prevention Strategies</h3>
            <ol>
                <li>Install reputable antivirus software</li>
                <li>Keep operating system and software updated</li>
                <li>Avoid downloading from untrusted sources</li>
                <li>Be cautious with email attachments</li>
                <li>Use firewalls and network security</li>
                <li>Regular system backups</li>
            </ol>
        `
    }
];

let currentQuizQuestion = 0;
let quizAnswers = [];
let quizScore = 0;

function initializeLearnPage() {
    // Initialize filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterArticles(this.dataset.category);
        });
    });

    // Initialize refresh tip button
    const refreshBtn = document.getElementById('refresh-tip-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadDailyTip);
    }
}

function loadDailyTip() {
    const tipText = document.getElementById('daily-tip-text');
    const tipCategory = document.getElementById('tip-category');
    const refreshBtn = document.getElementById('refresh-tip-btn');
    
    if (!tipText) return;
    
    // Add loading animation
    refreshBtn.style.transform = 'rotate(360deg)';
    
    // Get random tip
    const randomTip = SECURITY_TIPS[Math.floor(Math.random() * SECURITY_TIPS.length)];
    
    setTimeout(() => {
        tipText.textContent = randomTip.text;
        tipCategory.textContent = randomTip.category;
        refreshBtn.style.transform = 'rotate(0deg)';
    }, 500);
}

function loadArticles(category = 'all') {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;
    
    const filteredArticles = category === 'all' 
        ? ARTICLES 
        : ARTICLES.filter(article => article.category === category);
    
    articlesGrid.innerHTML = filteredArticles.map(article => `
        <article class="article-card" data-category="${article.category}">
            <div class="article-header">
                <div class="article-meta">
                    <span class="article-category">${article.category}</span>
                    <span class="article-date">${formatDate(article.date)}</span>
                </div>
                <span class="read-time">${article.readTime}</span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <button class="btn btn-outline article-btn" onclick="readArticle(${article.id})">
                <i class="fas fa-book-open"></i>
                Read Article
            </button>
        </article>
    `).join('');
}

function filterArticles(category) {
    loadArticles(category);
}

function readArticle(articleId) {
    const article = ARTICLES.find(a => a.id === articleId);
    if (!article) return;
    
    // Create article modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content article-modal">
            <div class="modal-header">
                <h2>${article.title}</h2>
                <button class="close-btn" onclick="closeArticle(this)">&times;</button>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-category">${article.category}</span>
                    <span class="article-date">${formatDate(article.date)}</span>
                    <span class="read-time">${article.readTime}</span>
                </div>
                <div class="article-body">
                    ${article.content}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Log reading activity
    if (typeof logActivity === 'function') {
        logActivity('learning', `Read article: ${article.title}`, 'info');
    }
}

function closeArticle(button) {
    const modal = button.closest('.modal');
    modal.remove();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Quiz Functionality
function initializeQuiz() {
    // Reset quiz state
    currentQuizQuestion = 0;
    quizAnswers = [];
    quizScore = 0;
}

function startQuiz() {
    const modal = document.getElementById('quiz-modal');
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    
    // Reset quiz
    initializeQuiz();
    
    // Show quiz, hide results
    quizContent.style.display = 'block';
    quizResults.style.display = 'none';
    
    // Load first question
    loadQuizQuestion();
    
    // Show modal
    modal.style.display = 'flex';
    
    // Log quiz start
    if (typeof logActivity === 'function') {
        logActivity('learning', 'Started cybersecurity quiz', 'info');
    }
}

function loadQuizQuestion() {
    const question = QUIZ_QUESTIONS[currentQuizQuestion];
    const quizContent = document.getElementById('quiz-content');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressFill = document.getElementById('quiz-progress');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Update progress
    currentQuestionSpan.textContent = currentQuizQuestion + 1;
    totalQuestionsSpan.textContent = QUIZ_QUESTIONS.length;
    progressFill.style.width = `${((currentQuizQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`;
    
    // Update buttons
    prevBtn.disabled = currentQuizQuestion === 0;
    nextBtn.textContent = currentQuizQuestion === QUIZ_QUESTIONS.length - 1 ? 'Finish' : 'Next';
    
    // Load question content
    quizContent.innerHTML = `
        <div class="question-container">
            <h3 class="question-text">${question.question}</h3>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <label class="option-label">
                        <input type="radio" name="quiz-answer" value="${index}">
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Restore previous answer if exists
    if (quizAnswers[currentQuizQuestion] !== undefined) {
        const radio = quizContent.querySelector(`input[value="${quizAnswers[currentQuizQuestion]}"]`);
        if (radio) radio.checked = true;
    }
}

function nextQuestion() {
    const selectedAnswer = document.querySelector('input[name="quiz-answer"]:checked');
    
    if (!selectedAnswer) {
        alert('Please select an answer before continuing.');
        return;
    }
    
    // Save answer
    quizAnswers[currentQuizQuestion] = parseInt(selectedAnswer.value);
    
    if (currentQuizQuestion < QUIZ_QUESTIONS.length - 1) {
        currentQuizQuestion++;
        loadQuizQuestion();
    } else {
        finishQuiz();
    }
}

function previousQuestion() {
    if (currentQuizQuestion > 0) {
        currentQuizQuestion--;
        loadQuizQuestion();
    }
}

function finishQuiz() {
    // Calculate score
    quizScore = 0;
    quizAnswers.forEach((answer, index) => {
        if (answer === QUIZ_QUESTIONS[index].correct) {
            quizScore++;
        }
    });
    
    // Show results
    showQuizResults();
    
    // Log quiz completion
    if (typeof logActivity === 'function') {
        logActivity('learning', `Completed cybersecurity quiz - Score: ${quizScore}/${QUIZ_QUESTIONS.length}`, 'success');
    }
}

function showQuizResults() {
    const quizContent = document.getElementById('quiz-content');
    const quizResults = document.getElementById('quiz-results');
    const finalScore = document.getElementById('final-score');
    const scoreTitle = document.getElementById('score-title');
    const scoreMessage = document.getElementById('score-message');
    
    // Hide quiz content, show results
    quizContent.style.display = 'none';
    quizResults.style.display = 'block';
    
    // Update score display
    finalScore.textContent = quizScore;
    
    // Determine score message
    const percentage = (quizScore / QUIZ_QUESTIONS.length) * 100;
    
    if (percentage >= 90) {
        scoreTitle.textContent = 'Excellent!';
        scoreMessage.textContent = 'You have outstanding cybersecurity awareness! Keep up the great work.';
    } else if (percentage >= 70) {
        scoreTitle.textContent = 'Good Job!';
        scoreMessage.textContent = 'You have solid cybersecurity knowledge. Consider reviewing a few areas for improvement.';
    } else if (percentage >= 50) {
        scoreTitle.textContent = 'Not Bad!';
        scoreMessage.textContent = 'You have basic cybersecurity awareness. We recommend studying our security articles.';
    } else {
        scoreTitle.textContent = 'Keep Learning!';
        scoreMessage.textContent = 'There\'s room for improvement. Please review our security guides and take the quiz again.';
    }
}

function restartQuiz() {
    initializeQuiz();
    startQuiz();
}

function closeQuiz() {
    const modal = document.getElementById('quiz-modal');
    modal.style.display = 'none';
}

// Security Checklist
const SECURITY_CHECKLIST = {
    password: [
        { text: "Use unique passwords for each account", completed: false },
        { text: "Enable two-factor authentication where available", completed: false },
        { text: "Use a password manager", completed: false },
        { text: "Passwords are at least 12 characters long", completed: false },
        { text: "Avoid using personal information in passwords", completed: false }
    ],
    email: [
        { text: "Verify sender before clicking links", completed: false },
        { text: "Check for spelling and grammar errors", completed: false },
        { text: "Hover over links to see actual URLs", completed: false },
        { text: "Don't download unexpected attachments", completed: false },
        { text: "Report suspicious emails", completed: false }
    ],
    device: [
        { text: "Keep operating system updated", completed: false },
        { text: "Install security updates promptly", completed: false },
        { text: "Use reputable antivirus software", completed: false },
        { text: "Enable automatic screen lock", completed: false },
        { text: "Regular data backups", completed: false }
    ]
};

function initializeChecklist() {
    // Load saved checklist state
    const savedChecklist = Storage.get('securityChecklist', SECURITY_CHECKLIST);
    Object.assign(SECURITY_CHECKLIST, savedChecklist);
}

function showChecklist() {
    const modal = document.getElementById('checklist-modal');
    
    // Load checklist items
    loadChecklistItems('password', 'password-checklist');
    loadChecklistItems('email', 'email-checklist');
    loadChecklistItems('device', 'device-checklist');
    
    modal.style.display = 'flex';
}

function loadChecklistItems(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = SECURITY_CHECKLIST[category].map((item, index) => `
        <div class="checklist-item">
            <label class="checkbox-label">
                <input type="checkbox" ${item.completed ? 'checked' : ''} 
                       onchange="toggleChecklistItem('${category}', ${index})">
                <span class="checkmark"></span>
                <span class="item-text">${item.text}</span>
            </label>
        </div>
    `).join('');
}

function toggleChecklistItem(category, index) {
    SECURITY_CHECKLIST[category][index].completed = !SECURITY_CHECKLIST[category][index].completed;
    
    // Save to localStorage
    Storage.set('securityChecklist', SECURITY_CHECKLIST);
    
    // Log activity
    if (typeof logActivity === 'function') {
        const action = SECURITY_CHECKLIST[category][index].completed ? 'completed' : 'unchecked';
        logActivity('settings', `Security checklist item ${action}: ${SECURITY_CHECKLIST[category][index].text}`, 'info');
    }
}

function closeChecklist() {
    const modal = document.getElementById('checklist-modal');
    modal.style.display = 'none';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load articles on page load
    setTimeout(() => {
        loadArticles();
    }, 100);
});
