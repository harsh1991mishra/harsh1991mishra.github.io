/**
 * AI Chatbot Module
 * Supports OpenAI, Hugging Face, and custom API endpoints
 * GitHub Pages Compatible (Client-side only)
 */

class HarsHChatbot {
  constructor(config = {}) {
    // API Configuration (set your API key in environment or update here)
    this.config = {
      apiProvider: config.apiProvider || 'openai', // 'openai', 'huggingface', or 'custom'
      apiKey: config.apiKey || localStorage.getItem('chatbot_api_key') || '',
      apiEndpoint: config.apiEndpoint || '',
      model: config.model || 'gpt-3.5-turbo',
      systemPrompt: config.systemPrompt || this.getDefaultSystemPrompt(),
      ...config
    };

    this.conversationHistory = [];
    this.isLoading = false;
    this.maxMessages = 50;
    this.initializeUI();
    this.attachEventListeners();
  }

  getDefaultSystemPrompt() {
    return `You are HarsH, an AI assistant on Harsh Mishra's personal website. 
Harsh is a Data Analyst, AI enthusiast, and Cyber Security expert specializing in:
- Data Analytics and visualization (Power BI, Excel, SQL)
- AI/ML integration and automation
- Cyber Security, GDPR compliance, and privacy
- IoT solutions and embedded systems
- Full-stack development

Be helpful, professional, and concise. Reference Harsh's work and expertise when relevant.`;
  }

  initializeUI() {
    const existingWidget = document.getElementById('harshChatbotWidget');
    if (existingWidget) return; // Already initialized

    const widget = document.createElement('div');
    widget.id = 'harshChatbotWidget';
    widget.innerHTML = `
      <div class="chatbot-container">
        <div class="chatbot-header">
          <h3>HarsH AI Assistant</h3>
          <button class="chatbot-close" aria-label="Close chatbot">✕</button>
        </div>
        <div class="chatbot-messages" id="chatMessages">
          <div class="message ai-message fade-in">
            <div class="message-content">
              Hi! I'm HarsH, Harsh's AI assistant. Ask me about Data Analytics, AI, Cyber Security, or my projects. How can I help you today?
            </div>
          </div>
        </div>
        <div class="chatbot-input-area">
          <input 
            type="text" 
            id="chatInput" 
            class="chatbot-input" 
            placeholder="Ask me anything..."
            autocomplete="off"
          >
          <button class="chatbot-send" id="chatSendBtn" aria-label="Send message">➤</button>
        </div>
        <div class="chatbot-footer">
          <small>Powered by AI • <a href="#" onclick="event.preventDefault(); document.getElementById('chatbotApiModal').style.display='block';">⚙️ Setup API</a></small>
        </div>
      </div>
    `;
    document.body.appendChild(widget);

    // Add API setup modal
    const modal = document.createElement('div');
    modal.id = 'chatbotApiModal';
    modal.className = 'chatbot-modal';
    modal.innerHTML = `
      <div class="chatbot-modal-content">
        <span class="chatbot-modal-close">&times;</span>
        <h2>Setup AI Chatbot</h2>
        <p>Choose your AI API provider and enter your API key:</p>
        
        <div class="api-options">
          <label>
            <input type="radio" name="apiProvider" value="openai" checked> OpenAI (GPT-3.5/GPT-4)
          </label>
          <label>
            <input type="radio" name="apiProvider" value="huggingface"> Hugging Face
          </label>
          <label>
            <input type="radio" name="apiProvider" value="custom"> Custom Endpoint
          </label>
        </div>

        <div class="api-input-group">
          <label for="apiKeyInput">API Key:</label>
          <input type="password" id="apiKeyInput" placeholder="Enter your API key" value="${this.config.apiKey}">
          <button type="checkbox" id="showApiKey">👁️ Show</button>
        </div>

        <div class="api-input-group" id="customEndpointGroup" style="display:none;">
          <label for="customEndpoint">Custom Endpoint URL:</label>
          <input type="text" id="customEndpoint" placeholder="https://your-api.com/chat" value="${this.config.apiEndpoint}">
        </div>

        <div class="api-links">
          <p><strong>Get an API Key:</strong></p>
          <ul>
            <li><a href="https://platform.openai.com/api-keys" target="_blank">OpenAI API Keys</a> (free credits available)</li>
            <li><a href="https://huggingface.co/settings/tokens" target="_blank">Hugging Face Tokens</a> (free tier)</li>
          </ul>
        </div>

        <button class="btn btn-primary" id="saveApiKey">Save Configuration</button>
        <small>Your API key is stored locally in your browser only.</small>
      </div>
    `;
    document.body.appendChild(modal);
  }

