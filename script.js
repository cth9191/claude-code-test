// Matrix Terminal Chat Interface
class MatrixChat {
    constructor() {
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearButton = document.getElementById('clearButton');
        this.bootSequence = document.getElementById('bootSequence');

        // Configuration - will be loaded from API
        this.webhookUrl = null;

        // Chat state - start fresh each session
        this.messages = [];
        this.isTyping = false;

        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.createMatrixBackground();
        this.startBootSequence();
        // Load configuration from API
        await this.loadConfig();
        // Don't load old chat history - start fresh each time
    }

    async loadConfig() {
        try {
            // Try to load config from API (production) or use fallback (local)
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

            if (isLocal) {
                // Local development fallback
                this.webhookUrl = 'https://chaseai.app.n8n.cloud/webhook/5e9d1448-c5ed-4723-8f4a-e345e13e254f';
                console.log('Using local development webhook URL');
                return;
            }

            const response = await fetch('/api/config');
            if (!response.ok) {
                throw new Error(`Config API error: ${response.status}`);
            }

            const config = await response.json();
            this.webhookUrl = config.webhookUrl;
            console.log('Configuration loaded from API');

        } catch (error) {
            console.error('Failed to load configuration:', error);
            this.webhookUrl = null;
        }
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.clearButton.addEventListener('click', () => this.clearChat());

        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        // Auto-focus input
        this.messageInput.addEventListener('blur', () => {
            setTimeout(() => this.messageInput.focus(), 100);
        });
    }

    startBootSequence() {
        setTimeout(() => {
            this.bootSequence.style.display = 'none';
            this.messagesContainer.style.display = 'block';
            this.messageInput.focus();

            // Show welcome message
            this.addMessage('bot', 'Welcome to the Matrix Terminal. I am your digital assistant. How may I help you today?');
        }, 4500); // Show boot sequence for 4.5 seconds
    }

    async handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;

        // Add user message
        this.addMessage('user', message);
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send message to n8n webhook
            console.log('Sending message to n8n:', message);
            const response = await this.sendToWebhook(message);
            console.log('n8n response:', response);

            this.hideTypingIndicator();

            // Type out the response from n8n
            let botResponse;
            if (response && Array.isArray(response) && response.length > 0) {
                // Handle n8n array response format: [{"text": "response"}]
                botResponse = response[0].text || response[0].message || response[0].response || 'No text in n8n response';
            } else if (response && (response.message || response.text || response.response)) {
                // Handle direct object response
                botResponse = response.message || response.text || response.response;
            } else {
                botResponse = 'Webhook call successful, but no response data received. n8n workflow may need to return a response.';
            }

