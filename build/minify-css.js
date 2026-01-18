const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Minify all bundled CSS files
 */

const distCssDir = path.join(__dirname, '..', 'dist', 'css');

if (!fs.existsSync(distCssDir)) {
  console.error('Error: dist/css directory not found. Run bundle:css first.');
  process.exit(1);
}

const cssFiles = fs.readdirSync(distCssDir).filter(file => file.endsWith('.bundle.css'));

if (cssFiles.length === 0) {
  console.error('Error: No bundled CSS files found. Run bundle:css first.');
  process.exit(1);
}

console.log('Minifying CSS files...\n');

cssFiles.forEach(file => {
  const inputPath = path.join(distCssDir, file);
  const outputPath = path.join(distCssDir, file.replace('.bundle.css', '.min.css'));
  
  try {
    execSync(`cleancss -o "${outputPath}" "${inputPath}" --level 2`, { stdio: 'inherit' });
    console.log(`✓ Minified: ${file} → ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`✗ Failed to minify ${file}:`, error.message);
  }
});

console.log('\n✓ CSS minification complete!');
