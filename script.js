/**
 * AI Chat Application - Main JavaScript
 * Educational project demonstrating LLM API integration
 * 
 * This file handles:
 * - API configuration and communication
 * - Chat message management
 * - UI interactions
 * - Error handling
 */

class AIChatApp {
    constructor() {
        // Configuration stored in localStorage
        // NOTE: For production, NEVER hardcode API keys! Use environment variables or secure storage.
        this.config = {
            apiKey: localStorage.getItem('apiKey') || '',
            apiProvider: localStorage.getItem('apiProvider') || 'groq',
            model: localStorage.getItem('model') || 'llama-3.1-8b-instant',
            systemPrompt: localStorage.getItem('systemPrompt') || 'You are a helpful AI assistant. Provide clear, concise, and accurate responses.'
        };
        
        // Chat history (stores conversation for context)
        this.chatHistory = [];
        
        // API endpoints configuration
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
            settingsBtn: document.getElementById('settingsBtn'),
            settingsPanel: document.getElementById('settingsPanel'),
            closeSettings: document.getElementById('closeSettings'),
            saveSettings: document.getElementById('saveSettings'),
            welcomeMessage: document.getElementById('welcomeMessage'),
            statusIndicator: document.getElementById('statusIndicator'),
            apiKey: document.getElementById('apiKey'),
            apiProvider: document.getElementById('apiProvider'),
            modelSelect: document.getElementById('modelSelect'),
            systemPrompt: document.getElementById('systemPrompt')
        };
        
