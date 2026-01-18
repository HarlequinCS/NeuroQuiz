const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Minify all bundled JavaScript files
 */

const distJsDir = path.join(__dirname, '..', 'dist', 'js');

if (!fs.existsSync(distJsDir)) {
  console.error('Error: dist/js directory not found. Run bundle:js first.');
  process.exit(1);
}

const jsFiles = fs.readdirSync(distJsDir).filter(file => file.endsWith('.bundle.js'));

if (jsFiles.length === 0) {
  console.error('Error: No bundled JS files found. Run bundle:js first.');
  process.exit(1);
}

console.log('Minifying JavaScript files...\n');

jsFiles.forEach(file => {
  const inputPath = path.join(distJsDir, file);
  const outputPath = path.join(distJsDir, file.replace('.bundle.js', '.min.js'));
  
  try {
    execSync(`terser "${inputPath}" -o "${outputPath}" -c -m --comments false`, { stdio: 'inherit' });
    console.log(`✓ Minified: ${file} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ Failed to minify ${file}:`, error.message);
  }
});

console.log('\n✓ JavaScript minification complete!');
