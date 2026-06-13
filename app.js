// DOM Element Selectors
const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Context storage array to maintain conversation memory
let chatHistory = [];

/**
 * Appends a message bubble into the chat viewport
 * @param {string} text - Message text content
 * @param {'user' | 'ai'} sender - Who sent the message
 */
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);
    msgDiv.innerText = text;
    chatContainer.appendChild(msgDiv);
    
    // Auto-scroll to the bottom of the container
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return msgDiv;
}

/**
 * Handles processing input, managing state, and querying the Gemini API
 */
async function sendMessage() {
    const query = messageInput.value.trim();
    if (!query) return;

    // 1. UI Update: User's prompt
    appendMessage(query, 'user');
    messageInput.value = '';
    
    // 2. Lock UI down during processing
    messageInput.disabled = true;
    sendBtn.disabled = true;

    // 3. Keep memory updated
    chatHistory.push({ role: 'user', content: query });

    // 4. UI Update: Generate temporary visual placeholder
    const aiMsgDiv = appendMessage("Thinking...", 'ai');

    try {
        // 5. Query Puter's keyless gateway using the 'gemini' flag
        const response = await puter.ai.chat(chatHistory, { model: 'gemini' });
        const aiResponseText = response.message.content;
        
        // 6. UI Update: Replace placeholder with final answer
        aiMsgDiv.innerText = aiResponseText;
        
        // 7. Update memory with response
        chatHistory.push({ role: 'assistant', content: aiResponseText });

    } catch (error) {
        console.error("Puter AI Gateway Error:", error);
        aiMsgDiv.innerText = "Error: Failed to fetch response. Check connection and try again.";
        aiMsgDiv.style.color = "var(--error-color)";
    } finally {
        // 8. Re-enable UI components
        messageInput.disabled = false;
        sendBtn.disabled = false;
        messageInput.focus();
    }
}

// Global Interaction Triggers
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
