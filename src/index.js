// QuickPaste - Cloudflare Workers Implementation
// Main entry point for the serverless pastebin

// HTML template for the main page
const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Paste - Pastebin Alternative</title>
    <meta name="description" content="Paste - A fast, secure, and anonymous pastebin alternative with syntax highlighting">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" sizes="32x32" href="/favicon-32x32.svg">
    <link rel="manifest" href="/manifest.json">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <style>
        /* Glassmorphism effect */
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.5);
        }
        
        /* Syntax highlighting override */
        .hljs {
            background: rgba(0, 0, 0, 0.2) !important;
            border-radius: 8px;
            padding: 1rem;
        }
        
        /* Animated gradient background */
        .animated-bg {
            background: linear-gradient(-45deg, #000000, #1a1a1a, #2d2d2d, #1f1f1f);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
        }
        
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        /* Loading animation */
        .loading {
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 2px solid #fbbf24;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body class="animated-bg min-h-screen text-white font-sans">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- Header -->
        <header class="text-center mb-8">
            <h1 class="text-4xl md:text-6xl font-bold mb-4">
                <span class="bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
                    Paste
                </span>
            </h1>
            <p class="text-lg md:text-xl text-gray-200 mb-2">Fast & Secure Pastebin Alternative</p>
            <p class="text-sm text-yellow-300">Share code, text, and documents instantly</p>
        </header>

        <!-- Main Content -->
        <main class="space-y-8">
            <!-- Create Paste Form -->
            <section class="glass rounded-xl p-6 shadow-2xl">
                <h2 class="text-2xl font-semibold mb-4 flex items-center">
                    <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Create New Paste
                </h2>
                
                <form id="pasteForm" class="space-y-4">
                    <!-- Title Input -->
                    <div>
                        <label for="title" class="block text-sm font-medium mb-2">Title (Optional)</label>
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            placeholder="Enter a title for your paste..."
                            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-300 text-white"
                        >
                    </div>

                    <!-- Language Selection -->
                    <div>
                        <label for="language" class="block text-sm font-medium mb-2">Language</label>
                        <select 
                            id="language" 
                            name="language"
                            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                        >
                            <option value="plaintext">Plain Text</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="json">JSON</option>
                            <option value="markdown">Markdown</option>
                            <option value="sql">SQL</option>
                            <option value="bash">Bash</option>
                            <option value="php">PHP</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                            <option value="csharp">C#</option>
                            <option value="go">Go</option>
                            <option value="rust">Rust</option>
                            <option value="typescript">TypeScript</option>
                            <option value="xml">XML</option>
                            <option value="yaml">YAML</option>
                        </select>
                    </div>

                    <!-- Content Textarea -->
                    <div>
                        <label for="content" class="block text-sm font-medium mb-2">Content</label>
                        <textarea 
                            id="content" 
                            name="content" 
                            rows="12" 
                            placeholder="Paste your code or text here..."
                            class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent placeholder-gray-300 text-white font-mono text-sm resize-y"
                            required
                        ></textarea>
                    </div>

                    <!-- Expiration Options -->
                    <div>
                        <label for="expiration" class="block text-sm font-medium mb-2">Expiration</label>
                        <select 
                            id="expiration" 
                            name="expiration"
                            class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-white"
                        >
                            <option value="never">Never</option>
                            <option value="1h">1 Hour</option>
                            <option value="1d">1 Day</option>
                            <option value="1w">1 Week</option>
                            <option value="1m">1 Month</option>
                        </select>
                    </div>

                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        id="submitBtn"
                        class="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span id="submitText">Create Paste</span>
                        <div id="submitLoading" class="loading mx-auto hidden"></div>
                    </button>
                </form>
            </section>

            <!-- Features Section -->
            <section class="glass rounded-xl p-6 shadow-2xl">
                <h2 class="text-2xl font-semibold mb-4">Features</h2>
                <div class="grid md:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h3 class="font-semibold">Lightning Fast</h3>
                        <p class="text-sm text-gray-300">Powered by Cloudflare Workers</p>
                    </div>
                    <div class="text-center">
                        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                        </div>
                        <h3 class="font-semibold">Secure & Anonymous</h3>
                        <p class="text-sm text-gray-300">No registration required</p>
                    </div>
                    <div class="text-center">
                        <div class="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                            </svg>
                        </div>
                        <h3 class="font-semibold">Syntax Highlighting</h3>
                        <p class="text-sm text-gray-300">20+ programming languages</p>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="text-center mt-12 text-gray-400">
            <p>&copy; 2024 Paste. Powered by Cloudflare Workers.</p>
            <p class="text-sm mt-2">Made by <a href="https://0xpacman.com" target="_blank" class="text-yellow-400 hover:text-yellow-300 transition-colors">0xPacman</a></p>
        </footer>

        <!-- Success Modal -->
        <div id="successModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div class="glass rounded-xl p-8 max-w-md w-full mx-4">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold mb-2">Paste Created Successfully!</h3>
                    <p class="text-gray-300 mb-4">Your paste has been created and is ready to share.</p>
                    <div class="flex space-x-2 mb-4">
                        <input 
                            type="text" 
                            id="pasteUrl" 
                            readonly 
                            class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-sm text-white"
                        >
                        <button 
                            id="copyUrlBtn"
                            class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded text-sm transition duration-200"
                        >
                            Copy
                        </button>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            id="viewPasteBtn"
                            class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded transition duration-200"
                        >
                            View Paste
                        </button>
                        <button 
                            id="createAnotherBtn"
                            class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded transition duration-200"
                        >
                            Create Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // JavaScript functionality
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('pasteForm');
            const submitBtn = document.getElementById('submitBtn');
            const submitText = document.getElementById('submitText');
            const submitLoading = document.getElementById('submitLoading');
            const successModal = document.getElementById('successModal');
            const pasteUrl = document.getElementById('pasteUrl');
            const copyUrlBtn = document.getElementById('copyUrlBtn');
            const viewPasteBtn = document.getElementById('viewPasteBtn');
            const createAnotherBtn = document.getElementById('createAnotherBtn');

            let currentPasteId = null;

            // Form submission
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = {
                    title: formData.get('title') || 'Untitled',
                    content: formData.get('content'),
                    language: formData.get('language'),
                    expiration: formData.get('expiration')
                };

                // Validate content
                if (!data.content.trim()) {
                    alert('Please enter some content for your paste.');
                    return;
                }

                // Show loading state
                setLoading(true);

                try {
                    const response = await fetch('/api/paste', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        throw new Error('HTTP error! status: ' + response.status);
                    }

                    const result = await response.json();
                    
                    if (result.success) {
                        currentPasteId = result.id;
                        pasteUrl.value = window.location.origin + '/' + result.id;
                        showSuccessModal();
                    } else {
                        throw new Error(result.error || 'Failed to create paste');
                    }
                } catch (error) {
                    console.error('Error creating paste:', error);
                    alert('Failed to create paste. Please try again.');
                } finally {
                    setLoading(false);
                }
            });

            // Copy URL functionality
            copyUrlBtn.addEventListener('click', async function() {
                try {
                    await navigator.clipboard.writeText(pasteUrl.value);
                    copyUrlBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyUrlBtn.textContent = 'Copy';
                    }, 2000);
                } catch (error) {
                    // Fallback for older browsers
                    pasteUrl.select();
                    document.execCommand('copy');
                    copyUrlBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyUrlBtn.textContent = 'Copy';
                    }, 2000);
                }
            });

            // View paste button
            viewPasteBtn.addEventListener('click', function() {
                if (currentPasteId) {
                    window.open('/' + currentPasteId, '_blank');
                }
            });

            // Create another paste button
            createAnotherBtn.addEventListener('click', function() {
                hideSuccessModal();
                form.reset();
                document.getElementById('content').focus();
            });

            // Close modal when clicking outside
            successModal.addEventListener('click', function(e) {
                if (e.target === successModal) {
                    hideSuccessModal();
                }
            });

            // Helper functions
            function setLoading(loading) {
                submitBtn.disabled = loading;
                submitText.style.display = loading ? 'none' : 'inline';
                submitLoading.style.display = loading ? 'block' : 'none';
            }

            function showSuccessModal() {
                successModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }

            function hideSuccessModal() {
                successModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }

            // Auto-resize textarea
            const textarea = document.getElementById('content');
            textarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        });
    </script>
