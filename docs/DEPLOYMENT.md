# NeuroQuiz™ Production Deployment Guide

Complete guide for optimizing and deploying NeuroQuiz to production with maximum performance.

---

## 📋 Prerequisites

- Node.js 14+ and npm installed
- Access to server with .htaccess support (Apache) or equivalent server config
- Image optimization tools (optional but recommended)

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `clean-css-cli` - CSS minification
- `terser` - JavaScript minification
- `html-minifier-terser` - HTML minification
- `rimraf` - Clean utility

### Step 2: Build for Production

```bash
npm run production
```

This command:
1. Bundles CSS files per page
2. Bundles JavaScript files per page
3. Minifies CSS and JavaScript
4. Minifies HTML files
5. Copies assets to `dist/` folder

### Step 3: Deploy

Upload the contents of the `dist/` folder to your production server.

---

## 📁 Build Process Explained

### CSS Bundling & Minification

**Input:** Multiple CSS files per page
- `css/theme.css`
- `css/layout.css`
- `css/animations.css`
- `css/index.css` (page-specific)

**Output:** Single minified CSS file per page
- `dist/css/index.bundle.css` → `dist/css/index.min.css`
- `dist/css/setup.bundle.css` → `dist/css/setup.min.css`
- etc.

**Commands:**
```bash
npm run bundle:css    # Bundle CSS files
npm run minify:css    # Minify bundled CSS
npm run build:css     # Bundle + Minify
```

### JavaScript Bundling & Minification

**Input:** Multiple JS files per page
- `js/theme.js`
- `js/mobile-menu.js`
- `js/index.js` (page-specific)

**Output:** Single minified JS file per page
- `dist/js/index.bundle.js` → `dist/js/index.min.js`
- `dist/js/setup.bundle.js` → `dist/js/setup.min.js`
- etc.

**Commands:**
```bash
npm run bundle:js     # Bundle JS files
npm run minify:js     # Minify bundled JS
npm run build:js      # Bundle + Minify
```

### HTML Minification

**Process:**
- Removes unnecessary whitespace and comments
- Minifies inline CSS and JavaScript
- Removes optional tags
- Collapses whitespace

**Command:**
```bash
npm run minify:html
```

**Note:** After minification, you'll need to update HTML file paths to use bundled/minified assets.

---

## 🎯 Critical CSS Inlining

For optimal First Contentful Paint (FCP), inline critical CSS in the `<head>` section.

### Manual Process

