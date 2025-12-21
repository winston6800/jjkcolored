# Deployment Options for 20GB+ of Images

## 🎯 Your Current Situation
- **Current**: 5,388 images (~10GB)
- **After adding 255 chapters**: ~10,388 images (~20-25GB)
- **Target**: Deploy on Cloudflare Pages via GitHub

## ❌ Option 1: Direct GitHub Upload (NOT Recommended)

**Why it won't work:**
- GitHub repositories become very slow with >10GB
- Cloudflare Pages will timeout during build
- Git operations (clone, push, pull) will take hours
- GitHub recommends <1GB for good performance

**Conclusion**: ❌ Don't do this

---

## ✅ Option 2: Cloudflare R2 (BEST for Cloudflare Pages)

### Advantages:
- ✅ **FREE** tier: 10GB storage + 1M operations/month
- ✅ Integrated with Cloudflare Pages
- ✅ Fast CDN delivery (global edge network)
- ✅ No egress fees
- ✅ Can scale beyond free tier if needed ($0.015/GB storage)

### Setup Steps:

1. **Create R2 Bucket**
   - Go to Cloudflare Dashboard → R2
   - Click "Create bucket"
   - Name it: `jjk-manga-images`
   - Make it public OR set up a custom domain

2. **Upload Images**
   ```bash
   # Using Cloudflare R2 API or dashboard
   # Upload entire colorizedjjk/ folder
   ```

3. **Get Public URL**
   - Option A: Use public R2 URL (`pub-xxxxx.r2.dev`)
   - Option B: Custom domain (recommended)
   - Example: `https://images.yourdomain.com/colorizedjjk/chapter 1/01_colorized.png`

4. **Update Config.js**
   ```javascript
   // Change from:
   folder: "colorizedjjk/chapter " + (index + 1),
   
   // To:
   folder: "https://images.yourdomain.com/colorizedjjk/chapter " + (index + 1),
   ```

5. **Deploy Code Only to GitHub**
   - Keep HTML, JS, CSS, config files in GitHub
   - Images stay in R2
   - Fast deployments, fast builds

**Cost**: FREE (or ~$0.30/month if you exceed 10GB)

---

## ⚠️ Option 3: Git LFS (If you MUST use GitHub)

### Setup:

1. **Install Git LFS**
   ```bash
   git lfs install
   ```

2. **Track PNG/JPG files**
   ```bash
   git lfs track "*.png"
   git lfs track "*.jpg"
   git lfs track "ReadJJK/colorizedjjk/**"
   ```

3. **Add and commit**
   ```bash
   git add .gitattributes
   git add ReadJJK/colorizedjjk/
   git commit -m "Add images via Git LFS"
   git push
   ```

### Disadvantages:
- ❌ Slower git operations
- ❌ Costs $5/month for 50GB bandwidth
- ❌ Still large repository size
- ❌ Cloudflare Pages may still timeout

**Cost**: $5/month minimum

---

## 🚀 Recommended Workflow

1. **Keep images in R2** (or similar object storage)
2. **Update config files** with new chapters:
   ```bash
   node update_chapters.js
   ```
3. **Commit only code/config** to GitHub:
   ```bash
   git add ReadJJK/*.js ReadJJK/*.html ReadJJK/*.css ReadJJK/*.json
   git commit -m "Add new chapters"
   git push
   ```
4. **Cloudflare Pages** will automatically deploy from GitHub
5. **Images load from R2** (fast CDN delivery)

---

## 📝 Next Steps

1. Run `node update_chapters.js` to update config with all chapters
2. Set up Cloudflare R2 bucket
3. Upload images to R2
4. Update `config.js` to use R2 URLs
5. Commit and push to GitHub

**Would you like help setting up R2 or updating the config?**


