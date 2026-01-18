/**
 * Complete Production Build Script
 * Handles the entire build process
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting NeuroQuiz Production Build...\n');

// Build steps
const steps = [
  {
    name: 'Clean dist folder',
    command: 'rimraf dist'
  },
  {
    name: 'Bundle CSS',
    command: 'node build/bundle-css.js'
  },
  {
    name: 'Bundle JavaScript',
    command: 'node build/bundle-js.js'
  },
  {
    name: 'Minify CSS',
    command: 'cleancss -o dist/css/styles.min.css dist/css/bundle.css --level 2'
  },
  {
    name: 'Minify JavaScript',
    command: 'terser dist/js/bundle.js -o dist/js/scripts.min.js -c -m --comments false'
  },
  {
    name: 'Copy Assets',
    command: 'node build/copy-assets.js'
  }
];

// Execute build steps
steps.forEach((step, index) => {
  try {
    console.log(`[${index + 1}/${steps.length}] ${step.name}...`);
    execSync(step.command, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    console.log(`✓ ${step.name} completed\n`);
  } catch (error) {
    console.error(`✗ ${step.name} failed:`, error.message);
    process.exit(1);
  }
});

console.log('✅ Production build complete!');
console.log('📦 Output directory: dist/');
console.log('\n📋 Next steps:');
console.log('1. Update HTML files to use minified CSS/JS');
console.log('2. Add critical CSS inline in HTML <head>');
console.log('3. Optimize images (TinyPNG, ImageOptim)');
console.log('4. Test production build locally');
console.log('5. Deploy dist/ folder to server\n');
