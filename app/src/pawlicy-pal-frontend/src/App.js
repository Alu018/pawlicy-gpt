// App.js
import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnswer("Loading...");
    const res = await fetch("http://localhost:8000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setContext(data.context);
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 32 }}>
      <h2>WonderVector5000 Q&A</h2>
      <form onSubmit={handleSubmit}>
        <input
          style={{ width: "100%", padding: 8, fontSize: 16 }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />
        <button style={{ marginTop: 12 }} type="submit">Ask</button>
      </form>
      {answer && (
        <div style={{ marginTop: 24 }}>
          <strong>Answer:</strong>
          <div>{answer}</div>
          <strong>Context:</strong>
          <div>
            {Array.isArray(context)
              ? context.map((item, idx) => (
                <pre key={idx} style={{ background: "#f4f4f4", padding: 8 }}>
                  {JSON.stringify(item, null, 2)}
                </pre>
              ))
              : typeof context === "object"
                ? <pre>{JSON.stringify(context, null, 2)}</pre>
                : context}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;