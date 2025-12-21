# Deployment Guide for Large Image Collections

## Current Situation
- **Current images**: ~10GB (5,388 files)
- **Additional chapters**: 255 chapters + ~5,000 images
- **Estimated total**: ~20-25GB

## ⚠️ Why NOT to Put Everything in GitHub

1. **GitHub Limits**:
   - 100MB per file (hard limit)
   - 100GB per repository (soft limit, but very slow)
   - Very large repos become unusable

2. **Cloudflare Pages Limits**:
   - Build timeouts on very large repos
   - Deployment size limits
   - Slow deployments

## ✅ Recommended Solution: Cloudflare R2 + GitHub

### Option 1: Cloudflare R2 (Recommended for Cloudflare Pages)

**Advantages:**
- Free tier: 10GB storage, 1M operations/month
- Integrated with Cloudflare Pages
- Fast CDN delivery
- No egress fees

**Steps:**
1. Create Cloudflare R2 bucket
2. Upload images to R2
3. Get public URLs
4. Update `config.js` to use R2 URLs instead of local paths

**Cost**: FREE for your use case!

### Option 2: Optimize + Git LFS

If you MUST use GitHub:
1. Optimize images (compress PNGs, convert to WebP) - could reduce 10GB to 2-3GB
2. Use Git LFS for large files
3. Accept slower git operations

**Cost**: Git LFS costs $5/month for 50GB bandwidth

### Option 3: Separate Image Repository

1. Create a separate GitHub repo just for images
2. Use GitHub Releases or Git LFS
3. Reference images from external repo

## 🚀 Quick Start: Cloudflare R2 Setup

1. Go to Cloudflare Dashboard → R2
2. Create a bucket (e.g., `jjk-manga-images`)
3. Upload your `colorizedjjk` folder
4. Make bucket public or use R2 custom domain
5. Update `config.js` to reference R2 URLs

Example:
```javascript
folder: "https://pub-xxxxx.r2.dev/colorizedjjk/chapter 1"
```

## 📝 Updating Config for New Chapters

After images are hosted, update:
- `config.js` - Add chapter entries
- `chapterCounts.json` - Add page counts

Would you like me to help set up Cloudflare R2 integration?


