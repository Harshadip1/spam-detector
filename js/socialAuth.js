// Social Authentication Manager - Google and GitHub OAuth
(function() {
    'use strict';

    class SocialAuth {
        constructor() {
            this.googleClientId = ''; // Will be set from environment or config
            this.githubClientId = ''; // Will be set from environment or config
            this.redirectUri = window.location.origin + '/auth/callback';
            this.init();
        }

        init() {
            this.loadGoogleAPI();
            this.setupEventListeners();
            console.log('🔐 Social Auth initialized');
        }

        loadGoogleAPI() {
            // Load Google Sign-In API
            if (!document.querySelector('script[src*="accounts.google.com"]')) {
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    this.initializeGoogleSignIn();
                };
                document.head.appendChild(script);
            }
        }

        initializeGoogleSignIn() {
            // For demo purposes, we'll use a mock client ID
            // In production, replace with your actual Google OAuth client ID
            const mockClientId = 'demo-google-client-id.apps.googleusercontent.com';
            
            try {
                if (window.google && window.google.accounts) {
                    window.google.accounts.id.initialize({
                        client_id: mockClientId,
                        callback: this.handleGoogleResponse.bind(this),
                        auto_select: false,
                        cancel_on_tap_outside: true
                    });
                }
            } catch (error) {
                console.log('Google Sign-In API not available, using mock authentication');
            }
        }

        setupEventListeners() {
            // Handle Google login buttons
            document.addEventListener('click', (e) => {
                if (e.target.closest('.social-btn.google')) {
                    e.preventDefault();
                    this.handleGoogleLogin();
                }
            });

            // Handle GitHub login buttons
            document.addEventListener('click', (e) => {
                if (e.target.closest('.social-btn.github')) {
                    e.preventDefault();
                    this.handleGitHubLogin();
                }
            });
        }

        handleGoogleLogin() {
            // Show loading state
            const googleBtns = document.querySelectorAll('.social-btn.google');
            googleBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
                btn.disabled = true;
            });

            // For demo purposes, simulate Google OAuth flow
            // In production, this would trigger the actual Google OAuth flow
            setTimeout(() => {
                this.simulateGoogleAuth();
            }, 1500);
        }

        handleGitHubLogin() {
            // Show loading state
            const githubBtns = document.querySelectorAll('.social-btn.github');
            githubBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
                btn.disabled = true;
            });

            // For demo purposes, simulate GitHub OAuth flow
            // In production, this would redirect to GitHub OAuth
            setTimeout(() => {
                this.simulateGitHubAuth();
            }, 1500);
        }

        simulateGoogleAuth() {
            // Simulate successful Google authentication
            const mockGoogleUser = {
                id: 'google_' + Date.now(),
                name: 'John Doe',
                email: 'john.doe@gmail.com',
                picture: 'https://via.placeholder.com/150/4285f4/ffffff?text=JD',
                provider: 'google',
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                theme: window.themeManager ? window.themeManager.getCurrentTheme() : 'dark'
            };

            this.completeAuth(mockGoogleUser, 'google_token_' + Date.now());
        }

        simulateGitHubAuth() {
            // Simulate successful GitHub authentication
            const mockGitHubUser = {
                id: 'github_' + Date.now(),
                name: 'John Developer',
                email: 'john.dev@github.com',
                picture: 'https://via.placeholder.com/150/333333/ffffff?text=JD',
                provider: 'github',
                joinDate: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
                theme: window.themeManager ? window.themeManager.getCurrentTheme() : 'dark'
            };

            this.completeAuth(mockGitHubUser, 'github_token_' + Date.now());
        }

        handleGoogleResponse(response) {
            // Handle actual Google OAuth response
            try {
                const payload = this.parseJWT(response.credential);
                const googleUser = {
                    id: 'google_' + payload.sub,
                    name: payload.name,
                    email: payload.email,
                    picture: payload.picture,
                    provider: 'google',
                    joinDate: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    theme: window.themeManager ? window.themeManager.getCurrentTheme() : 'dark'
                };

                this.completeAuth(googleUser, response.credential);
            } catch (error) {
                console.error('Google auth error:', error);
                this.handleAuthError('google', 'Failed to authenticate with Google');
            }
        }

        parseJWT(token) {
            // Parse JWT token payload
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (error) {
                throw new Error('Invalid JWT token');
            }
        }

        completeAuth(userData, token) {
            try {
                // Use auth manager for login if available
                if (window.authManager && window.authManager.login(userData, token)) {
                    // Show success message
                    if (window.showAlert) {
                        window.showAlert(`Welcome ${userData.name}! Logged in with ${userData.provider.charAt(0).toUpperCase() + userData.provider.slice(1)}.`, 'success');
                    }

                    // Log activity
                    if (window.logActivity) {
                        window.logActivity(`Logged in via ${userData.provider.charAt(0).toUpperCase() + userData.provider.slice(1)}`);
                    }

                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    throw new Error('Authentication failed');
                }
            } catch (error) {
                console.error('Auth completion error:', error);
                this.handleAuthError(userData.provider, 'Authentication failed. Please try again.');
            }
        }

        handleAuthError(provider, message) {
            // Reset button states
            this.resetButtonStates();

            // Show error message
            if (window.showAlert) {
                window.showAlert(message, 'error');
            }

            console.error(`${provider} auth error:`, message);
        }

        resetButtonStates() {
            // Reset Google buttons
            const googleBtns = document.querySelectorAll('.social-btn.google');
            googleBtns.forEach(btn => {
                btn.innerHTML = '<i class="fab fa-google"></i> Google';
                btn.disabled = false;
            });

            // Reset GitHub buttons
            const githubBtns = document.querySelectorAll('.social-btn.github');
            githubBtns.forEach(btn => {
                btn.innerHTML = '<i class="fab fa-github"></i> GitHub';
                btn.disabled = false;
            });
        }

        // Production methods for actual OAuth implementation
        initiateGoogleOAuth() {
            // In production, use actual Google OAuth
            const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
                `client_id=${this.googleClientId}&` +
                `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
                `response_type=code&` +
                `scope=openid email profile&` +
                `state=google_${Date.now()}`;
            
            window.location.href = googleAuthUrl;
        }

        initiateGitHubOAuth() {
            // In production, use actual GitHub OAuth
            const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
                `client_id=${this.githubClientId}&` +
                `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
                `scope=user:email&` +
                `state=github_${Date.now()}`;
            
            window.location.href = githubAuthUrl;
        }

        // Handle OAuth callback (for production)
        handleOAuthCallback() {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');

            if (error) {
                this.handleAuthError('oauth', 'Authentication was cancelled or failed');
                return;
            }

            if (code && state) {
                if (state.startsWith('google_')) {
                    this.exchangeGoogleCode(code);
                } else if (state.startsWith('github_')) {
                    this.exchangeGitHubCode(code);
                }
            }
        }

        async exchangeGoogleCode(code) {
            // In production, exchange code for tokens on your backend
            try {
                const response = await fetch('/auth/google/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code })
                });

                const data = await response.json();
                if (data.success) {
                    this.completeAuth(data.user, data.token);
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                this.handleAuthError('google', 'Failed to complete Google authentication');
            }
        }

        async exchangeGitHubCode(code) {
            // In production, exchange code for tokens on your backend
            try {
                const response = await fetch('/auth/github/callback', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code })
                });

                const data = await response.json();
                if (data.success) {
                    this.completeAuth(data.user, data.token);
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                this.handleAuthError('github', 'Failed to complete GitHub authentication');
            }
        }
    }

    // Initialize social auth
    let socialAuth;

    function initializeSocialAuth() {
        if (!socialAuth) {
            socialAuth = new SocialAuth();
            
            // Make it globally available
            window.socialAuth = socialAuth;
        }
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSocialAuth);
    } else {
        initializeSocialAuth();
    }

    // Also initialize immediately for early access
    initializeSocialAuth();

    console.log('🔐 Social Auth module loaded');
})();
