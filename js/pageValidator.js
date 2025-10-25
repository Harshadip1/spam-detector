// Page Validator - Ensures all pages are error-free and properly configured
// This script validates that all necessary scripts are loaded and functions are available

(function() {
    'use strict';

    // List of required functions that should be available on all pages
    const requiredFunctions = [
        'isValidEmail',
        'validatePassword', 
        'formatDate',
        'generateId',
        'showNotification',
        'getCurrentUser',
        'showAlert',
        'updateAuthUI',
        'logout',
        'Storage',
        'safeQuerySelector',
        'safeQuerySelectorAll',
        'safeAddEventListener',
        'toggleMobileMenu',
        'closeMobileMenu',
        'handleProfileCircleClick',
        'logActivity',
        'incrementMessagesCount'
    ];

    // List of required DOM elements that should exist on most pages
    const commonElements = [
        '.navbar',
        '.footer',
        '#hamburger',
        '#nav-menu'
    ];

    // Page-specific validation rules
    const pageValidation = {
        'index.html': {
            requiredElements: ['#spam-detector', '.hero'],
            requiredScripts: ['spam-detector.js', 'ai-classifier.js', 'advanced-detector.js']
        },
        'dashboard.html': {
            requiredElements: ['.dashboard-header', '.stats-grid'],
            requiredScripts: ['dashboard.js', 'navigation.js']
        },
        'login.html': {
            requiredElements: ['#login-form', '#signup-form'],
            requiredScripts: ['auth.js', 'enhanced-auth.js']
        },
        'profile.html': {
            requiredElements: ['.profile-header', '.profile-tabs'],
            requiredScripts: ['enhanced-auth.js', 'nav-profile.js', 'profile-editor.js']
        },
        'learn.html': {
            requiredElements: ['.learn-hero', '.articles-grid'],
            requiredScripts: ['learn.js']
        },
        'community.html': {
            requiredElements: ['.community-hero', '.forum-preview'],
            requiredScripts: ['community.js', 'chatbot.js']
        }
    };

    // Validation results
    let validationResults = {
        functions: {},
        elements: {},
        scripts: {},
        errors: [],
        warnings: [],
        passed: true
    };

    // Main validation function
    function validatePage() {
        console.log('🔍 Starting page validation...');
        
        validateRequiredFunctions();
        validateCommonElements();
        validatePageSpecificElements();
        validateScriptLoading();
        validateErrorHandling();
        
        displayValidationResults();
        
        return validationResults.passed;
    }

    // Validate that all required functions are available
    function validateRequiredFunctions() {
        console.log('📋 Validating required functions...');
        
        requiredFunctions.forEach(funcName => {
            const isAvailable = typeof window[funcName] !== 'undefined';
            validationResults.functions[funcName] = isAvailable;
            
            if (!isAvailable) {
                validationResults.errors.push(`Missing function: ${funcName}`);
                validationResults.passed = false;
            }
        });
    }

    // Validate common DOM elements
    function validateCommonElements() {
        console.log('🏗️ Validating common elements...');
        
        commonElements.forEach(selector => {
            const element = document.querySelector(selector);
            const exists = element !== null;
            validationResults.elements[selector] = exists;
            
            if (!exists) {
                validationResults.warnings.push(`Missing common element: ${selector}`);
            }
        });
    }

    // Validate page-specific elements
    function validatePageSpecificElements() {
        const currentPage = getCurrentPageName();
        const pageRules = pageValidation[currentPage];
        
        if (pageRules && pageRules.requiredElements) {
            console.log(`🎯 Validating ${currentPage} specific elements...`);
            
            pageRules.requiredElements.forEach(selector => {
                const element = document.querySelector(selector);
                const exists = element !== null;
                validationResults.elements[selector] = exists;
                
                if (!exists) {
                    validationResults.warnings.push(`Missing page element for ${currentPage}: ${selector}`);
                }
            });
        }
    }

    // Validate script loading
    function validateScriptLoading() {
        console.log('📜 Validating script loading...');
        
        const scripts = document.querySelectorAll('script[src]');
        const loadedScripts = Array.from(scripts).map(script => {
            const src = script.getAttribute('src');
            return src ? src.split('/').pop() : null;
        }).filter(Boolean);
        
        // Check for required core scripts
        const coreScripts = [
            'missingFilesFix.js',
            'utils.js', 
            'storage.js',
            'errorFix.js',
            'profileClickHandler.js',
            'userInterface.js',
            'main.js'
        ];
        
        coreScripts.forEach(scriptName => {
            const isLoaded = loadedScripts.includes(scriptName);
            validationResults.scripts[scriptName] = isLoaded;
            
            if (!isLoaded) {
                validationResults.errors.push(`Missing core script: ${scriptName}`);
                validationResults.passed = false;
            }
        });
        
        // Check page-specific scripts
        const currentPage = getCurrentPageName();
        const pageRules = pageValidation[currentPage];
        
        if (pageRules && pageRules.requiredScripts) {
            pageRules.requiredScripts.forEach(scriptName => {
                const isLoaded = loadedScripts.includes(scriptName);
                validationResults.scripts[scriptName] = isLoaded;
                
                if (!isLoaded) {
                    validationResults.warnings.push(`Missing page script for ${currentPage}: ${scriptName}`);
                }
            });
        }
    }

    // Validate error handling
    function validateErrorHandling() {
        console.log('🛡️ Validating error handling...');
        
        // Test that error handlers are working
        try {
            // Test safe DOM queries
            if (typeof safeQuerySelector === 'function') {
                safeQuerySelector('#non-existent-element');
            } else {
                validationResults.errors.push('safeQuerySelector function not available');
                validationResults.passed = false;
            }
            
            // Test storage operations
            if (typeof Storage !== 'undefined' && Storage.get) {
                Storage.get('test-key', 'default-value');
            } else {
                validationResults.errors.push('Storage object not properly configured');
                validationResults.passed = false;
            }
            
            // Test authentication functions
            if (typeof getCurrentUser === 'function') {
                getCurrentUser();
            } else {
                validationResults.errors.push('getCurrentUser function not available');
                validationResults.passed = false;
            }
            
        } catch (error) {
            validationResults.errors.push(`Error handling test failed: ${error.message}`);
            validationResults.passed = false;
        }
    }

    // Get current page name
    function getCurrentPageName() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }

    // Display validation results
    function displayValidationResults() {
        console.log('\n📊 VALIDATION RESULTS:');
        console.log('='.repeat(50));
        
        // Create visual indicator on page (disabled)
        // createValidationIndicator();
        
        if (validationResults.passed) {
            console.log('✅ VALIDATION PASSED - Page is error-free!');
        } else {
            console.log('❌ VALIDATION FAILED - Errors found!');
        }
        
    }
    
    // Create visual indicator on page
    function createValidationIndicator() {
        console.log('\n📋 Function Availability:');
        Object.entries(validationResults.functions).forEach(([func, available]) => {
            console.log(`  ${available ? '✅' : '❌'} ${func}`);
        });
        
        // Element existence
        console.log('\n🏗️ Element Existence:');
        Object.entries(validationResults.elements).forEach(([selector, exists]) => {
            console.log(`  ${exists ? '✅' : '⚠️'} ${selector}`);
        });
        
        // Script loading
        console.log('\n📜 Script Loading:');
        Object.entries(validationResults.scripts).forEach(([script, loaded]) => {
            console.log(`  ${loaded ? '✅' : '❌'} ${script}`);
        });
        
        // Errors
        if (validationResults.errors.length > 0) {
            console.log('\n❌ ERRORS:');
            validationResults.errors.forEach(error => {
                console.log(`  • ${error}`);
            });
        }
        
        // Warnings
        if (validationResults.warnings.length > 0) {
            console.log('\n⚠️ WARNINGS:');
            validationResults.warnings.forEach(warning => {
                console.log(`  • ${warning}`);
            });
        }
        // Remove existing indicator
        const existing = document.getElementById('validation-indicator');
        if (existing) {
            existing.remove();
        }
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.id = 'validation-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 8px 12px;
            border-radius: 4px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            cursor: pointer;
            ${validationResults.passed ? 
                'background: #28a745; border: 2px solid #1e7e34;' : 
                'background: #dc3545; border: 2px solid #c82333;'
            }
        `;
        
        const errorCount = validationResults.errors.length;
        const warningCount = validationResults.warnings.length;
        
        indicator.innerHTML = validationResults.passed ? 
            '✅ Page Valid' : 
            `❌ ${errorCount} Error${errorCount !== 1 ? 's' : ''}, ${warningCount} Warning${warningCount !== 1 ? 's' : ''}`;
        
        indicator.addEventListener('click', () => {
            console.log('📊 Validation Results:', validationResults);
        });
        
        document.body.appendChild(indicator);
        
        // Auto-hide after 5 seconds if validation passed
        if (validationResults.passed) {
            setTimeout(() => {
                if (indicator.parentElement) {
                    indicator.style.opacity = '0.3';
                }
            }, 5000);
        }
    }

    // Auto-run validation when DOM is ready
    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(validatePage, 1000); // Wait for other scripts to load
            });
        } else {
            setTimeout(validatePage, 1000);
        }
    }

    // Export validation function
    window.validatePage = validatePage;
    window.validationResults = validationResults;
    
    // Initialize
    initialize();
    
    console.log('🔍 Page Validator loaded - Validation will run automatically');
})();
