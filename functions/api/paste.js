// Cloudflare Pages Function for creating pastes
// POST /api/paste

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        // Parse request body
        const { content, language, customId } = await request.json();
        
        // Validate content
        if (!content || content.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Content is required' }), 
                { 
                    status: 400, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        }
        
        // Validate content length (limit to 1MB)
        if (content.length > 1048576) {
            return new Response(
                JSON.stringify({ error: 'Content too large (max 1MB)' }), 
                { 
                    status: 400, 
                    headers: { 'Content-Type': 'application/json' } 
                }
            );
        }
        
        let pasteId;
        
        // Handle custom ID
        if (customId) {
            // Validate custom ID format
            if (!/^[a-zA-Z0-9-_]+$/.test(customId)) {
                return new Response(
                    JSON.stringify({ error: 'Custom ID can only contain letters, numbers, hyphens, and underscores' }), 
                    { 
                        status: 400, 
                        headers: { 'Content-Type': 'application/json' } 
                    }
                );
            }
            
            // Check if custom ID already exists
            const existingPaste = await env.PASTES_KV.get(customId);
            if (existingPaste) {
                return new Response(
                    JSON.stringify({ error: 'Custom ID already taken' }), 
                    { 
                        status: 409, 
                        headers: { 'Content-Type': 'application/json' } 
                    }
                );
            }
            
            pasteId = customId;
        } else {
            // Generate random ID
            pasteId = generateUniqueId();
            
            // Ensure uniqueness (retry if collision)
            let attempts = 0;
            while (attempts < 5) {
                const existingPaste = await env.PASTES_KV.get(pasteId);
                if (!existingPaste) break;
                
                pasteId = generateUniqueId();
                attempts++;
            }
            
            if (attempts >= 5) {
                return new Response(
                    JSON.stringify({ error: 'Failed to generate unique ID' }), 
                    { 
                        status: 500, 
                        headers: { 'Content-Type': 'application/json' } 
                    }
                );
            }
        }
        
        // Prepare paste data
        const pasteData = {
            content: content.trim(),
            language: language || null,
            createdAt: Date.now(),
            id: pasteId
        };
        
        // Store in KV
        await env.PASTES_KV.put(pasteId, JSON.stringify(pasteData), {
            // Optional: Set expiration time (e.g., 1 year)
            expirationTtl: 31536000 // 1 year in seconds
        });
        
        // Return success response
        const baseUrl = new URL(request.url).origin;
        return new Response(
            JSON.stringify({
                success: true,
                id: pasteId,
                url: `${baseUrl}/${pasteId}`,
                createdAt: pasteData.createdAt
            }), 
            { 
                status: 201, 
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                } 
            }
        );
        
    } catch (error) {
        console.error('Error creating paste:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }), 
            { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' } 
            }
        );
    }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
}

// Generate a unique ID for pastes
function generateUniqueId() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
