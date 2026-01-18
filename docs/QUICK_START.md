# NeuroQuiz™ Production Optimization - Quick Start

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Build for Production

```bash
npm run production
```

This creates optimized files in the `dist/` folder.

### 3. Deploy

Upload the `dist/` folder contents to your production server.

---

## 📁 What Gets Built?

- ✅ **CSS**: Bundled & minified → `dist/css/*.min.css`
- ✅ **JavaScript**: Bundled & minified → `dist/js/*.min.js`
- ✅ **HTML**: Minified → `dist/*.html`
- ✅ **Assets**: Copied → `dist/assets/`
- ✅ **Data**: Copied → `dist/data/`

---

## 📋 Next Steps

1. **Update HTML files** to use minified CSS/JS:
   - Change `css/theme.css` → `css/index.min.css`
   - Change `js/theme.js` → `js/index.min.js`

2. **Add critical CSS** inline in HTML `<head>` (see DEPLOYMENT.md)

3. **Optimize images** (WebP, appropriate sizes)

4. **Deploy** `.htaccess` file to server root

5. **Optional**: Enable service worker (see DEPLOYMENT.md)

---

## 📊 Performance Goals

- **Lighthouse Score**: > 90 (all metrics)
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s

---

## 📚 Full Documentation

- **Deployment Guide**: See `DEPLOYMENT.md`
- **Optimization Guide**: See `OPTIMIZATION.md`
- **Build Scripts**: See `build/` folder

---

**Quick Commands:**

```bash
npm run clean        # Clean dist folder
npm run build        # Build CSS + JS
npm run production   # Full production build
```
