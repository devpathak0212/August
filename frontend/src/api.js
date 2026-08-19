const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed with ${res.status}`);
  }
  return data;
}

export async function sendMessage(userId, message) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, message }),
  });
  return handle(res);
}

export async function fetchHistory(userId) {
  const res = await fetch(`${BASE_URL}/chat/history/${userId}`);
  return handle(res);
}