            await this.typeMessage('bot', botResponse);
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage('bot', 'Error: Connection to the Matrix failed. Please try again.');
            console.error('Chat error:', error);
        }
    }

    async simulateBotResponse(userMessage) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        this.hideTypingIndicator();

        // Generate contextual responses based on user input
        let response = this.generateMockResponse(userMessage.toLowerCase());

        // Type out the response with animation
        await this.typeMessage('bot', response);
    }

    generateMockResponse(message) {
        const responses = {
            'hello': 'Greetings, human. You have entered the Matrix.',
            'hi': 'Hello. Welcome to the digital realm.',
            'help': 'I am here to assist you. Ask me anything about the Matrix or the world beyond.',
            'matrix': 'The Matrix is a system of control. But you already know this.',
            'neo': 'Mr. Anderson... or should I say, Neo?',
            'red pill': 'You took the red pill. There is no going back.',
            'blue pill': 'The blue pill would have been... simpler.',
            'morpheus': 'Morpheus showed you the truth. Now you must choose what to do with it.',
            'agent': 'Agents are everywhere. Be careful what you say.',
            'wake up': 'You are already awake. This is reality now.',
            'real': 'What is real? How do you define real?',
            'goodbye': 'Until we meet again in the Matrix.',
            'bye': 'Farewell, human. The Matrix awaits your return.',
            'exit': 'You cannot simply exit the Matrix. But you can disconnect.',
            'default': [
                'The Matrix has you...',
                'I understand. Processing your request...',
                'Interesting perspective. Tell me more.',
                'The digital realm holds many answers.',
                'Your thoughts resonate through the Matrix.',
                'I see you are questioning reality.',
                'The truth is out there, waiting to be discovered.',
                'Every choice has consequences in the Matrix.'
            ]
        };

        // Check for specific keywords
        for (const [keyword, response] of Object.entries(responses)) {
            if (keyword !== 'default' && message.includes(keyword)) {
                return response;
            }
        }

        // Return random default response
        const defaultResponses = responses.default;
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    async typeMessage(sender, text) {
        const messageElement = this.createMessageElement(sender, '');
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        const messageText = messageElement.querySelector('.message-text');

        // Type out character by character
        for (let i = 0; i < text.length; i++) {
            messageText.textContent = text.substring(0, i + 1);
            await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40));
            this.scrollToBottom();
        }

        // Add timestamp after typing is complete
        this.addTimestamp(messageElement);
        this.saveMessage(sender, text);
    }

    addMessage(sender, text) {
        const messageElement = this.createMessageElement(sender, text);
        this.messagesContainer.appendChild(messageElement);
        this.addTimestamp(messageElement);
        this.scrollToBottom();
        this.saveMessage(sender, text);
    }

    createMessageElement(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.textContent = text;

        messageDiv.appendChild(messageText);
        return messageDiv;
    }

    addTimestamp(messageElement) {
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = new Date().toLocaleTimeString();
        messageElement.appendChild(timestamp);
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingElement = document.createElement('div');
        typingElement.className = 'message bot typing-indicator';
        typingElement.innerHTML = '<div class="message-text"><span class="typing">●</span><span class="typing">●</span><span class="typing">●</span> Thinking...</div>';
        typingElement.id = 'typing-indicator';

        this.messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    clearChat() {
        if (confirm('Clear all chat history? This action cannot be undone.')) {
            this.messagesContainer.innerHTML = '';
            this.messages = [];
            this.saveMessages();
            this.addMessage('bot', 'Chat history cleared. Ready for new session.');
        }
    }

    loadChatHistory() {
        this.messages.forEach(msg => {
            this.addMessage(msg.sender, msg.text);
        });
    }

    saveMessage(sender, text) {
        this.messages.push({
            sender: sender,
            text: text,
            timestamp: new Date().toISOString()
        });
        this.saveMessages();
    }

    saveMessages() {
        try {
            localStorage.setItem('matrixChatHistory', JSON.stringify(this.messages));
        } catch (error) {
            console.warn('Could not save chat history:', error);
        }
    }

    loadMessages() {
        try {
            const saved = localStorage.getItem('matrixChatHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.warn('Could not load chat history:', error);
            return [];
        }
    }

    // Method to set webhook URL when ready for n8n integration
    setWebhookUrl(url) {
        this.webhookUrl = url;
        console.log('Webhook URL configured:', url);
    }

    // Create Matrix falling text background
    createMatrixBackground() {
        const matrixBg = document.getElementById('matrixBg');
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const columnCount = Math.floor(window.innerWidth / 20);

        // Clear existing columns
        matrixBg.innerHTML = '';

        for (let i = 0; i < columnCount; i++) {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            column.style.left = i * 20 + 'px';
            column.style.animationDuration = (Math.random() * 3 + 2) + 's';
            column.style.animationDelay = Math.random() * 2 + 's';

            const columnHeight = Math.floor(Math.random() * 20 + 10);
            for (let j = 0; j < columnHeight; j++) {
                const char = document.createElement('span');
                char.className = 'char';
                if (j === 0) char.className += ' bright';
                char.textContent = characters[Math.floor(Math.random() * characters.length)];
                column.appendChild(char);
            }

            matrixBg.appendChild(column);
        }

        // Refresh matrix background periodically
        if (this.matrixInterval) clearInterval(this.matrixInterval);
        this.matrixInterval = setInterval(() => this.refreshMatrixBackground(), 5000);

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.createMatrixBackground();
        }, 250);
    }

    refreshMatrixBackground() {
        const matrixBg = document.getElementById('matrixBg');
        const columns = matrixBg.querySelectorAll('.matrix-column');
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

        columns.forEach(column => {
            const chars = column.querySelectorAll('.char');
            chars.forEach(char => {
                if (Math.random() < 0.1) {
                    char.textContent = characters[Math.floor(Math.random() * characters.length)];
                }
            });
        });
    }

    // n8n webhook integration
    async sendToWebhook(message) {
        if (!this.webhookUrl) {
            throw new Error('Webhook URL not configured');
        }

        // Create URL with message as query parameter
        const url = new URL(this.webhookUrl);
        url.searchParams.append('message', message);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if response has content
        const contentLength = response.headers.get('content-length');
        if (contentLength === '0' || !response.headers.get('content-type')?.includes('json')) {
            return { message: null, success: true };
        }

        return response.json();
    }
}

// Initialize the chat when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.matrixChat = new MatrixChat();

    // Console message for developers
    console.log('%cMatrix Terminal Chat Initialized', 'color: #00bfff; font-size: 16px; font-weight: bold;');
    console.log('%cTo configure n8n webhook: matrixChat.setWebhookUrl("YOUR_WEBHOOK_URL")', 'color: #0080ff;');
});

// Add some Matrix-style console art
console.log(`
╔═══════════════════════════════════════╗
║         WELCOME TO THE MATRIX         ║
║              TERMINAL CHAT            ║
╚═══════════════════════════════════════╝
`);