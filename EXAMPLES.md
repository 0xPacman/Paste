# QuickPaste Usage Examples

This document provides examples of how to use QuickPaste programmatically and interactively.

## Web Interface Usage

### Creating a Paste

1. Visit `https://paste.0xpacman.com`
2. Enter your content in the large text area
3. (Optional) Select a programming language for syntax highlighting
4. (Optional) Enter a custom ID for your paste
5. Click "🚀 Create Paste"
6. Copy the generated URL to share your paste

### Viewing a Paste

1. Visit `https://paste.0xpacman.com/{paste-id}`
2. The paste content will be displayed with syntax highlighting
3. Use the action buttons to:
   - 📋 Copy content to clipboard
   - 📥 Download as a text file
   - 📄 Toggle raw view

## API Usage

### Create Paste via API

```bash
curl -X POST https://paste.0xpacman.com/api/paste \
  -H "Content-Type: application/json" \
  -d '{
    "content": "console.log(\"Hello, World!\");",
    "language": "javascript",
    "customId": "my-hello-world"
  }'
```

**Response:**
```json
{
  "success": true,
  "id": "my-hello-world",
  "url": "https://paste.0xpacman.com/my-hello-world",
  "createdAt": 1640995200000
}
```

### JavaScript Example

```javascript
async function createPaste(content, language = null, customId = null) {
  const response = await fetch('https://paste.0xpacman.com/api/paste', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      language,
      customId
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('Paste created:', result.url);
    return result;
  } else {
    console.error('Error:', result.error);
    throw new Error(result.error);
  }
}

// Usage
createPaste('print("Hello from Python!")', 'python')
  .then(result => console.log('Paste URL:', result.url))
  .catch(error => console.error('Failed to create paste:', error));
```

### Python Example

```python
import requests
import json

def create_paste(content, language=None, custom_id=None):
    url = 'https://paste.0xpacman.com/api/paste'
    
    data = {
        'content': content,
        'language': language,
        'customId': custom_id
    }
    
    response = requests.post(url, json=data)
    result = response.json()
    
    if result.get('success'):
        print(f"Paste created: {result['url']}")
        return result
    else:
        print(f"Error: {result.get('error')}")
        raise Exception(result.get('error'))

# Usage
try:
    result = create_paste(
        content='echo "Hello from Bash!"',
        language='bash',
        custom_id='bash-hello'
    )
    print(f"Paste URL: {result['url']}")
except Exception as e:
    print(f"Failed to create paste: {e}")
```

## Command Line Integration

### Bash Function

Add this to your `.bashrc` or `.zshrc`:

```bash
# Quick paste function
quickpaste() {
    local content="$1"
    local language="$2"
    local custom_id="$3"
    
    local json_data=$(jq -n \
        --arg content "$content" \
        --arg language "$language" \
        --arg customId "$custom_id" \
        '{content: $content, language: ($language // null), customId: ($customId // null)}')
    
    local response=$(curl -s -X POST https://paste.0xpacman.com/api/paste \
        -H "Content-Type: application/json" \
        -d "$json_data")
    
    local url=$(echo "$response" | jq -r '.url // empty')
    
    if [ -n "$url" ]; then
        echo "Paste created: $url"
        # Copy to clipboard if available
        if command -v pbcopy >/dev/null 2>&1; then
            echo "$url" | pbcopy
            echo "(URL copied to clipboard)"
        elif command -v xclip >/dev/null 2>&1; then
            echo "$url" | xclip -selection clipboard
            echo "(URL copied to clipboard)"
        fi
    else
        echo "Error creating paste:"
        echo "$response" | jq -r '.error // "Unknown error"'
    fi
}

# Usage:
# quickpaste "console.log('hello')" "javascript"
# quickpaste "print('hello')" "python" "my-python-hello"
```

### Pipe Content

```bash
# Pipe command output to paste
ls -la | quickpaste_pipe() {
    local content=$(cat)
    quickpaste "$content" "bash"
}

# Pipe file content
cat myfile.js | quickpaste_pipe_with_lang() {
    local content=$(cat)
    local ext="${1##*.}"
    case "$ext" in
        js) lang="javascript" ;;
        py) lang="python" ;;
        sh) lang="bash" ;;
        *) lang="" ;;
    esac
    quickpaste "$content" "$lang"
}
```

## Browser Integration

### Bookmarklet

Create a bookmark with this JavaScript code to quickly paste selected text:

```javascript
javascript:(function(){
    var text = window.getSelection().toString() || prompt('Enter text to paste:');
    if (text) {
        fetch('https://paste.0xpacman.com/api/paste', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({content: text})
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                prompt('Paste URL (Ctrl+C to copy):', data.url);
            } else {
                alert('Error: ' + data.error);
            }
        });
    }
})();
```

## Supported Languages

QuickPaste supports syntax highlighting for:

- `javascript` - JavaScript
- `typescript` - TypeScript  
- `python` - Python
- `java` - Java
- `cpp` - C++
- `csharp` - C#
- `php` - PHP
- `ruby` - Ruby
- `go` - Go
- `rust` - Rust
- `html` - HTML
- `css` - CSS
- `json` - JSON
- `xml` - XML
- `sql` - SQL
- `bash` - Bash/Shell

## Tips and Best Practices

### Content Guidelines

- **Size Limit**: Maximum 1MB per paste
- **Expiration**: Pastes expire after 1 year
- **Anonymous**: No registration required
- **Public**: All pastes are publicly accessible via URL

### Custom IDs

- Use alphanumeric characters, hyphens, and underscores only
- Keep them short and meaningful
- Check availability (API will return error if taken)

### Language Detection

- Specify language for better syntax highlighting
- Use common language identifiers
- Leave blank for auto-detection

### Security Considerations

- Don't paste sensitive information (passwords, API keys, etc.)
- Remember that pastes are public and searchable
- Use private/secure alternatives for confidential data

## Error Handling

Common error responses:

```json
{
  "error": "Content is required"
}
```

```json
{
  "error": "Content too large (max 1MB)"
}
```

```json
{
  "error": "Custom ID already taken"
}
```

```json
{
  "error": "Custom ID can only contain letters, numbers, hyphens, and underscores"
}
```

Always check the `success` field in API responses and handle errors appropriately.

---

For more information, visit [QuickPaste](https://paste.0xpacman.com) or check the [GitHub repository](https://github.com/0xPacman/Paste).
