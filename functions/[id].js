// Cloudflare Pages Function for viewing pastes
// GET /[id] - Dynamic route for paste viewing

export async function onRequestGet(context) {
    const { request, env, params } = context;
    const pasteId = params.id;
    
    try {
        // Fetch paste from KV store
        const pasteJson = await env.PASTES_KV.get(pasteId);
        
        if (!pasteJson) {
            return new Response(generate404Page(), {
                status: 404,
                headers: { 'Content-Type': 'text/html' }
            });
        }
        
        const pasteData = JSON.parse(pasteJson);
        
        // Generate and return the paste view HTML
        const html = generatePasteViewHTML(pasteData, request.url);
        
        return new Response(html, {
            status: 200,
            headers: { 
                'Content-Type': 'text/html',
                'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
            }
        });
        
    } catch (error) {
        console.error('Error fetching paste:', error);
        return new Response(generate500Page(), {
            status: 500,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

function generatePasteViewHTML(pasteData, currentUrl) {
    const { content, language, createdAt, id } = pasteData;
    const formattedDate = new Date(createdAt).toLocaleString();
    const timeAgo = formatTimeAgo(createdAt);
    
    // Escape HTML in content
    const escapedContent = escapeHtml(content);
    
    // Determine language class for syntax highlighting
    const languageClass = language ? `language-${language}` : '';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paste ${id} - QuickPaste</title>
    <meta name="description" content="View shared paste content on QuickPaste">
    
    <!-- Open Graph tags for social sharing -->
    <meta property="og:title" content="Paste ${id} - QuickPaste">
    <meta property="og:description" content="View shared content on QuickPaste">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${currentUrl}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Highlight.js CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    
    <!-- Custom Tailwind Configuration -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#f0f9ff',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                        },
                        secondary: {
                            50: '#f8fafc',
                            100: '#f1f5f9',
                            500: '#64748b',
                            600: '#475569',
                        }
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.5s ease-in-out',
                        'slide-up': 'slideUp 0.3s ease-out',
                    }
                }
            }
        }
    </script>
    
    <style>
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .code-container {
            background: #0d1117;
            border-radius: 12px;
            overflow: hidden;
        }
        
        pre {
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
        }
        
        code {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
            display: block;
            padding: 1.5rem;
            overflow-x: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }
        
        .line-numbers {
            color: #6e7681;
            user-select: none;
            margin-right: 1rem;
            padding-right: 1rem;
            border-right: 1px solid #30363d;
            min-width: 3rem;
            text-align: right;
        }
    </style>
</head>
<body class="min-h-screen gradient-bg">
    <!-- Header -->
    <header class="py-4">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between">
                <a href="/" class="text-white hover:text-blue-200 transition-colors">
                    <h1 class="text-2xl font-bold">📋 QuickPaste</h1>
                </a>
                <nav class="space-x-4">
                    <a href="/" class="text-blue-200 hover:text-white transition-colors">
                        Create New
                    </a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 pb-8">
        <div class="max-w-6xl mx-auto">
            <!-- Paste Info -->
            <div class="glass-effect rounded-t-2xl p-4 shadow-xl animate-fade-in">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div class="flex items-center space-x-4 mb-4 md:mb-0">
                        <h2 class="text-lg font-semibold text-white">
                            Paste ID: <span class="text-blue-200">${id}</span>
                        </h2>
                        ${language ? `<span class="bg-blue-500 text-white px-2 py-1 rounded text-sm">${language}</span>` : ''}
                    </div>
                    <div class="flex items-center space-x-2 text-blue-200 text-sm">
                        <span>Created: ${formattedDate}</span>
                        <span class="text-blue-300">•</span>
                        <span>${timeAgo}</span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="glass-effect px-4 py-3 flex flex-wrap gap-2 justify-end">
                <button 
                    id="copyPasteBtn"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                    title="Copy paste content"
                >
                    📋 Copy
                </button>
                <button 
                    id="downloadBtn"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                    title="Download as file"
                >
                    📥 Download
                </button>
                <button 
                    id="rawViewBtn"
                    onclick="toggleRawView()"
                    class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
                    title="Toggle raw view"
                >
                    📄 Raw
                </button>
            </div>

            <!-- Paste Content -->
            <div class="code-container shadow-xl animate-slide-up">
                <pre class="hljs"><code id="pasteContent" class="${languageClass}">${escapedContent}</code></pre>
            </div>
            
            <!-- Raw View (Hidden by default) -->
            <div id="rawView" class="hidden mt-4 glass-effect rounded-2xl p-6 shadow-xl">
                <h3 class="text-white font-semibold mb-3">Raw Content:</h3>
                <textarea 
                    readonly 
                    class="w-full h-64 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm resize-none"
                    style="font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;"
                >${escapedContent}</textarea>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="py-6 text-center">
        <div class="container mx-auto px-4">
            <p class="text-blue-100 text-sm">
                Built with ❤️ using Cloudflare Pages & Workers KV
            </p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="/script.js"></script>
    
    <script>
        // Initialize syntax highlighting
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlock = document.getElementById('pasteContent');
            if (codeBlock && window.hljs) {
                hljs.highlightElement(codeBlock);
            }
        });
        
        // Toggle raw view
        function toggleRawView() {
            const rawView = document.getElementById('rawView');
            const rawBtn = document.getElementById('rawViewBtn');
            
            if (rawView.classList.contains('hidden')) {
                rawView.classList.remove('hidden');
                rawBtn.textContent = '📊 Formatted';
                rawBtn.title = 'Show formatted view';
            } else {
                rawView.classList.add('hidden');
                rawBtn.textContent = '📄 Raw';
                rawBtn.title = 'Show raw view';
            }
        }
    </script>
</body>
</html>`;
}

function generate404Page() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paste Not Found - QuickPaste</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body class="min-h-screen gradient-bg flex items-center justify-center">
    <div class="max-w-md mx-auto text-center">
        <div class="glass-effect rounded-2xl p-8 shadow-2xl">
            <div class="text-6xl mb-4">🔍</div>
            <h1 class="text-2xl font-bold text-white mb-4">Paste Not Found</h1>
            <p class="text-blue-200 mb-6">
                The paste you're looking for doesn't exist or may have expired.
            </p>
            <a 
                href="/" 
                class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
                Create New Paste
            </a>
        </div>
    </div>
</body>
</html>`;
}

function generate500Page() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error - QuickPaste</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body class="min-h-screen gradient-bg flex items-center justify-center">
    <div class="max-w-md mx-auto text-center">
        <div class="glass-effect rounded-2xl p-8 shadow-2xl">
            <div class="text-6xl mb-4">⚠️</div>
            <h1 class="text-2xl font-bold text-white mb-4">Server Error</h1>
            <p class="text-blue-200 mb-6">
                Something went wrong on our end. Please try again later.
            </p>
            <a 
                href="/" 
                class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
                Go Home
            </a>
        </div>
    </div>
</body>
</html>`;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
}
