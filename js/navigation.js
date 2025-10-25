// Navigation Management for SecureMessage AI
// Handles navigation state, mobile menu, and page-specific navigation

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    setupMobileMenu();
    setupNavigationHighlighting();
    setupScrollEffects();
});

// Initialize navigation system
function initializeNavigation() {
    try {
        // Set active navigation item based on current page
        setActiveNavItem();
        
        // Setup navigation event listeners
        setupNavEventListeners();
        
        // Initialize breadcrumbs if present
        initializeBreadcrumbs();
        
        console.log('Navigation initialized successfully');
    } catch (error) {
        console.error('Error initializing navigation:', error);
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navOverlay = document.querySelector('.nav-overlay');
        
        if (hamburger && navMenu) {
            // Toggle mobile menu
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleMobileMenu();
            });
            
            // Close menu when clicking overlay
            if (navOverlay) {
                navOverlay.addEventListener('click', closeMobileMenu);
            }
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
            
            // Close menu when pressing escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        }
    } catch (error) {
        console.error('Error setting up mobile menu:', error);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const body = document.body;
        
        if (hamburger && navMenu) {
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    } catch (error) {
        console.error('Error toggling mobile menu:', error);
    }
}

// Open mobile menu
function openMobileMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const body = document.body;
        
        if (hamburger && navMenu) {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            body.classList.add('nav-open');
            
            // Animate menu items
            const navItems = navMenu.querySelectorAll('.nav-item');
            navItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-in');
            });
        }
    } catch (error) {
        console.error('Error opening mobile menu:', error);
    }
}

// Close mobile menu
function closeMobileMenu() {
    try {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const body = document.body;
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('nav-open');
            
            // Remove animation classes
            const navItems = navMenu.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.classList.remove('animate-in');
                item.style.animationDelay = '';
            });
        }
    } catch (error) {
        console.error('Error closing mobile menu:', error);
    }
}

// Set active navigation item based on current page
function setActiveNavItem() {
    try {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.split('/').pop();
                if (linkPage === currentPage || 
                    (currentPage === '' && linkPage === 'index.html') ||
                    (currentPage === 'index.html' && linkPage === '')) {
                    link.classList.add('active');
                }
            }
        });
    } catch (error) {
        console.error('Error setting active nav item:', error);
    }
}

// Setup navigation event listeners
function setupNavEventListeners() {
    try {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            // Close mobile menu when clicking nav link
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
            
            // Add hover effects for desktop
            link.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768) {
                    this.classList.add('hover');
                }
            });
            
            link.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    } catch (error) {
        console.error('Error setting up nav event listeners:', error);
    }
}

// Setup navigation highlighting on scroll
function setupNavigationHighlighting() {
    try {
        // Only run on pages with sections to highlight
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;
        
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        if (navLinks.length === 0) return;
        
        // Throttled scroll handler
        let ticking = false;
        
        function updateActiveSection() {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to corresponding nav link
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
            
            ticking = false;
        }
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateActiveSection);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll);
    } catch (error) {
        console.error('Error setting up navigation highlighting:', error);
    }
}

// Setup scroll effects for navbar
function setupScrollEffects() {
    try {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        function updateNavbar() {
            const scrollY = window.scrollY;
            
            // Add/remove scrolled class
            if (scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (optional)
            if (scrollY > lastScrollY && scrollY > 200) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll);
    } catch (error) {
        console.error('Error setting up scroll effects:', error);
    }
}

// Initialize breadcrumbs
function initializeBreadcrumbs() {
    try {
        const breadcrumbContainer = document.querySelector('.breadcrumbs');
        if (!breadcrumbContainer) return;
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const pageNames = {
            'index.html': 'Home',
            'about.html': 'About',
            'dashboard.html': 'Dashboard',
            'profile.html': 'Profile',
            'login.html': 'Login',
            'learn.html': 'Learn',
            'download.html': 'Download',
            'premium.html': 'Premium',
            'contact.html': 'Contact',
            'community.html': 'Community',
            'faq.html': 'FAQ',
            'report-scam.html': 'Report Scam',
            'fake-emails.html': 'Fake Emails',
            'extension.html': 'Extension'
        };
        
        const pageName = pageNames[currentPage] || 'Page';
        
        breadcrumbContainer.innerHTML = `
            <nav class="breadcrumb-nav">
                <a href="index.html" class="breadcrumb-item">
                    <i class="fas fa-home"></i>
                    <span>Home</span>
                </a>
                <span class="breadcrumb-separator">
                    <i class="fas fa-chevron-right"></i>
                </span>
                <span class="breadcrumb-item current">
                    ${pageName}
                </span>
            </nav>
        `;
    } catch (error) {
        console.error('Error initializing breadcrumbs:', error);
    }
}

// Smooth scroll to anchor links
function setupSmoothScrolling() {
    try {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                }
            });
        });
    } catch (error) {
        console.error('Error setting up smooth scrolling:', error);
    }
}

// Navigation utility functions
const Navigation = {
    // Navigate to page with loading state
    navigateTo(url, showLoader = true) {
        try {
            if (showLoader) {
                this.showPageLoader();
            }
            
            window.location.href = url;
        } catch (error) {
            console.error('Error navigating to page:', error);
        }
    },
    
    // Show page loading indicator
    showPageLoader() {
        try {
            const loader = document.createElement('div');
            loader.className = 'page-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p>Loading...</p>
                </div>
            `;
            
            document.body.appendChild(loader);
            
            // Remove loader after timeout (fallback)
            setTimeout(() => {
                if (loader.parentElement) {
                    loader.remove();
                }
            }, 5000);
        } catch (error) {
            console.error('Error showing page loader:', error);
        }
    },
    
    // Get current page info
    getCurrentPage() {
        try {
            const path = window.location.pathname;
            const page = path.split('/').pop() || 'index.html';
            const title = document.title;
            
            return {
                path: path,
                page: page,
                title: title
            };
        } catch (error) {
            console.error('Error getting current page info:', error);
            return null;
        }
    },
    
    // Update page title
    updatePageTitle(title) {
        try {
            document.title = `${title} - SecureMessage AI`;
        } catch (error) {
            console.error('Error updating page title:', error);
        }
    }
};

// Export navigation utilities
window.Navigation = Navigation;
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.openMobileMenu = openMobileMenu;
