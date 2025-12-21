import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
    // WebP quality (85 recommended for manga)
    quality: 85,
    
    // Source directory
    sourceDir: path.join(__dirname, 'colorizedjjk'),
    
    // Output directory (create new or overwrite?)
    outputDir: path.join(__dirname, 'colorizedjjk_webp'),
    
    // Delete original PNG after conversion? (default: false - keeps originals)
    deleteOriginals: false,
    
    // Parallel processing (number of concurrent conversions)
    concurrency: 4,
};

/**
 * Check if cwebp is installed
 */
function checkWebPInstalled() {
    try {
        execSync('cwebp -version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

/**
 * Convert single image to WebP
 */
function convertToWebP(inputPath, outputPath, quality) {
    try {
        // Create output directory if needed
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Convert PNG to WebP
        const cmd = `cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`;
        execSync(cmd, { stdio: 'pipe' });
        
        return { success: true, inputPath, outputPath };
    } catch (error) {
        return { success: false, inputPath, error: error.message };
    }
}

/**
 * Get all images to convert
 */
function getAllImages(dir) {
    const images = [];
    
    function scanDirectory(currentDir, relativePath = '') {
        const entries = fs.readdirSync(currentDir);
        
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry);
            const relPath = path.join(relativePath, entry);
            
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDirectory(fullPath, relPath);
            } else if (stat.isFile()) {
                const ext = path.extname(entry).toLowerCase();
                if (['.png', '.jpg', '.jpeg'].includes(ext)) {
                    images.push({
                        input: fullPath,
                        relative: relPath,
                        size: stat.size,
                    });
                }
            }
        }
    }
    
    scanDirectory(dir);
    return images;
}

/**
 * Main conversion function
 */
async function convertAll() {
    console.log('🔍 Scanning for images...\n');
    
    if (!fs.existsSync(CONFIG.sourceDir)) {
        console.error(`❌ Source directory not found: ${CONFIG.sourceDir}`);
        process.exit(1);
    }
    
    // Check if cwebp is installed
    if (!checkWebPInstalled()) {
        console.error('❌ cwebp is not installed!\n');
        console.log('📦 Installation:');
        console.log('   Windows: Download from https://developers.google.com/speed/webp/download');
        console.log('   Or use: choco install webp (if you have Chocolatey)');
        console.log('   Mac: brew install webp');
        console.log('   Linux: sudo apt-get install webp\n');
        console.log('💡 Alternative: Use online tools or Cloudflare Image Resizing');
        process.exit(1);
    }
    
    const images = getAllImages(CONFIG.sourceDir);
    console.log(`✓ Found ${images.length} images to convert\n`);
    
    if (images.length === 0) {
        console.log('No images found to convert.');
        return;
    }
    
    // Calculate current size
    const totalSize = images.reduce((sum, img) => sum + img.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const totalSizeGB = (totalSize / (1024 * 1024 * 1024)).toFixed(2);
    
    console.log(`📊 Current size: ${totalSizeGB} GB (${totalSizeMB} MB)\n`);
    console.log(`⚙️  Settings:`);
    console.log(`   Quality: ${CONFIG.quality}`);
    console.log(`   Output: ${CONFIG.outputDir}`);
    console.log(`   Delete originals: ${CONFIG.deleteOriginals ? 'Yes' : 'No'}\n`);
    
    console.log('🚀 Starting conversion...\n');
    
    let converted = 0;
    let failed = 0;
    let totalOutputSize = 0;
    const startTime = Date.now();
    
    // Process in batches
    for (let i = 0; i < images.length; i += CONFIG.concurrency) {
        const batch = images.slice(i, i + CONFIG.concurrency);
        
        const results = await Promise.all(
            batch.map(async (img) => {
                const outputRelative = img.relative.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                const outputPath = path.join(CONFIG.outputDir, outputRelative);
                
                const result = convertToWebP(img.input, outputPath, CONFIG.quality);
                
                if (result.success) {
                    try {
                        const outputStat = fs.statSync(outputPath);
                        totalOutputSize += outputStat.size;
                    } catch {}
                    converted++;
                    process.stdout.write(`\r✓ Converted: ${converted}/${images.length}`);
                } else {
                    failed++;
                    console.error(`\n✗ Failed: ${img.relative} - ${result.error}`);
                }
                
                return result;
            })
        );
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const outputSizeGB = (totalOutputSize / (1024 * 1024 * 1024)).toFixed(2);
    const reduction = ((1 - totalOutputSize / totalSize) * 100).toFixed(1);
    
    console.log(`\n\n✅ Conversion complete!\n`);
    console.log(`📊 Results:`);
    console.log(`   Converted: ${converted}`);
    console.log(`   Failed: ${failed}`);
    console.log(`   Original size: ${totalSizeGB} GB`);
    console.log(`   WebP size: ${outputSizeGB} GB`);
    console.log(`   Reduction: ${reduction}%`);
    console.log(`   Time: ${elapsed}s\n`);
    
    if (CONFIG.deleteOriginals) {
        console.log('⚠️  Note: Original files kept (deleteOriginals = false)');
        console.log('   To delete originals, set deleteOriginals: true in config\n');
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    convertAll().catch(console.error);
}

export { convertAll, convertToWebP, CONFIG };


