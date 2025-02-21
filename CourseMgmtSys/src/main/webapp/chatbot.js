document.addEventListener("DOMContentLoaded", function () {
    const chatIcon = document.getElementById("chat-icon");
    const chatWindow = document.getElementById("chat-window");
    const closeChat = document.getElementById("close-chat");
    const sendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatBody = document.getElementById("chat-body");

    // Toggle chat window when clicking the chat icon
    chatIcon.addEventListener("click", function () {
        if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
            chatWindow.style.display = "flex";
        } else {
            chatWindow.style.display = "none";
        }
    });

    // Close chat window when clicking the close button
    closeChat.addEventListener("click", function () {
        chatWindow.style.display = "none";
    });

    // Send Message Function
    function sendMessage() {
        let userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        // Display User Message
        let userDiv = document.createElement("div");
        userDiv.textContent = "You: " + userMessage;
        chatBody.appendChild(userDiv);
        chatInput.value = "";

        // Simulate Bot Response
        setTimeout(() => {
            let botDiv = document.createElement("div");
            botDiv.textContent = "Bot: " + getBotResponse(userMessage);
            chatBody.appendChild(botDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 500);
    }

    // Detect Enter Key for Sending Message
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    // Click Event for Send Button
    sendBtn.addEventListener("click", sendMessage);

    // Example Bot Responses
    function getBotResponse(input) {
        let responses = {
            "hello": "Hi there!",
            "how are you": "I'm just a bot, but I'm good!",
            "bye": "Goodbye!"
        };
        return responses[input.toLowerCase()] || "I don't understand that.";
    }
});