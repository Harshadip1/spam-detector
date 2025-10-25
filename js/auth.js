// Authentication JavaScript

// Initialize authentication system
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    checkAuthRedirect();
});

function initializeAuth() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const switchLink = document.getElementById('switch-link');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const switchText = document.getElementById('switch-text');
    
    let isLoginMode = true;
    
    // Handle form switching
    if (switchLink) {
        switchLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleAuthMode();
        });
    }
    
    function toggleAuthMode() {
        isLoginMode = !isLoginMode;
        
        if (isLoginMode) {
            // Switch to login mode
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            authTitle.textContent = 'Welcome Back';
            authSubtitle.textContent = 'Sign in to your SecureMessage AI account';
            switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switch-link">Sign up here</a>';
        } else {
            // Switch to signup mode
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            authTitle.textContent = 'Create Account';
            authSubtitle.textContent = 'Join SecureMessage AI for advanced protection';
            switchText.innerHTML = 'Already have an account? <a href="#" id="switch-link">Sign in here</a>';
        }
        
        // Re-attach event listener to new switch link
        const newSwitchLink = document.getElementById('switch-link');
        if (newSwitchLink) {
            newSwitchLink.addEventListener('click', (e) => {
                e.preventDefault();
                toggleAuthMode();
            });
        }
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Password strength indicator for signup
    const signupPassword = document.getElementById('signup-password');
    if (signupPassword) {
        signupPassword.addEventListener('input', updatePasswordStrength);
    }
    
    // Confirm password validation
    const confirmPassword = document.getElementById('confirm-password');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }
    
    // Social authentication buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialAuth);
    });
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Validate inputs
    if (!email || !password) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    submitBtn.disabled = true;
    
    try {
        // Call backend API for login
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Store authentication token
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('currentUser', JSON.stringify(data.data.user));
            
            // Store remember me preference
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            throw new Error(data.message || 'Login failed');
        }
        
    } catch (error) {
        // Fallback to localStorage for demo
        console.log('API not available, using localStorage fallback');
        
        const users = Storage.get('users', []);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Successful login with fallback
            const loginData = {
                ...user,
                lastLogin: new Date().toISOString(),
                rememberMe: rememberMe
            };
            
            // Store current user
            Storage.set('currentUser', loginData);
            localStorage.setItem('authToken', 'demo_token_' + Date.now());
            
            // Update user's last login
            const updatedUsers = users.map(u => 
                u.email === email ? { ...u, lastLogin: loginData.lastLogin } : u
            );
            Storage.set('users', updatedUsers);
            
            showAlert('Login successful! Redirecting to dashboard...', 'success');
            
            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
            
        } else {
            showAlert('Invalid email or password', 'error');
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Handle signup form submission
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        showAlert(passwordValidation.feedback, 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('Please agree to the Terms of Service.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if user already exists
        const users = Storage.get('users', []);
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            throw new Error('An account with this email already exists');
        }
        
        // Create new user
        const newUser = {
            id: generateUserId(),
            name: name,
            email: email,
            password: password, // In real app, this would be hashed
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                firstName: name.split(' ')[0] || '',
                lastName: name.split(' ').slice(1).join(' ') || '',
                phone: '',
                bio: ''
            }
        };
        
        // Save user
        users.push(newUser);
        Storage.set('users', users);
        Storage.set('currentUser', newUser);
        
        // Initialize user stats
        Storage.set('userStats', {
            totalScans: 0,
            spamDetected: 0,
            safeMessages: 0,
            suspiciousMessages: 0
        });
        
        showAlert('Account created successfully! Redirecting...', 'success');
        
        // Redirect after short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
        
    } catch (error) {
        showAlert(error.message || 'Signup failed. Please try again.', 'error');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Update password strength indicator
function updatePasswordStrength() {
    const password = document.getElementById('signup-password').value;
    const strengthIndicator = document.getElementById('password-strength');
    
    if (!strengthIndicator) return;
    
    const validation = validatePassword(password);
    
    if (password.length === 0) {
        strengthIndicator.innerHTML = '';
        return;
    }
    
    const strengthColors = {
        1: '#ff4757', // Very weak - red
        2: '#ff6b35', // Weak - orange
        3: '#ffd700', // Fair - yellow
        4: '#2ed573', // Good - light green
        5: '#39ff14'  // Strong - bright green
    };
    
    const strengthText = validation.feedback;
    const strengthColor = strengthColors[validation.strength] || '#ff4757';
    
    strengthIndicator.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
            <div style="flex: 1; height: 4px; background: var(--accent-bg); border-radius: 2px; overflow: hidden;">
                <div style="width: ${(validation.strength / 5) * 100}%; height: 100%; background: ${strengthColor}; transition: width 0.3s ease;"></div>
            </div>
            <span style="font-size: 0.875rem; color: ${strengthColor};">${strengthText}</span>
        </div>
    `;
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const confirmInput = document.getElementById('confirm-password');
    
    if (confirmPassword.length === 0) {
        confirmInput.style.borderColor = 'rgba(0, 212, 255, 0.3)';
        return;
    }
    
    if (password === confirmPassword) {
        confirmInput.style.borderColor = 'var(--success-color)';
    } else {
        confirmInput.style.borderColor = 'var(--danger-color)';
    }
}

// Handle social authentication
function handleSocialAuth(e) {
    e.preventDefault();
    const provider = e.currentTarget.classList.contains('google-btn') ? 'Google' : 'GitHub';
    showAlert(`${provider} authentication is not available in this demo.`, 'info');
}

// Generate unique user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Check if user should be redirected
function checkAuthRedirect() {
    const currentUser = getCurrentUser();
    const currentPage = window.location.pathname.split('/').pop();
    
    // If user is logged in and on login page, redirect to profile
    if (currentUser && currentPage === 'login.html') {
        window.location.href = 'profile.html';
    }
}

// Logout function
function logout() {
    Storage.remove('currentUser');
    showAlert('Logged out successfully.', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Export logout function for global use
window.logout = logout;
