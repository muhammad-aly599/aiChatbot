import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: input });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏏 Sports Bot</h2>

        {/* Chat Area - This is now the scrollable part */}
        <div style={styles.chatBox}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                ...styles.message,
                alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                background: m.sender === "user" ? "#2563eb" : "#f1f5f9",
                color: m.sender === "user" ? "#fff" : "#000",
              }}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div style={{ ...styles.message, ...styles.loader }}>
              <span className="dot">●</span>
              <span className="dot">●</span>
              <span className="dot">●</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Area - Stay fixed at the bottom of the card */}
        <div style={styles.inputArea}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a sports question..."
            style={styles.input}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={styles.button}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>

      <style>{`
        .dot {
          animation: blink 1.4s infinite both;
          font-size: 20px;
          margin-right: 4px;
        }
        .dot:nth-child(2) { animation-delay: .2s; }
        .dot:nth-child(3) { animation-delay: .4s; }

        @keyframes blink {
          0% { opacity: .2; }
          20% { opacity: 1; }
          100% { opacity: .2; }
        }
        
        /* Optional: Makes the scrollbar look cleaner */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh", // Fixed height for page
    width: "100vw",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    overflow: "hidden", // Prevents body scroll
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    height: "80vh", // Limits the height of the chat card
    maxHeight: "700px",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,.2)",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.5rem",
    color: "#1e293b",
  },
  chatBox: {
    flex: 1, // Takes up all remaining space in the card
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "1rem",
    overflowY: "auto", // Enables vertical scrolling
    background: "#f8fafc",
    borderRadius: "12px",
    marginBottom: "1rem",
  },
  message: {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: "16px",
    fontSize: "14px",
    lineHeight: 1.4,
    wordBreak: "break-word",
  },
  loader: {
    background: "#e5e7eb",
    color: "#000",
    width: "60px",
    justifyContent: "center",
    display: "flex",
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    paddingTop: "4px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    padding: "0 20px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};