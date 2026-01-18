const fs = require('fs');
const path = require('path');

/**
 * CSS Bundler for NeuroQuiz
 * Bundles all CSS files per page into single files
 */

const cssOrder = {
  'index': ['theme.css', 'layout.css', 'animations.css', 'index.css'],
  'setup': ['theme.css', 'layout.css', 'animations.css', 'setup.css'],
  'quiz': ['theme.css', 'quiz.css', 'animations.css'],
  'result': ['theme.css', 'layout.css', 'animations.css', 'results.css'],
  'about': ['theme.css', 'layout.css', 'animations.css', 'about.css']
};

const cssDir = path.join(__dirname, '..', 'css');
const distCssDir = path.join(__dirname, '..', 'dist', 'css');

// Ensure dist/css directory exists
if (!fs.existsSync(distCssDir)) {
  fs.mkdirSync(distCssDir, { recursive: true });
}

// Bundle CSS for each page
Object.keys(cssOrder).forEach(page => {
  const files = cssOrder[page];
  let bundle = '';
  
  // Add critical CSS inline comment
  bundle += `/* NeuroQuiz ${page} Bundle - Production Build */\n`;
  bundle += `/* Bundled: ${new Date().toISOString()} */\n\n`;
  
  files.forEach(file => {
    const filePath = path.join(cssDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      bundle += `/* === ${file} === */\n`;
      bundle += content;
      bundle += `\n\n`;
    } else {
      console.warn(`Warning: CSS file not found: ${filePath}`);
    }
  });
  
  // Write bundled CSS
  const outputPath = path.join(distCssDir, `${page}.bundle.css`);
  fs.writeFileSync(outputPath, bundle, 'utf8');
  console.log(`✓ Bundled CSS for ${page}: ${files.length} files → ${outputPath}`);
});

// Also create a general bundle for shared CSS
const sharedCss = ['theme.css', 'layout.css', 'animations.css'];
let sharedBundle = '/* NeuroQuiz Shared CSS Bundle */\n\n';

sharedCss.forEach(file => {
  const filePath = path.join(cssDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    sharedBundle += `/* === ${file} === */\n`;
    sharedBundle += content;
    sharedBundle += `\n\n`;
  }
});

fs.writeFileSync(path.join(distCssDir, 'bundle.css'), sharedBundle, 'utf8');
console.log('✓ Created shared CSS bundle: bundle.css');
