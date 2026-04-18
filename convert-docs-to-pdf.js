/**
 * Convert Documentation to PDF
 * Converts all markdown files in docs/ folder to nicely formatted PDFs
 */

const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('md-to-pdf');

// CSS content for PDF styling
const cssContent = `@page {
    size: A4;
    margin: 2cm;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 100%;
}

h1 {
    color: #2563eb;
    border-bottom: 3px solid #2563eb;
    padding-bottom: 10px;
    margin-top: 30px;
    margin-bottom: 20px;
    page-break-after: avoid;
}

h2 {
    color: #1e40af;
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 8px;
    margin-top: 25px;
    margin-bottom: 15px;
    page-break-after: avoid;
}

h3 {
    color: #1e3a8a;
    margin-top: 20px;
    margin-bottom: 12px;
    page-break-after: avoid;
}

h4 {
    color: #1e3a8a;
    margin-top: 15px;
    margin-bottom: 10px;
}

code {
    background-color: #f3f4f6;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: #dc2626;
}

pre {
    background-color: #1f2937;
    color: #f9fafb;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    page-break-inside: avoid;
}

pre code {
    background-color: transparent;
    color: #f9fafb;
    padding: 0;
}

blockquote {
    border-left: 4px solid #3b82f6;
    padding-left: 15px;
    margin-left: 0;
    color: #4b5563;
    font-style: italic;
}

table {
    border-collapse: collapse;
    width: 100%;
    margin: 15px 0;
    page-break-inside: avoid;
}

th, td {
    border: 1px solid #d1d5db;
    padding: 10px;
    text-align: left;
}

th {
    background-color: #3b82f6;
    color: white;
    font-weight: bold;
}

tr:nth-child(even) {
    background-color: #f9fafb;
}

ul, ol {
    margin: 10px 0;
    padding-left: 25px;
}

li {
    margin: 5px 0;
}

strong {
    color: #1e40af;
    font-weight: 600;
}

em {
    color: #4b5563;
}

hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 30px 0;
}

a {
    color: #2563eb;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

.header-info {
    background-color: #eff6ff;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
    border-left: 4px solid #2563eb;
}`;

// PDF configuration
function getPdfConfig(cssFilePath) {
    return {
        stylesheet: cssFilePath,
        pdf_options: {
            format: 'A4',
            margin: {
                top: '2cm',
                right: '2cm',
                bottom: '2cm',
                left: '2cm'
            },
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%; color: #6b7280; padding: 0 2cm;">
                    <span>NeuroQuiz™ Documentation</span>
                </div>
            `,
            footerTemplate: `
                <div style="font-size: 10px; text-align: center; width: 100%; color: #6b7280; padding: 0 2cm;">
                    <span class="pageNumber"></span> / <span class="totalPages"></span>
                </div>
            `
        },
        body_class: 'markdown-body'
    };
}

async function convertMarkdownToPdf(mdFilePath, outputPath) {
    let cssFilePath = null;
    try {
        console.log(`Converting: ${path.basename(mdFilePath)}...`);
        
        // Create temporary CSS file
        cssFilePath = path.join(__dirname, 'temp-pdf-styles.css');
        fs.writeFileSync(cssFilePath, cssContent);
        
        // Get config with CSS file path
        const config = getPdfConfig(cssFilePath);
        
        const pdf = await mdToPdf({ path: mdFilePath }, config);
        
        if (pdf) {
            fs.writeFileSync(outputPath, pdf.content);
            console.log(`✓ Created: ${path.basename(outputPath)}`);
            return true;
        } else {
            console.error(`✗ Failed to convert: ${path.basename(mdFilePath)}`);
            return false;
        }
    } catch (error) {
        console.error(`✗ Error converting ${path.basename(mdFilePath)}:`, error.message);
        return false;
    } finally {
        // Clean up temporary CSS file
        if (cssFilePath && fs.existsSync(cssFilePath)) {
            try {
                fs.unlinkSync(cssFilePath);
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    }
}

async function main() {
    const docsDir = path.join(__dirname, 'docs');
    
    if (!fs.existsSync(docsDir)) {
        console.error('docs/ folder not found!');
        return;
    }
    
    const files = fs.readdirSync(docsDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    if (mdFiles.length === 0) {
        console.log('No markdown files found in docs/ folder');
        return;
    }
    
    console.log(`Found ${mdFiles.length} markdown file(s) to convert...\n`);
    
    let successCount = 0;
    let failCount = 0;
    
    for (const mdFile of mdFiles) {
        const mdPath = path.join(docsDir, mdFile);
        const pdfName = mdFile.replace('.md', '.pdf');
        const pdfPath = path.join(docsDir, pdfName);
        
        const success = await convertMarkdownToPdf(mdPath, pdfPath);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
        
        // Small delay between conversions to avoid port conflicts
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n✅ Conversion complete!`);
    console.log(`   Success: ${successCount}`);
    if (failCount > 0) {
        console.log(`   Failed: ${failCount}`);
    }
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { convertMarkdownToPdf, getPdfConfig };
