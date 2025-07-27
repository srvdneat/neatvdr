// 21st Extension Toolbar
class ToolbarExtension {
    constructor() {
        this.isVisible = false;
        this.isExpanded = false;
        this.init();
    }

    // Static setup method for external initialization
    static setupToolbar() {
        console.log('Setting up 21st extension toolbar...');
        try {
            const toolbar = new ToolbarExtension();
            console.log('21st extension toolbar setup complete');
            return toolbar;
        } catch (error) {
            console.error('Error setting up 21st extension toolbar:', error);
            return null;
        }
    }

    init() {
        this.createToolbar();
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }

    createToolbar() {
        // Check if toolbar already exists
        if (document.getElementById('toolbar-21st')) {
            console.log('Toolbar already exists, removing...');
            document.getElementById('toolbar-21st').remove();
        }

        const toolbar = document.createElement('div');
        toolbar.id = 'toolbar-21st';
        toolbar.className = 'toolbar-21st';
        
        // Create toolbar HTML with FontAwesome icons
        toolbar.innerHTML = `
            <div class="toolbar-toggle">
                <div class="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
                            <div class="toolbar-content">
                    <div class="toolbar-section">
                        <h4>Navigation</h4>
                        <div class="toolbar-buttons">
                            <button class="toolbar-btn" data-section="executive-summary">
                                <i class="fas fa-chart-bar" style="margin-right: 12px;"></i>
                                <span>Summary</span>
                            </button>
                            <button class="toolbar-btn" data-section="market-opportunity">
                                <i class="fas fa-globe" style="margin-right: 12px;"></i>
                                <span>Market</span>
                            </button>
                            <button class="toolbar-btn" data-section="financial-projections">
                                <i class="fas fa-calculator" style="margin-right: 12px;"></i>
                                <span>Financials</span>
                            </button>
                            <button class="toolbar-btn" data-section="funding-ask">
                                <i class="fas fa-rocket" style="margin-right: 12px;"></i>
                                <span>Funding</span>
                            </button>
                        </div>
                    </div>
                    <div class="toolbar-section">
                        <h4>Actions</h4>
                        <div class="toolbar-buttons">
                            <button class="toolbar-btn" id="print-btn">
                                <i class="fas fa-print" style="margin-right: 12px;"></i>
                                <span>Print</span>
                            </button>
                            <button class="toolbar-btn" id="fullscreen-btn">
                                <i class="fas fa-expand" style="margin-right: 12px;"></i>
                                <span>Fullscreen</span>
                            </button>
                        </div>
                    </div>
                </div>
        `;
        
        document.body.appendChild(toolbar);
        console.log('Toolbar created successfully');
        
        // Verify buttons are created
        const buttons = toolbar.querySelectorAll('.toolbar-btn');
        console.log(`Created ${buttons.length} toolbar buttons`);
        buttons.forEach((btn, index) => {
            const text = btn.querySelector('span')?.textContent || 'No text';
            console.log(`Button ${index + 1}: ${text}`);
        });
    }

    setupEventListeners() {
        const toolbar = document.getElementById('toolbar-21st');
        const toggle = toolbar.querySelector('.toolbar-toggle');
        const buttons = toolbar.querySelectorAll('.toolbar-btn');

        // Toggle toolbar visibility
        toggle.addEventListener('click', () => {
            this.toggleToolbar();
        });

        // Navigation buttons
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.dataset.section;
                if (section) {
                    this.scrollToSection(section);
                } else {
                    this.handleActionButton(btn.id);
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'p':
                        e.preventDefault();
                        this.printDocument();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.toggleFullscreen();
                        break;
                }
            }
        });

        // Close toolbar when clicking outside
        document.addEventListener('click', (e) => {
            if (!toolbar.contains(e.target) && this.isVisible) {
                this.hideToolbar();
            }
        });
    }

    setupIntersectionObserver() {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveButton(entry.target.id);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => observer.observe(section));
    }

    toggleToolbar() {
        const toolbar = document.getElementById('toolbar-21st');
        if (this.isVisible) {
            this.hideToolbar();
        } else {
            this.showToolbar();
        }
    }

    showToolbar() {
        const toolbar = document.getElementById('toolbar-21st');
        toolbar.classList.add('toolbar-visible');
        this.isVisible = true;
    }

    hideToolbar() {
        const toolbar = document.getElementById('toolbar-21st');
        toolbar.classList.remove('toolbar-visible');
        this.isVisible = false;
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            this.hideToolbar();
        }
    }

    updateActiveButton(sectionId) {
        const buttons = document.querySelectorAll('.toolbar-btn[data-section]');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });
    }

    handleActionButton(buttonId) {
        switch(buttonId) {
            case 'print-btn':
                this.printDocument();
                break;
            case 'fullscreen-btn':
                this.toggleFullscreen();
                break;
        }
    }

    printDocument() {
        window.print();
    }

    shareDocument() {
        if (navigator.share) {
            navigator.share({
                title: 'SrvdNeat VDR',
                url: window.location.href
            });
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href);
            this.showNotification('URL copied to clipboard');
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#theme-toggle i');
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
        this.showNotification('Theme toggled');
    }

    toggleFontSize() {
        const currentSize = getComputedStyle(document.body).fontSize;
        const sizes = ['14px', '16px', '18px', '20px'];
        const currentIndex = sizes.indexOf(currentSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        document.body.style.fontSize = sizes[nextIndex];
        this.showNotification(`Font size: ${sizes[nextIndex]}`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'toolbar-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
}

// Initialize toolbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing toolbar...');
    try {
        new ToolbarExtension();
        console.log('Toolbar extension initialized successfully');
    } catch (error) {
        console.error('Error initializing toolbar:', error);
    }
});

// Also try to initialize if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('DOM still loading, waiting...');
} else {
    console.log('DOM already loaded, initializing toolbar immediately...');
    try {
        new ToolbarExtension();
        console.log('Toolbar extension initialized successfully (immediate)');
    } catch (error) {
        console.error('Error initializing toolbar (immediate):', error);
    }
} 

// Global function for external toolbar setup
window.setup21stToolbar = function() {
    return ToolbarExtension.setupToolbar();
}; 