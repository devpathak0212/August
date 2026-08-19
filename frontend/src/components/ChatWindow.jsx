import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { sendMessage, fetchHistory } from "../api";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      try {
        const history = await fetchHistory(user.uid);
        if (cancelled) return;
        const flattened = history.flatMap((entry) => [
          { role: "user", text: entry.user },
          { role: "bot", text: entry.bot },
        ]);
        setMessages(flattened);
      } catch {
        // No history yet, or backend unreachable — start fresh silently.
      } finally {
        if (!cancelled) setLoadingHistory(false);
      }
    }
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [user.uid]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setError("");
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setSending(true);

    try {
      const data = await sendMessage(user.uid, trimmed);
      setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
    } catch (err) {
      setError(err.message || "Message couldn't be sent. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-screen">
      <div className="leaf-field" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className={`leaf leaf-${(i % 5) + 1}`} />
        ))}
      </div>

      <header className="chat-header">
        <div className="chat-header-left">
          <div className="moon-glow" aria-hidden="true" />
          <div>
            <div className="brand-mark brand-mark-sm">august</div>
            <div className="chat-subtitle">{user.displayName || user.email}</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={() => signOut(auth)}>
          Log out
        </button>
      </header>

      <main className="chat-body" ref={scrollRef}>
        {loadingHistory && (
          <div className="chat-empty">Gathering fallen leaves…</div>
        )}

        {!loadingHistory && messages.length === 0 && (
          <div className="chat-empty">
            <p className="chat-empty-title">The clearing is quiet.</p>
            <p>Say something to start the conversation.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} />
        ))}

        {sending && (
          <div className="bubble-row from-bot">
            <div className="bubble bubble-bot bubble-typing">
              <span className="bubble-label">august</span>
              <span className="typing-dots">
                <i /> <i /> <i />
              </span>
            </div>
          </div>
        )}
      </main>

      {error && <div className="chat-error">{error}</div>}

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write something…"
          disabled={sending}
        />
        <button type="submit" className="btn-primary" disabled={sending}>
          Send
        </button>
      </form>
    </div>
  );
}