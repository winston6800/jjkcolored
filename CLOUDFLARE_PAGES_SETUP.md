# Cloudflare Pages Deployment Setup

## Quick Setup Steps

### 1. Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Pages**
2. Click **"Create a project"** → **"Connect to Git"**
3. Select **GitHub** and authorize Cloudflare
4. Choose your repository: `winston6800/jjkcolored`
5. Click **"Begin setup"**

### 2. Build Settings (IMPORTANT)

Since this is a **static site** with no build step:

- **Framework preset**: `None` or `Plain HTML`
- **Build command**: Leave **EMPTY** (no build needed)
- **Build output directory**: `/` (root directory)
- **Root directory**: `/` (or leave empty)

### 3. Environment Variables (if needed)

No environment variables needed for this static site.

### 4. Deploy

Click **"Save and Deploy"** - Cloudflare will:
- Pull from your GitHub repo
- Deploy the static files
- Give you a `*.pages.dev` URL

### 5. Connect Custom Domain

1. In your Pages project, go to **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter: `readjjkcolored.com`
4. Cloudflare will automatically configure DNS

### 6. Update DNS (if needed)

If DNS isn't auto-configured:
- Add a **CNAME** record:
  - Name: `@` (or `readjjkcolored`)
  - Target: `your-project-name.pages.dev`

## Important Notes

✅ **Your images are already in R2** - config.js uses R2 URLs, so images will work  
✅ **No build step needed** - just deploy the static files  
✅ **Auto-deploy on push** - every git push to main will auto-deploy  

## Troubleshooting

**If changes don't show up:**
- Check the Pages deployment logs
- Make sure you're pushing to the `main` branch
- Wait 1-2 minutes for deployment to complete
- Hard refresh browser (Ctrl+F5)

**If domain doesn't work:**
- Verify DNS records in Cloudflare
- Check custom domain settings in Pages
- Wait for DNS propagation (up to 24 hours, usually instant)

