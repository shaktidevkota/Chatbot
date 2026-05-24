const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const historyList = document.getElementById('history-list');

let history = [];

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function formatReply(text) {
  return text
    .replace(/(^|\s)[-–—]\s+/g, '$1\n- ')
    .replace(/(\d+)\.\s*/g, '\n$1. ')
    .replace(/\n{2,}/g, '\n\n')
    .trim();
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  userInput.value = '';
  history.push({ role: 'user', content: message });

  showThinkingDots();

  try {
    const response = await fetch('http://localhost:5000/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: message, history })
    });

    const data = await response.json();
    const rawReply = data.reply || 'No response from AI.';
    const reply = formatReply(rawReply);

    removeThinkingDots();
    history.push({ role: 'assistant', content: reply });
    addTypingEffect(reply, 'bot');
    updateHistory();
  } catch (error) {
    console.error(error);
    removeThinkingDots();
    addMessage('Sorry, something went wrong. Please try again.', 'bot');
  }
}

function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addTypingEffect(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  chatBox.appendChild(msgDiv);

  let i = 0;
  const interval = setInterval(() => {
    msgDiv.textContent = text.slice(0, i);
    i++;
    if (i > text.length) clearInterval(interval);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 20);
}

function showThinkingDots() {
  const dotsDiv = document.createElement('div');
  dotsDiv.classList.add('message', 'bot');
  dotsDiv.id = 'thinking-dots';
  dotsDiv.textContent = '...';
  chatBox.appendChild(dotsDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinkingDots() {
  const dotsDiv = document.getElementById('thinking-dots');
  if (dotsDiv) dotsDiv.remove();
}

function updateHistory() {
  historyList.innerHTML = '';
  history.forEach((item, index) => {
    if (item.role === 'user') {
      const li = document.createElement('li');
      li.textContent = item.content.slice(0, 40);
      li.addEventListener('click', () => {
        chatBox.innerHTML = '';
        history.slice(0, index + 2).forEach(msg =>
          addMessage(msg.content, msg.role === 'user' ? 'user' : 'bot')
        );
      });
      historyList.appendChild(li);
    }
  });
}