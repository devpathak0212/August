import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthPage({ onAfterSignup }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignup) {
        const trimmedUsername = username.trim();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (trimmedUsername) {
          await updateProfile(cred.user, { displayName: trimmedUsername });
        }
        await onAfterSignup?.();
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // onAuthStateChanged in App.jsx picks up the session from here.
      // Note: updateProfile updates cred.user locally, but the `user` object
      // App.jsx holds via onAuthStateChanged won't refresh on its own —
      // App.jsx handles this (see reload() call there).
    } catch (err) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="leaf-field" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`leaf leaf-${(i % 5) + 1}`} />
        ))}
      </div>

      <div className="auth-card">
        <div className="brand-mark">august</div>
        <div className="auth-eyebrow">The Chatbot</div>
        <h1 className="auth-title">
          {isSignup ? "Plant a new account" : "Welcome back"}
        </h1>
        <p className="auth-sub">
          {isSignup
            ? "The days are getting shorter — let's get you set up."
            : "Pick up right where the conversation left off."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <label className="field">
              <span>Username</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="What should august call you?"
                autoComplete="nickname"
                maxLength={40}
              />
            </label>
          )}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "One moment…" : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setMode(isSignup ? "login" : "signup");
            setError("");
          }}
        >
          {isSignup
            ? "Already have an account? Log in"
            : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}

function friendlyError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email already has an account. Try logging in instead.";
    case "auth/invalid-email":
      return "That email doesn't look right.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password didn't match.";
    default:
      return "Something went wrong. Please try again.";
  }
}