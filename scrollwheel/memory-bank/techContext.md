# Technical Context

## Technologies Used
- JavaScript for extension logic
- HTML and CSS for popup and options UI
- WebExtensions API for browser extension framework
- Browser storage API for persistent settings

## Development Setup
- Standard web development environment with code editor and browser for testing
- Use of browser developer tools for debugging extension scripts
- Local file structure includes background.js, content.js, popup.html/js, options.html/js, manifest.json, and icons

## Technical Constraints
- Must comply with WebExtensions API standards for cross-browser compatibility
- Limited access to browser APIs based on permissions declared in manifest
- Performance constraints to avoid slowing down page load or interaction

## Dependencies
- No external libraries currently; all functionality implemented with native browser APIs and JavaScript

## Tool Usage Patterns
- Modular JavaScript files for separation of concerns
- Event-driven communication between scripts
- Use of manifest.json to declare permissions, scripts, and UI components
