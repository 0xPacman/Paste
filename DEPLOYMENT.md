# QuickPaste Deployment Guide

This guide walks you through deploying QuickPaste to Cloudflare Pages step-by-step.

## Prerequisites

Before you begin, ensure you have:

- [ ] A Cloudflare account (free tier works)
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Domain `0xpacman.com` managed by Cloudflare (for subdomain `paste.0xpacman.com`)

## Step 1: Initial Setup

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Clone and setup the project**:
   ```bash
   git clone https://github.com/0xPacman/Paste.git
   cd Paste
   npm install
   ```

## Step 2: Create KV Namespace

1. **Create the KV namespace**:
   ```bash
   wrangler kv:namespace create "PASTES_KV"
   ```
   
   This will output something like:
   ```
   ✅ Success!
   Add the following to your wrangler.toml:
   
   [[kv_namespaces]]
   binding = "PASTES_KV"
   id = "your-namespace-id-here"
   ```

2. **Create preview namespace** (for development):
   ```bash
   wrangler kv:namespace create "PASTES_KV" --preview
   ```

3. **Update `wrangler.toml`** with your namespace IDs:
   ```toml
   [[kv_namespaces]]
   binding = "PASTES_KV"
   id = "your-production-namespace-id"
   preview_id = "your-preview-namespace-id"
   ```

## Step 3: Deploy to Cloudflare Pages

### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial QuickPaste deployment"
   git push origin main
   ```

2. **Create Pages Project**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to **Pages**
   - Click **"Create a project"**
   - Select **"Connect to Git"**
   - Choose your repository
   - Configure build settings:
     - **Project name**: `quickpaste` (or your preferred name)
     - **Production branch**: `main`
     - **Build command**: `echo "Static site - no build required"`
     - **Build output directory**: `public`
     - **Root directory**: `/` (leave empty)

3. **Deploy**:
   - Click **"Save and Deploy"**
   - Wait for the deployment to complete

### Option B: Direct Deployment

1. **Deploy directly with Wrangler**:
   ```bash
   wrangler pages project create quickpaste
   wrangler pages deploy public --project-name quickpaste
   ```

## Step 4: Configure KV Namespace Binding

1. **In Cloudflare Dashboard**:
   - Go to **Pages** → Your project → **Settings** → **Functions**
   - Scroll to **KV namespace bindings**
   - Click **"Add binding"**
   - Set:
     - **Variable name**: `PASTES_KV`
     - **KV namespace**: Select your created namespace
   - Click **"Save"**

2. **Redeploy** to apply changes:
   - Go to **Deployments** tab
   - Click **"Retry deployment"** on the latest deployment

## Step 5: Configure Custom Domain

1. **Add Custom Domain**:
   - In your Pages project, go to **Custom domains**
   - Click **"Set up a custom domain"**
   - Enter: `paste.0xpacman.com`
   - Click **"Continue"**

2. **Update DNS Records**:
   - If `0xpacman.com` is managed by Cloudflare:
     - Cloudflare will automatically add the CNAME record
   - If managed elsewhere:
     - Add CNAME record: `paste` → `your-pages-domain.pages.dev`

3. **Verify Setup**:
   - Wait for DNS propagation (usually 1-5 minutes)
   - Visit `https://paste.0xpacman.com`

## Step 6: Test Your Deployment

1. **Create a test paste**:
   - Go to your domain
   - Enter some test content
   - Click "Create Paste"
   - Verify you receive a shareable URL

2. **Test paste viewing**:
   - Visit the generated paste URL
   - Verify content displays correctly
   - Test syntax highlighting with code

3. **Test features**:
   - Copy to clipboard functionality
   - Download feature
   - Raw view toggle
   - Mobile responsiveness

## Step 7: Monitor and Maintain

1. **Check Analytics**:
   - Cloudflare Dashboard → Pages → Your project → Analytics
   - Monitor traffic and performance

2. **Review Logs**:
   - Pages → Your project → Functions → View logs
   - Check for any errors or issues

3. **KV Storage Usage**:
   - Workers & Pages → KV → Your namespace
   - Monitor storage usage and key count

## Environment Variables (Optional)

For additional configuration, you can set environment variables:

1. **In Cloudflare Dashboard**:
   - Pages → Your project → Settings → Environment variables
   - Add variables for production/preview environments

Example variables:
```
MAX_PASTE_SIZE=1048576
DEFAULT_EXPIRY=31536000
ANALYTICS_ID=your-analytics-id
```

## Troubleshooting

### Common Issues

1. **"KV namespace not found" error**:
   - Verify namespace binding is correctly configured
   - Check namespace ID in wrangler.toml matches dashboard
   - Redeploy after binding changes

2. **Functions not working**:
   - Ensure functions are in `functions/` directory
   - Check function exports are correct
   - Verify KV binding name matches code

3. **Custom domain not working**:
   - Check DNS propagation: `dig paste.0xpacman.com`
   - Verify domain is active in Cloudflare
   - Try accessing via Pages domain first

4. **Paste creation fails**:
   - Check browser developer console for errors
   - Verify KV namespace has write permissions
   - Test with smaller content size

### Debug Commands

```bash
# Test local development
npm run dev

# Check KV namespace
wrangler kv:namespace list

# View KV contents
wrangler kv:key list --binding PASTES_KV

# Check Pages deployment
wrangler pages deployment list

# View function logs
wrangler pages deployment tail
```

## Security Considerations

1. **Content Filtering**: Consider adding content moderation
2. **Rate Limiting**: Implement rate limiting for paste creation
3. **Abuse Prevention**: Monitor for spam or malicious content
4. **HTTPS Only**: Ensure all traffic uses HTTPS
5. **CSP Headers**: Add Content Security Policy headers

## Performance Optimization

1. **Caching**: Configure appropriate cache headers
2. **Compression**: Enable gzip/brotli compression
3. **CDN**: Leverage Cloudflare's global CDN
4. **Monitoring**: Set up uptime monitoring

## Backup and Recovery

1. **KV Backup**: Regularly export KV data
2. **Code Backup**: Maintain Git repository
3. **Configuration**: Document all settings
4. **Recovery Plan**: Have rollback procedures ready

---

🎉 **Congratulations!** Your QuickPaste platform is now live at `paste.0xpacman.com`

For support or questions, please refer to the [main README](README.md) or open an issue on GitHub.
