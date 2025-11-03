import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-[70vh] grid place-items-center text-white text-center">
        <div>
          <div className="text-lg mb-2">Для доступа к профилю войдите в аккаунт</div>
          <div className="text-white/60">Нажмите на круглый шарик в правом нижнем углу</div>
          <div className="mt-6"><Link to="/" className="underline">← На главную</Link></div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-[70vh] max-w-xl mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-6">Профиль</h1>
      <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
        <div className="mb-2"><span className="text-white/60">Имя:</span> {user.name}</div>
        <div className="mb-2"><span className="text-white/60">E‑mail:</span> {user.email}</div>
        <div className="text-xs text-white/50 mt-4">Данные хранятся локально в браузере (localStorage).</div>
      </div>
    </div>
  );
}
