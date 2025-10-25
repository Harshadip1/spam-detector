// Report Scam Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeReportForm();
    loadRecentReports();
    updateReportStats();
});

// Sample recent reports data
const SAMPLE_REPORTS = [
    {
        id: 1,
        type: 'email',
        title: 'Fake PayPal Security Alert',
        description: 'Email claiming account suspension, asking to verify payment info',
        source: 'security@paypal-verify.net',
        urgency: 'high',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'verified'
    },
    {
        id: 2,
        type: 'website',
        title: 'Fake Amazon Login Page',
        description: 'Website mimicking Amazon login to steal credentials',
        source: 'amazon-secure.login-verify.com',
        urgency: 'critical',
        timestamp: '2024-01-15T09:15:00Z',
        status: 'blocked'
    },
    {
        id: 3,
        type: 'sms',
        title: 'Bank Account Frozen SMS',
        description: 'Text claiming bank account frozen, requesting immediate call',
        source: '+1-555-SCAM',
        urgency: 'medium',
        timestamp: '2024-01-15T08:45:00Z',
        status: 'investigating'
    },
    {
        id: 4,
        type: 'email',
        title: 'Cryptocurrency Investment Scam',
        description: 'Email promising guaranteed returns on Bitcoin investment',
        source: 'invest@crypto-profits.biz',
        urgency: 'medium',
        timestamp: '2024-01-14T16:20:00Z',
        status: 'verified'
    },
    {
        id: 5,
        type: 'social',
        title: 'Fake Tech Support Facebook Ad',
        description: 'Facebook ad claiming computer infected, requesting remote access',
        source: 'TechSupport Pro (Facebook)',
        urgency: 'high',
        timestamp: '2024-01-14T14:10:00Z',
        status: 'removed'
    },
    {
        id: 6,
        type: 'email',
        title: 'IRS Tax Refund Phishing',
        description: 'Email claiming tax refund available, requesting SSN verification',
        source: 'refunds@irs-treasury.org',
        urgency: 'high',
        timestamp: '2024-01-14T11:30:00Z',
        status: 'verified'
    }
];

let uploadedFiles = [];
let reportCount = 0;

// Initialize report form
function initializeReportForm() {
    const form = document.getElementById('scam-report-form');
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('evidence-files');
    const anonymousCheckbox = document.getElementById('anonymous-report');
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // File upload handling
    setupFileUpload(uploadArea, fileInput);
    
    // Anonymous report handling
    anonymousCheckbox.addEventListener('change', function() {
        const contactFields = document.querySelectorAll('#reporter-name, #reporter-email');
        contactFields.forEach(field => {
            field.disabled = this.checked;
            if (this.checked) {
                field.value = '';
            }
        });
    });
    
    // Report type selection
    const reportTypes = document.querySelectorAll('input[name="scamType"]');
    reportTypes.forEach(radio => {
        radio.addEventListener('change', function() {
            updateFormForType(this.value);
        });
    });
    
    // Auto-fill user info if logged in
    autoFillUserInfo();
}

// Setup file upload functionality
function setupFileUpload(uploadArea, fileInput) {
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

// Handle uploaded files
function handleFiles(files) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
    
    Array.from(files).forEach(file => {
        if (file.size > maxSize) {
            showAlert(`File "${file.name}" is too large. Maximum size is 10MB.`, 'error');
            return;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showAlert(`File type "${file.type}" is not supported.`, 'error');
            return;
        }
        
        uploadedFiles.push(file);
        displayUploadedFile(file);
    });
}

// Display uploaded file
function displayUploadedFile(file) {
    const uploadFiles = document.getElementById('upload-files');
    const fileDiv = document.createElement('div');
    fileDiv.className = 'uploaded-file';
    fileDiv.innerHTML = `
        <div class="file-info">
            <i class="fas fa-${getFileIcon(file.type)}"></i>
            <span class="file-name">${file.name}</span>
            <span class="file-size">${formatFileSize(file.size)}</span>
        </div>
        <button type="button" class="remove-file" onclick="removeFile('${file.name}')">
            <i class="fas fa-times"></i>
        </button>
    `;
    uploadFiles.appendChild(fileDiv);
}

