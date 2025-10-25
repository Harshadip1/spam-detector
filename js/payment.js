// Payment Processing JavaScript for SecureMessage AI
(function() {
    'use strict';

    // Payment configuration
    const PAYMENT_CONFIG = {
        taxRate: 0.18, // 18% GST in India
        currency: 'INR',
        supportedMethods: ['upi', 'card', 'netbanking'],
        plans: {
            basic: {
                name: 'Basic Plan',
                monthly: 749,
                yearly: 7490,
                features: [
                    '1,000 scans per month',
                    'Basic spam detection',
                    'Email support',
                    'Standard filters'
                ]
            },
            pro: {
                name: 'Pro Plan',
                monthly: 2399,
                yearly: 23990,
                features: [
                    '10,000 scans per month',
                    'Advanced AI detection',
                    'Priority support',
                    'Custom filters',
                    'API access'
                ]
            },
            enterprise: {
                name: 'Enterprise Plan',
                monthly: 8199,
                yearly: 81990,
                features: [
                    'Unlimited scans',
                    'Enterprise AI suite',
                    '24/7 phone support',
                    'API access',
                    'Custom integrations'
                ]
            }
        }
    };

    // Payment manager class
    class PaymentManager {
        constructor() {
            this.currentPlan = null;
            this.currentCycle = 'monthly';
            this.selectedMethod = 'card';
            this.init();
        }

        init() {
            this.loadPlanFromURL();
            this.setupEventListeners();
            this.validateForm();
        }

        loadPlanFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const planType = urlParams.get('plan') || 'pro';
            const cycle = urlParams.get('cycle') || 'monthly';

            this.currentPlan = PAYMENT_CONFIG.plans[planType];
            this.currentCycle = cycle;

            if (this.currentPlan) {
                this.updatePlanDisplay();
                this.updateBillingCycle();
            }
        }

        updatePlanDisplay() {
            const planInfo = document.getElementById('selected-plan');
            if (!planInfo || !this.currentPlan) return;

            const price = this.currentPlan[this.currentCycle];
            const period = this.currentCycle === 'yearly' ? '/year' : '/month';

            planInfo.innerHTML = `
                <div class="plan-name">${this.currentPlan.name}</div>
                <div class="plan-price">₹${price.toLocaleString('en-IN')}${period}</div>
                <ul class="plan-features">
                    ${this.currentPlan.features.map(feature => 
                        `<li><i class="fas fa-check"></i> ${feature}</li>`
                    ).join('')}
                </ul>
            `;

            this.updateTotals(price);
        }

        updateBillingCycle() {
            const cycleOptions = document.querySelectorAll('.cycle-option');
            cycleOptions.forEach(option => {
                option.classList.remove('active');
                if (option.dataset.cycle === this.currentCycle) {
                    option.classList.add('active');
                }
            });
        }

        updateTotals(subtotal) {
            const tax = Math.round(subtotal * PAYMENT_CONFIG.taxRate);
            const total = subtotal + tax;

            const subtotalEl = document.getElementById('subtotal');
            const taxEl = document.getElementById('tax');
            const totalEl = document.getElementById('total');

            if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
            if (taxEl) taxEl.textContent = `₹${tax.toLocaleString('en-IN')}`;
            if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
        }

        setupEventListeners() {
            // Billing cycle toggle
            const cycleOptions = document.querySelectorAll('.cycle-option');
            cycleOptions.forEach(option => {
                option.addEventListener('click', () => {
                    this.currentCycle = option.dataset.cycle;
                    this.updatePlanDisplay();
                    this.updateBillingCycle();
                    this.updateURL();
                });
            });

            // Payment method selection
            const paymentMethods = document.querySelectorAll('.payment-method');
            paymentMethods.forEach(method => {
                method.addEventListener('click', () => {
                    paymentMethods.forEach(m => m.classList.remove('active'));
                    method.classList.add('active');
                    this.selectedMethod = method.dataset.method;
                    this.updatePaymentForm();
                });
            });

            // Form submission
            const form = document.getElementById('payment-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.processPayment();
                });
            }

            // Card formatting
            this.setupCardFormatting();
        }

        updateURL() {
            const urlParams = new URLSearchParams(window.location.search);
            const plan = urlParams.get('plan') || 'pro';
            const newUrl = `${window.location.pathname}?plan=${plan}&cycle=${this.currentCycle}`;
            window.history.replaceState({}, '', newUrl);
        }

        updatePaymentForm() {
            const form = document.getElementById('payment-form');
            if (!form) return;

            const cardFields = form.querySelectorAll('#card-number, #expiry, #cvv, #cardholder');
            const sections = form.querySelectorAll('.payment-section');
            
            // Hide all sections first
            sections.forEach(section => section.classList.remove('active'));
            
            if (this.selectedMethod === 'upi') {
                const upiSection = document.getElementById('upi-section');
                if (upiSection) upiSection.classList.add('active');
                cardFields.forEach(field => {
                    field.closest('.form-group').style.display = 'none';
                });
            } else if (this.selectedMethod === 'netbanking') {
                const netbankingSection = document.getElementById('netbanking-section');
                if (netbankingSection) netbankingSection.classList.add('active');
                cardFields.forEach(field => {
                    field.closest('.form-group').style.display = 'none';
                });
            } else {
                cardFields.forEach(field => {
                    field.closest('.form-group').style.display = 'block';
                });
            }
        }

        showCryptoInfo() {
            const modal = document.createElement('div');
            modal.className = 'crypto-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h3>Cryptocurrency Payment</h3>
                    <p>You will be redirected to our secure cryptocurrency payment processor to complete your transaction.</p>
                    <div class="crypto-options">
                        <div class="crypto-option">
                            <i class="fab fa-bitcoin"></i>
                            <span>Bitcoin (BTC)</span>
                        </div>
                        <div class="crypto-option">
                            <i class="fab fa-ethereum"></i>
                            <span>Ethereum (ETH)</span>
                        </div>
                        <div class="crypto-option">
                            <i class="fas fa-coins"></i>
                            <span>Other Cryptocurrencies</span>
                        </div>
                    </div>
                    <button onclick="this.closest('.crypto-modal').remove()">Continue with Credit Card</button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        setupCardFormatting() {
            const cardNumber = document.getElementById('card-number');
            const expiry = document.getElementById('expiry');
            const cvv = document.getElementById('cvv');

            if (cardNumber) {
                cardNumber.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                    if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
                    e.target.value = formattedValue;
                });
            }

            if (expiry) {
                expiry.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    e.target.value = value;
                });
            }

            if (cvv) {
                cvv.addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
                });
            }
        }

        validateForm() {
            const form = document.getElementById('payment-form');
            if (!form) return true;

            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            // Email validation
            const email = document.getElementById('email');
            if (email && email.value && !this.isValidEmail(email.value)) {
                isValid = false;
                email.classList.add('error');
            }

            return isValid;
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        async processPayment() {
            if (!this.validateForm()) {
                this.showAlert('Please fill in all required fields correctly.', 'error');
                return;
            }

            const payButton = document.querySelector('.pay-button');
            if (!payButton) return;

            const originalText = payButton.innerHTML;
            
            // Show loading state
            payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...';
            payButton.disabled = true;

            try {
                // Simulate payment processing
                await this.simulatePaymentProcess();
                
                // Store subscription info
                this.storeSubscription();
                
                // Show success and redirect
                this.showAlert('Payment successful! Welcome to SecureMessage AI Premium!', 'success');
                
                setTimeout(() => {
                    window.location.href = 'payment-success.html';
                }, 2000);
                
            } catch (error) {
                console.error('Payment error:', error);
                this.showAlert('Payment failed. Please try again.', 'error');
                
                // Restore button
                payButton.innerHTML = originalText;
                payButton.disabled = false;
            }
        }

        simulatePaymentProcess() {
            return new Promise((resolve, reject) => {
                // Simulate different payment methods
                const processingTime = this.selectedMethod === 'card' ? 3000 : 
                                     this.selectedMethod === 'paypal' ? 2000 : 4000;
                
                setTimeout(() => {
                    // Simulate 95% success rate
                    if (Math.random() > 0.05) {
                        resolve();
                    } else {
                        reject(new Error('Payment processing failed'));
                    }
                }, processingTime);
            });
        }

        storeSubscription() {
            const urlParams = new URLSearchParams(window.location.search);
            const plan = urlParams.get('plan') || 'pro';
            
            const subscription = {
                plan: plan,
                cycle: this.currentCycle,
                startDate: new Date().toISOString(),
                status: 'active',
                paymentMethod: this.selectedMethod,
                amount: this.currentPlan[this.currentCycle],
                nextBilling: this.getNextBillingDate()
            };
            
            localStorage.setItem('userSubscription', JSON.stringify(subscription));
            
            // Log activity
            if (window.logActivity) {
                window.logActivity('subscription', 'upgrade', {
                    plan: plan,
                    cycle: this.currentCycle,
                    amount: subscription.amount
                });
            }
        }

        getNextBillingDate() {
            const now = new Date();
            if (this.currentCycle === 'yearly') {
                now.setFullYear(now.getFullYear() + 1);
            } else {
                now.setMonth(now.getMonth() + 1);
            }
            return now.toISOString();
        }

        showAlert(message, type = 'info') {
            // Try to use existing alert system
            if (window.showNotification) {
                window.showNotification(message, type);
                return;
            }

            // Fallback alert
            const alert = document.createElement('div');
            alert.className = `payment-alert ${type}`;
            alert.textContent = message;
            alert.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                background: ${type === 'error' ? '#dc3545' : '#28a745'};
                color: white;
                border-radius: 8px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    // Initialize payment manager when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.paymentManager = new PaymentManager();
        });
    } else {
        window.paymentManager = new PaymentManager();
    }

    // Expose payment manager globally
    window.PaymentManager = PaymentManager;

})();
