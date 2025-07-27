# 21st Extension Toolbar

A modern, monochrome floating toolbar for the SrvdNeat VDR project that provides quick access to navigation and actions.

## Features

### Navigation
- **Summary**: Jump to Executive Summary section
- **Market**: Navigate to Market Opportunity section  
- **Financials**: Go to Financial Projections section
- **Funding**: Access Funding Ask section

### Actions
- **Print**: Print the current document (Ctrl/Cmd + P)
- **Share**: Share document URL or copy to clipboard
- **Fullscreen**: Toggle fullscreen mode (Ctrl/Cmd + F)

### View Options
- **Theme**: Toggle between light and dark themes
- **Font Size**: Cycle through different font sizes (14px, 16px, 18px, 20px)

## Design

- **Monochrome**: Clean black and white design with subtle transparency
- **Minimal**: Focused on essential functionality without clutter
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Proper focus states and keyboard navigation
- **Smooth Animations**: Elegant transitions and hover effects

## Usage

### Activation
- Click the floating toolbar button (hamburger icon) on the right side of the screen
- The toolbar slides in from the right with smooth animation

### Navigation
- Click any navigation button to smoothly scroll to that section
- The active section is highlighted in the toolbar
- Toolbar automatically closes after navigation

### Keyboard Shortcuts
- `Ctrl/Cmd + P`: Print document
- `Ctrl/Cmd + F`: Toggle fullscreen
- `Escape`: Close toolbar (when open)

### Mobile Support
- Responsive design that adapts to smaller screens
- Touch-friendly button sizes
- Optimized layout for mobile devices

## Technical Details

### Files
- `assets/js/toolbar.js`: Main toolbar functionality
- `assets/css/toolbar.css`: Styling and animations
- Integrated into `src/enhanced.html` and `src/index.html`

### Browser Support
- Modern browsers with ES6+ support
- Fallback for older browsers with reduced functionality
- Print styles automatically hide toolbar

### Performance
- Lightweight implementation
- Efficient event handling
- Minimal DOM manipulation
- Smooth 60fps animations

## Customization

The toolbar can be easily customized by modifying:

1. **Colors**: Update CSS variables in `toolbar.css`
2. **Sections**: Add/remove navigation buttons in `toolbar.js`
3. **Actions**: Extend the `handleActionButton` method
4. **Styling**: Modify the CSS classes and animations

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatible
- High contrast mode support
- Reduced motion support

## Future Enhancements

Potential additions to the toolbar:
- Search functionality
- Table of contents
- Bookmark sections
- Export options (PDF, etc.)
- Custom themes
- User preferences storage 