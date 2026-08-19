export default function MessageBubble({ role, text }) {
  const isUser = role === "user";
  const safeText = toDisplayText(text);
  return (
    <div className={`bubble-row ${isUser ? "from-user" : "from-bot"}`}>
      <div className={`bubble ${isUser ? "bubble-user" : "bubble-bot"}`}>
        {!isUser && <span className="bubble-label">august</span>}
        <p>{safeText}</p>
      </div>
    </div>
  );
}

function toDisplayText(value) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "text" in value) {
    return String(value.text);
  }
  if (Array.isArray(value)) {
    return value
      .map((v) => (typeof v === "string" ? v : v?.text ?? ""))
      .join("");
  }
  return value == null ? "" : String(value);
}
