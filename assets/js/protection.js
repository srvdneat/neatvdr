// SrvdNeat VDR Protection System
// Prevents right-click, copy-paste, and implements password protection

class VDRProtection {
    constructor() {
        this.isAuthenticated = false;
        this.config = window.VDRConfig || {
            password: 'SrvdNeat2025!',
            maxAttempts: 3,
            sessionTimeout: 2 * 60 * 60 * 1000,
            enableSessionTimeout: true,
            enableRightClickProtection: true,
            enableCopyProtection: true,
            enableCutProtection: true,
            enablePasteProtection: true,
            enableSelectAllProtection: true,
            enablePrintProtection: true,
            enableSaveProtection: true,
            enableDeveloperToolsProtection: true,
            enableTextSelectionProtection: true,
            enableDragDropProtection: true,
            enableImageDragProtection: true,
            enableWatermark: true,
            watermarkText: 'SrvdNeat VDR - Confidential',
            enableWarningNotifications: true,
            enableDevToolsDetection: true,
            messages: {
                rightClick: 'Right-click is disabled for content protection.',
                copy: 'Copy is disabled for content protection.',
                cut: 'Cut is disabled for content protection.',
                paste: 'Paste is disabled for content protection.',
                selectAll: 'Select all is disabled for content protection.',
                print: 'Print is disabled for content protection.',
                save: 'Save is disabled for content protection.',
                devTools: 'Developer tools are disabled for content protection.',
                accessDenied: 'Developer tools detected. Access denied.',
                tooManyAttempts: 'Too many failed attempts. Please refresh the page to try again.',
                incorrectPassword: 'Incorrect password. {attempts} attempts remaining.',
                enterPassword: 'Enter password to access confidential information',
                confidentialInfo: 'Confidential and Proprietary Information',
                unauthorizedAccess: 'Unauthorized access is prohibited'
            },
            styles: {
                watermarkColor: 'rgba(102, 126, 234, 0.1)',
                warningColor: '#e53e3e',
                passwordGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        };
        this.attempts = 0;
        this.init();
    }

    init() {
        // Check if user is already authenticated
        if (sessionStorage.getItem('vdr_authenticated') === 'true') {
            this.isAuthenticated = true;
            this.showContent();
        } else {
            this.showPasswordScreen();
        }

        // Initialize protection features
        this.setupProtection();
    }

    showPasswordScreen() {
        // Hide all content
        document.body.style.display = 'none';
        
        // Create password overlay
        const overlay = document.createElement('div');
        overlay.id = 'password-overlay';
        overlay.innerHTML = `
            <div class="password-container">
                <div class="password-box">
                    <div class="password-header">
                        <i class="fas fa-lock"></i>
                        <h2>SrvdNeat Virtual Data Room</h2>
                        <p>${this.config.messages.enterPassword}</p>
                    </div>
                    <div class="password-form">
                        <div class="input-group">
                            <input type="password" id="password-input" placeholder="Enter password" autocomplete="off">
                            <button id="password-submit" type="button">
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                        <div id="password-error" class="error-message hidden"></div>
                        <div class="attempts-remaining">
                            Attempts remaining: <span id="attempts-left">${this.config.maxAttempts - this.attempts}</span>
                        </div>
                    </div>
                    <div class="password-footer">
                        <p>${this.config.messages.confidentialInfo}</p>
                        <p>${this.config.messages.unauthorizedAccess}</p>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #password-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: ${this.config.styles.passwordGradient};
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
            }

            .password-container {
                width: 100%;
                max-width: 400px;
                padding: 20px;
            }

            .password-box {
                background: white;
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                text-align: center;
            }

            .password-header {
                margin-bottom: 30px;
            }

            .password-header i {
                font-size: 48px;
                color: #667eea;
                margin-bottom: 16px;
            }

            .password-header h2 {
                font-size: 24px;
                font-weight: 700;
                color: #1a202c;
                margin: 0 0 8px 0;
            }

            .password-header p {
                color: #718096;
                margin: 0;
                font-size: 14px;
            }

            .password-form {
                margin-bottom: 30px;
            }

            .input-group {
                display: flex;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                overflow: hidden;
                margin-bottom: 16px;
            }

            #password-input {
                flex: 1;
                padding: 16px 20px;
                border: none;
                outline: none;
                font-size: 16px;
                font-family: 'Inter', sans-serif;
            }

            #password-submit {
                padding: 16px 20px;
                background: #667eea;
                border: none;
                color: white;
                cursor: pointer;
                transition: background 0.2s;
                font-size: 16px;
            }

            #password-submit:hover {
                background: #5a67d8;
            }

            .error-message {
                color: #e53e3e;
                font-size: 14px;
                margin-bottom: 16px;
                padding: 8px 12px;
                background: #fed7d7;
                border-radius: 6px;
                border: 1px solid #feb2b2;
            }

            .hidden {
                display: none;
            }

            .attempts-remaining {
                font-size: 12px;
                color: #718096;
                margin-bottom: 16px;
            }

            .password-footer {
                border-top: 1px solid #e2e8f0;
                padding-top: 20px;
            }

            .password-footer p {
                font-size: 12px;
                color: #a0aec0;
                margin: 4px 0;
            }

            .shake {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(overlay);

        // Add event listeners
        document.getElementById('password-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkPassword();
            }
        });

        document.getElementById('password-submit').addEventListener('click', () => {
            this.checkPassword();
        });

        // Focus on input
        setTimeout(() => {
            document.getElementById('password-input').focus();
        }, 100);
    }

    checkPassword() {
        const input = document.getElementById('password-input');
        const error = document.getElementById('password-error');
        const attemptsLeft = document.getElementById('attempts-left');
        const passwordBox = document.querySelector('.password-box');

        if (input.value === this.config.password) {
            this.isAuthenticated = true;
            sessionStorage.setItem('vdr_authenticated', 'true');
            this.showContent();
        } else {
            this.attempts++;
            attemptsLeft.textContent = this.config.maxAttempts - this.attempts;
            
            error.textContent = this.config.messages.incorrectPassword.replace('{attempts}', this.config.maxAttempts - this.attempts);
            error.classList.remove('hidden');
            passwordBox.classList.add('shake');
            
            input.value = '';
            input.focus();

            // Remove shake animation
            setTimeout(() => {
                passwordBox.classList.remove('shake');
            }, 500);

            if (this.attempts >= this.config.maxAttempts) {
                error.textContent = this.config.messages.tooManyAttempts;
                input.disabled = true;
                document.getElementById('password-submit').disabled = true;
            }
        }
    }

    showContent() {
        // Remove password overlay
        const overlay = document.getElementById('password-overlay');
        if (overlay) {
            overlay.remove();
        }

        // Show body content
        document.body.style.display = 'block';
        
        // Initialize protection features
        this.setupProtection();
    }

    setupProtection() {
        if (!this.isAuthenticated) return;

        // Prevent right-click
        if (this.config.enableRightClickProtection) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showWarning(this.config.messages.rightClick);
                return false;
            });
        }

        // Prevent copy (Ctrl+C, Cmd+C)
        if (this.config.enableCopyProtection) {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C')) {
                    e.preventDefault();
                    this.showWarning(this.config.messages.copy);
                    return false;
                }
            });
        }

        // Prevent cut (Ctrl+X, Cmd+X)
        if (this.config.enableCutProtection) {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'x' || e.key === 'X')) {
                    e.preventDefault();
                    this.showWarning(this.config.messages.cut);
                    return false;
                }
            });
        }

        // Prevent paste (Ctrl+V, Cmd+V)
        if (this.config.enablePasteProtection) {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V')) {
                    e.preventDefault();
                    this.showWarning(this.config.messages.paste);
                    return false;
                }
            });
        }

        // Prevent select all (Ctrl+A, Cmd+A)
        if (this.config.enableSelectAllProtection) {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
                    e.preventDefault();
                    this.showWarning(this.config.messages.selectAll);
                    return false;
                }
            });
        }

        // Prevent print (Ctrl+P, Cmd+P)
        if (this.config.enablePrintProtection) {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
                    e.preventDefault();
                    this.showWarning(this.config.messages.print);
                    return false;
                }
            });
        }

        // Prevent save (Ctrl+S, Cmd+S)
        if (this.config.enableSaveProtection) {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
                    e.preventDefault();
                    this.showWarning(this.config.messages.save);
                    return false;
                }
            });
        }

        // Prevent F12 and other developer tools
        if (this.config.enableDeveloperToolsProtection) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
                    e.preventDefault();
                    this.showWarning(this.config.messages.devTools);
                    return false;
                }
            });
        }

        // Prevent text selection
        if (this.config.enableTextSelectionProtection) {
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });
        }

        // Prevent drag and drop
        if (this.config.enableDragDropProtection) {
            document.addEventListener('dragstart', (e) => {
                e.preventDefault();
                return false;
            });
        }

        // Prevent image dragging
        if (this.config.enableImageDragProtection) {
            document.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                }
            });
        }

        // Disable text selection via CSS
        const style = document.createElement('style');
        style.textContent = `
            * {
                -webkit-user-select: none !important;
                -moz-user-select: none !important;
                -ms-user-select: none !important;
                user-select: none !important;
                -webkit-touch-callout: none !important;
                -webkit-tap-highlight-color: transparent !important;
            }
            
            input, textarea {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
        `;
        document.head.appendChild(style);

        // Add watermark
        if (this.config.enableWatermark) {
            this.addWatermark();
        }

        // Add session timeout
        if (this.config.enableSessionTimeout) {
            this.setupSessionTimeout();
        }
    }

    showWarning(message) {
        if (!this.config.enableWarningNotifications) return;

        // Create warning notification
        const warning = document.createElement('div');
        warning.className = 'protection-warning';
        warning.innerHTML = `
            <div class="warning-content">
                <i class="fas fa-shield-alt"></i>
                <span>${message}</span>
            </div>
        `;

        // Add warning styles
        if (!document.getElementById('warning-styles')) {
            const style = document.createElement('style');
            style.id = 'warning-styles';
            style.textContent = `
                .protection-warning {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${this.config.styles.warningColor};
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    animation: slideIn 0.3s ease-out;
                    max-width: 300px;
                }

                .warning-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(warning);

        // Remove warning after 3 seconds
        setTimeout(() => {
            warning.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                }
            }, 300);
        }, 3000);
    }

    addWatermark() {
        const watermark = document.createElement('div');
        watermark.id = 'vdr-watermark';
        watermark.innerHTML = this.config.watermarkText;
        
        const style = document.createElement('style');
        style.textContent = `
            #vdr-watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 48px;
                font-weight: 700;
                color: ${this.config.styles.watermarkColor};
                pointer-events: none;
                z-index: 9998;
                white-space: nowrap;
                font-family: 'Inter', sans-serif;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(watermark);
    }

    setupSessionTimeout() {
        // Set session timeout based on configuration
        const timeout = this.config.sessionTimeout;
        
        let sessionTimer = setTimeout(() => {
            this.logout();
        }, timeout);

        // Reset timer on user activity
        const resetTimer = () => {
            clearTimeout(sessionTimer);
            sessionTimer = setTimeout(() => {
                this.logout();
            }, timeout);
        };

        // Listen for user activity
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });
    }

    logout() {
        sessionStorage.removeItem('vdr_authenticated');
        location.reload();
    }
}

// Initialize protection when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VDRProtection();
});

// Prevent access to developer tools
if (window.VDRConfig && window.VDRConfig.enableDevToolsDetection) {
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            document.body.innerHTML = window.VDRConfig.messages.accessDenied;
        }
    }, 1000);
} 