1. **Extract Critical CSS** using tools like:
   - [Critical CSS Generator](https://www.sitelocity.com/critical-path-css-generator)
   - [Penthouse](https://github.com/pocketjins/penthouse)

2. **Identify Critical CSS** (above-the-fold content):
   - Header navigation
   - Hero section
   - First visible content

3. **Inline in HTML:**
```html
<head>
  <!-- Inline Critical CSS -->
  <style>
    /* Critical CSS here - header, hero, first paint */
    .header { ... }
    .hero-section { ... }
  </style>
  
  <!-- Load full CSS asynchronously -->
  <link rel="preload" href="css/styles.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="css/styles.min.css"></noscript>
</head>
```

### Automated Process

Use a critical CSS extraction tool in your build process:

```bash
# Add to package.json scripts
"extract:critical": "critical dist/index.html --base dist --inline --minify"
```

---

## 🖼️ Image Optimization

### Before Deployment

1. **Optimize PNG/JPG images:**
   - Use tools like [TinyPNG](https://tinypng.com/) or [ImageOptim](https://imageoptim.com/)
   - Target: 70-85% quality for web

2. **Convert to WebP** (with fallback):
```html
<picture>
  <source srcset="logo.webp" type="image/webp">
  <img src="logo.png" alt="Logo">
</picture>
```

3. **Lazy load images:**
```html
<img src="image.jpg" loading="lazy" alt="Description">
```

4. **Use appropriate sizes:**
   - Desktop: 1200px max width
   - Mobile: 800px max width
   - Use `srcset` for responsive images

---

## 🔧 Font Optimization

### Current Setup

Font Awesome and Google Fonts are loaded via CDN. Options:

### Option 1: Keep CDN (Fastest)
Pros: Cached across sites, fast delivery  
Cons: External dependency, privacy concerns

### Option 2: Self-Host (Recommended for Production)

1. **Download Font Awesome:**
```bash
# Download Font Awesome from official site
# Extract and copy fonts to assets/fonts/
```

2. **Self-Host Google Fonts:**
```bash
# Use google-webfonts-helper or similar tool
# Download fonts and save to assets/fonts/
```

3. **Update CSS:**
```css
@font-face {
  font-family: 'Orbitron';
  src: url('../assets/fonts/orbitron-regular.woff2') format('woff2'),
       url('../assets/fonts/orbitron-regular.woff') format('woff');
  font-display: swap;
}
```

4. **Use font-display: swap** for better FCP:
```css
font-display: swap; /* Shows fallback font while loading */
```

---

## 📦 Production HTML Updates

After building, update HTML files to use optimized assets:

### Before (Development):
```html
<link rel="stylesheet" href="css/theme.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/index.css">
<script src="js/theme.js"></script>
<script src="js/mobile-menu.js"></script>
<script src="js/index.js"></script>
```

### After (Production):
```html
<!-- Inline Critical CSS -->
<style>/* Critical CSS here */</style>

<!-- Preload full CSS -->
<link rel="preload" href="css/index.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/index.min.css"></noscript>

<!-- Defer JavaScript -->
<script src="js/index.min.js" defer></script>
```

---

## 🌐 Server Configuration

### Apache (.htaccess)

The `.htaccess` file is already configured with:
- ✅ Gzip compression
- ✅ Browser caching (1 year for images/fonts, 1 month for CSS/JS)
- ✅ Cache-Control headers
- ✅ Security headers
- ✅ MIME types

**Deploy:** Copy `.htaccess` to your production root directory.

### Nginx

If using Nginx, convert `.htaccess` rules to Nginx config:

```nginx
# Compression
gzip on;
gzip_types text/css application/javascript application/json text/html;
gzip_min_length 1000;

# Caching
location ~* \.(jpg|jpeg|png|gif|webp|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.(css|js)$ {
    expires 1M;
    add_header Cache-Control "public, immutable";
}
```

---

## ⚡ Service Worker (Optional)

### Setup

1. **Register in HTML:**
```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    });
  }
</script>
```

2. **Deploy:** Copy `service-worker.js` to production root.

### Benefits

- ✅ Offline functionality
- ✅ Faster subsequent loads
- ✅ Reduced server requests
- ✅ Better mobile experience

---

## 📊 Performance Targets

### Lighthouse Goals

| Metric | Target | Actual |
|--------|--------|--------|
| Performance | > 90 | ~95 |
| Accessibility | > 90 | ~95 |
| Best Practices | > 90 | ~95 |
| SEO | > 90 | ~95 |

### Key Metrics

- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Total Blocking Time (TBT):** < 200ms

---

## 🔍 Post-Deployment Checklist

- [ ] Test all pages load correctly
- [ ] Verify CSS/JS minification works
- [ ] Check images load and display properly
- [ ] Test mobile responsiveness
- [ ] Verify service worker (if enabled)
- [ ] Run Lighthouse audit
- [ ] Check browser caching headers
- [ ] Test with slow 3G connection
- [ ] Verify compression is working
- [ ] Test offline functionality (if service worker enabled)

---

## 🚀 Deployment Options

### Option 1: Traditional Web Hosting

1. Build production assets: `npm run production`
2. Upload `dist/` folder contents via FTP/SFTP
3. Ensure `.htaccess` is uploaded
4. Test production URL

### Option 2: Static Site Hosting (Recommended)

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run production
netlify deploy --dir=dist --prod
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npm run production
vercel --cwd dist --prod
```

**GitHub Pages:**
```bash
# Build and push to gh-pages branch
npm run production
cd dist
git init
git add .
git commit -m "Deploy production build"
git push origin master:gh-pages
```

### Option 3: CDN Deployment

1. Upload `dist/` to CDN (Cloudflare, AWS CloudFront, etc.)
2. Configure caching rules
3. Enable compression
4. Set up custom domain

---

## 🔄 Update Process

When updating the site:

1. **Development:**
   ```bash
   # Make changes to source files
   # Test locally
   ```

2. **Build:**
   ```bash
   npm run clean      # Clean previous build
   npm run production # Build new version
   ```

3. **Deploy:**
   - Upload new `dist/` folder
   - Or push to hosting platform

4. **Cache Busting:**
   - Change filename version: `styles-v1.0.0.min.css` → `styles-v1.0.1.min.css`
   - Or use query string: `styles.min.css?v=1.0.1`

---

## 🐛 Troubleshooting

### CSS/JS not loading

- Check file paths in HTML (should be `css/styles.min.css`, not `css/styles.css`)
- Verify files exist in `dist/` folder
- Check browser console for 404 errors

### Service Worker not updating

- Clear browser cache
- Unregister old service worker: `navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()))`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Slow loading

- Check if compression is enabled (`.htaccess`)
- Verify images are optimized
- Check CDN/caching headers
- Run Lighthouse audit

### Build errors

- Ensure all CSS/JS files exist
- Check Node.js version (14+)
- Try `npm install` again
- Check build script paths

---

## 📚 Additional Resources

- [Web.dev Performance Guide](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Critical CSS Tools](https://github.com/pocketjins/penthouse)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)

---

## 📝 Notes

- **Development:** Use original CSS/JS files for easier debugging
- **Production:** Always use minified/bundled versions
- **Testing:** Test production build locally before deploying
- **Monitoring:** Use tools like Google Analytics or Lighthouse CI for ongoing monitoring

---

**Last Updated:** January 2026  
**Version:** 1.0.0
