// Contact Page JavaScript

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeCharacterCounter();
});

// Initialize contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Real-time validation
    const requiredFields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', validateEmailField);
    }
}

// Handle contact form submission
async function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        privacyPolicy: formData.get('privacyPolicy') === 'on'
    };
    
    // Validate form
    if (!validateContactForm(contactData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Save contact submission to localStorage (for demo purposes)
        const submissions = Storage.get('contactSubmissions', []);
        const newSubmission = {
            ...contactData,
            id: generateSubmissionId(),
            timestamp: new Date().toISOString(),
            status: 'received'
        };
        submissions.push(newSubmission);
        Storage.set('contactSubmissions', submissions);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        e.target.reset();
        updateCharacterCount();
        
    } catch (error) {
        showAlert('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Validate contact form
function validateContactForm(data) {
    let isValid = true;
    
    // Check required fields
    if (!data.firstName.trim()) {
        showFieldError('first-name', 'First name is required');
        isValid = false;
    }
    
    if (!data.lastName.trim()) {
        showFieldError('last-name', 'Last name is required');
        isValid = false;
    }
    
    if (!data.email.trim()) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    if (!data.subject) {
        showFieldError('subject', 'Please select a subject');
        isValid = false;
    }
    
    if (!data.message.trim()) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (data.message.trim().length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    if (!data.privacyPolicy) {
        showAlert('Please agree to the Privacy Policy to continue.', 'error');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    // Remove existing error
    clearFieldError({ target: field });
    
    // Add error styling
    field.style.borderColor = 'var(--danger-color)';
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: var(--danger-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    // Insert error message after field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

// Clear field error
function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = 'rgba(0, 212, 255, 0.3)';
    
    // Remove error message
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        const fieldName = field.previousElementSibling.textContent.replace('*', '').trim();
        showFieldError(field.id, `${fieldName} is required`);
    }
}

// Validate email field specifically
function validateEmailField(e) {
    const field = e.target;
    const email = field.value.trim();
    
    if (email && !isValidEmail(email)) {
        showFieldError(field.id, 'Please enter a valid email address');
    }
}

// Initialize character counter for message field
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    if (messageField && charCount) {
        messageField.addEventListener('input', updateCharacterCount);
        updateCharacterCount(); // Initial count
    }
}

// Update character count
function updateCharacterCount() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    
    if (messageField && charCount) {
        const count = messageField.value.length;
        charCount.textContent = count;
        
        // Change color based on length
        if (count > 900) {
            charCount.style.color = 'var(--danger-color)';
        } else if (count > 700) {
            charCount.style.color = 'var(--warning-color)';
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
    }
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherAnswer.style.maxHeight = '0';
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = '0';
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
        
        // Initialize styles
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        icon.style.transition = 'transform 0.3s ease';
    });
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'block';
        
        // Add animation
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'scale(0.8)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modalContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 100);
    }
}

// Close success modal
function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Open live chat (placeholder function)
function openLiveChat() {
    showAlert('Live chat would open in a real application. For now, please use the contact form.', 'info');
}

// Generate submission ID
function generateSubmissionId() {
    return 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Make functions available globally
window.closeSuccessModal = closeSuccessModal;
window.openLiveChat = openLiveChat;
