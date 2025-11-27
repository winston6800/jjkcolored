import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration for R2 deployment
const R2_CONFIG = {
    // Option 1: Use public R2 URL (replace with your actual URL)
    // baseUrl: 'https://pub-xxxxx.r2.dev',
    
    // Option 2: Use custom domain (recommended)
    // baseUrl: 'https://images.yourdomain.com',
    
    // Option 3: Use local paths (current, for development)
    baseUrl: null, // null = use local paths
};

function updateConfigForR2(baseUrl) {
    const configPath = path.join(__dirname, 'config.js');
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    if (!baseUrl) {
        // Use local paths (development mode)
        configContent = configContent.replace(
            /folder: "https?:\/\/[^"]+\/colorizedjjk\/chapter/g,
            'folder: "colorizedjjk/chapter'
        );
        console.log('✓ Configured for local development (relative paths)');
    } else {
        // Use R2 URLs
        const pattern = /folder: "colorizedjjk\/chapter/g;
        if (pattern.test(configContent)) {
            configContent = configContent.replace(
                pattern,
                `folder: "${baseUrl}/colorizedjjk/chapter`
            );
            console.log(`✓ Configured for R2 deployment: ${baseUrl}`);
        } else {
            console.log('⚠ Config already uses URLs, updating base URL...');
            configContent = configContent.replace(
                /folder: "https?:\/\/[^/]+\/colorizedjjk\/chapter/g,
                `folder: "${baseUrl}/colorizedjjk/chapter`
            );
        }
    }
    
    fs.writeFileSync(configPath, configContent);
    console.log('✓ Updated config.js');
}

// Main
console.log('\n🔧 R2 Configuration Setup\n');

if (R2_CONFIG.baseUrl) {
    updateConfigForR2(R2_CONFIG.baseUrl);
    console.log('\n✅ Config updated for R2 deployment');
    console.log(`   Base URL: ${R2_CONFIG.baseUrl}`);
} else {
    updateConfigForR2(null);
    console.log('\n📝 To configure for R2:');
    console.log('   1. Edit setup_r2_config.js');
    console.log('   2. Set baseUrl to your R2 URL');
    console.log('   3. Run: node setup_r2_config.js');
}

console.log('\n📚 Next steps:');
console.log('   1. Create separate Cloudflare account (optional)');
console.log('   2. Create R2 bucket');
console.log('   3. Upload colorizedjjk/ folder to R2');
console.log('   4. Get public URL or set custom domain');
console.log('   5. Update baseUrl in this script and run again');
console.log('\n💡 Cost: ~$0.30/month for 20GB (first 10GB free)');


