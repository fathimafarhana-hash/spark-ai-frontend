import React, { useState } from "react";
import "./App.css";

function App() {

  const [prompt, setPrompt] = useState("");

  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Welcome to SparkAI. How can I help improve your productivity today?"
    }
  ]);

  const sendMessage = async () => {

    if (!prompt.trim()) return;

    const currentPrompt = prompt;

    setPrompt("");

    const userMessage = {
      type: "user",
      text: currentPrompt
    };

    setMessages(prev => [
      ...prev,
      userMessage,
      {
        type: "ai",
        text: "⚡ SparkAI is analyzing your request..."
      }
    ]);

    try {

      const response = await fetch(
        "http://localhost:8080/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: currentPrompt
          })
        }
      );

      const data = await response.json();

      setMessages(prev => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          type: "ai",
          text: data.response
        };

        return updated;
      });

    } catch (error) {

      setMessages(prev => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          type: "ai",
          text: "❌ Unable to connect to SparkAI backend."
        };

        return updated;
      });

    }
  };

  return (
    <div className="app">

      <div className="sidebar">

        <h2>⚡ SparkAI</h2>

        <div className="menu">
          <div>🏠 Dashboard</div>
          <div>🤖 AI Assistant</div>
          <div>✅ Tasks</div>
          <div>📅 Meetings</div>
          <div>📚 Knowledge Hub</div>
          <div>👤 Profile</div>
        </div>

      </div>

      <div className="main">

        <div className="header">

          <h1>SparkAI Enterprise Assistant</h1>

          <p>Future Workplace Intelligence</p>

        </div>

        <div className="chat-box">

          {messages.map((msg, index) => (

            <div key={index}>

              <div
                className={
                  msg.type === "user"
                    ? "user-message"
                    : "ai-message"
                }
              >
                {msg.text}
              </div>

              {msg.type === "ai" && (

                <div className="message-actions">

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(msg.text)
                    }
                  >
                    📋
                  </button>

                  <button>
                    👍
                  </button>

                  <button>
                    👎
                  </button>

                  <button>
                    ⋮
                  </button>

                </div>

              )}

            </div>

          ))}

        </div>

        <div className="input-area">

          <input
            type="text"
            placeholder="Ask SparkAI..."
            value={prompt}
            onChange={(e) =>
              setPrompt(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button onClick={sendMessage}>
            Spark
          </button>

        </div>

      </div>

    </div>
  );
}

export default App;
