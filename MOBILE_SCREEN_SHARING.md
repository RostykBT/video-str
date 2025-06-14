# Mobile Screen Sharing Setup Guide

## For Android Chrome Users

### Method 1: Enable Experimental Features

1. Open Chrome on your Android device
2. Navigate to: `chrome://flags`
3. Search for and enable these flags:
   - **Experimental Web Platform features**: Enabled
   - **Desktop PWAs**: Enabled
   - **Screen Capture API**: Enabled (if available)
4. Restart Chrome
5. Visit the cast page and try screen sharing

### Method 2: Desktop Site Mode

1. Open Chrome on your Android device
2. Navigate to the cast page
3. Tap the three dots menu (⋮)
4. Check "Desktop site"
5. Refresh the page
6. Try screen sharing

### Method 3: Install as PWA

1. Visit the cast page in Chrome
2. Tap "Add to Home Screen" when prompted
3. Open the app from home screen
4. Try screen sharing (PWAs have enhanced permissions)

## For iOS Safari Users

### Limited Support

- iOS Safari has very limited screen sharing support
- Try Desktop mode: Safari → AA → Request Desktop Website
- Consider using Chrome or Firefox on iOS

## For Firefox Mobile Users

### Enable Developer Features

1. Open Firefox on your mobile device
2. Navigate to: `about:config`
3. Search for: `media.getdisplaymedia.enabled`
4. Set to: `true`
5. Restart Firefox

## Desktop Browsers (Full Support)

All modern desktop browsers support screen sharing:

- Chrome 72+
- Firefox 66+
- Safari 13+
- Edge 79+

## Troubleshooting

### Common Issues

1. **Permission Denied**: Make sure to allow all permissions when prompted
2. **Not Supported**: Try enabling experimental features or desktop mode
3. **Black Screen**: Check if other apps are using screen sharing
4. **Audio Issues**: Ensure microphone permissions are granted

### Advanced Tips

- Use landscape orientation on mobile for better quality
- Close other apps to free up resources
- Ensure stable internet connection
- Try different browsers if one doesn't work

## Browser Feature Detection

The app automatically detects:

- Device type (mobile/desktop)
- Browser type and version
- Available screen sharing APIs
- Fallback methods

## Security Note

Screen sharing requires secure contexts (HTTPS) in production.
The development server uses HTTP, but modern browsers allow
localhost screen sharing for testing.
