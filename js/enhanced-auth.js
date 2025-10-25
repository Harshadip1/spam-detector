// Enhanced Authentication with 2FA Support

// Initialize enhanced authentication
document.addEventListener('DOMContentLoaded', function() {
    enhanceLoginForm();
    initializeLoginActivityTracking();
});

// Enhance existing login form with 2FA
function enhanceLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.removeEventListener('submit', handleLogin);
    loginForm.addEventListener('submit', handleEnhancedLogin);
}

// Enhanced login handler with 2FA
async function handleEnhancedLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        showAlert('Please fill in all fields.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    try {
        // Simulate login verification
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if user exists and password is correct
        const users = Storage.get('users', []);
        const user = users.find(u => u.email === email);
        
        if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
        }
        
        // Log login attempt
        logActivity('login', `Login attempt for ${email}`, 'info');
        
        // Check if 2FA is enabled
        const userData = Storage.get('userData', {});
        if (userData.security?.twoFactorEnabled) {
            // Show 2FA verification
            show2FAVerification(user);
        } else {
            // Complete login without 2FA
            completeLogin(user);
        }
        
    } catch (error) {
        showAlert(error.message, 'error');
        logActivity('login', `Failed login attempt for ${email}`, 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Show 2FA verification modal
function show2FAVerification(user) {
    const modal = create2FAVerificationModal();
    document.body.appendChild(modal);
    
    // Focus on code input
    setTimeout(() => {
        const codeInput = modal.querySelector('#tfa-code-input');
        if (codeInput) codeInput.focus();
    }, 100);
    
    // Handle verification
    const verifyBtn = modal.querySelector('#verify-tfa-login');
    verifyBtn.addEventListener('click', () => verify2FALogin(user, modal));
    
    // Handle backup code
    const backupBtn = modal.querySelector('#use-backup-code');
    backupBtn.addEventListener('click', () => showBackupCodeInput(modal));
    
    // Handle close
    const closeBtn = modal.querySelector('#close-tfa-verification');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
}

// Create 2FA verification modal
function create2FAVerificationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Two-Factor Authentication</h3>
                <button class="modal-close" id="close-tfa-verification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="tfa-verification-content">
                    <div class="tfa-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h4>Enter Authentication Code</h4>
                    <p>Please enter the 6-digit code from your authenticator app.</p>
                    
                    <div class="code-input-group">
                        <input type="text" id="tfa-code-input" maxlength="6" placeholder="000000" autocomplete="one-time-code">
                    </div>
                    
                    <div class="tfa-actions">
                        <button class="btn btn-primary" id="verify-tfa-login">
                            <i class="fas fa-check"></i>
                            Verify Code
                        </button>
                        <button class="btn btn-outline" id="use-backup-code">
                            <i class="fas fa-key"></i>
                            Use Backup Code
                        </button>
                    </div>
                    
                    <div class="tfa-help">
                        <p><small>Having trouble? <a href="#" id="tfa-help-link">Get help with 2FA</a></small></p>
                    </div>
                </div>
                
                <div class="backup-code-content" style="display: none;">
                    <div class="tfa-icon">
                        <i class="fas fa-key"></i>
                    </div>
                    <h4>Enter Backup Code</h4>
                    <p>Enter one of your backup codes to sign in.</p>
                    
                    <div class="code-input-group">
                        <input type="text" id="backup-code-input" placeholder="1234-5678" maxlength="9">
                    </div>
                    
                    <div class="tfa-actions">
                        <button class="btn btn-primary" id="verify-backup-code">
                            <i class="fas fa-check"></i>
                            Verify Backup Code
                        </button>
                        <button class="btn btn-outline" id="back-to-tfa">
                            <i class="fas fa-arrow-left"></i>
                            Back to 2FA
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Show backup code input
function showBackupCodeInput(modal) {
    const tfaContent = modal.querySelector('.tfa-verification-content');
    const backupContent = modal.querySelector('.backup-code-content');
    
    tfaContent.style.display = 'none';
    backupContent.style.display = 'block';
    
    // Focus on backup code input
    const backupInput = modal.querySelector('#backup-code-input');
    if (backupInput) backupInput.focus();
    
    // Handle back button
    const backBtn = modal.querySelector('#back-to-tfa');
    backBtn.addEventListener('click', () => {
        tfaContent.style.display = 'block';
        backupContent.style.display = 'none';
        
        const codeInput = modal.querySelector('#tfa-code-input');
        if (codeInput) codeInput.focus();
    });
    
    // Handle backup code verification
    const verifyBackupBtn = modal.querySelector('#verify-backup-code');
    verifyBackupBtn.addEventListener('click', () => {
        const backupCode = backupInput.value.trim();
        if (verifyBackupCode(backupCode)) {
            modal.remove();
            const user = getCurrentUser();
            completeLogin(user);
            logActivity('login', 'Logged in using backup code', 'success');
        } else {
            showAlert('Invalid backup code. Please try again.', 'error');
        }
    });
}

// Verify 2FA code for login
function verify2FALogin(user, modal) {
    const code = modal.querySelector('#tfa-code-input').value;
    
    if (!code || code.length !== 6) {
        showAlert('Please enter a valid 6-digit code.', 'error');
        return;
    }
    
    // Simulate 2FA verification (in real app, this would be server-side)
    if (code === '123456' || code.match(/^\d{6}$/)) {
        modal.remove();
        completeLogin(user);
        logActivity('login', 'Successfully logged in with 2FA', 'success');
    } else {
        showAlert('Invalid authentication code. Please try again.', 'error');
        
        // Clear the input
        modal.querySelector('#tfa-code-input').value = '';
    }
}

// Verify backup code
function verifyBackupCode(code) {
    // In a real app, this would check against stored backup codes
    const validCodes = ['1234-5678', '2345-6789', '3456-7890', '4567-8901', '5678-9012', '6789-0123'];
    return validCodes.includes(code);
}

// Complete login process
function completeLogin(user) {
    // Set current user
    Storage.set('currentUser', user);
    Storage.set('isLoggedIn', true);
    
    // Update last login time
    user.lastLogin = new Date().toISOString();
    const users = Storage.get('users', []);
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        Storage.set('users', users);
    }
    
    // Log successful login
    logActivity('login', `Successfully logged in as ${user.email}`, 'success');
    
    // Update UI after successful login
    updateUIAfterLogin(userData);
    
    // Update navigation profile
    if (typeof updateProfileVisibility === 'function') {
        updateProfileVisibility();
    }
    if (typeof loadUserProfile === 'function') {
        loadUserProfile();
    }
    
    // Show success message
    showNotification('Login successful! Welcome back!', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// Initialize login activity tracking
function initializeLoginActivityTracking() {
    logActivity('login', 'Visited login page', 'info');
    
    // Track failed attempts
    let failedAttempts = Storage.get('failedLoginAttempts', 0);
    
    // Reset failed attempts after successful login
    window.addEventListener('beforeunload', function() {
        if (Storage.get('isLoggedIn')) {
            Storage.set('failedLoginAttempts', 0);
        }
    });
}

// Enhanced logout with activity tracking
function enhancedLogout() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        logActivity('logout', `User ${currentUser.email} logged out`, 'info');
    }
    
    // Clear session data
    Storage.remove('currentUser');
    Storage.set('isLoggedIn', false);
    
    // Show logout message
    showAlert('You have been logged out successfully.', 'info');
    
    // Redirect to login
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// Add enhanced logout to global scope
window.enhancedLogout = enhancedLogout;

// Auto-logout after inactivity (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (Storage.get('isLoggedIn')) {
        inactivityTimer = setTimeout(() => {
            logActivity('logout', 'Auto-logout due to inactivity', 'warning');
            enhancedLogout();
        }, 30 * 60 * 1000); // 30 minutes
    }
}

// Track user activity for auto-logout
['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, true);
});

// Initialize inactivity timer
resetInactivityTimer();
