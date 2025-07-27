# SrvdNeat VDR Protection System

This document explains how to set up and configure the protection system for the SrvdNeat Virtual Data Room.

## Overview

The protection system provides multiple layers of security for your confidential documents:

- **Password Protection**: Requires authentication before accessing content
- **Right-Click Prevention**: Disables context menu access
- **Copy-Paste Prevention**: Blocks copying and pasting of content
- **Text Selection Prevention**: Prevents selecting and highlighting text
- **Print Prevention**: Blocks printing functionality
- **Developer Tools Detection**: Detects and blocks developer console access
- **Session Timeout**: Automatic logout after inactivity
- **Watermark Overlay**: Visual watermark on all content

## Files Added

1. `assets/js/config.js` - Configuration file for customizing protection settings
2. `assets/js/protection.js` - Main protection system implementation
3. Updated all HTML files to include the protection scripts

## Configuration

### Password Setup

Edit `assets/js/config.js` to change the password:

```javascript
window.VDRConfig = {
    password: 'YourCustomPassword123!', // Change this
    maxAttempts: 3, // Maximum login attempts
    // ... other settings
};
```

### Protection Features

You can enable/disable specific protection features:

```javascript
window.VDRConfig = {
    // Protection features
    enableRightClickProtection: true,     // Prevent right-click
    enableCopyProtection: true,           // Prevent copy (Ctrl+C)
    enableCutProtection: true,            // Prevent cut (Ctrl+X)
    enablePasteProtection: true,          // Prevent paste (Ctrl+V)
    enableSelectAllProtection: true,      // Prevent select all (Ctrl+A)
    enablePrintProtection: true,          // Prevent print (Ctrl+P)
    enableSaveProtection: true,           // Prevent save (Ctrl+S)
    enableDeveloperToolsProtection: true, // Prevent F12 and dev tools
    enableTextSelectionProtection: true,  // Prevent text selection
    enableDragDropProtection: true,       // Prevent drag and drop
    enableImageDragProtection: true,      // Prevent image dragging
    
    // Visual features
    enableWatermark: true,                // Show watermark overlay
    enableWarningNotifications: true,     // Show warning popups
    enableDevToolsDetection: true,        // Detect developer tools
    
    // Session settings
    enableSessionTimeout: true,           // Enable auto-logout
    sessionTimeout: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
};
```

### Custom Messages

Customize warning messages and text:

```javascript
window.VDRConfig = {
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
    
    watermarkText: 'SrvdNeat VDR - Confidential', // Watermark text
};
```

### Styling

Customize colors and visual appearance:

```javascript
window.VDRConfig = {
    styles: {
        watermarkColor: 'rgba(102, 126, 234, 0.1)', // Watermark color
        warningColor: '#e53e3e', // Warning notification color
        passwordGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' // Password screen background
    }
};
```

## Implementation Details

### Password Protection

- Uses session storage to maintain authentication state
- Maximum 3 login attempts before lockout
- Password is stored in plain text in config (consider server-side validation for production)

### Protection Methods

1. **Right-Click Prevention**: Disables context menu
2. **Keyboard Shortcuts**: Blocks common shortcuts (Ctrl+C, Ctrl+V, etc.)
3. **Text Selection**: Prevents selecting text via CSS and JavaScript
4. **Drag & Drop**: Prevents dragging images and content
5. **Developer Tools**: Detects and blocks developer console access

### Session Management

- 2-hour session timeout (configurable)
- Resets timer on user activity
- Automatic logout and page reload

### Visual Features

- **Watermark**: Semi-transparent overlay on all content
- **Warning Notifications**: Popup messages for blocked actions
- **Password Screen**: Professional login interface

## Security Considerations

### Limitations

1. **Client-Side Only**: All protection is implemented in JavaScript
2. **Password Storage**: Password is visible in source code
3. **Bypass Methods**: Advanced users can potentially bypass protections
4. **Screenshot Prevention**: Cannot prevent screenshots or screen recording

### Recommendations

1. **Server-Side Authentication**: Implement proper server-side password validation
2. **HTTPS**: Always use HTTPS in production
3. **Additional Measures**: Consider additional server-side protections
4. **Regular Updates**: Keep protection system updated

## Usage

1. Edit `assets/js/config.js` to set your desired password and settings
2. The protection system will automatically activate on all HTML pages
3. Users will see a password screen before accessing content
4. All protection features will be active after successful authentication

## Troubleshooting

### Common Issues

1. **Password Not Working**: Check the password in `config.js`
2. **Protection Not Loading**: Ensure both `config.js` and `protection.js` are loaded
3. **Session Issues**: Clear browser session storage to reset authentication

### Testing

1. Try right-clicking on content (should show warning)
2. Try copying text (Ctrl+C should be blocked)
3. Try opening developer tools (should be detected and blocked)
4. Test session timeout by leaving page idle

## Files Modified

- `src/enhanced.html`
- `src/financials.html`
- `src/print-friendly.html`
- `presentations/pitch-deck.html`

All files now include the protection scripts in the correct order. 