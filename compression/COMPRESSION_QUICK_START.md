# Quick Start: Compress Images to WebP

## 🎯 Goal
Reduce your 10-20GB image collection to **2-4GB** (fits in free tier!)

## 📦 Step 1: Install WebP Tools

### Windows:
```powershell
# Option 1: Chocolatey (recommended)
choco install webp

# Option 2: Manual download
# Visit: https://developers.google.com/speed/webp/download
# Download "libwebp" for Windows
# Extract and add to PATH
```

### Mac:
```bash
brew install webp
```

### Linux:
```bash
sudo apt-get install webp
# or
sudo yum install libwebp-tools
```

## 🚀 Step 2: Run Compression Script

```bash
cd ReadJJK
node compress_to_webp.js
```

This will:
- ✅ Scan all PNG/JPG images
- ✅ Convert to WebP (quality 85)
- ✅ Save to `colorizedjjk_webp/` folder
- ✅ Keep originals (safe!)
- ✅ Show size reduction stats

## ⚙️ Customize Settings

Edit `compress_to_webp.js`:

```javascript
const CONFIG = {
    quality: 85,           // 85 = excellent, 80 = very good, 75 = good
    deleteOriginals: false, // Set true to delete PNGs after conversion
    concurrency: 4,         // Parallel conversions (adjust based on CPU)
};
```

## 📊 Expected Results

| Original | WebP (85) | Reduction | Cost |
|----------|-----------|-----------|------|
| 10 GB | 2.5 GB | 75% | **FREE** ✅ |
| 20 GB | 5 GB | 75% | **FREE** ✅ |
| 30 GB | 7.5 GB | 75% | **FREE** ✅ |

## 🔄 Step 3: Update Code to Use WebP

After conversion, update `config.js`:

```javascript
fileNaming: {
    pattern: "numbered",
    suffix: "_colorized",
    extension: ".webp"  // Changed from .png
}
```

And update folder path:
```javascript
folder: "colorizedjjk_webp/chapter " + (index + 1),
```

## 💡 Alternative: Cloudflare Automatic Optimization

If you don't want to convert locally:

1. Upload PNGs to R2
2. Cloudflare Image Resizing automatically converts to WebP
3. No manual conversion needed!

## 🎨 Quality Comparison

- **Quality 85**: Indistinguishable from PNG (recommended)
- **Quality 80**: Very slight difference, 5% smaller files
- **Quality 75**: Noticeable on close inspection, 10% smaller

**Recommendation**: Use **85** for manga (text needs to be crisp)

## ⏱️ Time Estimate

- **5,388 images**: ~2-4 hours
- **10,388 images**: ~4-8 hours

**Tip**: Run overnight! Script shows progress.

## ✅ After Compression

1. Test WebP images look good
2. Upload `colorizedjjk_webp/` to R2 (or GitHub if small enough)
3. Update config to use WebP
4. Deploy!

**Result**: Everything fits in **free tier**! 🎉


