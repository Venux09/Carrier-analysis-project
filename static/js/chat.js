// AI Chat frontend — sends messages to /api/chat/send, renders replies.

(function () {
  const SESSION_ID = "session_" + Math.random().toString(36).slice(2, 10);
  const chatWindow = document.getElementById("chatWindow");
  const chatInput  = document.getElementById("chatInput");
  const sendBtn    = document.getElementById("sendBtn");

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function appendMessage(role, text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.textContent = role === "user" ? "You" : "CC";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.textContent = text;

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatWindow.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "msg assistant";
    div.id = "typingIndicator";

    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    avatar.textContent = "CC";

    const indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement("div");
      dot.className = "typing-dot";
      indicator.appendChild(dot);
    }

    div.appendChild(avatar);
    div.appendChild(indicator);
    chatWindow.appendChild(div);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById("typingIndicator");
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = "";
    sendBtn.disabled = true;
    appendMessage("user", text);
    showTyping();

    try {
      const resp = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: SESSION_ID, message: text }),
      });
      const data = await resp.json();
      hideTyping();
      appendMessage("assistant", data.reply || data.error || "Something went wrong.");
    } catch (err) {
      hideTyping();
      appendMessage("assistant", "Network error. Please check your connection and try again.");
    } finally {
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  sendBtn.addEventListener("click", sendMessage);

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  chatInput.focus();
})();