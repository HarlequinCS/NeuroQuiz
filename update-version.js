/**
 * Update Version Script - Quick version updater for development
 * Run: node update-version.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get version - use timestamp for better cache busting
function getVersion() {
  // For development: use timestamp for aggressive cache busting
  // For production: can use git hash or semantic version
  const timestamp = Date.now();
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '');
  
  // Format: YYYYMMDD-HHMMSS-timestamp
  return `${dateStr}-${timeStr}-${timestamp.toString(36)}`;
}

// Get git version (short commit hash) - fallback
function getGitVersion() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return null;
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

  // Update CSS files (with or without existing version)
  const cssPattern = /href=["'](css\/[^"']+\.css)([?&]v=[^"']+)?["']/g;
  content = content.replace(cssPattern, (match, filePath, existingVersion) => {
    updated = true;
    const separator = filePath.includes('?') ? '&' : '?';
    return `href="${filePath}${separator}v=${version}"`;
  });

  // Update JS files (with or without existing version)
  const jsPattern = /src=["'](js\/[^"']+\.js)([?&]v=[^"']+)?["']/g;
  content = content.replace(jsPattern, (match, filePath, existingVersion) => {
    updated = true;
    const separator = filePath.includes('?') ? '&' : '?';
    return `src="${filePath}${separator}v=${version}"`;
  });
  
  // Update image files that might have versioning
  const imgPattern = /src=["'](assets\/[^"']+\.(png|jpg|jpeg|svg|webp|gif))([?&]v=[^"']+)?["']/gi;
  content = content.replace(imgPattern, (match, filePath, ext, existingVersion) => {
    updated = true;
    const separator = filePath.includes('?') ? '&' : '?';
    return `src="${filePath}${separator}v=${version}"`;
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
  // Use timestamp-based version for better cache busting
  const version = getVersion();
  const gitVersion = getGitVersion();
  
  console.log(`🚀 Updating version to: ${version}`);
  if (gitVersion) {
    console.log(`   Git hash: ${gitVersion}`);
  }
  console.log('');

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
