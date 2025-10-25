// Download Page JavaScript

// Initialize download page
document.addEventListener('DOMContentLoaded', function() {
    initializeDownloadButtons();
    initializeInstallationGuide();
    initializeFeatureComparison();
    trackDownloadStats();
    generateQRCodes();
});

// Initialize download buttons
function initializeDownloadButtons() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', handleDownload);
    });
}

// Handle download button clicks
function handleDownload(e) {
    e.preventDefault();
    
    const button = e.currentTarget;
    const platform = getPlatformFromButton(button);
    
    // Track download attempt
    trackDownload(platform);
    
    // Show download modal or redirect (in real app)
    showDownloadModal(platform);
    
    // Add visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Get platform from button classes
function getPlatformFromButton(button) {
    if (button.classList.contains('ios-btn')) return 'iOS';
    if (button.classList.contains('android-btn')) return 'Android';
    if (button.classList.contains('windows-btn')) return 'Windows';
    if (button.classList.contains('mac-btn')) return 'macOS';
    if (button.classList.contains('chrome-btn')) return 'Chrome';
    if (button.classList.contains('firefox-btn')) return 'Firefox';
    return 'Unknown';
}

// Show download modal
function showDownloadModal(platform) {
    const modal = createDownloadModal(platform);
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        closeDownloadModal(modal);
    }, 5000);
}

