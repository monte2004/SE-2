class ChatBot {
    constructor() {
        this.messages = [];
        this.init();
    }

    init() {
        // Load previous messages
        this.loadMessages();
        
        // Setup event listeners
        document.querySelector('.send-btn').addEventListener('click', this.sendMessage.bind(this));
        document.querySelector('.chat-input input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    sendMessage() {
        const input = document.querySelector('.chat-input input');
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            this.generateResponse(text);
        }, 1000);
    }

    addMessage(text, sender) {
        const message = { text, sender, timestamp: new Date() };
        this.messages.push(message);
        this.renderMessage(message);
        this.saveMessages();
    }

    renderMessage(message) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.sender}`;
        messageEl.innerHTML = `
            <div class="avatar">${message.sender === 'user' ? 'You' : 'AI'}</div>
            <div class="content">${message.text}</div>
        `;
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateResponse(userMessage) {
        // This would call an AI API in a real implementation
        let response = "I'm sorry, I didn't understand that. Could you please rephrase?";
        
        if (userMessage.toLowerCase().includes('order')) {
            response = "I can help with order issues. Please provide your order number.";
        } else if (userMessage.toLowerCase().includes('return')) {
            response = "Our return policy allows returns within 30 days. Would you like to start a return?";
        }
        
        this.addMessage(response, 'ai');
    }

    saveMessages() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }

    loadMessages() {
        const saved = localStorage.getItem('chatMessages');
        if (saved) {
            this.messages = JSON.parse(saved);
            this.messages.forEach(msg => this.renderMessage(msg));
        } else {
            this.addMessage("Hello! How can I help you today?", 'ai');
        }
    }
}

new ChatBot();