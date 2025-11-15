(function() {
  const API_KEY = document.currentScript.getAttribute('data-api-key');
  const API_URL = 'https://custai.vercel.app/api/chat';
  const LOGO_URL = 'https://custai.vercel.app/logo.png';
  
  // CSS Styles
  const styles = `
    #cs-widget-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
      transition: transform 0.2s;
    }
    #cs-widget-button:hover {
      transform: scale(1.1);
    }
    #cs-widget-button svg {
      width: 28px;
      height: 28px;
      fill: white;
    }
    #cs-widget-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s;
    }
    #cs-widget-container.active {
      display: flex;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    #cs-widget-box {
      width: 90%;
      max-width: 500px;
      height: 80%;
      max-height: 700px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s;
    }
    @keyframes slideUp {
      from { transform: translateY(50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    #cs-widget-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    #cs-widget-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    #cs-widget-logo {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #cs-widget-logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    #cs-widget-title {
      font-size: 18px;
      font-weight: 600;
    }
    #cs-widget-close {
      background: rgba(255,255,255,0.2);
      border: none;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }
    #cs-widget-close:hover {
      background: rgba(255,255,255,0.3);
    }
    #cs-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f8f9fa;
    }
    .cs-message {
      margin-bottom: 16px;
      display: flex;
      gap: 10px;
      animation: messageSlide 0.3s;
    }
    @keyframes messageSlide {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .cs-message.ai {
      flex-direction: row;
    }
    .cs-message.user {
      flex-direction: row-reverse;
    }
    .cs-message-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      flex-shrink: 0;
      overflow: hidden;
    }
    .cs-message-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .cs-message.user .cs-message-avatar {
      background: #e0e0e0;
    }
    .cs-message-bubble {
      max-width: 70%;
      padding: 12px 16px;
      border-radius: 18px;
      line-height: 1.4;
      font-size: 14px;
    }
    .cs-message.ai .cs-message-bubble {
      background: white;
      color: #2c3e50;
      border-bottom-left-radius: 4px;
    }
    .cs-message.user .cs-message-bubble {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .cs-message-time {
      font-size: 11px;
      color: #95a5a6;
      margin-top: 4px;
    }
    #cs-widget-input-container {
      padding: 15px 20px;
      background: white;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
    }
    #cs-widget-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e0e0e0;
      border-radius: 25px;
      font-size: 14px;
      outline: none;
      font-family: system-ui, -apple-system, sans-serif;
    }
    #cs-widget-input:focus {
      border-color: #667eea;
    }
    #cs-widget-send {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: transform 0.2s;
    }
    #cs-widget-send:hover:not(:disabled) {
      transform: scale(1.05);
    }
    #cs-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .cs-typing {
      display: flex;
      gap: 4px;
      padding: 10px 16px;
      background: white;
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      width: fit-content;
    }
    .cs-typing span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #95a5a6;
      animation: typing 1.4s infinite;
    }
    .cs-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cs-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
  `;

  // Inject styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Create widget HTML
  const widgetHTML = `
    <button id="cs-widget-button" aria-label="Open chat">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    </button>
    <div id="cs-widget-container">
      <div id="cs-widget-box">
        <div id="cs-widget-header">
          <div id="cs-widget-header-left">
            <div id="cs-widget-logo">
              <img src="${LOGO_URL}" alt="Logo" />
            </div>
            <div id="cs-widget-title">Whalecore Assistant</div>
          </div>
          <button id="cs-widget-close" aria-label="Close chat">✕</button>
        </div>
        <div id="cs-widget-messages"></div>
        <div id="cs-widget-input-container">
          <input type="text" id="cs-widget-input" placeholder="Ketik pesan..." />
          <button id="cs-widget-send" aria-label="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', widgetHTML);

  // Elements
  const button = document.getElementById('cs-widget-button');
  const container = document.getElementById('cs-widget-container');
  const closeBtn = document.getElementById('cs-widget-close');
  const messagesDiv = document.getElementById('cs-widget-messages');
  const input = document.getElementById('cs-widget-input');
  const sendBtn = document.getElementById('cs-widget-send');

  let conversationHistory = [];

  // Helper functions
  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `cs-message ${isUser ? 'user' : 'ai'}`;
    messageDiv.innerHTML = `
      <div class="cs-message-avatar">
        ${isUser ? '👤' : `<img src="${LOGO_URL}" alt="Bot" />`}
      </div>
      <div>
        <div class="cs-message-bubble">${text}</div>
        <div class="cs-message-time">${formatTime()}</div>
      </div>
    `;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'cs-message ai';
    typingDiv.id = 'cs-typing-indicator';
    typingDiv.innerHTML = `
      <div class="cs-message-avatar">
        <img src="${LOGO_URL}" alt="Bot" />
      </div>
      <div class="cs-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  function hideTyping() {
    const typingDiv = document.getElementById('cs-typing-indicator');
    if (typingDiv) typingDiv.remove();
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    conversationHistory.push({ role: 'user', content: message });
    input.value = '';
    sendBtn.disabled = true;

    // Show typing indicator
    showTyping();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: API_KEY,
          message: message,
          history: conversationHistory.slice(-6) // Last 3 exchanges
        })
      });

      const data = await response.json();
      hideTyping();

      if (data.success) {
        addMessage(data.response);
        conversationHistory.push({ role: 'assistant', content: data.response });
      } else {
        addMessage('Maaf, terjadi kesalahan. Coba lagi ya!');
      }
    } catch (error) {
      hideTyping();
      addMessage('Maaf, koneksi bermasalah. Coba lagi nanti ya!');
      console.error('Chat error:', error);
    } finally {
      sendBtn.disabled = false;
    }
  }

  // Event listeners
  button.addEventListener('click', () => {
    container.classList.add('active');
    input.focus();
    
    // Welcome message on first open
    if (messagesDiv.children.length === 0) {
      setTimeout(() => {
        addMessage('Haii kakk.... kenalin aku CS AI ya, btw ada kendala apa nih kak ko sampe chat aku hehe, tanya aja kak kalo ada kendala atau kebingungan, aku siap bantu! 😊');
      }, 300);
    }
  });

  closeBtn.addEventListener('click', () => {
    container.classList.remove('active');
  });

  container.addEventListener('click', (e) => {
    if (e.target === container) {
      container.classList.remove('active');
    }
  });

  sendBtn.addEventListener('click', sendMessage);
  
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled) {
      sendMessage();
    }
  });
})();
