const fs = require('fs');
const path = require('path');

/**
 * Copy Assets for Production Build
 * Copies necessary assets to dist folder
 */

const srcDir = __dirname + '/..';
const distDir = path.join(__dirname, '..', 'dist');

// Ensure dist directories exist
const distDirs = [
  'dist',
  'dist/assets',
  'dist/assets/images',
  'dist/assets/audio',
  'dist/assets/fonts',
  'dist/data',
  'dist/css',
  'dist/js'
];

distDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Copy function
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy assets
console.log('Copying assets...');
copyRecursiveSync(path.join(srcDir, 'assets'), path.join(distDir, 'assets'));
console.log('✓ Copied assets/');

// Copy data files
console.log('Copying data files...');
copyRecursiveSync(path.join(srcDir, 'data'), path.join(distDir, 'data'));
console.log('✓ Copied data/');

// Copy favicon
if (fs.existsSync(path.join(srcDir, 'favicon.ico'))) {
  fs.copyFileSync(path.join(srcDir, 'favicon.ico'), path.join(distDir, 'favicon.ico'));
  console.log('✓ Copied favicon.ico');
}

// Copy robots.txt and sitemap.xml
['robots.txt', 'sitemap.xml'].forEach(file => {
  if (fs.existsSync(path.join(srcDir, file))) {
    fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
    console.log(`✓ Copied ${file}`);
  }
});

console.log('\n✓ Asset copy complete!');
