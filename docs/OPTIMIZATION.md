# NeuroQuiz™ Performance Optimization Guide

Complete guide for optimizing NeuroQuiz performance to achieve Lighthouse scores > 90.

---

## 🎯 Quick Optimization Checklist

### Before Building

- [ ] Optimize all images (PNG, JPG → WebP where possible)
- [ ] Extract and inline critical CSS
- [ ] Preload important resources
- [ ] Defer non-critical JavaScript
- [ ] Use lazy loading for images

### After Building

- [ ] Verify all CSS/JS files are minified
- [ ] Check HTML files are minified
- [ ] Test with Lighthouse
- [ ] Verify .htaccess is working
- [ ] Test offline functionality (service worker)

---

## 📊 Performance Optimizations

### 1. Critical CSS Inlining

**Goal:** Improve First Contentful Paint (FCP)

**Steps:**

1. Identify above-the-fold content:
   - Header navigation
   - Hero section
   - First visible text/images

2. Extract critical CSS:
   ```bash
   # Using Penthouse (Node.js)
   npm install -g penthouse
   penthouse http://localhost:3000 dist/css/index.min.css > critical.css
   ```

3. Inline in HTML `<head>`:
   ```html
   <head>
     <!-- Critical CSS Inline -->
     <style>
       /* Header, Hero, First Paint CSS here */
       .header { ... }
       .hero-section { ... }
       .nav { ... }
     </style>
     
     <!-- Preload Full CSS -->
     <link rel="preload" href="css/index.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
     <noscript><link rel="stylesheet" href="css/index.min.css"></noscript>
   </head>
   ```

**Expected Improvement:** FCP: -0.3s to -0.5s

---

### 2. JavaScript Optimization

**Goal:** Reduce JavaScript parse/compile time

**Current Issues:**
- Multiple script tags blocking render
- External CDN dependencies (Font Awesome, Google Fonts)

**Optimization Steps:**

#### Step 1: Bundle & Minify JavaScript
```bash
npm run build:js
```

#### Step 2: Use Defer/Async
```html
<!-- Before -->
<script src="js/theme.js"></script>
<script src="js/mobile-menu.js"></script>
<script src="js/index.js"></script>

<!-- After -->
<script src="js/index.min.js" defer></script>
```

#### Step 3: Remove Blocking External Scripts
- Consider self-hosting Font Awesome icons (use SVG sprites)
- Self-host Google Fonts

**Expected Improvement:** TTI: -0.5s to -1.0s

---

### 3. Image Optimization

**Goal:** Reduce image payload size

**Current Issues:**
- Large PNG images
- No WebP format
- No lazy loading

**Optimization Steps:**

#### Step 1: Convert to WebP
```bash
# Using cwebp (Google)
cwebp -q 80 image.png -o image.webp

# Or use online tool: https://cloudconvert.com/png-to-webp
```

#### Step 2: Use Responsive Images
```html
<!-- Before -->
<img src="landing-bg.png" alt="Background">

<!-- After -->
<picture>
  <source srcset="landing-bg.webp" type="image/webp">
  <source srcset="landing-bg.jpg" type="image/jpeg">
  <img src="landing-bg.png" alt="Background" loading="lazy">
</picture>
```

#### Step 3: Add Lazy Loading
```html
<img src="image.jpg" loading="lazy" alt="Description" width="800" height="600">
```

#### Step 4: Use Appropriate Sizes
- Desktop: 1200px max width
- Tablet: 800px max width
- Mobile: 400px max width

**Expected Improvement:** LCP: -0.5s to -1.5s, Bandwidth: -60% to -80%

---

### 4. Font Optimization

**Goal:** Prevent font loading blocking render

**Current Issues:**
- Google Fonts loaded synchronously
- Font Awesome loaded via CDN

**Optimization Steps:**

#### Step 1: Preload Fonts
```html
<link rel="preload" href="assets/fonts/orbitron-regular.woff2" as="font" type="font/woff2" crossorigin>
```

#### Step 2: Use font-display: swap
```css
@font-face {
  font-family: 'Orbitron';
  src: url('fonts/orbitron-regular.woff2') format('woff2');
  font-display: swap; /* Shows fallback while loading */
}
```

#### Step 3: Self-Host Fonts (Recommended)
- Download fonts from Google Fonts
- Host locally in `assets/fonts/`
- Remove external CDN link

**Expected Improvement:** FCP: -0.2s to -0.4s

---

### 5. Resource Preloading

**Goal:** Prioritize critical resources

**Add to `<head>`:**
```html
<!-- DNS Prefetch for External Resources -->
<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">

<!-- Preconnect to External Domains -->
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>

<!-- Preload Critical CSS -->
<link rel="preload" href="css/index.min.css" as="style">

<!-- Preload Critical JavaScript -->
<link rel="preload" href="js/index.min.js" as="script">

<!-- Preload Critical Images -->
<link rel="preload" href="assets/images/logo.svg" as="image">
```

---

### 6. HTML Optimization

**Goal:** Reduce HTML payload size

**Current Issues:**
- Inline scripts block parsing
- Comments and whitespace add bytes

**Optimization Steps:**

#### Step 1: Minify HTML
```bash
npm run minify:html
```

#### Step 2: Remove Inline Scripts (Move to External)
```html
<!-- Before -->
<script>
  document.addEventListener('DOMContentLoaded', () => {
    // code here
  });
</script>

<!-- After -->
<script src="js/index.min.js" defer></script>
```

**Expected Improvement:** HTML Size: -30% to -50%

---

### 7. Caching Strategy

**Goal:** Reduce server requests on repeat visits

