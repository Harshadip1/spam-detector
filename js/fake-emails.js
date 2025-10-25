// Fake Emails Educational Tool
document.addEventListener('DOMContentLoaded', function() {
    initializeFakeEmails();
    loadFakeEmails();
});

// Fake Email Database
const FAKE_EMAILS = [
    {
        id: 1,
        category: 'banking',
        subject: 'URGENT: Your Bank Account Has Been Suspended',
        sender: 'security@bank-alerts.com',
        senderDisplay: 'Bank Security Team',
        date: '2024-01-15 09:23 AM',
        content: `
            <div class="email-header">
                <div class="sender-info">
                    <strong>From:</strong> Bank Security Team &lt;security@bank-alerts.com&gt;<br>
                    <strong>To:</strong> customer@email.com<br>
                    <strong>Subject:</strong> URGENT: Your Bank Account Has Been Suspended<br>
                    <strong>Date:</strong> January 15, 2024 9:23 AM
                </div>
            </div>
            <div class="email-body">
                <p>Dear Valued Customer,</p>
                
                <p><strong style="color: red;">URGENT SECURITY ALERT</strong></p>
                
                <p>We have detected suspicious activity on your account and have temporarily suspended it for your protection. Multiple failed login attempts were detected from an unknown location.</p>
                
                <p><strong>Account Details:</strong><br>
                Account Number: ****-****-****-1234<br>
                Last Login: Unknown Location - Russia<br>
                Status: SUSPENDED</p>
                
                <p>To restore access to your account immediately, please verify your identity by clicking the link below and entering your login credentials:</p>
                
                <p><a href="#" style="background: red; color: white; padding: 10px; text-decoration: none;">VERIFY ACCOUNT NOW</a></p>
                
                <p><strong>WARNING:</strong> If you do not verify your account within 24 hours, it will be permanently closed and all funds will be frozen.</p>
                
                <p>Thank you for your immediate attention to this matter.</p>
                
                <p>Sincerely,<br>
                Bank Security Department<br>
                Customer Protection Division</p>
                
                <p style="font-size: 10px; color: gray;">This email was sent from an automated system. Please do not reply to this email.</p>
            </div>
        `,
        redFlags: [
            'Urgent language creating panic ("URGENT", "immediately")',
            'Suspicious sender email domain (bank-alerts.com instead of official bank domain)',
            'Generic greeting ("Dear Valued Customer" instead of actual name)',
            'Threatening consequences (account closure, frozen funds)',
            'Requests login credentials via email link',
            'Claims of suspicious activity from "Russia" to create fear',
            'Poor grammar and formatting inconsistencies',
            'Fake urgency with 24-hour deadline'
        ],
        riskLevel: 'high',
        description: 'Classic banking phishing scam using fear tactics and urgency to steal login credentials.'
    },
    {
        id: 2,
        category: 'tech',
        subject: 'Your Computer is Infected - Immediate Action Required',
        sender: 'support@microsoft-security.net',
        senderDisplay: 'Microsoft Security Team',
        date: '2024-01-14 02:15 PM',
        content: `
            <div class="email-header">
                <div class="sender-info">
                    <strong>From:</strong> Microsoft Security Team &lt;support@microsoft-security.net&gt;<br>
                    <strong>To:</strong> user@email.com<br>
                    <strong>Subject:</strong> Your Computer is Infected - Immediate Action Required<br>
                    <strong>Date:</strong> January 14, 2024 2:15 PM
                </div>
            </div>
            <div class="email-body">
                <p>Dear Windows User,</p>
                
                <p style="color: red; font-weight: bold;">⚠️ CRITICAL SECURITY ALERT ⚠️</p>
                
                <p>Our advanced security systems have detected that your computer (IP: 192.168.1.1) is infected with dangerous malware that is stealing your personal information RIGHT NOW.</p>
                
                <p><strong>Threats Detected:</strong></p>
                <ul>
                    <li>Trojan.Win32.Stealer - ACTIVE</li>
                    <li>Keylogger.Malware - RECORDING KEYSTROKES</li>
                    <li>Banking.Virus - ACCESSING FINANCIAL DATA</li>
                </ul>
                
                <p>Your personal data, passwords, and banking information are at IMMEDIATE RISK!</p>
                
                <p>To remove these threats instantly, download our emergency security tool:</p>
                
                <p><a href="#" style="background: #0078d4; color: white; padding: 15px; text-decoration: none; border-radius: 5px;">⬇️ DOWNLOAD SECURITY FIX NOW</a></p>
                
                <p>Or call our emergency support line: <strong style="color: red;">1-800-FAKE-NUM</strong></p>
                
                <p><em>Time remaining before permanent damage: 2 hours 34 minutes</em></p>
                
                <p>This is an automated security notification from Microsoft Windows Defender.</p>
                
                <p>Microsoft Corporation<br>
                Security Response Team</p>
            </div>
        `,
        redFlags: [
            'Fake Microsoft domain (microsoft-security.net)',
            'Scare tactics about immediate threats',
            'Generic greeting ("Dear Windows User")',
            'Fake technical details and threat names',
            'Countdown timer creating false urgency',
            'Requests to download suspicious software',
            'Phone number for "emergency support"',
            'Claims to know user\'s IP address',
            'Poor formatting and unprofessional appearance'
        ],
        riskLevel: 'high',
        description: 'Tech support scam impersonating Microsoft to trick users into downloading malware or calling fake support.'
    },
    {
        id: 3,
        category: 'social',
        subject: 'Someone tried to log into your Facebook account',
        sender: 'security@facebook-alerts.org',
        senderDisplay: 'Facebook Security',
        date: '2024-01-13 11:47 PM',
        content: `
            <div class="email-header">
                <div class="sender-info">
                    <strong>From:</strong> Facebook Security &lt;security@facebook-alerts.org&gt;<br>
                    <strong>To:</strong> user@email.com<br>
                    <strong>Subject:</strong> Someone tried to log into your Facebook account<br>
                    <strong>Date:</strong> January 13, 2024 11:47 PM
                </div>
            </div>
            <div class="email-body">
                <div style="background: #4267B2; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0;">facebook</h2>
                </div>
                
                <p>Hi there,</p>
                
                <p>We detected an unusual login attempt on your Facebook account from a device we don't recognize.</p>
                
                <p><strong>Login Details:</strong><br>
                Device: Unknown Device<br>
                Location: Moscow, Russia<br>
                Time: January 13, 2024 at 11:45 PM<br>
                Browser: Chrome on Windows</p>
                
                <p>If this was you, you can ignore this email. If this wasn't you, please secure your account immediately.</p>
                
                <p style="text-align: center;">
                    <a href="#" style="background: #4267B2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Secure My Account</a>
                </p>
                
                <p>You can also review your recent login activity and manage your security settings.</p>
                
                <p>Thanks,<br>
                The Facebook Team</p>
                
                <hr>
                
                <p style="font-size: 12px; color: #666;">
                This message was sent to user@email.com. If you don't want to receive these emails from Facebook in the future, please unsubscribe.<br>
                Facebook, Inc., 1 Hacker Way, Menlo Park, CA 94301
                </p>
            </div>
        `,
        redFlags: [
            'Fake Facebook domain (facebook-alerts.org instead of facebook.com)',
            'Generic greeting ("Hi there" instead of actual name)',
            'Suspicious login location (Moscow, Russia) to create concern',
            'Button leads to fake Facebook login page',
            'Slightly off Facebook branding and styling',
            'Unsubscribe link likely leads to malicious site',
            'Email address doesn\'t match Facebook\'s official format'
        ],
        riskLevel: 'medium',
        description: 'Social media phishing attempting to steal Facebook login credentials by mimicking security alerts.'
    },
    {
        id: 4,
        category: 'shopping',
        subject: 'Your Amazon order has been cancelled - Refund Required',
        sender: 'orders@amazon-customer.com',
        senderDisplay: 'Amazon Customer Service',
        date: '2024-01-12 08:30 AM',
        content: `
            <div class="email-header">
                <div class="sender-info">
                    <strong>From:</strong> Amazon Customer Service &lt;orders@amazon-customer.com&gt;<br>
                    <strong>To:</strong> customer@email.com<br>
                    <strong>Subject:</strong> Your Amazon order has been cancelled - Refund Required<br>
                    <strong>Date:</strong> January 12, 2024 8:30 AM
                </div>
            </div>
            <div class="email-body">
                <div style="background: #232F3E; color: white; padding: 15px;">
                    <h2 style="margin: 0;">amazon</h2>
                </div>
                
                <p>Dear Customer,</p>
                
                <p>We're writing to inform you that your recent order has been cancelled due to a payment processing error.</p>
                
                <p><strong>Order Details:</strong><br>
                Order Number: #123-4567890-1234567<br>
                Item: iPhone 15 Pro Max 256GB<br>
                Amount: $1,199.00<br>
                Status: CANCELLED</p>
                
                <p>Due to new banking regulations, we cannot automatically process your refund. You must verify your payment information to receive your $1,199.00 refund.</p>
                
                <p><strong>Action Required:</strong> Please click the button below to update your payment method and receive your refund within 24 hours.</p>
                
                <p style="text-align: center;">
                    <a href="#" style="background: #FF9900; color: black; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Update Payment & Get Refund</a>
                </p>
                
                <p><strong>Important:</strong> If you do not update your information within 48 hours, the refund will be forfeited according to our new policy.</p>
                
                <p>We apologize for any inconvenience this may cause.</p>
                
                <p>Best regards,<br>
                Amazon Customer Service Team</p>
                
                <p style="font-size: 11px; color: #666;">
                This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message.
                </p>
            </div>
        `,
        redFlags: [
            'Fake Amazon domain (amazon-customer.com instead of amazon.com)',
            'Claims about "new banking regulations" and "new policy"',
            'Threatens forfeiture of refund to create urgency',
            'Requests payment information update via email link',
            'Generic greeting without actual customer name',
            'Suspicious order details for expensive item',
            'Creates false urgency with 48-hour deadline',
            'No option to contact Amazon directly for verification'
        ],
        riskLevel: 'high',
        description: 'E-commerce scam impersonating Amazon to steal payment information through fake refund process.'
    },
    {
        id: 5,
        category: 'urgent',
        subject: 'FINAL NOTICE: Legal Action Will Be Taken',
        sender: 'legal@irs-collections.gov',
        senderDisplay: 'IRS Collections Department',
        date: '2024-01-11 04:22 PM',
        content: `
            <div class="email-header">
                <div class="sender-info">
                    <strong>From:</strong> IRS Collections Department &lt;legal@irs-collections.gov&gt;<br>
                    <strong>To:</strong> taxpayer@email.com<br>
                    <strong>Subject:</strong> FINAL NOTICE: Legal Action Will Be Taken<br>
                    <strong>Date:</strong> January 11, 2024 4:22 PM
                </div>
            </div>
            <div class="email-body">
                <div style="background: red; color: white; padding: 10px; text-align: center; font-weight: bold;">
                    FINAL NOTICE - IMMEDIATE ACTION REQUIRED
                </div>
                
                <p>TAXPAYER ID: [REDACTED]</p>
                
                <p>This is your FINAL NOTICE regarding unpaid taxes owed to the Internal Revenue Service.</p>
                
                <p><strong>AMOUNT OWED: $4,847.63</strong><br>
                <strong>DUE DATE: OVERDUE</strong><br>
                <strong>CASE NUMBER: IRS-2024-0891234</strong></p>
                
                <p>Our records indicate that you have failed to respond to previous notices regarding your outstanding tax debt. As a result, the following actions will be taken within 24 hours:</p>
                
                <ul>
                    <li>Wage garnishment</li>
                    <li>Bank account levy</li>
                    <li>Property seizure</li>
                    <li>Criminal prosecution</li>
                </ul>
                
                <p><strong style="color: red;">TO AVOID THESE ACTIONS, YOU MUST CALL IMMEDIATELY:</strong></p>
                
                <p style="text-align: center; font-size: 24px; color: red; font-weight: bold;">
                    1-800-SCAM-IRS
                </p>
                
                <p>Our tax resolution specialists are standing by to help you resolve this matter immediately. Payment arrangements can be made over the phone using a credit card or bank transfer.</p>
                
                <p><strong>Office Hours:</strong> 24/7 Emergency Tax Line</p>
                
                <p>Do not ignore this notice. Failure to respond will result in immediate enforcement action.</p>
                
                <p>Internal Revenue Service<br>
                Collections Enforcement Division</p>
                
                <p style="font-size: 10px;">Reference Number: IRS-FAKE-123456</p>
            </div>
        `,
        redFlags: [
            'Fake IRS domain (.gov domains are legitimate, but this is suspicious)',
            'Threatens immediate legal action and criminal prosecution',
            'Demands immediate phone call to resolve',
            'Claims 24/7 phone support (IRS doesn\'t operate this way)',
            'Requests payment over phone with credit card',
            'Creates extreme urgency with 24-hour deadline',
            'Uses scare tactics (wage garnishment, property seizure)',
            'IRS communicates primarily through mail, not email',
            'Fake case numbers and reference numbers'
        ],
        riskLevel: 'high',
        description: 'Government impersonation scam using fear of legal consequences to pressure victims into immediate payment.'
    },
    {
        id: 6,
        category: 'banking',
        subject: 'Verify Your Credit Card Information',
        sender: 'verify@visa-security.net',
        senderDisplay: 'Visa Security Center',
        date: '2024-01-10 01:45 PM',
        content: `
            <div class="email-header">
                <div class="sender-info">
                    <strong>From:</strong> Visa Security Center &lt;verify@visa-security.net&gt;<br>
                    <strong>To:</strong> cardholder@email.com<br>
                    <strong>Subject:</strong> Verify Your Credit Card Information<br>
                    <strong>Date:</strong> January 10, 2024 1:45 PM
                </div>
            </div>
            <div class="email-body">
                <div style="background: #1A1F71; color: white; padding: 20px; text-align: center;">
                    <h2 style="margin: 0; font-family: Arial;">VISA</h2>
                </div>
                
                <p>Dear Visa Cardholder,</p>
                
                <p>As part of our enhanced security measures, we are updating our systems and need to verify your credit card information.</p>
                
                <p>Your card ending in ****-1234 requires verification to continue using Visa services worldwide.</p>
                
                <p><strong>Verification Required For:</strong></p>
                <ul>
                    <li>Online purchases</li>
                    <li>International transactions</li>
                    <li>ATM withdrawals</li>
                    <li>Contactless payments</li>
                </ul>
                
                <p>Please verify your information by clicking the secure link below:</p>
                
                <p style="text-align: center;">
                    <a href="#" style="background: #1A1F71; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px;">Verify Card Information</a>
                </p>
                
                <p><strong>Note:</strong> This verification must be completed within 72 hours to avoid temporary suspension of your card.</p>
                
                <p>If you have any questions, please contact Visa Customer Service at the number on the back of your card.</p>
                
                <p>Thank you for your cooperation.</p>
                
                <p>Visa Security Team<br>
                Customer Protection Services</p>
                
                <p style="font-size: 11px; color: #666;">
                Visa Inc. | 900 Metro Center Blvd, Foster City, CA 94404
                </p>
            </div>
        `,
        redFlags: [
            'Fake Visa domain (visa-security.net instead of visa.com)',
            'Requests credit card verification via email link',
            'Generic card number reference (****-1234)',
            'Creates false urgency with 72-hour deadline',
            'Visa doesn\'t typically request verification via email',
            'Threatens card suspension to create pressure',
            'Generic greeting without actual cardholder name',
            'Legitimate Visa emails come from @visa.com domain'
        ],
        riskLevel: 'high',
        description: 'Credit card phishing scam impersonating Visa to steal card information and personal details.'
    }
];