        // Initialize the app
        this.init();
    }
    
    /**
     * Initialize application
     * Sets up event listeners and loads saved configuration
     */
    init() {
        // Load saved settings into form
        this.loadSettings();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update status indicator
        this.updateStatus();
        
        // Auto-resize textarea
        this.setupTextareaResize();
        
        console.log('AI Chat App initialized');
    }
    
    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Send message on button click
        this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter (Shift+Enter for new line)
        this.elements.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Clear chat
        this.elements.clearBtn.addEventListener('click', () => this.clearChat());
        
        // Settings panel
        this.elements.settingsBtn.addEventListener('click', () => this.toggleSettings());
        this.elements.closeSettings.addEventListener('click', () => this.toggleSettings());
        this.elements.saveSettings.addEventListener('click', () => this.saveSettings());
        
        // Update model options when provider changes
        this.elements.apiProvider.addEventListener('change', () => this.updateModelOptions());
    }
    
    /**
     * Auto-resize textarea as user types
     */
    setupTextareaResize() {
        this.elements.messageInput.addEventListener('input', () => {
            this.elements.messageInput.style.height = 'auto';
            this.elements.messageInput.style.height = this.elements.messageInput.scrollHeight + 'px';
        });
    }
    
    /**
     * Load settings from localStorage and update form
     */
    loadSettings() {
        this.elements.apiKey.value = this.config.apiKey;
        this.elements.apiProvider.value = this.config.apiProvider;
        this.elements.modelSelect.value = this.config.model;
        this.elements.systemPrompt.value = this.config.systemPrompt;
        
        this.updateModelOptions();
    }
    
    /**
     * Update available models based on selected provider
     */
    updateModelOptions() {
        const provider = this.elements.apiProvider.value;
        const modelSelect = this.elements.modelSelect;
        
        // Clear existing options
        modelSelect.innerHTML = '';
        
        // Add provider-specific models
        const models = {
            groq: [
                { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Fast)' },
                { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B (Powerful)' },
                { value: 'llama-3.2-3b-preview', label: 'Llama 3.2 3B' },
                { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
                { value: 'gemma2-9b-it', label: 'Gemma 2 9B' }
            ],
            openrouter: [
                { value: 'meta-llama/llama-3.1-8b-instruct:free', label: 'Llama 3.1 8B (Free)' },
                { value: 'google/gemma-2-9b-it:free', label: 'Gemma 2 9B (Free)' },
                { value: 'mistralai/mistral-7b-instruct:free', label: 'Mistral 7B (Free)' }
            ],
            huggingface: [
                { value: 'meta-llama/Llama-2-7b-chat-hf', label: 'Llama 2 7B Chat' },
                { value: 'mistralai/Mistral-7B-Instruct-v0.1', label: 'Mistral 7B Instruct' },
                { value: 'google/flan-t5-large', label: 'FLAN-T5 Large' }
            ],
            custom: [
                { value: 'custom-model', label: 'Custom Model' }
            ]
        };
        
        const providerModels = models[provider] || models.groq;
        
        providerModels.forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.label;
            modelSelect.appendChild(option);
        });
        
        // Try to restore previous selection
        if (this.config.model) {
            modelSelect.value = this.config.model;
        }
    }
    
    /**
     * Toggle settings panel visibility
     */
    toggleSettings() {
        this.elements.settingsPanel.classList.toggle('active');
    }
    
    /**
     * Save settings to localStorage and update config
     */
    saveSettings() {
        // Get values from form
        this.config.apiKey = this.elements.apiKey.value.trim();
        this.config.apiProvider = this.elements.apiProvider.value;
        this.config.model = this.elements.modelSelect.value;
        this.config.systemPrompt = this.elements.systemPrompt.value.trim();
        
        // Save to localStorage
        localStorage.setItem('apiKey', this.config.apiKey);
        localStorage.setItem('apiProvider', this.config.apiProvider);
        localStorage.setItem('model', this.config.model);
        localStorage.setItem('systemPrompt', this.config.systemPrompt);
        
        // Update status
        this.updateStatus();
        
        // Close settings panel
        this.toggleSettings();
        
        // Show success feedback
        this.showNotification('Settings saved successfully!', 'success');
    }
    
    /**
     * Update connection status indicator
     */
    updateStatus() {
        const hasApiKey = this.config.apiKey.length > 0;
        
        if (hasApiKey) {
            this.elements.statusIndicator.classList.add('connected');
            this.elements.statusIndicator.innerHTML = `
                <span class="status-dot"></span>
                Connected (${this.config.apiProvider})
            `;
        } else {
            this.elements.statusIndicator.classList.remove('connected');
            this.elements.statusIndicator.innerHTML = `
                <span class="status-dot"></span>
                Not configured
            `;
        }
    }
    
    /**
     * Send a message to the AI
     */
    async sendMessage() {
        const message = this.elements.messageInput.value.trim();
        
        // Validate message
        if (!message) return;
        
        // Check if API key is configured
        if (!this.config.apiKey) {
            this.showNotification('Please configure your API key in settings', 'error');
            this.toggleSettings();
            return;
        }
        
        // Hide welcome message
        if (this.elements.welcomeMessage) {
            this.elements.welcomeMessage.style.display = 'none';
        }
        
        // Clear input
        this.elements.messageInput.value = '';
        this.elements.messageInput.style.height = 'auto';
        
        // Disable send button
        this.elements.sendBtn.disabled = true;
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Add to chat history
        this.chatHistory.push({
            role: 'user',
            content: message
        });
        
        // Show loading indicator
        const loadingId = this.addLoadingMessage();
        
        try {
            // Send request to API
            const response = await this.callAPI();
            
            // Remove loading indicator
            this.removeMessage(loadingId);
            
            // Add AI response to chat
            this.addMessage('assistant', response);
            
            // Add to chat history
            this.chatHistory.push({
                role: 'assistant',
                content: response
            });
            
        } catch (error) {
            // Remove loading indicator
            this.removeMessage(loadingId);
            
            // Show error message
            this.addMessage('assistant', `Error: ${error.message}`);
            console.error('API Error:', error);
        }
        
        // Re-enable send button
        this.elements.sendBtn.disabled = false;
        
        // Focus back on input
        this.elements.messageInput.focus();
    }
    
    /**
     * Call the LLM API
     * This function demonstrates how to make API requests
     */
    async callAPI() {
        const endpoint = this.apiEndpoints[this.config.apiProvider];
        
        if (!endpoint) {
            throw new Error('Invalid API provider selected');
        }
        
        // Prepare messages with system prompt
        const messages = [
            { role: 'system', content: this.config.systemPrompt },
            ...this.chatHistory
        ];
        
        // Different API providers use slightly different formats
        if (this.config.apiProvider === 'huggingface') {
            return await this.callHuggingFaceAPI(messages);
        }
        
        // Standard OpenAI-compatible format (Groq, OpenRouter)
        const requestBody = {
            model: this.config.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
        };
        
        // Make API request
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json',
                // OpenRouter requires additional header
                ...(this.config.apiProvider === 'openrouter' && {
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'AI Chat Educational Demo'
                })
            },
            body: JSON.stringify(requestBody)
        });
        
        // Check for errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
        }
        
        // Parse response
        const data = await response.json();
        
        // Extract message content
        const messageContent = data.choices[0]?.message?.content;
        
        if (!messageContent) {
            throw new Error('No response from API');
        }
        
        return messageContent;
    }
    
    /**
     * Call Hugging Face API (different format)
     */
    async callHuggingFaceAPI(messages) {
        // Convert messages to prompt format
        const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
        
        const response = await fetch(this.apiEndpoints.huggingface, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 512,
                    temperature: 0.7
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data[0]?.generated_text || 'No response';
    }
    
    /**
     * Add a message to the chat UI
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
        
        // Scroll to bottom
        this.scrollToBottom();
        
        return messageDiv.id = `msg-${Date.now()}`;
    }
    
    /**
     * Format message content (handles code blocks, line breaks, etc.)
     */
    formatMessage(content) {
        // Escape HTML
        content = content.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
        
        // Format code blocks
        content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre><code>${code.trim()}</code></pre>`;
        });
        
        // Format inline code
        content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Format line breaks
        content = content.replace(/\n/g, '<br>');
        
        return content;
    }
    
    /**
     * Add loading indicator
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
     * Remove a message by ID
     */
    removeMessage(id) {
        const message = document.getElementById(id);
        if (message) {
            message.remove();
        }
    }
    
    /**
     * Clear all chat messages
     */
    clearChat() {
        // Confirm action
        if (this.chatHistory.length > 0) {
            if (!confirm('Are you sure you want to clear the chat history?')) {
                return;
            }
        }
        
        // Clear history
        this.chatHistory = [];
        
        // Clear UI
        this.elements.messagesContainer.innerHTML = '';
        
        // Show welcome message
        if (this.elements.welcomeMessage) {
            this.elements.welcomeMessage.style.display = 'flex';
        }
        
        this.showNotification('Chat cleared', 'success');
    }
    
    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        setTimeout(() => {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }, 100);
    }
    
    /**
     * Show notification to user
     */
    showNotification(message, type = 'info') {
        // Simple console notification (you can enhance this with a toast UI)
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Optional: Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f85149' : '#3fb950'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create global app instance
    window.chatApp = new AIChatApp();
    
    console.log('🚀 AI Chat Application loaded successfully!');
    console.log('💡 Configure your API key in settings to start chatting');
});

