# Favicon and Icon Setup

This directory contains placeholder favicon files. For production, replace these with your branded assets.

## Files Needed

### Required Files
- `favicon.ico` - 16x16, 32x32, 48x48 multi-size ICO format
- `favicon.svg` - SVG version (currently placeholder)
- `apple-touch-icon.png` - 180x180 PNG for iOS devices
- `icon-192.png` - 192x192 PNG for web app manifest
- `icon-512.png` - 512x512 PNG for web app manifest

### Optional Files
- `icon-maskable-192.png` - 192x192 PNG with safe zone for Android
- `icon-maskable-512.png` - 512x512 PNG with safe zone for Android

## How to Generate Icons

### Option 1: Using Figma/Design Tool
1. Design your icon in Figma, Sketch, or Adobe Illustrator
2. Export as SVG (for `favicon.svg`)
3. Export at required sizes (16x16, 32x32, 180x180, 192x192, 512x512)
4. Convert PNGs to ICO using online tool or ImageMagick

### Option 2: Using Favicon Generator
Visit [RealFaviconGenerator](https://realfavicongenerator.net/):
1. Upload your source image (at least 512x512)
2. Customize colors and styles for different platforms
3. Download the generated package
4. Replace files in this directory

### Option 3: Using ImageMagick (Command Line)
```bash
# Convert SVG to PNG sizes
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 icon-192.png
convert favicon.svg -resize 512x512 icon-512.png

# Create ICO from PNGs
convert favicon.svg -resize 16x16 favicon-16.png
convert favicon.svg -resize 32x32 favicon-32.png
convert favicon.svg -resize 48x48 favicon-48.png
convert favicon-16.png favicon-32.png favicon-48.png favicon.ico

# Clean up temporary files
rm favicon-16.png favicon-32.png favicon-48.png
```

## Design Guidelines

### Icon Design Best Practices
- **Simple and recognizable**: Icons should work at small sizes (16x16)
- **Flat design**: Avoid gradients and complex shadows for better scalability
- **High contrast**: Ensure icon is visible on both light and dark backgrounds
- **Safe zone for maskable icons**: Keep important content within 80% center circle

### Color Recommendations
- **Primary color**: `#3b82f6` (blue) - matches default theme
- **Background**: `#ffffff` (white) or transparent
- **Contrast ratio**: Maintain WCAG AA compliance (4.5:1 minimum)

### Testing
1. **Browser tabs**: Test favicon.ico at 16x16 in Chrome, Firefox, Safari
2. **iOS home screen**: Test apple-touch-icon.png by adding to iOS home screen
3. **Android home screen**: Test maskable icons on Android devices
4. **PWA install**: Test manifest icons in PWA installation flow

## Current Placeholder

The current `favicon.svg` contains a simple geometric placeholder:
- Blue rounded square background (#3b82f6)
- White diamond shape
- Blue center circle

**Replace this with your actual branding before production deployment.**

## References
- [Web.dev - Define icons and a theme color](https://web.dev/add-manifest/#icons)
- [MDN - Web app manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Apple - Configuring Web Applications](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)