let currentEmailCategory = 'all';

function initializeFakeEmails() {
    // Initialize category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentEmailCategory = this.dataset.category;
            loadFakeEmails(currentEmailCategory);
        });
    });
}

function loadFakeEmails(category = 'all') {
    const emailsGrid = document.getElementById('emails-grid');
    if (!emailsGrid) return;
    
    const filteredEmails = category === 'all' 
        ? FAKE_EMAILS 
        : FAKE_EMAILS.filter(email => email.category === category);
    
    emailsGrid.innerHTML = filteredEmails.map(email => `
        <div class="fake-email-card" data-category="${email.category}">
            <div class="email-header-preview">
                <div class="risk-indicator risk-${email.riskLevel}">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${email.riskLevel.toUpperCase()} RISK</span>
                </div>
                <div class="email-category">${email.category.toUpperCase()}</div>
            </div>
            <div class="email-preview">
                <div class="sender-info">
                    <strong>From:</strong> ${email.senderDisplay}<br>
                    <small>${email.sender}</small>
                </div>
                <div class="subject-line">
                    <strong>Subject:</strong> ${email.subject}
                </div>
                <div class="email-date">
                    ${email.date}
                </div>
            </div>
            <div class="email-description">
                <p>${email.description}</p>
            </div>
            <div class="email-actions">
                <button class="btn btn-primary" onclick="analyzeEmail(${email.id})">
                    <i class="fas fa-search"></i>
                    Analyze Email
                </button>
                <div class="red-flags-count">
                    <i class="fas fa-flag"></i>
                    ${email.redFlags.length} Red Flags
                </div>
            </div>
        </div>
    `).join('');
}

