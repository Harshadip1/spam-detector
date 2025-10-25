// API Service for SecureMessage AI - MongoDB Backend Integration
(function() {
    'use strict';

    class ApiService {
        constructor() {
            this.baseURL = '/api';
            this.token = localStorage.getItem('authToken');
        }

        // Set auth token for requests
        setToken(token) {
            this.token = token;
            if (token) {
                localStorage.setItem('authToken', token);
            } else {
                localStorage.removeItem('authToken');
            }
        }

        // Generic API request method
        async request(endpoint, options = {}) {
            const url = `${this.baseURL}${endpoint}`;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
                    ...options.headers
                },
                ...options
            };

            try {
                const response = await fetch(url, config);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                }

                return data;
            } catch (error) {
                console.error(`API request failed: ${endpoint}`, error);
                throw error;
            }
        }

        // Authentication methods
        async login(email, password) {
            try {
                const response = await this.request('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                if (response.success) {
                    this.setToken(response.data.token);
                    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                }

                return response;
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        }

        async register(userData) {
            try {
                const response = await this.request('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify(userData)
                });

                if (response.success) {
                    this.setToken(response.data.token);
                    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                }

                return response;
            } catch (error) {
                console.error('Registration failed:', error);
                throw error;
            }
        }

        async logout() {
            try {
                if (this.token) {
                    await this.request('/auth/logout', {
                        method: 'POST'
                    });
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // Clear local data regardless of API response
                this.setToken(null);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('userStats');
            }
        }

        async getCurrentUser() {
            try {
                const response = await this.request('/auth/me');

                if (response.success) {
                    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
                    return response.data.user;
                }

                return null;
            } catch (error) {
                console.error('Get current user error:', error);
                // Fallback to localStorage
                return this.getCurrentUserLocal();
            }
        }

        async checkAuthStatus() {
            try {
                const response = await this.request('/auth/check-status', {
                    method: 'POST'
                });

                if (response.authenticated) {
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    this.setToken(localStorage.getItem('authToken'));
                }

                return response;
            } catch (error) {
                console.error('Check auth status error:', error);
                // Fallback to localStorage check
                return {
                    authenticated: !!localStorage.getItem('currentUser'),
                    user: this.getCurrentUserLocal()
                };
            }
        }

        // LocalStorage fallback methods
        getCurrentUserLocal() {
            try {
                const userData = localStorage.getItem('currentUser');
                return userData ? JSON.parse(userData) : null;
            } catch (error) {
                console.error('Error getting current user from localStorage:', error);
                return null;
            }
        }

        // Health check
        async healthCheck() {
            try {
                const response = await fetch(`${this.baseURL}/health`);
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Health check failed:', error);
                return { status: 'ERROR', database: 'Disconnected' };
            }
        }

        // Spam detection (local fallback)
        analyzeMessage(message) {
            const spamKeywords = [
                'lottery', 'winner', 'prize', 'urgent', 'click here', 'free money',
                'congratulations', 'selected', 'claim now', 'limited time',
                'act now', 'don\'t miss', 'exclusive offer', 'guaranteed',
                'risk free', 'no obligation', 'bank account', 'social security',
                'password reset', 'verify account', 'suspicious activity'
            ];

            const lowerMessage = message.toLowerCase();
            let spamScore = 0;
            let detectedPatterns = [];

            spamKeywords.forEach(keyword => {
                if (lowerMessage.includes(keyword)) {
                    spamScore += 0.15;
                    detectedPatterns.push(keyword);
                }
            });

            // Check for URL patterns
            const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
            if (urlPattern.test(message)) {
                spamScore += 0.2;
                detectedPatterns.push('suspicious_link');
            }

            // Check for email patterns
            const emailPattern = /\S+@\S+\.\S+/g;
            if (emailPattern.test(message)) {
                spamScore += 0.1;
                detectedPatterns.push('email_address');
            }

            // Check for phone patterns
            const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
            if (phonePattern.test(message)) {
                spamScore += 0.1;
                detectedPatterns.push('phone_number');
            }

            // Determine risk level
            let riskLevel = 'low';
            if (spamScore > 0.6) riskLevel = 'high';
            else if (spamScore > 0.3) riskLevel = 'medium';

            return {
                isSpam: spamScore > 0.3,
                confidence: Math.min(spamScore, 1),
                riskLevel,
                detectedPatterns: [...new Set(detectedPatterns)],
                recommendation: spamScore > 0.6 ? 'Delete immediately' :
                              spamScore > 0.3 ? 'Review carefully' : 'Safe to read'
            };
        }
    }

    // Create global instance
    window.apiService = new ApiService();
})();