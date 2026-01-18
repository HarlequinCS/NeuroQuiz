const fs = require('fs');
const path = require('path');

/**
 * JavaScript Bundler for NeuroQuiz
 * Bundles all JS files per page into single files
 */

const jsOrder = {
  'index': ['theme.js', 'mobile-menu.js', 'index.js'],
  'setup': ['theme.js', 'mobile-menu.js', 'data.js'],
  'quiz': ['data.js', 'engine.js', 'cognitive-analyzer.js', 'quiz-ui.js', 'background-effects.js'],
  'result': ['theme.js', 'cognitive-analyzer.js', 'results-ui.js'],
  'about': ['theme.js', 'mobile-menu.js', 'about.js', 'card-tilt.js']
};

const jsDir = path.join(__dirname, '..', 'js');
const distJsDir = path.join(__dirname, '..', 'dist', 'js');

// Ensure dist/js directory exists
if (!fs.existsSync(distJsDir)) {
  fs.mkdirSync(distJsDir, { recursive: true });
}

// Bundle JS for each page
Object.keys(jsOrder).forEach(page => {
  const files = jsOrder[page];
  let bundle = '';
  
  // Add bundle header comment
  bundle += `/* NeuroQuiz ${page} Bundle - Production Build */\n`;
  bundle += `/* Bundled: ${new Date().toISOString()} */\n\n`;
  
  files.forEach(file => {
    const filePath = path.join(jsDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add file separator comment
      bundle += `/* === ${file} === */\n`;
      bundle += content;
      bundle += `\n\n`;
    } else {
      console.warn(`Warning: JS file not found: ${filePath}`);
    }
  });
  
  // Write bundled JS
  const outputPath = path.join(distJsDir, `${page}.bundle.js`);
  fs.writeFileSync(outputPath, bundle, 'utf8');
  console.log(`✓ Bundled JS for ${page}: ${files.length} files → ${outputPath}`);
});

// Also create a general bundle for shared JS
const sharedJs = ['theme.js', 'mobile-menu.js'];
let sharedBundle = '/* NeuroQuiz Shared JS Bundle */\n\n';

sharedJs.forEach(file => {
  const filePath = path.join(jsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    sharedBundle += `/* === ${file} === */\n`;
    sharedBundle += content;
    sharedBundle += `\n\n`;
  }
});

fs.writeFileSync(path.join(distJsDir, 'bundle.js'), sharedBundle, 'utf8');
console.log('✓ Created shared JS bundle: bundle.js');
