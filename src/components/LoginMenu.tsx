import React, { useEffect, useState } from "react";
import { currentUser, login, logout, onAuthChange, register } from "../lib/auth";

type Tab = "login" | "register";

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <label className="flex flex-col gap-1 w-full">
    <span className="text-sm text-white/80">{label}</span>
    <input
      {...props}
      className="px-3 py-2 rounded-xl bg-white/10 border border-white/20 outline-none focus:border-white/40 text-white placeholder-white/60"
    />
  </label>
);

export default function LoginMenu() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("login");
  const [err, setErr] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(currentUser());

  useEffect(() => onAuthChange(() => setUser(currentUser())), []);

  const reset = () => {
    setErr("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(email, password);
    if (!res.ok) setErr(res.error);
    else {
      reset();
      setOpen(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const res = register(name, email, password);
    if (!res.ok) setErr(res.error);
    else {
      reset();
      setOpen(false);
    }
  };

  return (
    <>
      {/* Top-left login button/menu */}
      <div className="fixed top-4 left-4 z-50">
        {!user ? (
          <button
            onClick={() => { setOpen(true); setTab("login"); }}
            className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition"
            style={{ WebkitBackdropFilter: "blur(12px)" as any }}
          >
            Вход
          </button>
        ) : (
          <div className="group relative">
            <button className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/15 transition">
              👋 {user.name}
            </button>
            <div className="absolute left-0 mt-2 hidden group-hover:block bg-black/60 border border-white/20 rounded-xl p-2 min-w-[160px] backdrop-blur">
              <div className="px-3 py-2 text-white/80 text-sm">{user.email}</div>
              <hr className="border-white/20" />
              <button
                onClick={() => logout()}
                className="w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg"
              >
                Выйти
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md mx-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => { setTab("login"); setErr(""); }}
                className={"flex-1 px-3 py-2 rounded-xl " + (tab === "login" ? "bg-white/20 text-white" : "bg-white/10 text-white/70")}
              >
                Вход
              </button>
              <button
                onClick={() => { setTab("register"); setErr(""); }}
                className={"flex-1 px-3 py-2 rounded-xl " + (tab === "register" ? "bg-white/20 text-white" : "bg-white/10 text-white/70")}
              >
                Регистрация
              </button>
            </div>

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-3">
                <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                <Input label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="******" />
                {err && <div className="text-red-300 text-sm">{err}</div>}
                <button type="submit" className="mt-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90">Войти</button>
                <button type="button" onClick={() => setTab("register")} className="text-white/70 text-sm underline self-start">
                  Нет аккаунта? Зарегистрируйтесь
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="flex flex-col gap-3">
                <Input label="Имя" value={name} onChange={e => setName(e.target.value)} placeholder="Ваше имя" />
                <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                <Input label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="минимум 6 символов" />
                {err && <div className="text-red-300 text-sm">{err}</div>}
                <button type="submit" className="mt-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-white/90">Зарегистрироваться</button>
                <button type="button" onClick={() => setTab("login")} className="text-white/70 text-sm underline self-start">
                  Уже есть аккаунт? Войти
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
