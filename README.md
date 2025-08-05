# ScrollCircle Chrome Extension

A lightweight Chrome extension that provides intuitive scrolling using a draggable circle overlay. Perfect for users with mobility constraints or anyone who wants precise scroll control.

## 🚀 Quick Start

### Installation Instructions

#### Method 1: Load as Unpacked Extension (Recommended for Development)

1. **Download the Extension**
   - Clone or download this repository to your computer
   - Extract the files if downloaded as a ZIP

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Chrome Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner
   - This enables advanced options for loading extensions

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `scrollwheel` folder from this repository
   - The ScrollCircle icon should appear in your Chrome toolbar

5. **Verify Installation**
   - Look for the ScrollCircle icon in your extensions toolbar
   - Click the icon to test the popup interface

#### Method 2: Install from Chrome Web Store (When Available)

1. Visit the Chrome Web Store
2. Search for "ScrollCircle"
3. Click "Add to Chrome"
4. Confirm the installation

## 📋 Prerequisites

- **Google Chrome**: Version 88 or higher (for Manifest V3 support)
- **Windows/Mac/Linux**: Compatible with all major operating systems
- **No Additional Software**: No dependencies or build tools required

## 🎯 Features

### Core Functionality
- **Draggable Circle**: Semi-transparent circle that can be positioned anywhere on the page
- **Directional Scrolling**: Move your mouse within the circle to scroll in any direction
- **Variable Speed**: Scroll speed is proportional to distance from the circle's center
- **Auto-stop**: Scrolling automatically stops when the cursor leaves the circle

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for positioning and control
- **High Contrast Mode**: Enhanced visibility option
- **Screen Reader Support**: ARIA labels and proper focus management
- **Customizable Settings**: Adjust size, opacity, and speed for individual needs

## 🎮 How to Use

### Basic Operation

1. **Activate the Extension**
   - Click the ScrollCircle icon in your Chrome toolbar
   - Or use the keyboard shortcut: `Ctrl+Shift+S` (Mac: `Cmd+Shift+S`)

2. **Position the Circle**
   - Click and drag the circle to your desired location on the page
   - The position is remembered between page loads

3. **Start Scrolling**
   - Move your mouse inside the circle:
     - Move up from center = scroll up
     - Move down from center = scroll down
     - Move left from center = scroll left
     - Move right from center = scroll right

4. **Deactivate**
   - Click the extension icon again
   - Or press `Escape` when the circle has focus

### Keyboard Controls

- **Arrow Keys**: Move the circle when it has focus
- **Escape**: Close the circle
- **Tab**: Focus the circle for keyboard navigation

### Customization

Access settings by:
- Right-clicking the extension icon and selecting "Options"
- Or clicking "More Options" in the popup

Available settings:
- **Speed Multiplier**: Control scroll sensitivity (0.1x to 5x)
- **Circle Size**: Adjust diameter (60px to 200px)
- **Opacity**: Set transparency (10% to 100%)
- **High Contrast**: Toggle high contrast borders

## 🔧 Troubleshooting

### Common Issues

**Extension doesn't appear in toolbar**
- Check if Developer mode is enabled in `chrome://extensions/`
- Try refreshing the extensions page
- Restart Chrome and reload the extension

**Circle doesn't appear on page**
- Make sure the extension is enabled
- Try refreshing the page and activating again
- Some pages (like `chrome://` URLs) don't allow content scripts

**Scrolling is too fast/slow**
- Adjust the Speed Multiplier in settings
- Try values between 0.5x and 2x for most use cases

**Can't see the circle clearly**
- Enable High Contrast Mode in settings
- Adjust the Opacity setting
- Try a larger Circle Size

**Keyboard shortcuts don't work**
- Check if another extension is using the same shortcut
- Try clicking the extension icon instead
- Make sure the circle has focus (click on it first)

### Getting Help

If you encounter issues:
1. Check the browser console for error messages (F12 → Console)
2. Try disabling other extensions to check for conflicts
3. Restart Chrome and reload the extension
4. Check that you're using Chrome version 88 or higher

## 📁 File Structure

```
scrollwheel/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for extension events
├── content.js             # Main functionality injected into pages
├── popup.html             # Extension popup interface
├── popup.js               # Popup functionality
├── options.html           # Settings page
├── options.js             # Settings functionality
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## 🔒 Privacy & Security

ScrollCircle is designed with privacy in mind:
- **No Data Collection**: Does not collect or transmit user data
- **Local Storage Only**: Settings stored locally on your device
- **No Network Requests**: Works entirely offline
- **No Analytics**: No tracking or usage analytics
- **Open Source**: Code is transparent and auditable

## 🌐 Browser Compatibility

- **Chrome**: Version 88+ (Manifest V3 support)
- **Edge**: Version 88+ (Chromium-based)
- **Other Chromium browsers**: Should work with Manifest V3 support

## ♿ Accessibility

ScrollCircle follows WCAG 2.1 guidelines:
- **Keyboard Navigation**: Full functionality without a mouse
- **Screen Reader Support**: Proper ARIA labels and roles
- **High Contrast**: Visual accessibility option
- **Focus Management**: Clear focus indicators
- **No Animation Sensitivity**: Respects user motion preferences

## 🛠️ Development

### Building from Source
1. Clone the repository
2. No build process required - load directly as unpacked extension
3. Make changes to the source files
4. Reload the extension in `chrome://extensions/`

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For help and support:
- Check this README for common solutions
- Review the in-extension help tooltips
- Check browser console for error messages
- Open an issue on the project repository

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Chrome Version Required**: 88+ 