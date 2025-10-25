// AI Chatbot for Cybersecurity Support
document.addEventListener('DOMContentLoaded', function() {
    initializeChatbot();
});

// Chatbot knowledge base
const CHATBOT_RESPONSES = {
    // Greetings
    greetings: [
        "Hello! I'm SecureBot, your cybersecurity assistant. How can I help you stay safe online today?",
        "Hi there! I'm here to help with any cybersecurity questions you might have. What's on your mind?",
        "Welcome! I'm SecureBot, ready to assist you with spam detection and online safety. How can I help?"
    ],
    
    // Phishing related
    phishing: {
        keywords: ['phishing', 'fake email', 'suspicious email', 'scam email', 'fraudulent'],
        responses: [
            "Phishing emails try to steal your personal information by pretending to be from legitimate companies. Here are key warning signs:\n\n• Generic greetings like 'Dear Customer'\n• Urgent language creating pressure\n• Suspicious sender addresses\n• Requests for personal information\n• Poor grammar and spelling\n\nNever click links or download attachments from suspicious emails. When in doubt, contact the company directly through their official website.",
            "To protect yourself from phishing:\n\n1. Always verify sender addresses carefully\n2. Hover over links to see the actual URL\n3. Look for spelling and grammar errors\n4. Be suspicious of urgent requests\n5. Use our spam detector to analyze suspicious emails\n\nWould you like me to explain any of these points in more detail?"
        ]
    },
    
    // Password security
    passwords: {
        keywords: ['password', 'strong password', 'password security', 'password manager'],
        responses: [
            "Strong passwords are crucial for online security! Here's how to create them:\n\n• Use at least 12 characters\n• Mix uppercase, lowercase, numbers, and symbols\n• Avoid personal information\n• Use unique passwords for each account\n• Consider using a password manager\n\nExample strong password: MyC@t15Fluffy!2024\n\nWould you like tips on password managers or two-factor authentication?",
            "Password security best practices:\n\n1. Never reuse passwords across accounts\n2. Change passwords if a service is breached\n3. Enable two-factor authentication when available\n4. Use passphrases for easier memorization\n5. Avoid common passwords like '123456' or 'password'\n\nNeed help with anything specific about password security?"
        ]
    },
    
    // Spam detection
    spam: {
        keywords: ['spam', 'spam detection', 'junk mail', 'unwanted emails'],
        responses: [
            "Our AI spam detector analyzes emails for suspicious patterns. Here's what it looks for:\n\n• Suspicious sender reputation\n• Unusual language patterns\n• Malicious links or attachments\n• Impersonation attempts\n• Mass mailing indicators\n\nYou can use our web app to scan any suspicious email. Just paste the content and get instant results!",
            "Common spam indicators include:\n\n• Offers that seem too good to be true\n• Requests for immediate action\n• Poor grammar and formatting\n• Unexpected attachments\n• Generic or missing sender information\n\nOur system uses machine learning to detect these patterns with 99.9% accuracy. Try scanning a suspicious email to see how it works!"
        ]
    },
    
    // Two-factor authentication
    '2fa': {
        keywords: ['2fa', 'two factor', 'authentication', 'authenticator'],
        responses: [
            "Two-Factor Authentication (2FA) adds an extra security layer to your accounts:\n\n• Something you know (password)\n• Something you have (phone/authenticator app)\n\nTypes of 2FA:\n1. SMS codes (less secure)\n2. Authenticator apps (recommended)\n3. Hardware keys (most secure)\n\nPopular authenticator apps: Google Authenticator, Authy, Microsoft Authenticator\n\nEnable 2FA on all important accounts for maximum security!",
            "Setting up 2FA is easy:\n\n1. Go to your account security settings\n2. Choose 'Enable Two-Factor Authentication'\n3. Scan the QR code with your authenticator app\n4. Enter the verification code\n5. Save backup codes in a safe place\n\nThis makes your account much harder to hack, even if someone knows your password!"
        ]
    },
    
    // Malware
    malware: {
        keywords: ['malware', 'virus', 'trojan', 'ransomware', 'infected'],
        responses: [
            "Malware is malicious software that can harm your device. Common types:\n\n• Viruses: Replicate and spread to other files\n• Trojans: Disguise as legitimate software\n• Ransomware: Encrypts files for ransom\n• Spyware: Secretly monitors your activity\n• Adware: Shows unwanted advertisements\n\nProtection tips:\n1. Use reputable antivirus software\n2. Keep software updated\n3. Avoid suspicious downloads\n4. Be careful with email attachments\n5. Regular system backups",
            "Signs your device might be infected:\n\n• Slow performance\n• Unexpected pop-ups\n• Programs crashing frequently\n• Unknown programs running\n• High network activity\n• Files missing or encrypted\n\nIf you suspect infection:\n1. Disconnect from internet\n2. Run full antivirus scan\n3. Remove detected threats\n4. Update all software\n5. Change important passwords"
        ]
    },
    
    // Safe browsing
    browsing: {
        keywords: ['safe browsing', 'website security', 'https', 'ssl', 'secure website'],
        responses: [
            "Safe browsing tips to protect yourself online:\n\n• Look for HTTPS (lock icon) on websites\n• Avoid clicking suspicious links\n• Keep your browser updated\n• Use reputable websites for downloads\n• Be cautious on public Wi-Fi\n• Check website URLs carefully\n\nRed flags for unsafe websites:\n- No HTTPS encryption\n- Suspicious URLs with typos\n- Too many pop-ups\n- Requests for unnecessary permissions\n- Poor design or grammar",
            "Website security indicators:\n\n✅ Green lock icon = Secure HTTPS connection\n⚠️ 'Not Secure' warning = Avoid entering personal info\n🔒 Extended validation = Company identity verified\n\nAlways verify you're on the correct website before entering sensitive information. Scammers often create fake websites with similar URLs to legitimate ones."
        ]
    },
    
    // Social engineering
    social: {
        keywords: ['social engineering', 'manipulation', 'pretexting', 'baiting'],
        responses: [
            "Social engineering uses psychological manipulation to trick people into revealing information or performing actions. Common tactics:\n\n• Pretexting: Creating fake scenarios\n• Baiting: Offering something enticing\n• Phishing: Impersonating trusted entities\n• Tailgating: Following someone into secure areas\n• Quid pro quo: Offering services for information\n\nProtection strategies:\n1. Verify identities independently\n2. Be skeptical of unsolicited contact\n3. Don't share sensitive information\n4. Follow security policies\n5. Report suspicious activity",
            "Red flags for social engineering:\n\n• Urgent or threatening language\n• Requests for confidential information\n• Offers that seem too good to be true\n• Pressure to act quickly\n• Claims of authority or emergency\n• Requests to bypass normal procedures\n\nWhen in doubt, verify through official channels. Legitimate organizations won't pressure you for immediate action."
        ]
    },
    
    // Default responses
    default: [
        "I'm here to help with cybersecurity questions! You can ask me about:\n\n• Phishing and email security\n• Password protection\n• Spam detection\n• Two-factor authentication\n• Malware protection\n• Safe browsing\n• Social engineering\n\nWhat would you like to know more about?",
        "I can help you with various cybersecurity topics. Try asking about phishing, passwords, spam detection, or any other security concerns you might have!",
        "I'm not sure I understand that specific question, but I'm here to help with cybersecurity! You can ask me about email security, password protection, or how to stay safe online."
    ],
    
    // Appreciation
    thanks: [
        "You're welcome! Stay safe online and feel free to ask if you have more cybersecurity questions.",
        "Happy to help! Remember, staying informed is your best defense against cyber threats.",
        "Glad I could assist! Don't hesitate to reach out if you need more cybersecurity guidance."
    ]
};