function analyzeEmail(emailId) {
    const email = FAKE_EMAILS.find(e => e.id === emailId);
    if (!email) return;
    
    const modal = document.getElementById('email-modal');
    const emailDisplay = document.getElementById('email-display');
    const analysisPanel = document.getElementById('analysis-panel');
    
    // Display email content
    emailDisplay.innerHTML = `
        <div class="fake-email-content">
            <div class="email-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <span>FAKE EMAIL - FOR EDUCATIONAL PURPOSES ONLY</span>
            </div>
            ${email.content}
        </div>
    `;
    
    // Display analysis
    analysisPanel.innerHTML = `
        <div class="analysis-content">
            <div class="risk-assessment">
                <h3>Risk Assessment</h3>
                <div class="risk-level risk-${email.riskLevel}">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${email.riskLevel.toUpperCase()} RISK</span>
                </div>
            </div>
            
            <div class="red-flags-analysis">
                <h3>Red Flags Identified (${email.redFlags.length})</h3>
                <ul class="red-flags-list">
                    ${email.redFlags.map(flag => `
                        <li class="red-flag-item">
                            <i class="fas fa-flag"></i>
                            <span>${flag}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="protection-tips">
                <h3>How to Protect Yourself</h3>
                <ul class="protection-list">
                    <li><i class="fas fa-shield-check"></i> Never click links in suspicious emails</li>
                    <li><i class="fas fa-phone"></i> Contact the company directly using official numbers</li>
                    <li><i class="fas fa-search"></i> Verify the sender's email domain</li>
                    <li><i class="fas fa-trash"></i> Delete the email and report it as spam</li>
                    <li><i class="fas fa-user-friends"></i> Warn others about similar scams</li>
                </ul>
            </div>
            
            <div class="analysis-actions">
                <button class="btn btn-outline" onclick="closeEmailModal()">
                    <i class="fas fa-times"></i>
                    Close Analysis
                </button>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Log analysis activity
    if (typeof logActivity === 'function') {
        logActivity('learning', `Analyzed fake email: ${email.subject}`, 'info');
    }
}

function closeEmailModal() {
    const modal = document.getElementById('email-modal');
    modal.style.display = 'none';
}

function startPhishingQuiz() {
    // Redirect to main quiz or start specialized phishing quiz
    if (typeof startQuiz === 'function') {
        startQuiz();
    } else {
        window.location.href = 'learn.html#quiz';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadFakeEmails();
    }, 100);
});
