# 📋 QuickPaste - Modern Serverless Pastebin

A beautiful, fast, and secure Pastebin platform built with Cloudflare Pages and Workers KV. Share code, text, and snippets instantly with custom URLs and syntax highlighting.

## ✨ Features

- **🚀 Serverless Architecture**: Built entirely on Cloudflare Pages with Workers KV storage
- **🎨 Modern UI**: Beautiful, responsive design with glass morphism effects and smooth animations
- **⚡ Lightning Fast**: Global CDN distribution with edge computing
- **🔐 Anonymous**: No registration required - create pastes instantly
- **🌈 Syntax Highlighting**: Support for 15+ programming languages
- **📱 Mobile Friendly**: Fully responsive design that works on all devices
- **🔗 Custom URLs**: Support for custom paste IDs
- **📋 One-Click Copy**: Easy copy-to-clipboard functionality
- **💾 Download Support**: Download pastes as text files
- **⏰ Automatic Expiry**: Pastes expire after 1 year to save storage

## 🛠 Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Backend**: Cloudflare Pages Functions
- **Database**: Cloudflare Workers KV
- **Hosting**: Cloudflare Pages
- **Syntax Highlighting**: Highlight.js
- **Domain**: paste.0xpacman.com

## 🚀 Quick Start

### Prerequisites

1. A Cloudflare account
2. Node.js 18+ installed
3. Git installed

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/0xPacman/Paste.git
   cd Paste
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a KV Namespace** (via Cloudflare dashboard or Wrangler CLI):
   ```bash
   npx wrangler kv:namespace create "PASTES_KV"
   npx wrangler kv:namespace create "PASTES_KV" --preview
   ```

4. **Update wrangler.toml** with your KV namespace IDs:
   ```toml
   [[kv_namespaces]]
   binding = "PASTES_KV"
   id = "your-kv-namespace-id"
   preview_id = "your-preview-kv-namespace-id"
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Open in browser**: http://localhost:8788

## 📦 Deployment

### Deploy to Cloudflare Pages

#### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your repository
   - Configure build settings:
     - **Build command**: `echo "No build required"`
     - **Build output directory**: `public`
     - **Root directory**: `/`

3. **Set up KV Namespace Binding**:
   - Go to your Pages project → Settings → Functions
   - Add KV namespace binding:
     - **Variable name**: `PASTES_KV`
     - **KV namespace**: Select your created namespace

4. **Configure Custom Domain**:
   - Go to your Pages project → Custom domains
   - Add `paste.0xpacman.com`
   - Update DNS records as instructed

#### Method 2: Direct Deployment

1. **Deploy using Wrangler**:
   ```bash
   npm run deploy
   ```

2. **Set up KV binding** via Cloudflare Dashboard (same as Method 1, step 3)

### Environment Configuration

Update your `wrangler.toml` for production:

```toml
[env.production]
name = "paste-platform"

[[env.production.kv_namespaces]]
binding = "PASTES_KV"
id = "your-production-kv-namespace-id"
```

## 🏗 Project Structure

```
Paste/
├── public/                 # Static assets
│   ├── index.html         # Main landing page
│   ├── script.js          # Client-side JavaScript
│   └── style.css          # Additional styles (if needed)
├── functions/             # Cloudflare Pages Functions
│   ├── api/
│   │   └── paste.js       # POST /api/paste - Create paste
│   └── [id].js           # GET /[id] - View paste
├── wrangler.toml         # Cloudflare configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Configuration

### KV Namespace Setup

1. **Create KV Namespace**:
   ```bash
   npx wrangler kv:namespace create "PASTES_KV"
   ```

2. **Get Namespace ID** and update `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "PASTES_KV"
   id = "your-namespace-id-here"
   ```

### Custom Domain Setup

1. **Add Domain in Cloudflare Pages**:
   - Go to Pages project → Custom domains
   - Add `paste.0xpacman.com`

2. **Update DNS Records**:
   - Add CNAME record: `paste` → `your-pages-domain.pages.dev`
   - Or A record pointing to Cloudflare's IP

## 📖 API Documentation

### Create Paste

**Endpoint**: `POST /api/paste`

**Request Body**:
```json
{
  "content": "Your paste content here",
  "language": "javascript",  // Optional
  "customId": "my-paste"     // Optional
}
```

**Response**:
```json
{
  "success": true,
  "id": "abc12345",
  "url": "https://paste.0xpacman.com/abc12345",
  "createdAt": 1640995200000
}
```

### View Paste

**Endpoint**: `GET /{id}`

Returns a complete HTML page with the paste content, syntax highlighting, and sharing options.

## 🎨 Customization

### Styling

The application uses Tailwind CSS with custom configuration. Main style areas:

- **Colors**: Defined in Tailwind config (primary, secondary palettes)
- **Animations**: Custom CSS animations for smooth interactions
- **Glass Effects**: Modern glassmorphism design elements

### Features

You can easily extend the platform:

- **Expiration Options**: Modify TTL in `functions/api/paste.js`
- **File Upload**: Add file upload support
- **Password Protection**: Add optional password protection
- **Analytics**: Integrate view tracking
- **Themes**: Add dark/light theme toggle

## 🔒 Security Features

- **Content Validation**: Input sanitization and size limits
- **XSS Protection**: HTML escaping for user content
- **Rate Limiting**: Built-in Cloudflare DDoS protection
- **HTTPS Only**: Automatic SSL/TLS encryption
- **Anonymous**: No personal data collection

## 📊 Performance

- **Global CDN**: Cloudflare's edge network
- **Edge Computing**: Functions run close to users
- **Caching**: Intelligent caching for paste content
- **Lightweight**: Minimal dependencies and optimized assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **KV Namespace not found**:
   - Ensure KV namespace is created and ID is correct in `wrangler.toml`
   - Check binding name matches in Functions settings

2. **Custom domain not working**:
   - Verify DNS records are properly configured
   - Check domain is added in Pages custom domains

3. **Functions not deploying**:
   - Ensure functions are in the `functions/` directory
   - Check function syntax and exports

### Getting Help

- **Documentation**: [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- **Community**: [Cloudflare Community](https://community.cloudflare.com/)
- **Issues**: [GitHub Issues](https://github.com/0xPacman/Paste/issues)

---

Built with ❤️ by [0xPacman](https://github.com/0xPacman) using Cloudflare Pages & Workers KV