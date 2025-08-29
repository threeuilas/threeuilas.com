# Three Uilas Website

A modern, responsive website for Three Uilas - Electric Farm Utility Vehicles in Hawaii.

## Directory Structure

```
threeuilas.com/
├── src/                    # Source files
│   ├── index.html         # Main HTML file
│   ├── index.css          # Source CSS with Tailwind directives
│   └── script.js          # JavaScript functionality
├── dist/                   # Build outputs (deployable)
│   ├── index.html         # Production HTML with updated paths
│   ├── index_output.css   # Compiled CSS
│   ├── script.js          # JavaScript file
│   └── assets/            # All static assets (images, fonts, logos)
├── assets/                 # Source static assets
│   ├── images/            # Product and company images
│   ├── fonts.css          # Font definitions
│   ├── logo.svg           # Company logo
│   ├── three-uilas-favicon.png
│   ├── three-uilas-favicon.svg
│   ├── three-uilas-logo-icon.svg
│   └── three-uilas-logo-raw.svg
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Development

### Prerequisites
- Node.js and npm
- Python 3 (for local development server)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build complete project:
   ```bash
   npm run build
   ```

### Development Commands

- **Complete Build**: `npm run build` - Builds CSS, copies all assets, and updates HTML paths
- **CSS Only**: `npm run build:css` - Just rebuild CSS
- **Copy Assets**: `npm run copy:assets` - Copy assets and JS to dist
- **Update HTML**: `npm run copy:html` - Copy HTML and fix paths
- **Clean Build**: `npm run clean` - Remove dist folder and start fresh
- **Watch CSS changes**: `npm run watch` - Watch for CSS changes
- **Serve locally**: `npm run serve` - Serve from dist folder (production-ready)
- **Development mode**: `npm run dev` - Watch CSS and serve simultaneously

### Local Development
The development server runs on `http://localhost:8000` and serves files from the `dist/` directory, giving you a production-like environment.

## Build Process

The complete build process:

1. **CSS Build**: Processes `src/index.css` with Tailwind CSS v4 → `dist/index_output.css`
2. **Asset Copy**: Copies entire `assets/` folder and `script.js` to `dist/`
3. **HTML Processing**: Copies HTML and updates all file paths to be relative to `dist/`
4. **Result**: A complete, deployable website in the `dist/` folder

## Features

- Responsive design optimized for all devices
- Modern UI with Tailwind CSS
- Mobile-first navigation
- Optimized images and assets
- Clean, maintainable code structure
- **Production-ready builds** with all assets included

## Deployment

The `dist/` folder contains everything needed for production deployment:
- All HTML, CSS, and JavaScript files
- Complete assets folder with images, fonts, and logos
- Properly configured file paths
- No external dependencies (except CDN fonts)

Simply upload the entire contents of the `dist/` folder to your web server.