  attachEventListeners() {
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');
    const closeBtn = document.querySelector('.chatbot-close');
    const modal = document.getElementById('chatbotApiModal');
    const modalClose = document.querySelector('.chatbot-modal-close');
    const saveBtn = document.getElementById('saveApiKey');
    const showKeyBtn = document.getElementById('showApiKey');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const apiProviderRadios = document.querySelectorAll('input[name="apiProvider"]');
    const customEndpointGroup = document.getElementById('customEndpointGroup');

    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    closeBtn.addEventListener('click', () => {
      document.getElementById('harshChatbotWidget').style.display = 'none';
    });

    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    saveBtn.addEventListener('click', () => this.saveApiConfiguration());

    showKeyBtn.addEventListener('click', () => {
      if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        showKeyBtn.textContent = '🙈 Hide';
      } else {
        apiKeyInput.type = 'password';
        showKeyBtn.textContent = '👁️ Show';
      }
    });

    apiProviderRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        this.config.apiProvider = e.target.value;
        customEndpointGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
      });
    });

    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  saveApiConfiguration() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const apiProvider = document.querySelector('input[name="apiProvider"]:checked').value;
    const customEndpoint = document.getElementById('customEndpoint').value.trim();

    if (!apiKey) {
      alert('Please enter an API key.');
      return;
    }

    this.config.apiKey = apiKey;
    this.config.apiProvider = apiProvider;
    if (apiProvider === 'custom' && customEndpoint) {
      this.config.apiEndpoint = customEndpoint;
    }

    localStorage.setItem('chatbot_api_key', apiKey);
    localStorage.setItem('chatbot_api_provider', apiProvider);
    localStorage.setItem('chatbot_api_endpoint', customEndpoint);

    alert('API configuration saved! ✓');
    document.getElementById('chatbotApiModal').style.display = 'none';
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    if (!this.config.apiKey) {
      this.addMessage('ai', 'Please configure your API key first. Click ⚙️ Setup API to get started.', true);
      return;
    }

    // Add user message
    this.addMessage('user', message);
    input.value = '';

    // Show loading indicator
    this.setLoading(true);

    try {
      const response = await this.callAI(message);
      this.addMessage('ai', response);
      this.conversationHistory.push({ role: 'assistant', content: response });
    } catch (error) {
      this.addMessage('ai', `Error: ${error.message}`, true);
    } finally {
      this.setLoading(false);
    }
  }

  async callAI(userMessage) {
    this.conversationHistory.push({ role: 'user', content: userMessage });

    switch (this.config.apiProvider) {
      case 'openai':
        return await this.callOpenAI(userMessage);
      case 'huggingface':
        return await this.callHuggingFace(userMessage);
      case 'custom':
        return await this.callCustomAPI(userMessage);
      default:
        throw new Error('Unknown API provider');
    }
  }

  async callOpenAI(userMessage) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [
          { role: 'system', content: this.config.systemPrompt },
          ...this.conversationHistory.slice(-10) // Keep last 10 messages for context
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callHuggingFace(userMessage) {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: this.config.systemPrompt },
          ...this.conversationHistory.slice(-10)
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.[0] || 'Hugging Face API error');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async callCustomAPI(userMessage) {
    if (!this.config.apiEndpoint) {
      throw new Error('Custom endpoint URL not configured');
    }

    const response = await fetch(this.config.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        message: userMessage,
        history: this.conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error('Custom API error: ' + response.statusText);
    }

    const data = await response.json();
    return data.response || data.message || JSON.stringify(data);
  }

  addMessage(sender, content, isError = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message fade-in ${isError ? 'error' : ''}`;
    messageDiv.innerHTML = `<div class="message-content">${this.escapeHtml(content)}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (sender === 'user' || !isError) {
      this.conversationHistory.push({ role: sender === 'user' ? 'user' : 'assistant', content });
    }

    // Trim history if too long
    if (this.conversationHistory.length > this.maxMessages) {
      this.conversationHistory = this.conversationHistory.slice(-this.maxMessages);
    }
  }

  setLoading(isLoading) {
    this.isLoading = isLoading;
    const sendBtn = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');

    if (isLoading) {
      sendBtn.disabled = true;
      input.disabled = true;
      sendBtn.textContent = '⏳';

      // Show loading bubble
      const messagesContainer = document.getElementById('chatMessages');
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'message ai-message loading';
      loadingDiv.id = 'loadingBubble';
      loadingDiv.innerHTML = `<div class="message-content"><span class="typing-indicator">●●●</span></div>`;
      messagesContainer.appendChild(loadingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } else {
      sendBtn.disabled = false;
      input.disabled = false;
      sendBtn.textContent = '➤';

      const loadingBubble = document.getElementById('loadingBubble');
      if (loadingBubble) loadingBubble.remove();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.harshChatbot = new HarsHChatbot();
  });
} else {
  window.harshChatbot = new HarsHChatbot();
}
