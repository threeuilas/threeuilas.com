# Three Uilas Website - Development Guide

A static website built with modern web technologies for Three Uilas electric farm utility vehicles.

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with accessibility features
- **Tailwind CSS v4**: Utility-first CSS framework
- **Vanilla JavaScript**: ES6+ for interactions and mobile menu
- **Custom Fonts**: Asap Condensed font family via Google Fonts
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

## 📁 Project Structure

```
threeuilas.com/
├── index.html              # Main HTML file
├── index.css               # Tailwind CSS source with custom styles
├── index_output.css        # Compiled CSS (generated)
├── fonts.css               # Custom font definitions
├── script.js               # JavaScript functionality
├── assets/                 # Logo and brand assets
│   ├── three-uilas-logo-combined.svg
│   ├── three-uilas-logo-icon.svg
│   └── three-uilas-logo-raw.svg
├── images/                 # Product and company images
│   ├── dump-bed-gate.jpg
│   ├── dump-bed-rear-view.jpg
│   ├── dump-bed-side-view.jpg
│   └── three-uilas-production.jpeg
├── package.json            # Dependencies
└── README.md               # This file
```

## 🚀 Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build CSS**:
   ```bash
   npx tailwindcss -i index.css -o index_output.css
   ```

3. **View Website**:
   Open `index.html` in your web browser

## 🔧 Development Workflow

### CSS Development
- **Source**: Edit `index.css` for all styles
- **Build**: Run Tailwind CLI to compile to `index_output.css`
- **Custom Styles**: Add custom CSS after Tailwind imports in `index.css`

### JavaScript
- **File**: `script.js` contains all interactive functionality
- **Features**: Mobile menu, smooth scrolling, keyboard navigation
- **No Dependencies**: Pure vanilla JavaScript, no frameworks

### HTML Structure
- **Semantic**: Uses proper HTML5 semantic elements
- **Accessibility**: ARIA labels and keyboard navigation support
- **SEO**: Meta tags and structured content

## 📱 Responsive Design

- **Mobile-First**: Default styles for mobile devices
- **Breakpoints**: 
  - Mobile: Default (320px+)
  - Tablet: `md:` prefix (768px+)
  - Desktop: `lg:` prefix (1024px+)
- **Mobile Menu**: Hamburger menu with slide-out navigation

## 🎨 Design System

- **Colors**: Defined as CSS custom properties in `index.css`
- **Typography**: Asap Condensed font family
- **Spacing**: Tailwind's spacing scale for consistency
- **Components**: Reusable UI patterns with consistent styling

## 🔄 Build Process

The CSS build process:
1. **Source**: `index.css` imports Tailwind and adds custom styles
2. **Build**: Tailwind CLI processes and optimizes
3. **Output**: `index_output.css` contains all styles ready for production

## 📝 File Management

- **Images**: Optimize and compress before adding to `images/` folder
- **Assets**: SVG logos in `assets/` folder for scalability
- **Fonts**: Google Fonts loaded via CDN in HTML head

## 🚀 Deployment

This is a static site that can be deployed to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Any static hosting service**

Simply upload all files excluding `node_modules/` and `package.json`.

## 🔍 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Fallbacks**: Graceful degradation for older browsers

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Glossary/Semantics)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)