# ScrollCircle Chrome Extension

ScrollCircle is a lightweight Chrome extension that provides an intuitive, accessible way to scroll web pages using a draggable circle overlay. Perfect for users with mobility constraints or anyone who wants precise scroll control.

## Features

### Core Functionality
- **Draggable Circle**: A semi-transparent circle that can be positioned anywhere on the page
- **Directional Scrolling**: Move your mouse within the circle to scroll in any direction
- **Variable Speed**: Scroll speed is proportional to distance from the circle's center
- **Auto-stop**: Scrolling automatically stops when the cursor leaves the circle

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support for positioning and control
- **High Contrast Mode**: Enhanced visibility option
- **Screen Reader Support**: ARIA labels and proper focus management
- **Customizable Settings**: Adjust size, opacity, and speed for individual needs

### User Controls
- **Toggle Activation**: Click extension icon or use Ctrl+Shift+S (Cmd+Shift+S on Mac)
- **Drag to Position**: Click and drag the circle to your preferred location
- **Persistent Position**: Remembers last position between page loads
- **Customizable Appearance**: Adjust size, opacity, and contrast

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the extension folder
5. The ScrollCircle icon should appear in your extensions toolbar

## Usage

### Basic Operation
1. **Activate**: Click the ScrollCircle icon or press `Ctrl+Shift+S` (Mac: `Cmd+Shift+S`)
2. **Position**: Drag the circle to your desired location on the page
3. **Scroll**: Move your mouse inside the circle:
   - Move up from center = scroll up
   - Move down from center = scroll down
   - Move left from center = scroll left
   - Move right from center = scroll right
4. **Deactivate**: Click the icon again or press `Escape` when the circle is focused

### Keyboard Controls
- **Arrow Keys**: Move the circle when it has focus
- **Escape**: Close the circle
- **Tab**: Focus the circle for keyboard navigation

### Settings
Access settings by:
- Right-clicking the extension icon and selecting "Options"
- Or clicking "More Options" in the popup

Available settings:
- **Speed Multiplier**: Control scroll sensitivity (0.1x to 5x)
- **Circle Size**: Adjust diameter (60px to 200px)
- **Opacity**: Set transparency (10% to 100%)
- **High Contrast**: Toggle high contrast borders

## Files Structure

```
ScrollCircle/
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
│   ├── icon128.png
│   ├── icon16-active.png
│   ├── icon32-active.png
│   ├── icon48-active.png
│   └── icon128-active.png
└── README.md
```

## Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension architecture
- **Content Script**: Injects the scroll circle functionality into web pages
- **Service Worker**: Handles extension lifecycle and command events
- **Storage API**: Persists user settings and circle position

### Performance
- **60fps Updates**: Smooth scrolling with requestAnimationFrame
- **Passive Listeners**: Optimized event handling
- **Minimal DOM**: Single container element
- **No External Dependencies**: Lightweight and secure

### Permissions
- `activeTab`: Access to interact with the current tab
- `scripting`: Inject content scripts
- `storage`: Save user preferences
- `host_permissions`: Work on all websites

## Browser Compatibility

- **Chrome**: Version 88+ (Manifest V3 support)
- **Edge**: Version 88+ (Chromium-based)
- **Other Chromium browsers**: Should work with Manifest V3 support

## Accessibility Compliance

ScrollCircle follows WCAG 2.1 guidelines:
- **Keyboard Navigation**: Full functionality without a mouse
- **Screen Reader Support**: Proper ARIA labels and roles
- **High Contrast**: Visual accessibility option
- **Focus Management**: Clear focus indicators
- **No Animation Sensitivity**: Respects user motion preferences

## Privacy

ScrollCircle is designed with privacy in mind:
- **No Data Collection**: Does not collect or transmit user data
- **Local Storage Only**: Settings stored locally on your device
- **No Network Requests**: Works entirely offline
- **No Analytics**: No tracking or usage analytics

## Troubleshooting

### Common Issues

**Circle doesn't appear**
- Check if the extension is enabled in chrome://extensions/
- Try refreshing the page and activating again
- Some pages (like chrome:// URLs) don't allow content scripts

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

### Reporting Issues

If you encounter bugs or have feature requests, please include:
- Chrome version
- Extension version
- Steps to reproduce
- Any error messages in the console

## Development

### Building from Source
1. Clone the repository
2. No build process required - load directly as unpacked extension
3. Make changes to the source files
4. Reload the extension in chrome://extensions/

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For help and support:
- Check this README for common solutions
- Review the in-extension help tooltips
- Check browser console for error messages

## Version History

### v1.0.0
- Initial release
- Core scrolling functionality
- Draggable circle interface
- Keyboard accessibility
- Settings page
- High contrast mode
- Position persistence
