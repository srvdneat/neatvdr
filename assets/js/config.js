// SrvdNeat VDR Protection Configuration
// Modify these settings to customize the protection system

window.VDRConfig = {
    // Password settings
    password: 'SrvdNeat2025!', // Change this to your desired password
    maxAttempts: 3, // Maximum login attempts before lockout
    
    // Session settings
    sessionTimeout: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    enableSessionTimeout: true, // Set to false to disable auto-logout
    
    // Protection features
    enableRightClickProtection: true, // Prevent right-click
    enableCopyProtection: true, // Prevent copy (Ctrl+C)
    enableCutProtection: true, // Prevent cut (Ctrl+X)
    enablePasteProtection: true, // Prevent paste (Ctrl+V)
    enableSelectAllProtection: true, // Prevent select all (Ctrl+A)
    enablePrintProtection: true, // Prevent print (Ctrl+P)
    enableSaveProtection: true, // Prevent save (Ctrl+S)
    enableDeveloperToolsProtection: true, // Prevent F12 and dev tools
    enableTextSelectionProtection: true, // Prevent text selection
    enableDragDropProtection: true, // Prevent drag and drop
    enableImageDragProtection: true, // Prevent image dragging
    
    // Visual features
    enableWatermark: true, // Show watermark overlay
    watermarkText: 'SrvdNeat VDR - Confidential', // Watermark text
    enableWarningNotifications: true, // Show warning popups
    
    // Developer tools detection
    enableDevToolsDetection: true, // Detect and block developer tools
    
    // Custom messages
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
    
    // Styling
    styles: {
        watermarkColor: 'rgba(102, 126, 234, 0.1)', // Watermark color
        warningColor: '#e53e3e', // Warning notification color
        passwordGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' // Password screen background
    }
}; 