**Configured in .htaccess:**

| Asset Type | Cache Duration | Cache-Control |
|------------|----------------|---------------|
| HTML | 1 hour | `max-age=3600, must-revalidate` |
| CSS/JS | 1 month | `max-age=2592000, immutable` |
| Images | 1 year | `max-age=31536000, immutable` |
| Fonts | 1 year | `max-age=31536000, immutable` |

**Cache Busting:**
When updating assets, change filename:
- `styles-v1.0.0.min.css` → `styles-v1.0.1.min.css`
- Or use query string: `styles.min.css?v=1.0.1`

---

### 8. Compression

**Goal:** Reduce transfer size

**Configured in .htaccess:**
- Gzip compression enabled
- Compresses: HTML, CSS, JS, JSON, SVG

**Verify Compression:**
```bash
curl -H "Accept-Encoding: gzip" -I https://yoursite.com/css/styles.min.css
# Should see: Content-Encoding: gzip
```

**Expected Improvement:** Transfer Size: -70% to -85%

---

## 📈 Performance Metrics

### Target Metrics

| Metric | Target | Critical |
|--------|--------|----------|
| First Contentful Paint (FCP) | < 1.8s | < 2.5s |
| Largest Contentful Paint (LCP) | < 2.5s | < 4.0s |
| Time to Interactive (TTI) | < 3.8s | < 5.0s |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.25 |
| Total Blocking Time (TBT) | < 200ms | < 600ms |
| Speed Index | < 3.4s | < 4.0s |

### How to Measure

1. **Lighthouse (Chrome DevTools):**
   - Open DevTools (F12)
   - Go to Lighthouse tab
   - Click "Generate report"

2. **WebPageTest:**
   - https://www.webpagetest.org/
   - Enter URL and test

3. **PageSpeed Insights:**
   - https://pagespeed.web.dev/
   - Enter URL for analysis

---

## 🔧 Advanced Optimizations

### 1. Service Worker (Offline Caching)

**Setup:**
1. Copy `service-worker.js` to production root
2. Register in HTML:
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
</script>
```

**Benefits:**
- Offline functionality
- Faster repeat visits
- Reduced server load

### 2. HTTP/2 Server Push (If Available)

Push critical resources to client:
```apache
# Apache mod_http2
Header add Link "</css/styles.min.css>; rel=preload; as=style"
Header add Link "</js/scripts.min.js>; rel=preload; as=script"
```

### 3. CDN Deployment

**Benefits:**
- Geographic distribution
- Faster global load times
- DDoS protection

**Options:**
- Cloudflare (Free tier available)
- AWS CloudFront
- Netlify CDN

### 4. Subresource Integrity (SRI)

For external resources (if still using CDN):
```html
<link rel="stylesheet" 
      href="https://cdn.example.com/font-awesome.css"
      integrity="sha384-..."
      crossorigin="anonymous">
```

---

## 🎯 Page-Specific Optimizations

### Index Page

**Critical Path:**
1. Header navigation CSS
2. Hero section CSS
3. Logo image
4. Hero background image

**Optimization:**
- Inline header + hero CSS
- Preload logo.svg
- Lazy load background particles animation

### Quiz Page

**Critical Path:**
1. Quiz container CSS
2. Question card CSS
3. Button styles

**Optimization:**
- Inline quiz container CSS
- Defer background effects JS
- Lazy load animations

### Result Page

**Critical Path:**
1. Results display CSS
2. Chart library (if external)
3. Analytics scripts (defer)

**Optimization:**
- Inline results CSS
- Load Chart.js asynchronously
- Defer analytics

---

## 📋 Pre-Deployment Checklist

- [ ] All images optimized (WebP, appropriate sizes)
- [ ] Critical CSS inlined in HTML
- [ ] JavaScript bundled and minified
- [ ] CSS bundled and minified
- [ ] HTML minified
- [ ] Fonts optimized (font-display: swap)
- [ ] Service worker configured (optional)
- [ ] .htaccess deployed
- [ ] Cache headers verified
- [ ] Compression verified (Gzip)
- [ ] Lighthouse score > 90
- [ ] Mobile responsiveness tested
- [ ] Cross-browser testing completed

---

## 🐛 Common Issues & Solutions

### Issue: Lighthouse score still below 90

**Solutions:**
1. Check image optimization (use WebP)
2. Inline more critical CSS
3. Defer non-critical JavaScript
4. Reduce render-blocking resources
5. Enable compression

### Issue: Slow Time to Interactive (TTI)

**Solutions:**
1. Reduce JavaScript bundle size
2. Code-split large JS files
3. Remove unused JavaScript
4. Use async/defer for scripts

### Issue: Large Layout Shift (CLS)

**Solutions:**
1. Set width/height attributes on images
2. Reserve space for dynamic content
3. Avoid inserting content above existing content
4. Use CSS aspect-ratio for responsive images

### Issue: Slow LCP (Largest Contentful Paint)

**Solutions:**
1. Optimize hero image (WebP, appropriate size)
2. Preload LCP image
3. Reduce server response time
4. Minimize render-blocking CSS/JS

---

## 📚 Resources

- [Web.dev Performance Guide](https://web.dev/performance/)
- [Lighthouse Scoring Guide](https://web.dev/performance-scoring/)
- [Critical CSS Tools](https://github.com/pocketjins/penthouse)
- [Image Optimization Guide](https://web.dev/fast/#optimize-your-images)
- [Font Loading Best Practices](https://web.dev/font-best-practices/)

---

**Last Updated:** January 2026  
**Version:** 1.0.0
