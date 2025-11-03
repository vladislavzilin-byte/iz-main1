import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AuthBubble() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = (user?.name || "Guest")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="fixed right-5 bottom-5 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-14 h-14 rounded-full bg-white/10 backdrop-blur border border-white/20 shadow-[0_20px_80px_rgba(255,255,255,0.2)] hover:bg-white/15 transition-all"
        aria-label="Account menu"
      >
        <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        <div className="relative w-full h-full flex items-center justify-center text-white font-bold">
          {user ? initials : "↳"}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="absolute right-0 bottom-20 w-80 rounded-2xl border border-white/20 bg-black/70 backdrop-blur-xl shadow-[0_30px_120px_rgba(255,255,255,0.18)] overflow-hidden"
          >
            <div className="p-4">
              {user ? <UserCard onLogout={logout} /> : <Tabs />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Tabs() {
  const [tab, setTab] = useState<"login" | "register">("login");
  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("login")}
          className={`px-3 py-1 rounded-xl text-sm ${tab === "login" ? "bg-white/15 text-white" : "text-white/70 hover:text-white"}`}
        >
          Вход
        </button>
        <button
          onClick={() => setTab("register")}
          className={`px-3 py-1 rounded-xl text-sm ${tab === "register" ? "bg-white/15 text-white" : "text-white/70 hover:text-white"}`}
        >
          Регистрация
        </button>
      </div>
      {tab === "login" ? <LoginForm /> : <RegisterForm switchToLogin={() => setTab("login")} />}
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block mb-3">
      <span className="block text-xs text-white/60 mb-1">{props.label}</span>
      <input
        {...props}
        className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
      />
    </label>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const r = await login(email, password);
    if (!r.ok) setError(r.error || "Ошибка");
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <Field label="E‑mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Field label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <div className="text-xs text-red-300 mb-2">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white disabled:opacity-60"
      >
        {loading ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}

function RegisterForm({ switchToLogin }: { switchToLogin: () => void }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (password.length < 6) {
      setError("Минимум 6 символов");
      setLoading(false);
      return;
    }
    const r = await register(name, email, password);
    if (!r.ok) setError(r.error || "Ошибка");
    setLoading(false);
    if (r.ok) switchToLogin();
  }

  return (
    <form onSubmit={onSubmit}>
      <Field label="Имя" value={name} onChange={(e) => setName(e.target.value)} required />
      <Field label="E‑mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Field label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <div className="text-xs text-red-300 mb-2">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-xl bg-white/15 hover:bg-white/20 border border-white/20 text-white disabled:opacity-60"
      >
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
      <div className="text-xs text-white/60 mt-2">Уже есть аккаунт? <button type="button" onClick={switchToLogin} className="underline">Войти</button></div>
    </form>
  );
}

function UserCard({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold">
          {(user?.name || "U").slice(0,1).toUpperCase()}
        </div>
        <div className="text-white">
          <div className="font-semibold">{user?.name}</div>
          <div className="text-xs text-white/60">{user?.email}</div>
        </div>
      </div>
      <div className="grid gap-2">
        <a href="/profile" className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white/90 hover:bg-white/15">Профиль</a>
        <button onClick={onLogout} className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm text-white/90 hover:bg-white/15">Выйти</button>
      </div>
    </div>
  );
}