</body>
</html>`;

// Generate a random paste ID
function generateId() {
    return Math.random().toString(36).substr(2, 8);
}

// Calculate expiration timestamp
function getExpirationTimestamp(expiration) {
    if (expiration === 'never') return null;
    
    const now = Date.now();
    const durations = {
        '1h': 60 * 60 * 1000,
        '1d': 24 * 60 * 60 * 1000,
        '1w': 7 * 24 * 60 * 60 * 1000,
        '1m': 30 * 24 * 60 * 60 * 1000
    };
    
    return now + (durations[expiration] || 0);
}

// Generate paste view HTML
function generatePasteHTML(paste, createdDate, expiresDate) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${paste.title} - Paste</title>
    <meta name="description" content="Paste - ${paste.title}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <style>
        .glass {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 4px;
        }
        
        .hljs {
            background: rgba(0, 0, 0, 0.2) !important;
            border-radius: 8px;
            padding: 1rem;
        }
        
        .animated-bg {
            background: linear-gradient(-45deg, #000000, #1a1a1a, #2d2d2d, #1f1f1f);
            background-size: 400% 400%;
            animation: gradient 15s ease infinite;
        }
        
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    </style>
</head>
<body class="animated-bg min-h-screen text-white font-sans">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- Header -->
        <header class="mb-6">
            <div class="flex items-center justify-between flex-wrap gap-4">
                <a href="/" class="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    ← Paste
                </a>
                <div class="flex space-x-2">
                    <button id="copyBtn" class="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                        <span>Copy</span>
                    </button>
                    <button id="rawBtn" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition duration-200">
                        Raw
                    </button>
                </div>
            </div>
        </header>

        <!-- Paste Content -->
        <main>
            <!-- Paste Info -->
            <div class="glass rounded-xl p-6 mb-6">
                <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <h1 class="text-2xl font-bold">${paste.title}</h1>
                    <div class="flex flex-wrap gap-4 text-sm text-gray-300">
                        <span>Language: <span class="text-yellow-300">${paste.language}</span></span>
                        <span>Views: <span class="text-white">${paste.views}</span></span>
                        <span>Created: <span class="text-yellow-400">${createdDate}</span></span>
                        <span>Expires: <span class="text-gray-300">${expiresDate}</span></span>
                    </div>
                </div>
                
                <!-- Content -->
                <div class="relative">
                    <pre><code id="pasteContent" class="language-${paste.language}">${paste.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="text-center mt-8 text-gray-400">
            <p>&copy; 2024 Paste. Powered by Cloudflare Workers.</p>
            <p class="text-sm mt-2">Made by <a href="https://0xpacman.com" target="_blank" class="text-yellow-400 hover:text-yellow-300 transition-colors">0xPacman</a></p>
        </footer>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize syntax highlighting
            hljs.highlightAll();

            // Copy functionality
            const copyBtn = document.getElementById('copyBtn');
            const pasteContent = document.getElementById('pasteContent');

            copyBtn.addEventListener('click', async function() {
                try {
                    await navigator.clipboard.writeText(pasteContent.textContent);
                    copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Copied!</span>';
                    copyBtn.classList.add('bg-green-500');
                    copyBtn.classList.remove('bg-yellow-500', 'hover:bg-yellow-600');
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg><span>Copy</span>';
                        copyBtn.classList.remove('bg-green-500');
                        copyBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
                    }, 2000);
                } catch (error) {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = pasteContent.textContent;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy';
                    }, 2000);
                }
            });

            // Raw button functionality
            const rawBtn = document.getElementById('rawBtn');
            rawBtn.addEventListener('click', function() {
                window.open(window.location.href + '/raw', '_blank');
            });
        });
    </script>
</body>
</html>`;
}

