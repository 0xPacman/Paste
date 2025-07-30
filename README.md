# 📋 Paste- **🌈 Syntax Highlighting**: Support for 18+ programming languages with highlight.js
- **📱 Mobile Friendly**: Fully responsive design that works on all devices
- **📋 One-Click Copy**: Easy copy-to-clipboard functionality
- **⏰ Custom Expiration**: Choose from never, 1 hour, 1 day, 1 week, or 1 month
- **👀 View Counter**: Track paste views automaticallystebin Alternative

A beautiful, fast, and secure Pastebin alternative built with Cloudflare Workers. Share code, text, and snippets instantly with syntax highlighting and modern UI.

## ✨ Features

- **🚀 Serverless Architecture**: Built entirely on Cloudflare Workers with Workers KV storage
- **🎨 Modern UI**: Beautiful black & yellow theme with glassmorphism effects and smooth animations
- **⚡ Lightning Fast**: Global edge computing with Cloudflare's network
- **🔐 Anonymous**: No registration required - create pastes instantly
- **🌈 Syntax Highlighting**: Support for 18+ programming languages with highlight.js
- **📱 Mobile Friendly**: Fully responsive design that works on all devices
- ** One-Click Copy**: Easy copy-to-clipboard functionality
- **� Custom Expiration**: Choose from never, 1 hour, 1 day, 1 week, or 1 month
- **👀 View Counter**: Track paste views automatically
- **📄 Raw View**: Access raw paste content directly

## 🛠 Technology Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript (embedded in Worker)
- **Backend**: Cloudflare Workers
- **Database**: Cloudflare Workers KV
- **Syntax Highlighting**: Highlight.js CDN
- **Domain**: paste.0xpacman.com

## 🚀 Quick Start

### Prerequisites

1. A Cloudflare account
2. Node.js 18+ installed
3. Wrangler CLI installed globally: `npm install -g wrangler`

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

3. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

4. **Create a KV Namespace**:
   ```bash
   wrangler kv:namespace create "PASTE_KV"
   ```

5. **Update wrangler.toml** with your KV namespace ID:
   ```toml
   [[kv_namespaces]]
   binding = "PASTE_KV"
   id = "your-kv-namespace-id"
   preview_id = "your-kv-namespace-id"
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

7. **Open in browser**: http://localhost:8787

## 📦 Deployment

### Deploy to Cloudflare Workers

1. **Deploy using Wrangler**:
   ```bash
   npm run deploy
   ```
   or
   ```bash
   wrangler deploy
   ```

2. **Set up Custom Domain** (if not already configured):
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Workers & Pages
   - Select your worker
   - Go to Settings → Triggers
   - Add custom domain: `paste.0xpacman.com`

### Environment Configuration

Your `wrangler.toml` should look like this for production:

```toml
name = "paste"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[route]]
pattern = "paste.0xpacman.com/*"
custom_domain = true

[[kv_namespaces]]
binding = "PASTE_KV"
id = "your-kv-namespace-id"
preview_id = "your-kv-namespace-id"

[env.production]
name = "paste"
route = "paste.0xpacman.com/*"

[[env.production.kv_namespaces]]
binding = "PASTE_KV"
id = "your-kv-namespace-id"
```

## 🏗 Project Structure

```
Paste/
├── src/
│   └── index.js          # Main Cloudflare Worker with embedded frontend
├── wrangler.toml         # Cloudflare Workers configuration
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Configuration

### KV Namespace Setup

1. **Create KV Namespace**:
   ```bash
   wrangler kv:namespace create "PASTE_KV"
   ```

2. **Get Namespace ID** and update `wrangler.toml`:
   ```toml
   [[kv_namespaces]]
   binding = "PASTE_KV"
   id = "your-namespace-id-here"
   preview_id = "your-namespace-id-here"
   ```

### Custom Domain Setup

1. **Add Domain in Workers Dashboard**:
   - Go to Workers & Pages → Your worker → Settings → Triggers
   - Add custom domain: `paste.0xpacman.com`

2. **Update DNS Records** (if domain is on Cloudflare):
   - Automatic SSL/TLS setup
   - CNAME flattening for root domain support

## 📖 API Documentation

### Create Paste

**Endpoint**: `POST /api/paste`

**Request Body**:
```json
{
  "title": "My Code Snippet",      // Optional
  "content": "console.log('Hello, World!');",
  "language": "javascript",        // Optional, defaults to "plaintext"
  "expiration": "1d"              // Optional: "never", "1h", "1d", "1w", "1m"
}
```

**Response**:
```json
{
  "success": true,
  "id": "abc12345",
  "url": "https://paste.0xpacman.com/abc12345"
}
```

### View Paste

**Endpoint**: `GET /{id}`

Returns a complete HTML page with the paste content, syntax highlighting, view counter, and sharing options.

### Raw Paste Content

**Endpoint**: `GET /{id}/raw`

Returns the raw paste content as plain text.

## 🎨 Customization

### Styling

The application uses a black & yellow theme with Tailwind CSS and custom glassmorphism effects:

- **Colors**: Black gradients with yellow/white accents
- **Animations**: Smooth gradient animations and hover effects
- **Glass Effects**: Modern backdrop blur and transparency

### Features

You can easily extend the platform by modifying `src/index.js`:

- **Expiration Options**: Add more time options in the expiration dropdown
- **Language Support**: Add more languages to the highlight.js integration
- **Authentication**: Add optional user accounts and private pastes
- **File Upload**: Support for file uploads and binary content
- **Analytics**: Add detailed usage analytics and statistics

## 🔒 Security Features

- **Content Validation**: Input sanitization and size limits
- **XSS Protection**: HTML escaping for all user content
- **Rate Limiting**: Built-in Cloudflare DDoS and abuse protection
- **HTTPS Only**: Automatic SSL/TLS encryption
- **Anonymous**: No personal data collection or tracking
- **Automatic Expiration**: Pastes can be set to expire automatically

## 📊 Performance

- **Global Edge Network**: Cloudflare's 300+ edge locations
- **Sub-100ms Response**: Functions run at the edge close to users
- **Intelligent Caching**: Automatic paste content caching
- **Minimal Bundle**: Single file architecture with embedded frontend
- **KV Storage**: Ultra-fast key-value storage with global replication

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
   - Ensure KV namespace is created: `wrangler kv:namespace create "PASTE_KV"`
   - Check namespace ID in `wrangler.toml` matches your actual namespace

2. **Custom domain not working**:
   - Verify domain is added in Workers dashboard under Triggers
   - Check DNS records point to Cloudflare (orange cloud enabled)

3. **Local development issues**:
   - Use `wrangler dev` instead of `npm run dev` for troubleshooting
   - Check Node.js version compatibility (18+)

4. **Deployment failures**:
   - Ensure you're logged in: `wrangler login`
   - Check `wrangler.toml` syntax and configuration

### Getting Help

- **Documentation**: [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- **Community**: [Cloudflare Community](https://community.cloudflare.com/)
- **Issues**: [GitHub Issues](https://github.com/0xPacman/Paste/issues)

---

Built with ❤️ by [0xPacman](https://0xpacman.com) using Cloudflare Workers & KV