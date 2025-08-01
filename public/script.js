// Main JavaScript file for QuickPaste functionality

class QuickPaste {
    constructor() {
        this.form = document.getElementById('pasteForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.submitText = document.getElementById('submitText');
        this.loadingText = document.getElementById('loadingText');
        this.successMessage = document.getElementById('successMessage');
        this.errorMessage = document.getElementById('errorMessage');
        this.pasteUrl = document.getElementById('pasteUrl');
        this.copyBtn = document.getElementById('copyBtn');
        this.viewPasteBtn = document.getElementById('viewPasteBtn');
        this.createAnotherBtn = document.getElementById('createAnotherBtn');
        this.tryAgainBtn = document.getElementById('tryAgainBtn');
        this.errorText = document.getElementById('errorText');
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.copyBtn.addEventListener('click', this.copyToClipboard.bind(this));
        this.createAnotherBtn.addEventListener('click', this.resetForm.bind(this));
        this.tryAgainBtn.addEventListener('click', this.hideError.bind(this));
        
        // Auto-resize textarea
        const textarea = document.getElementById('content');
        textarea.addEventListener('input', this.autoResize.bind(this));
        
        // Initialize syntax highlighting if we're on a paste view page
        this.initSyntaxHighlighting();
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const content = formData.get('content').trim();
        const language = formData.get('language');
        const customId = formData.get('customId');

        if (!content) {
            this.showError('Please enter some content to create a paste.');
            return;
        }

        this.setLoading(true);
        this.hideMessages();

        try {
            const response = await fetch('/api/paste', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    language: language || null,
                    customId: customId || null
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to create paste');
            }

            this.showSuccess(result.url, result.id);
        } catch (error) {
            console.error('Error creating paste:', error);
            this.showError(error.message || 'Failed to create paste. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        this.submitBtn.disabled = loading;
        if (loading) {
            this.submitText.classList.add('hidden');
            this.loadingText.classList.remove('hidden');
            this.submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        } else {
            this.submitText.classList.remove('hidden');
            this.loadingText.classList.add('hidden');
            this.submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        }
    }

    showSuccess(url, id) {
        this.pasteUrl.value = url;
        this.viewPasteBtn.href = `/${id}`;
        this.successMessage.classList.remove('hidden');
        this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showError(message) {
        this.errorText.textContent = message;
        this.errorMessage.classList.remove('hidden');
        this.errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    hideMessages() {
        this.successMessage.classList.add('hidden');
        this.errorMessage.classList.add('hidden');
    }

    hideError() {
        this.errorMessage.classList.add('hidden');
    }

    resetForm() {
        this.form.reset();
        this.hideMessages();
        document.getElementById('content').focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.pasteUrl.value);
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✅';
            this.copyBtn.classList.add('bg-green-600');
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.classList.remove('bg-green-600');
            }, 2000);
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            // Fallback for older browsers
            this.pasteUrl.select();
            document.execCommand('copy');
        }
    }

    autoResize(e) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
    }

    // Initialize syntax highlighting for paste view pages
    async initSyntaxHighlighting() {
        const codeBlock = document.getElementById('pasteContent');
        if (!codeBlock) return;

        try {
            // Dynamically load highlight.js
            if (!window.hljs) {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');
                await this.loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css');
            }

            // Apply syntax highlighting
            if (window.hljs) {
                hljs.highlightElement(codeBlock);
            }
        } catch (error) {
            console.error('Failed to load syntax highlighting:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    loadStylesheet(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }
}

// Utility functions for paste viewing pages
class PasteViewer {
    constructor() {
        this.initCopyFunctionality();
        this.initDownloadFunctionality();
    }

    initCopyFunctionality() {
        const copyBtn = document.getElementById('copyPasteBtn');
        if (!copyBtn) return;

        copyBtn.addEventListener('click', async () => {
            const content = document.getElementById('pasteContent').textContent;
            try {
                await navigator.clipboard.writeText(content);
                this.showToast('Copied to clipboard! 📋');
            } catch (error) {
                console.error('Failed to copy:', error);
                this.showToast('Failed to copy to clipboard ❌');
            }
        });
    }

    initDownloadFunctionality() {
        const downloadBtn = document.getElementById('downloadBtn');
        if (!downloadBtn) return;

        downloadBtn.addEventListener('click', () => {
            const content = document.getElementById('pasteContent').textContent;
            const filename = `paste-${window.location.pathname.replace('/', '')}.txt`;
            
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Download started! 📥');
        });
    }

    showToast(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Advertisement Management
class AdManager {
    constructor() {
        this.init();
    }

    init() {
        this.createAdSpace();
        this.loadAdScript();
    }

    createAdSpace() {
        // Create the ad container element
        const adContainer = document.createElement('div');
        adContainer.className = 'container mx-auto px-4 py-6';
        adContainer.innerHTML = `
            <div class="max-w-4xl mx-auto text-center">
                <div id="container-b7fd22dc45f39238dca50579277adda3"></div>
            </div>
        `;

        // Insert the ad space between main content and footer
        const main = document.querySelector('main');
        const footer = document.querySelector('footer');
        
        if (main && footer) {
            footer.parentNode.insertBefore(adContainer, footer);
        }
    }

    loadAdScript() {
        // Create and load the ad script
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        script.src = '//pl27310161.profitableratecpm.com/b7fd22dc45f39238dca50579277adda3/invoke.js';
        
        // Add script to head
        document.head.appendChild(script);
    }
}

// Initialize based on page type
document.addEventListener('DOMContentLoaded', () => {
    // Initialize advertisement manager
    new AdManager();
    
    if (document.getElementById('pasteForm')) {
        // Main page - initialize paste creation
        new QuickPaste();
    } else if (document.getElementById('pasteContent')) {
        // Paste view page - initialize paste viewer
        new PasteViewer();
    }
});

// Global utility functions
window.QuickPasteUtils = {
    formatTimeAgo: (timestamp) => {
        const now = Date.now();
        const diff = now - timestamp;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'just now';
        if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
        if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
        return `${days} day${days === 1 ? '' : 's'} ago`;
    },

    generateId: (length = 8) => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
};
