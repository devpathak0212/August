import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useTheme } from "./hooks/useTheme";
import AuthPage from "./components/AuthPage";
import ChatWindow from "./components/ChatWindow";
import "./styles/theme.css";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Firebase's `user` object is mutated in place by updateProfile(), so after
  // setting a username on signup we need a fresh reference for React to
  // actually re-render with the new displayName.
  async function refreshUser() {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    setUser({ ...auth.currentUser });
  }

  if (user === undefined) {
    return (
      <div className="boot-screen">
        <div className="moon-glow" aria-hidden="true" />
        <p>august</p>
      </div>
    );
  }

  return user ? (
    <ChatWindow user={user} theme={theme} onToggleTheme={toggleTheme} />
  ) : (
    <AuthPage
      onAfterSignup={refreshUser}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}