/**
 * AI Chat Application - INSECURE VERSION (Educational Purpose Only)
 * 
 * ⚠️  WARNING: This file demonstrates BAD SECURITY PRACTICES
 * 
 * This version shows what NOT to do:
 * - Hardcoded API keys (SECURITY RISK!)
 * - No user input validation
 * - Keys visible in source code
 * - Keys stored in version control
 * 
 * Use this ONLY for educational comparison with script.js
 * NEVER use this approach in production!
 */

class InsecureAIChatApp {
    constructor() {
        // ❌ BAD PRACTICE: Hardcoded API keys
        // This is what you should NEVER do in real applications
        this.config = {
            apiKey: 'YOUR_GROQ_API_KEY_HERE', // ❌ EXPOSED! (Replace with actual key for demo)
            apiProvider: 'groq',
            model: 'llama-3.1-8b-instant',
            systemPrompt: 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.'
        };
        
        // Chat history
        this.chatHistory = [];
        
        // API endpoints
        this.apiEndpoints = {
            groq: 'https://api.groq.com/openai/v1/chat/completions',
            openrouter: 'https://openrouter.ai/api/v1/chat/completions',
            huggingface: 'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf'
        };
        
        // Get DOM elements
        this.elements = {
            messagesContainer: document.getElementById('messagesContainer'),
            messageInput: document.getElementById('messageInput'),
            sendBtn: document.getElementById('sendBtn'),
            clearBtn: document.getElementById('clearBtn'),
            welcomeMessage: document.getElementById('welcomeMessage'),
            statusIndicator: document.getElementById('statusIndicator')
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize the insecure app
     */
    init() {
        this.setupEventListeners();
        this.updateStatus();
        this.setupTextareaResize();
        
        // Show warning message
        this.showSecurityWarning();
        
        console.log('⚠️  INSECURE AI Chat App initialized - FOR EDUCATIONAL PURPOSES ONLY!');
    }
    
    /**
     * Show security warning to users
     */
    showSecurityWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'security-warning';
        warningDiv.innerHTML = `
            <div class="warning-content">
                <h3>♨️ API's Keys in JavaScript Function</h3>
            </div>
        `;
        
        // Add warning styles
        warningDiv.style.cssText = `
            background:rgb(44, 123, 49);
            color: white;
            padding: 20px;
            margin: 10px;
            border-radius: 8px;
            border-left: 5px solid #48c5ff;
            font-family: Arial, sans-serif;
        `;
        
        // Insert warning at the top
        const container = document.querySelector('.chat-container') || document.body;
        container.insertBefore(warningDiv, container.firstChild);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.elements.clearBtn.addEventListener('click', () => this.clearChat());
    }
    
    /**
     * Auto-resize textarea
     */
    setupTextareaResize() {
        this.elements.messageInput.addEventListener('input', () => {
            this.elements.messageInput.style.height = 'auto';
            this.elements.messageInput.style.height = this.elements.messageInput.scrollHeight + 'px';
        });
    }
    
    /**
     * Update status (always shows as connected since key is hardcoded)
     */
    updateStatus() {
        this.elements.statusIndicator.classList.add('connected');
        this.elements.statusIndicator.innerHTML = `
            <span class="status-dot"></span>
            Connected (${this.config.apiProvider}) - INSECURE VERSION
        `;
    }
    
    /**
     * Send message (simplified - no validation needed)
     */
    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        
        if (!message) return;
        
        // Hide welcome message
        if (this.elements.welcomeMessage) {
            this.elements.welcomeMessage.style.display = 'none';
        }
        
        // Clear input
        this.elements.messageInput.value = '';
        this.elements.messageInput.style.height = 'auto';
        
        // Disable send button
        this.elements.sendBtn.disabled = true;
        
        // Add user message
        this.addMessage('user', message);
        
        // Add to chat history
        this.chatHistory.push({
            role: 'user',
            content: message
        });
        
        // Show loading
        const loadingId = this.addLoadingMessage();
        
        try {
            // Call API (using hardcoded key)
            const response = await this.callAPI();
            
            // Remove loading
            this.removeMessage(loadingId);
            
            // Add AI response
            this.addMessage('assistant', response);
            
            // Add to history
            this.chatHistory.push({
                role: 'assistant',
                content: response
            });
            
        } catch (error) {
            this.removeMessage(loadingId);
            this.addMessage('assistant', `Error: ${error.message}`);
            console.error('API Error:', error);
        }
        
        // Re-enable send button
        this.elements.sendBtn.disabled = false;
        this.elements.messageInput.focus();
    }
    
    /**
     * Call API with hardcoded key
     */
    async callAPI() {
        const endpoint = this.apiEndpoints[this.config.apiProvider];
        
        const messages = [
            { role: 'system', content: this.config.systemPrompt },
            ...this.chatHistory
        ];
        
        const requestBody = {
            model: this.config.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
        };
        
        // Make request with hardcoded API key
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`, // ❌ Hardcoded key!
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        const messageContent = data.choices[0]?.message?.content;
        
        if (!messageContent) {
            throw new Error('No response from API');
        }
        
        return messageContent;
    }
    
    /**
     * Add message to chat
     */
    addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(content)}</div>
                <div class="message-time">${time}</div>
            </div>
        `;
        
        this.elements.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv.id = `msg-${Date.now()}`;
    }
    
    /**
     * Format message content
     */
    formatMessage(content) {
        content = content.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
        
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });
        
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }
    
    /**
     * Add loading message
     */
    addLoadingMessage() {
        const messageDiv = document.createElement('div');
        const id = `loading-${Date.now()}`;
        messageDiv.id = id;
        messageDiv.className = 'message assistant';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.elements.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        return id;
    }
    
    /**
     * Remove message
     */
    removeMessage(id) {
        const message = document.getElementById(id);
        if (message) {
            message.remove();
        }
    }
    
    /**
     * Clear chat
     */
    clearChat() {
        if (this.chatHistory.length > 0) {
            if (!confirm('Are you sure you want to clear the chat history?')) {
                return;
            }
        }
        
        this.chatHistory = [];
        this.elements.messagesContainer.innerHTML = '';
        
        if (this.elements.welcomeMessage) {
            this.elements.welcomeMessage.style.display = 'flex';
        }
        
        console.log('Chat cleared');
    }
    
    /**
     * Scroll to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }, 100);
    }
}

// Initialize the insecure app
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.insecureChatApp = new InsecureAIChatApp();
    
    console.log('⚠️  INSECURE AI Chat Application loaded - FOR EDUCATIONAL PURPOSES ONLY!');
    console.log('🔒 Compare this with script.js to learn security best practices');
});