// Get file icon based on type
function getFileIcon(type) {
    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf') return 'file-pdf';
    if (type === 'text/plain') return 'file-text';
    return 'file';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remove uploaded file
function removeFile(fileName) {
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    const fileElements = document.querySelectorAll('.uploaded-file');
    fileElements.forEach(element => {
        if (element.querySelector('.file-name').textContent === fileName) {
            element.remove();
        }
    });
}

// Update form based on selected type
function updateFormForType(type) {
    const sourceLabel = document.querySelector('label[for="scam-source"]');
    const sourceInput = document.getElementById('scam-source');
    
    switch (type) {
        case 'email':
            sourceLabel.textContent = 'Sender Email Address';
            sourceInput.placeholder = 'sender@example.com';
            break;
        case 'website':
            sourceLabel.textContent = 'Website URL';
            sourceInput.placeholder = 'https://suspicious-website.com';
            break;
        case 'sms':
            sourceLabel.textContent = 'Phone Number';
            sourceInput.placeholder = '+1-555-123-4567';
            break;
        case 'social':
            sourceLabel.textContent = 'Profile/Page Name';
            sourceInput.placeholder = 'Facebook page or profile name';
            break;
    }
}

// Auto-fill user information if logged in
function autoFillUserInfo() {
    const userData = Storage.get('userData', {});
    if (userData.email) {
        document.getElementById('reporter-email').value = userData.email;
    }
    if (userData.firstName && userData.lastName) {
        document.getElementById('reporter-name').value = `${userData.firstName} ${userData.lastName}`;
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const reportData = {
        id: Date.now(),
        type: formData.get('scamType'),
        title: formData.get('title'),
        source: formData.get('source'),
        description: formData.get('description'),
        content: formData.get('content'),
        financialLoss: formData.get('financialLoss'),
        urgencyLevel: formData.get('urgencyLevel'),
        reportedElsewhere: formData.get('reportedElsewhere') === 'on',
        reporterName: formData.get('anonymous') === 'on' ? 'Anonymous' : formData.get('reporterName'),
        reporterEmail: formData.get('anonymous') === 'on' ? '' : formData.get('reporterEmail'),
        anonymous: formData.get('anonymous') === 'on',
        files: uploadedFiles.map(f => f.name),
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    // Validate required fields
    if (!reportData.type || !reportData.title || !reportData.description || !reportData.urgencyLevel) {
        showAlert('Please fill in all required fields.', 'error');
        return;
    }
    
    // Submit report
    submitReport(reportData);
}

// Submit report
function submitReport(reportData) {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save report locally
        saveReport(reportData);
        
        // Show success message
        showSuccessMessage(reportData);
        
        // Reset form
        resetForm();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Update stats
        updateReportStats();
        
        // Log activity
        if (typeof logActivity === 'function') {
            logActivity('report', `Submitted ${reportData.type} scam report: ${reportData.title}`, 'success');
        }
    }, 2000);
}

// Save report to localStorage
function saveReport(reportData) {
    let reports = Storage.get('scamReports', []);
    reports.unshift(reportData);
    
    // Keep only last 100 reports
    if (reports.length > 100) {
        reports = reports.slice(0, 100);
    }
    
    Storage.set('scamReports', reports);
}

// Show success message
function showSuccessMessage(reportData) {
    const modal = document.createElement('div');
    modal.className = 'modal success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="success-header">
                <i class="fas fa-check-circle"></i>
                <h2>Report Submitted Successfully!</h2>
            </div>
            <div class="success-body">
                <p>Thank you for helping keep our community safe. Your report has been received and will be reviewed by our security team.</p>
                
                <div class="report-summary">
                    <h3>Report Summary:</h3>
                    <div class="summary-item">
                        <strong>Report ID:</strong> #${reportData.id}
                    </div>
                    <div class="summary-item">
                        <strong>Type:</strong> ${reportData.type.charAt(0).toUpperCase() + reportData.type.slice(1)}
                    </div>
                    <div class="summary-item">
                        <strong>Urgency:</strong> ${reportData.urgencyLevel.charAt(0).toUpperCase() + reportData.urgencyLevel.slice(1)}
                    </div>
                    <div class="summary-item">
                        <strong>Status:</strong> Under Review
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3>What happens next?</h3>
                    <ul>
                        <li>Our security team will review your report within 24-48 hours</li>
                        <li>If verified, the scam will be added to our detection database</li>
                        <li>You'll receive an email update on the report status (if provided)</li>
                        <li>The information will help protect other users from similar threats</li>
                    </ul>
                </div>
            </div>
            <div class="success-actions">
                <button class="btn btn-primary" onclick="closeSuccessModal()">
                    <i class="fas fa-check"></i>
                    Got it, thanks!
                </button>
                <button class="btn btn-outline" onclick="submitAnotherReport()">
                    <i class="fas fa-plus"></i>
                    Submit Another Report
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Auto-close after 10 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            closeSuccessModal();
        }
    }, 10000);
}

// Close success modal
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