// Main request handler
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Handle different routes
        if (path === '/') {
            // Serve the main page
            return new Response(HTML_CONTENT, {
                headers: {
                    'Content-Type': 'text/html;charset=UTF-8',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }
        
        if (path === '/robots.txt') {
            return new Response('User-agent: *\nAllow: /', {
                headers: {
                    'Content-Type': 'text/plain',
                    'Cache-Control': 'public, max-age=86400'
                }
            });
        }

        // Serve favicon files
        if (path === '/favicon.ico' || path === '/favicon.svg') {
            // SVG favicon with clipboard icon
            const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#000000"/>
  <rect x="8" y="10" width="16" height="18" rx="2" fill="#fbbf24"/>
  <rect x="12" y="6" width="8" height="6" rx="1" fill="#ffffff"/>
  <rect x="14" y="8" width="4" height="2" rx="0.5" fill="#000000"/>
  <rect x="11" y="14" width="10" height="1.5" fill="#000000"/>
  <rect x="11" y="17" width="8" height="1.5" fill="#000000"/>
  <rect x="11" y="20" width="10" height="1.5" fill="#000000"/>
  <rect x="11" y="23" width="6" height="1.5" fill="#000000"/>
</svg>`;
            return new Response(svgContent, {
                headers: {
                    'Content-Type': path === '/favicon.ico' ? 'image/svg+xml' : 'image/svg+xml',
                    'Cache-Control': 'public, max-age=31536000'
                }
            });
        }

        if (path === '/favicon.svg') {
            const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#000000"/>
  <rect x="8" y="10" width="16" height="18" rx="2" fill="#fbbf24"/>
  <rect x="12" y="6" width="8" height="6" rx="1" fill="#ffffff"/>
  <rect x="14" y="8" width="4" height="2" rx="0.5" fill="#000000"/>
  <rect x="11" y="14" width="10" height="1.5" fill="#000000"/>
  <rect x="11" y="17" width="8" height="1.5" fill="#000000"/>
  <rect x="11" y="20" width="10" height="1.5" fill="#000000"/>
  <rect x="11" y="23" width="6" height="1.5" fill="#000000"/>
</svg>`;
            return new Response(svgContent, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=31536000'
                }
            });
        }

        if (path === '/favicon-32x32.svg') {
            const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#000"/>
  <rect x="8" y="10" width="16" height="18" rx="2" fill="#fbbf24"/>
  <rect x="12" y="6" width="8" height="6" rx="1" fill="#fff"/>
  <rect x="14" y="8" width="4" height="2" fill="#000"/>
  <rect x="11" y="14" width="10" height="1" fill="#000"/>
  <rect x="11" y="17" width="8" height="1" fill="#000"/>
  <rect x="11" y="20" width="10" height="1" fill="#000"/>
  <rect x="11" y="23" width="6" height="1" fill="#000"/>
</svg>`;
            return new Response(svgContent, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=31536000'
                }
            });
        }
        
        if (path === '/manifest.json') {
            const manifest = {
                name: 'Paste',
                short_name: 'Paste',
                description: 'Fast, Secure & Anonymous Pastebin Alternative',
                start_url: '/',
                display: 'standalone',
                background_color: '#000000',
                theme_color: '#fbbf24',
                icons: [
                    {
                        src: '/favicon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml'
                    },
                    {
                        src: '/favicon-32x32.svg',
                        sizes: '32x32',
                        type: 'image/svg+xml'
                    }
                ]
            };
            return new Response(JSON.stringify(manifest), {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=86400'
                }
            });
        }

        if (path === '/api/paste' && request.method === 'POST') {
            // Handle paste creation
            try {
                const data = await request.json();
                
                // Validate input
                if (!data.content || !data.content.trim()) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: 'Content is required'
                    }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }

                // Generate paste ID
                const id = generateId();
                
                // Calculate expiration
                const expiresAt = getExpirationTimestamp(data.expiration);
                
                // Create paste object
                const paste = {
                    id,
                    title: data.title || 'Untitled',
                    content: data.content,
                    language: data.language || 'plaintext',
                    createdAt: Date.now(),
                    expiresAt,
                    views: 0
                };

                // Store in KV
                await env.PASTE_KV.put(id, JSON.stringify(paste), {
                    expirationTtl: expiresAt ? Math.floor((expiresAt - Date.now()) / 1000) : undefined
                });

                return new Response(JSON.stringify({
                    success: true,
                    id,
                    url: `${url.origin}/${id}`
                }), {
                    headers: { 'Content-Type': 'application/json' }
                });

            } catch (error) {
                console.error('Error creating paste:', error);
                return new Response(JSON.stringify({
                    success: false,
                    error: 'Internal server error'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Handle paste viewing (e.g., /abc123)
        const pasteId = path.slice(1); // Remove leading slash
        
        if (pasteId && pasteId.length === 8 && /^[a-z0-9]+$/.test(pasteId)) {
            try {
                // Get paste from KV
                const pasteData = await env.PASTE_KV.get(pasteId);
                
                if (!pasteData) {
                    return new Response('Paste not found', { status: 404 });
                }

                const paste = JSON.parse(pasteData);
                
                // Check if paste has expired
                if (paste.expiresAt && Date.now() > paste.expiresAt) {
                    await env.PASTE_KV.delete(pasteId);
                    return new Response('Paste has expired', { status: 410 });
                }

                // Increment view count
                paste.views = (paste.views || 0) + 1;
                await env.PASTE_KV.put(pasteId, JSON.stringify(paste), {
                    expirationTtl: paste.expiresAt ? Math.floor((paste.expiresAt - Date.now()) / 1000) : undefined
                });

                // Format dates
                const createdDate = new Date(paste.createdAt).toLocaleString();
                const expiresDate = paste.expiresAt ? new Date(paste.expiresAt).toLocaleString() : 'Never';

                // Generate paste view HTML
                const pasteHTML = generatePasteHTML(paste, createdDate, expiresDate);

                return new Response(pasteHTML, {
                    headers: {
                        'Content-Type': 'text/html;charset=UTF-8',
                        'Cache-Control': 'public, max-age=3600'
                    }
                });

            } catch (error) {
                console.error('Error retrieving paste:', error);
                return new Response('Internal server error', { status: 500 });
            }
        }

        // Handle raw paste viewing (e.g., /abc123/raw)
        if (path.includes('/raw')) {
            const pasteId = path.split('/')[1];
            
            if (pasteId && pasteId.length === 8 && /^[a-z0-9]+$/.test(pasteId)) {
                try {
                    const pasteData = await env.PASTE_KV.get(pasteId);
                    
                    if (!pasteData) {
                        return new Response('Paste not found', { status: 404 });
                    }

                    const paste = JSON.parse(pasteData);
                    
                    // Check if paste has expired
                    if (paste.expiresAt && Date.now() > paste.expiresAt) {
                        await env.PASTE_KV.delete(pasteId);
                        return new Response('Paste has expired', { status: 410 });
                    }

                    return new Response(paste.content, {
                        headers: {
                            'Content-Type': 'text/plain;charset=UTF-8',
                            'Cache-Control': 'public, max-age=3600'
                        }
                    });

                } catch (error) {
                    console.error('Error retrieving raw paste:', error);
                    return new Response('Internal server error', { status: 500 });
                }
            }
        }

        // 404 for all other routes
        return new Response('Not Found', { status: 404 });
    }
};