// Create download modal
function createDownloadModal(platform) {
    const modal = document.createElement('div');
    modal.className = 'download-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        backdrop-filter: blur(5px);
    `;
    
    const downloadInfo = getDownloadInfo(platform);
    
    modal.innerHTML = `
        <div class="modal-content" style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            background: var(--card-bg);
            border-radius: var(--radius-lg);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            text-align: center;
            transition: transform 0.3s ease;
            border: 1px solid rgba(0, 212, 255, 0.3);
        ">
            <div style="margin-bottom: 1.5rem;">
                <i class="${downloadInfo.icon}" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Download ${platform} App</h3>
                <p style="color: var(--text-secondary);">${downloadInfo.description}</p>
            </div>
            
            <div style="background: var(--accent-bg); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">
                    <i class="fas fa-info-circle"></i> Demo Notice
                </p>
                <p style="color: var(--text-primary); font-size: 0.875rem;">
                    This is a demonstration. In a real application, the ${platform} app would begin downloading now.
                </p>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="closeDownloadModal(this.closest('.download-modal'))" class="btn btn-primary">
                    <i class="fas fa-check"></i> Got it
                </button>
                <button onclick="window.open('${downloadInfo.storeUrl}', '_blank')" class="btn btn-outline">
                    <i class="fas fa-external-link-alt"></i> Visit Store
                </button>
            </div>
        </div>
    `;
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDownloadModal(modal);
        }
    });
    
    return modal;
}

// Get download information for platform
function getDownloadInfo(platform) {
    const downloadInfo = {
        'iOS': {
            icon: 'fab fa-apple',
            description: 'Download from the App Store for iPhone and iPad',
            storeUrl: 'https://apps.apple.com'
        },
        'Android': {
            icon: 'fab fa-android',
            description: 'Get it on Google Play for Android devices',
            storeUrl: 'https://play.google.com'
        },
        'Windows': {
            icon: 'fab fa-windows',
            description: 'Download the desktop application for Windows',
            storeUrl: 'https://microsoft.com'
        },
        'macOS': {
            icon: 'fab fa-apple',
            description: 'Download the desktop application for Mac',
            storeUrl: 'https://apps.apple.com'
        },
        'Chrome': {
            icon: 'fab fa-chrome',
            description: 'Add the extension to Google Chrome',
            storeUrl: 'https://chrome.google.com/webstore'
        },
        'Firefox': {
            icon: 'fab fa-firefox',
            description: 'Install the add-on for Mozilla Firefox',
            storeUrl: 'https://addons.mozilla.org'
        }
    };
    
    return downloadInfo[platform] || {
        icon: 'fas fa-download',
        description: 'Download the application',
        storeUrl: '#'
    };
}

// Close download modal
function closeDownloadModal(modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300);
}

// Track download attempts
function trackDownload(platform) {
    let downloadStats = Storage.get('downloadStats', {});
    
    if (!downloadStats[platform]) {
        downloadStats[platform] = 0;
    }
    
    downloadStats[platform]++;
    downloadStats.total = (downloadStats.total || 0) + 1;
    downloadStats.lastDownload = new Date().toISOString();
    
    Storage.set('downloadStats', downloadStats);
    
    // Show success message
    showAlert(`${platform} download initiated! Check your downloads folder.`, 'success');
}

// Initialize installation guide tabs
function initializeInstallationGuide() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.guide-tabs .tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(`${tabId}-guide`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Animate steps
                animateSteps(targetContent);
            }
        });
    });
}

// Animate installation steps
function animateSteps(container) {
    const steps = container.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            step.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            step.style.opacity = '1';
            step.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Initialize feature comparison table
function initializeFeatureComparison() {
    const table = document.querySelector('.comparison-table table');
    if (!table) return;
    
    // Add hover effects to rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(0, 212, 255, 0.05)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.background = 'transparent';
        });
    });
    
    // Animate table on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateTable(table);
                observer.unobserve(entry.target);
            }
        });
    });
    
    observer.observe(table);
}

// Animate comparison table
function animateTable(table) {
    const rows = table.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            row.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Track download statistics
function trackDownloadStats() {
    const stats = Storage.get('downloadStats', {});
    
    // Update download count in hero section if element exists
    const downloadCount = document.querySelector('.download-stats .stat-number');
    if (downloadCount && stats.total) {
        // Animate counter
        animateCounter(downloadCount, stats.total, 1000000); // Start from 1M base
    }
}

// Animate counter
function animateCounter(element, targetValue, baseValue = 0) {
    const startValue = baseValue;
    const endValue = baseValue + (targetValue || 0);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
        
        // Format number
        if (currentValue >= 1000000) {
            element.textContent = (currentValue / 1000000).toFixed(1) + 'M+';
        } else if (currentValue >= 1000) {
            element.textContent = (currentValue / 1000).toFixed(0) + 'K+';
        } else {
            element.textContent = currentValue + '+';
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// System requirements checker (placeholder)
function checkSystemRequirements(platform) {
    // This would check actual system requirements in a real app
    const requirements = {
        'iOS': () => /iPad|iPhone|iPod/.test(navigator.userAgent),
        'Android': () => /Android/.test(navigator.userAgent),
        'Windows': () => /Windows/.test(navigator.userAgent),
        'macOS': () => /Mac/.test(navigator.userAgent),
        'Chrome': () => /Chrome/.test(navigator.userAgent),
        'Firefox': () => /Firefox/.test(navigator.userAgent)
    };
    
    return requirements[platform] ? requirements[platform]() : false;
}

// Generate QR codes for mobile apps
function generateQRCodes() {
    generateQRCode('ios-qr', 'https://apps.apple.com/app/securemessage-ai');
    generateQRCode('android-qr', 'https://play.google.com/store/apps/details?id=com.securemessage.ai');
}

// Generate individual QR code
function generateQRCode(elementId, url) {
    const qrElement = document.getElementById(elementId);
    if (!qrElement) return;
    
    const canvas = qrElement.querySelector('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const size = 120;
    
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Generate simple QR-like pattern (placeholder)
    // In a real app, you'd use a QR code library like qrcode.js
    generateQRPattern(ctx, size, url);
}

// Generate QR-like pattern (placeholder implementation)
function generateQRPattern(ctx, size, data) {
    const cellSize = size / 21; // 21x21 grid for QR code
    
    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Generate pattern based on URL hash
    ctx.fillStyle = '#000000';
    const hash = simpleHash(data);
    
    // Draw finder patterns (corners)
    drawFinderPattern(ctx, 0, 0, cellSize);
    drawFinderPattern(ctx, 14 * cellSize, 0, cellSize);
    drawFinderPattern(ctx, 0, 14 * cellSize, cellSize);
    
    // Draw data pattern
    for (let i = 0; i < 21; i++) {
        for (let j = 0; j < 21; j++) {
            // Skip finder pattern areas
            if (isFinderArea(i, j)) continue;
            
            // Generate pseudo-random pattern based on hash
            if ((hash + i * 21 + j) % 3 === 0) {
                ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
}

// Draw QR finder pattern
function drawFinderPattern(ctx, x, y, cellSize) {
    // Outer square (7x7)
    ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);
    
    // Inner white square (5x5)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
    
    // Center black square (3x3)
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
}

// Check if position is in finder pattern area
function isFinderArea(i, j) {
    return (i < 9 && j < 9) || // Top-left
           (i > 12 && j < 9) || // Top-right
           (i < 9 && j > 12);   // Bottom-left
}

// Simple hash function for generating patterns
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

// Make functions available globally
window.closeDownloadModal = closeDownloadModal;