// Submit another report
function submitAnotherReport() {
    closeSuccessModal();
    resetForm();
    document.getElementById('scam-report-form').scrollIntoView({ behavior: 'smooth' });
}

// Reset form
function resetForm() {
    document.getElementById('scam-report-form').reset();
    uploadedFiles = [];
    document.getElementById('upload-files').innerHTML = '';
    
    // Re-enable contact fields
    const contactFields = document.querySelectorAll('#reporter-name, #reporter-email');
    contactFields.forEach(field => {
        field.disabled = false;
    });
    
    // Re-fill user info
    autoFillUserInfo();
}

// Load recent reports
function loadRecentReports() {
    const reportsGrid = document.getElementById('reports-grid');
    const userReports = Storage.get('scamReports', []);
    
    // Combine user reports with sample data
    const allReports = [...userReports, ...SAMPLE_REPORTS]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 6);
    
    reportsGrid.innerHTML = allReports.map(report => `
        <div class="report-card" data-type="${report.type}">
            <div class="report-header">
                <div class="report-type">
                    <i class="fas fa-${getReportIcon(report.type)}"></i>
                    <span>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</span>
                </div>
                <div class="report-status status-${report.status}">
                    ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </div>
            </div>
            
            <h3 class="report-title">${report.title}</h3>
            <p class="report-description">${truncateText(report.description, 100)}</p>
            
            <div class="report-meta">
                <div class="report-source">
                    <i class="fas fa-link"></i>
                    <span>${truncateText(report.source || 'Source not provided', 30)}</span>
                </div>
                <div class="report-time">
                    <i class="fas fa-clock"></i>
                    <span>${formatTimeAgo(report.timestamp)}</span>
                </div>
            </div>
            
            <div class="report-urgency urgency-${report.urgency}">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${report.urgency ? report.urgency.charAt(0).toUpperCase() + report.urgency.slice(1) : 'Medium'} Priority</span>
            </div>
        </div>
    `).join('');
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-reports');
    loadMoreBtn.addEventListener('click', loadMoreReports);
}

// Get report icon
function getReportIcon(type) {
    const icons = {
        email: 'envelope',
        website: 'globe',
        sms: 'sms',
        social: 'users'
    };
    return icons[type] || 'exclamation-triangle';
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Format time ago
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
}

// Load more reports
function loadMoreReports() {
    // Simulate loading more reports
    const reportsGrid = document.getElementById('reports-grid');
    const loadMoreBtn = document.getElementById('load-more-reports');
    
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    setTimeout(() => {
        // Add more sample reports
        const moreReports = SAMPLE_REPORTS.slice(3, 6);
        moreReports.forEach(report => {
            const reportCard = document.createElement('div');
            reportCard.className = 'report-card';
            reportCard.innerHTML = `
                <div class="report-header">
                    <div class="report-type">
                        <i class="fas fa-${getReportIcon(report.type)}"></i>
                        <span>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</span>
                    </div>
                    <div class="report-status status-${report.status}">
                        ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </div>
                </div>
                
                <h3 class="report-title">${report.title}</h3>
                <p class="report-description">${truncateText(report.description, 100)}</p>
                
                <div class="report-meta">
                    <div class="report-source">
                        <i class="fas fa-link"></i>
                        <span>${truncateText(report.source, 30)}</span>
                    </div>
                    <div class="report-time">
                        <i class="fas fa-clock"></i>
                        <span>${formatTimeAgo(report.timestamp)}</span>
                    </div>
                </div>
                
                <div class="report-urgency urgency-${report.urgency}">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${report.urgency.charAt(0).toUpperCase() + report.urgency.slice(1)} Priority</span>
                </div>
            `;
            reportsGrid.appendChild(reportCard);
        });
        
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Reports';
        loadMoreBtn.disabled = false;
        loadMoreBtn.style.display = 'none'; // Hide after loading more
    }, 1500);
}

// Update report statistics
function updateReportStats() {
    const userReports = Storage.get('scamReports', []);
    const totalReports = 2847 + userReports.length;
    
    const statsElement = document.getElementById('total-reports');
    if (statsElement) {
        animateCounterLocal(statsElement, totalReports);
    }
}

// Animate counter (use global function if available)
function animateCounterLocal(element, targetValue) {
    // Use global animateCounter if available, otherwise use local implementation
    if (typeof window.animateCounter === 'function') {
        window.animateCounter(element, targetValue, 1000);
        return;
    }
    
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Make functions available globally
window.removeFile = removeFile;
window.closeSuccessModal = closeSuccessModal;
window.submitAnotherReport = submitAnotherReport;
window.resetForm = resetForm;
