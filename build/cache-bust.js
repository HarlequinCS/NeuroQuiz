/**
 * Cache Busting Script - Inject Git Version into HTML files
 * Updates CSS/JS file references with current git commit hash
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get git version (short commit hash)
function getGitVersion() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn('Warning: Could not get git version, using timestamp');
    return Date.now().toString(36);
  }
}

// Update HTML file with version query parameters
function updateHTMLFile(filePath, version) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: File not found: ${fullPath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;

  // Update CSS files
  content = content.replace(
    /href="(css\/[^"]+\.css)"/g,
    (match, filePath) => {
      // Skip if already has version
      if (match.includes('?v=')) {
        return match.replace(/\?v=[^"]+/, `?v=${version}`);
      }
      updated = true;
      return `href="${filePath}?v=${version}"`;
    }
  );

  // Update JS files
  content = content.replace(
    /src="(js\/[^"]+\.js)"/g,
    (match, filePath) => {
      // Skip if already has version
      if (match.includes('?v=')) {
        return match.replace(/\?v=[^"]+/, `?v=${version}`);
      }
      updated = true;
      return `src="${filePath}?v=${version}"`;
    }
  );

  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  } else {
    console.log(`- Skipped: ${filePath} (already has version or no matches)`);
    return false;
  }
}

// Main execution
function main() {
  const version = getGitVersion();
  console.log(`🚀 Cache Busting - Using git version: ${version}\n`);

  const htmlFiles = [
    'quiz.html',
    'index.html',
    'about.html',
    'setup.html',
    'result.html'
  ];

  let updatedCount = 0;
  htmlFiles.forEach(file => {
    if (updateHTMLFile(file, version)) {
      updatedCount++;
    }
  });

  console.log(`\n✅ Cache busting complete! Updated ${updatedCount} file(s) with version ${version}`);
}

if (require.main === module) {
  main();
}

module.exports = { getGitVersion, updateHTMLFile };
