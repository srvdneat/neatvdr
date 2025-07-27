// Enhanced SrvdNeat VDR JavaScript

class SrvdNeatVDR {
    constructor() {
        this.charts = {};
        this.observers = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.setupScrollAnimations();
        this.setupProgressRings();
        this.setupNavigation();
        this.setupPrintOptimization();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation
        document.addEventListener('DOMContentLoaded', () => {
            this.addLoadingStates();
            this.setupTooltips();
        });

        // Window resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }

    initializeCharts() {
        this.createARRChart();
        this.createMetricsChart();
        this.createTractionChart();
    }

    createARRChart() {
        const ctx = document.getElementById('arrChart');
        if (!ctx) return;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');

        this.charts.arr = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Month 0', 'Month 6', 'Month 12', 'Month 18', 'Month 24', 'Month 36'],
                datasets: [{
                    label: 'ARR (AUD)',
                    data: [0, 77010, 406590, 1627625, 4500000, 8593410],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#1d4ed8',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        titleColor: '#f9fafb',
                        bodyColor: '#f9fafb',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed.y;
                                const formatted = new Intl.NumberFormat('en-AU', {
                                    style: 'currency',
                                    currency: 'AUD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(value);
                                return `ARR: ${formatted}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)',
                            borderDash: [5, 5]
                        },
                        ticks: {
                            color: '#6b7280',
                            callback: function(value) {
                                if (value >= 1000000) {
                                    return '$' + (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return '$' + (value / 1000).toFixed(0) + 'K';
                                }
                                return '$' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createMetricsChart() {
        // Additional charts can be added here
        // Example: Unit economics breakdown, market size visualization, etc.
    }

    createTractionChart() {
        // Traction metrics visualization
        // Example: Growth trajectory, conversion funnel, etc.
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll-triggered animations
        this.observers.scroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            this.observers.scroll.observe(section);
        });

        // Observe metric cards for counter animation
        document.querySelectorAll('.metric-card').forEach(card => {
            this.observers.scroll.observe(card);
        });
    }

    setupProgressRings() {
        const rings = document.querySelectorAll('.progress-ring-circle');
        rings.forEach(ring => {
            const percentage = ring.getAttribute('data-percentage') || 75;
            const circumference = 251.2;
            const offset = circumference - (percentage / 100) * circumference;
            
            ring.style.strokeDasharray = circumference;
            ring.style.strokeDashoffset = circumference;
            
            setTimeout(() => {
                ring.style.strokeDashoffset = offset;
            }, 500);
        });
    }

    setupNavigation() {
        // Create floating navigation menu
        this.createFloatingNav();
        
        // Setup smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    createFloatingNav() {
        const sections = [
            { id: 'executive-summary', label: 'Summary' },
            { id: 'market-opportunity', label: 'Market' },
            { id: 'product-overview', label: 'Product' },
            { id: 'financial-projections', label: 'Financials' },
            { id: 'traction', label: 'Traction' },
            { id: 'team', label: 'Team' },
            { id: 'competitive-advantage', label: 'Advantage' },
            { id: 'funding-ask', label: 'Funding' }
        ];

        const nav = document.createElement('nav');
        nav.className = 'fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block';
        nav.innerHTML = `
            <div class="bg-white bg-opacity-90 backdrop-blur-lg rounded-full shadow-lg p-2">
                ${sections.map(section => `
                    <a href="#${section.id}" 
                       class="block w-3 h-3 rounded-full bg-gray-300 my-3 transition-all duration-300 hover:bg-blue-500"
                       title="${section.label}">
                    </a>
                `).join('')}
            </div>
        `;
        document.body.appendChild(nav);

        // Highlight current section
        this.updateActiveNavItem(sections);
    }

    updateActiveNavItem(sections) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navItem = document.querySelector(`a[href="#${entry.target.id}"]`);
                if (navItem) {
                    if (entry.isIntersecting) {
                        navItem.classList.add('bg-blue-500');
                        navItem.classList.remove('bg-gray-300');
                    } else {
                        navItem.classList.remove('bg-blue-500');
                        navItem.classList.add('bg-gray-300');
                    }
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) observer.observe(element);
        });
    }

    setupTooltips() {
        // Simple tooltip implementation
        document.querySelectorAll('[data-tooltip]').forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-50 pointer-events-none';
        tooltip.textContent = text;
        tooltip.id = 'tooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
    }

    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    setupPrintOptimization() {
        // Optimize for printing
        window.addEventListener('beforeprint', () => {
            this.optimizeForPrint();
        });
        
        window.addEventListener('afterprint', () => {
            this.restoreFromPrint();
        });
    }

    optimizeForPrint() {
        // Hide interactive elements
        document.querySelectorAll('.chart-container canvas').forEach(canvas => {
            canvas.style.display = 'none';
        });
        
        // Show print-friendly alternatives
        this.createPrintCharts();
    }

    restoreFromPrint() {
        // Restore interactive elements
        document.querySelectorAll('.chart-container canvas').forEach(canvas => {
            canvas.style.display = 'block';
        });
        
        // Remove print alternatives
        document.querySelectorAll('.print-chart').forEach(chart => {
            chart.remove();
        });
    }

    createPrintCharts() {
        const chartContainer = document.querySelector('#arrChart').closest('.chart-container');
        if (chartContainer) {
            const printChart = document.createElement('div');
            printChart.className = 'print-chart';
            printChart.innerHTML = `
                <table class="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-300 p-2">Period</th>
                            <th class="border border-gray-300 p-2">ARR (AUD)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td class="border border-gray-300 p-2">Month 0</td><td class="border border-gray-300 p-2">$0</td></tr>
                        <tr><td class="border border-gray-300 p-2">Month 6</td><td class="border border-gray-300 p-2">$77,010</td></tr>
                        <tr><td class="border border-gray-300 p-2">Month 12</td><td class="border border-gray-300 p-2">$406,590</td></tr>
                        <tr><td class="border border-gray-300 p-2">Month 18</td><td class="border border-gray-300 p-2">$1,627,625</td></tr>
                        <tr><td class="border border-gray-300 p-2">Month 24</td><td class="border border-gray-300 p-2">$4,500,000</td></tr>
                        <tr><td class="border border-gray-300 p-2">Month 36</td><td class="border border-gray-300 p-2">$8,593,410</td></tr>
                    </tbody>
                </table>
            `;
            chartContainer.appendChild(printChart);
        }
    }

    handleResize() {
        // Recalculate chart dimensions
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }

    handleKeyboardNavigation(e) {
        // Keyboard shortcuts for navigation
        if (e.altKey) {
            switch(e.key) {
                case '1':
                    document.getElementById('executive-summary').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '2':
                    document.getElementById('market-opportunity').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '3':
                    document.getElementById('product-overview').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '4':
                    document.getElementById('financial-projections').scrollIntoView({ behavior: 'smooth' });
                    break;
                case '5':
                    document.getElementById('traction').scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    }

    addLoadingStates() {
        // Add loading states to metric cards
        document.querySelectorAll('.metric-card').forEach(card => {
            card.classList.add('loading');
            setTimeout(() => {
                card.classList.remove('loading');
                this.animateCounter(card);
            }, Math.random() * 1000 + 500);
        });
    }

    animateCounter(card) {
        const number = card.querySelector('h3');
        if (!number) return;
        
        const finalValue = number.textContent;
        const isMonetary = finalValue.includes('$');
        const isMillion = finalValue.includes('M');
        const isPercentage = finalValue.includes('%');
        const isRatio = finalValue.includes('x');
        
        let numericValue = parseFloat(finalValue.replace(/[$%MKx\s]/g, ''));
        if (isMillion) numericValue *= 1000000;
        if (finalValue.includes('K')) numericValue *= 1000;
        
        let current = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = current;
            let suffix = '';
            
            if (isMillion && current >= 1000000) {
                displayValue = current / 1000000;
                suffix = 'M';
            } else if (current >= 1000) {
                displayValue = current / 1000;
                suffix = 'K';
            }
            
            let formatted = displayValue.toFixed(displayValue < 10 ? 1 : 0);
            if (isMonetary) formatted = '$' + formatted;
            if (isPercentage) formatted = formatted + '%';
            if (isRatio) formatted = formatted + 'x';
            
            number.textContent = formatted + suffix;
        }, 20);
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the VDR application
document.addEventListener('DOMContentLoaded', () => {
    new SrvdNeatVDR();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SrvdNeatVDR;
} 