// Chat state
let chatState = {
    isOpen: false,
    isTyping: false,
    conversationHistory: [],
    userName: null
};

// Initialize chatbot
function initializeChatbot() {
    createChatWidget();
    loadChatHistory();
    
    // Add keyboard shortcut (Ctrl+Shift+C) to open chat
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            toggleChat();
        }
    });
}

// Create chat widget HTML
function createChatWidget() {
    const chatWidget = document.createElement('div');
    chatWidget.id = 'chat-widget';
    chatWidget.innerHTML = `
        <div class="chat-button" id="chat-button">
            <i class="fas fa-comments"></i>
            <span class="chat-notification" id="chat-notification">1</span>
        </div>
        
        <div class="chat-window" id="chat-window">
            <div class="chat-header">
                <div class="chat-agent">
                    <div class="agent-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="agent-info">
                        <h4>SecureBot</h4>
                        <span class="agent-status">
                            <span class="status-dot"></span>
                            Online - AI Assistant
                        </span>
                    </div>
                </div>
                <div class="chat-controls">
                    <button class="chat-control" id="minimize-chat" title="Minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="chat-control" id="close-chat" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div class="chat-messages" id="chat-messages">
                <div class="welcome-message">
                    <div class="message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Hello! I'm SecureBot, your cybersecurity assistant. I can help you with questions about phishing, passwords, spam detection, and online safety. How can I assist you today?</p>
                            <div class="quick-actions">
                                <button class="quick-action" data-message="How do I identify phishing emails?">
                                    <i class="fas fa-envelope"></i>
                                    Phishing Help
                                </button>
                                <button class="quick-action" data-message="How do I create strong passwords?">
                                    <i class="fas fa-key"></i>
                                    Password Tips
                                </button>
                                <button class="quick-action" data-message="How does spam detection work?">
                                    <i class="fas fa-shield-alt"></i>
                                    Spam Detection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-container">
                <div class="typing-indicator" id="typing-indicator" style="display: none;">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span>SecureBot is typing...</span>
                </div>
                <div class="chat-input">
                    <input type="text" id="chat-input" placeholder="Ask me about cybersecurity..." maxlength="500">
                    <button id="send-message" disabled>
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="chat-suggestions" id="chat-suggestions">
                    <span class="suggestion" data-message="What is two-factor authentication?">2FA</span>
                    <span class="suggestion" data-message="How to report a scam?">Report Scam</span>
                    <span class="suggestion" data-message="What is malware?">Malware</span>
                    <span class="suggestion" data-message="Safe browsing tips">Safe Browsing</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(chatWidget);
    
    // Add event listeners
    setupChatEventListeners();
}

// Setup event listeners for chat
function setupChatEventListeners() {
    const chatButton = document.getElementById('chat-button');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    
    // Toggle chat
    chatButton.addEventListener('click', toggleChat);
    closeChat.addEventListener('click', closeChat);
    minimizeChat.addEventListener('click', minimizeChat);
    
    // Input handling
    chatInput.addEventListener('input', function() {
        sendButton.disabled = this.value.trim() === '';
    });
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey && this.value.trim()) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendButton.addEventListener('click', sendMessage);
    
    // Quick actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quick-action') || e.target.classList.contains('suggestion')) {
            const message = e.target.dataset.message;
            if (message) {
                document.getElementById('chat-input').value = message;
                sendMessage();
            }
        }
    });
}

// Toggle chat window
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    const chatButton = document.getElementById('chat-button');
    const notification = document.getElementById('chat-notification');
    
    chatState.isOpen = !chatState.isOpen;
    
    if (chatState.isOpen) {
        chatWindow.style.display = 'flex';
        chatButton.classList.add('active');
        notification.style.display = 'none';
        document.getElementById('chat-input').focus();
        
        // Log chat open
        if (typeof logActivity === 'function') {
            logActivity('support', 'Opened chat support', 'info');
        }
    } else {
        chatWindow.style.display = 'none';
        chatButton.classList.remove('active');
    }
}

// Close chat
function closeChat() {
    chatState.isOpen = false;
    document.getElementById('chat-window').style.display = 'none';
    document.getElementById('chat-button').classList.remove('active');
}

// Minimize chat
function minimizeChat() {
    closeChat();
}

// Send message
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    document.getElementById('send-message').disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    // Generate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
        
        // Save conversation
        saveChatHistory();
    }, Math.random() * 2000 + 1000); // 1-3 second delay for realism
}

// Add message to chat
function addMessage(content, sender) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${content.replace(/\n/g, '<br>')}</p>
                <span class="message-time">${timestamp}</span>
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
                <span class="message-time">${timestamp}</span>
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to conversation history
    chatState.conversationHistory.push({
        content: content,
        sender: sender,
        timestamp: new Date().toISOString()
    });
}

// Generate bot response
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for greetings
    if (message.match(/\b(hello|hi|hey|good morning|good afternoon|good evening)\b/)) {
        return getRandomResponse(CHATBOT_RESPONSES.greetings);
    }
    
    // Check for thanks
    if (message.match(/\b(thank|thanks|thx|appreciate)\b/)) {
        return getRandomResponse(CHATBOT_RESPONSES.thanks);
    }
    
    // Check knowledge base
    for (const [category, data] of Object.entries(CHATBOT_RESPONSES)) {
        if (typeof data === 'object' && data.keywords) {
            for (const keyword of data.keywords) {
                if (message.includes(keyword)) {
                    return getRandomResponse(data.responses);
                }
            }
        }
    }
    
    // Default response
    return getRandomResponse(CHATBOT_RESPONSES.default);
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Show typing indicator
function showTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    const messagesContainer = document.getElementById('chat-messages');
    
    indicator.style.display = 'flex';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    chatState.isTyping = true;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    indicator.style.display = 'none';
    chatState.isTyping = false;
}

// Save chat history
function saveChatHistory() {
    Storage.set('chatHistory', chatState.conversationHistory.slice(-50)); // Keep last 50 messages
}

// Load chat history
function loadChatHistory() {
    const history = Storage.get('chatHistory', []);
    chatState.conversationHistory = history;
    
    // Restore recent messages (optional)
    if (history.length > 0) {
        // Could restore last few messages here if desired
    }
}

// Show notification badge
function showChatNotification() {
    const notification = document.getElementById('chat-notification');
    if (notification && !chatState.isOpen) {
        notification.style.display = 'block';
    }
}

// Export functions for global use
window.toggleChat = toggleChat;
window.showChatNotification = showChatNotification;
