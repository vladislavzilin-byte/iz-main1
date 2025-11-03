import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; name: string; email: string };
type AuthState = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

const LS_USERS = "iz_users_v1";
const LS_SESSION = "iz_session_v1";

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}

type StoredUser = { id: string; name: string; email: string; passHash: string };

function readUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(LS_USERS) || "[]"); } catch { return []; }
}
function writeUsers(u: StoredUser[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(u));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(LS_SESSION);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = readUsers();
    const passHash = await sha256(password);
    const u = users.find(x => x.email.toLowerCase() === email.trim().toLowerCase() && x.passHash === passHash);
    if (!u) return { ok: false, error: "Неверная почта или пароль" };
    const sess: User = { id: u.id, name: u.name, email: u.email };
    localStorage.setItem(LS_SESSION, JSON.stringify(sess));
    setUser(sess);
    return { ok: true };
  };

  const register = async (name: string, email: string, password: string) => {
    const users = readUsers();
    const exists = users.some(x => x.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) return { ok: false, error: "Такой e‑mail уже зарегистрирован" };
    const passHash = await sha256(password);
    const id = crypto.randomUUID();
    const newUser: StoredUser = { id, name: name.trim() || "User", email: email.trim(), passHash };
    users.push(newUser);
    writeUsers(users);
    const sess: User = { id, name: newUser.name, email: newUser.email };
    localStorage.setItem(LS_SESSION, JSON.stringify(sess));
    setUser(sess);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(LS_SESSION);
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
