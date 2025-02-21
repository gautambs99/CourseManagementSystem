document.addEventListener("DOMContentLoaded", function () {
    const chatIcon = document.getElementById("chat-icon");
    const chatWindow = document.getElementById("chat-window");
    const closeChat = document.getElementById("close-chat");
    const sendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatBody = document.getElementById("chat-body");

    let predefinedRules = {};

    // Predefined responses for greetings and common queries
    const basicResponses = {
        "hi": "Hello! How can I assist you with your courses today?",
        "hello": "Hi there! How can I help with your course-related questions?",
        "hey": "Hey! Feel free to ask me about courses, subjects, or enrollment.",
        "good morning": "Good morning! How can I assist you with courses?",
        "good evening": "Good evening! Need any information on courses?",
        "bye": "Goodbye! Let me know if you have more course-related questions.",
        "thank you": "You're welcome! Let me know if you need anything else."
    };

    // Load predefined rules from rules.txt
    async function loadPredefinedRules() {
        try {
            const response = await fetch("rules.txt"); // Ensure `rules.txt` is hosted on your server
            if (!response.ok) throw new Error("Failed to load rules file.");
            const data = await response.text();
            predefinedRules = parseRules(data);
        } catch (error) {
            console.error("Error loading rules:", error);
        }
    }

    // Parse rules from the text file (format: key=value)
    function parseRules(data) {
        const rules = {};
        const lines = data.split("\n");
        lines.forEach(line => {
            const [key, value] = line.split("=");
            if (key && value) {
                rules[key.trim().toLowerCase()] = value.trim();
            }
        });
        return rules;
    }

    // Toggle chat window
    chatIcon.addEventListener("click", function () {
        chatWindow.style.display = chatWindow.style.display === "none" || chatWindow.style.display === "" ? "flex" : "none";
    });

    // Close chat window
    closeChat.addEventListener("click", function () {
        chatWindow.style.display = "none";
    });

    // Handle sending messages
    async function sendMessage() {
        let userMessage = chatInput.value.trim().toLowerCase();
        if (userMessage === "") return;

        displayMessage("You: " + userMessage);

        chatInput.value = ""; // Clear input

        let botResponse = getPredefinedResponse(userMessage);
        if (!botResponse) {
            if (isCourseRelated(userMessage)) {
                botResponse = await fetchChatGPTResponse(userMessage);
            } else {
                botResponse = "I'm only trained to answer course-related questions. Please ask about courses, subjects, or enrollment.";
            }
        }

        displayMessage("Bot: " + botResponse);
    }

    // Function to display messages in chat
    function displayMessage(message) {
        let messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Get predefined response if available
    function getPredefinedResponse(userMessage) {
        if (basicResponses[userMessage]) return basicResponses[userMessage]; // Greetings and common responses

        if (predefinedRules[userMessage]) return predefinedRules[userMessage]; // Exact predefined rules

        for (let key in predefinedRules) { // Partial match for predefined responses
            if (userMessage.includes(key)) {
                return predefinedRules[key];
            }
        }

        return null; // No predefined response found
    }

    // Check if a question is course-related
    function isCourseRelated(question) {
        const courseKeywords = [
            "course", "courses", "available courses", "subjects", "syllabus",
            "credit", "prerequisite", "semester", "faculty", "professor",
            "enrollment", "exam", "assignment", "schedule", "elective", "major"
        ];
        return courseKeywords.some(keyword => question.includes(keyword));
    }

    // Fetch response from ChatGPT API for course-related questions
    async function fetchChatGPTResponse(userMessage) {
        const apiKey = "YOUR_OPENAI_API_KEY"; // Replace with your OpenAI API key
        const url = "https://api.openai.com/v1/chat/completions";

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        };

        const body = JSON.stringify({
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }],
            max_tokens: 100
        });

        try {
            const response = await fetch(url, { method: "POST", headers, body });
            const data = await response.json();
            return data.choices[0].message.content || "I couldn't understand that.";
        } catch (error) {
            console.error("Error fetching ChatGPT response:", error);
            return "Sorry, I couldn't fetch course details right now. Please try again later.";
        }
    }

    // Detect Enter Key for sending message
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    // Click event for send button
    sendBtn.addEventListener("click", sendMessage);

    // Load predefined rules on startup
    loadPredefinedRules();
});
