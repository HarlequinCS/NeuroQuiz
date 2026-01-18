/**
 * Update Version Script - Quick version updater for development
 * Run: node update-version.js
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
  const fullPath = path.resolve(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`Warning: File not found: ${fullPath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;

  // Update CSS files
  const cssPattern = /href=["'](css\/[^"']+\.css)([?&]v=[^"']+)?["']/g;
  content = content.replace(cssPattern, (match, filePath, existingVersion) => {
    updated = true;
    return `href="${filePath}?v=${version}"`;
  });

  // Update JS files
  const jsPattern = /src=["'](js\/[^"']+\.js)([?&]v=[^"']+)?["']/g;
  content = content.replace(jsPattern, (match, filePath, existingVersion) => {
    updated = true;
    return `src="${filePath}?v=${version}"`;
  });

  // Add or update version meta tag
  const metaPattern = /<meta\s+name=["']app-version["']\s+content=["'][^"']+["']\s*\/?>/i;
  const newMetaTag = `<meta name="app-version" content="${version}">`;
  
  if (metaPattern.test(content)) {
    content = content.replace(metaPattern, newMetaTag);
    updated = true;
  } else {
    // Add meta tag in head if not exists
    const headPattern = /(<head[^>]*>)/i;
    if (headPattern.test(content)) {
      content = content.replace(headPattern, `$1\n    ${newMetaTag}`);
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  } else {
    console.log(`- Skipped: ${filePath} (no CSS/JS files found)`);
    return false;
  }
}

// Main execution
function main() {
  const version = getGitVersion();
  console.log(`🚀 Updating version to: ${version}\n`);

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

  console.log(`\n✅ Version update complete! Updated ${updatedCount} file(s) with version ${version}`);
  console.log(`\n💡 Tip: Run this script after any CSS/JS changes to update versions automatically.`);
}

if (require.main === module) {
  main();
}

module.exports = { getGitVersion, updateHTMLFile };
