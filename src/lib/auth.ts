/**
 * Very simple client-side auth using localStorage.
 * Users are stored under 'users' as a record {email: {email, name, passwordHash}}.
 * Current session stored under 'authUser' as {email, name}.
 * Passwords are hashed with a trivial hash here purely to avoid plain text (not secure).
 */

export type AuthUser = { email: string; name: string };
type StoredUser = { email: string; name: string; passwordHash: string };

const USERS_KEY = "users";
const AUTH_KEY = "authUser";

function getUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function setUsers(rec: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(rec));
}

function hash(s: string): string {
  // naive non-cryptographic hash for demo purposes only
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export function register(name: string, email: string, password: string): { ok: true } | { ok: false; error: string } {
  email = email.trim().toLowerCase();
  name = name.trim();
  if (!name) return { ok: false, error: "Введите имя" };
  if (!email || !email.includes("@")) return { ok: false, error: "Некорректный email" };
  if (password.length < 6) return { ok: false, error: "Пароль должен быть от 6 символов" };

  const users = getUsers();
  if (users[email]) return { ok: false, error: "Такой email уже зарегистрирован" };

  users[email] = { email, name, passwordHash: hash(password) };
  setUsers(users);
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email, name }));
  window.dispatchEvent(new Event("auth:change"));
  return { ok: true };
}

export function login(email: string, password: string): { ok: true } | { ok: false; error: string } {
  email = email.trim().toLowerCase();
  const users = getUsers();
  const u = users[email];
  if (!u) return { ok: false, error: "Пользователь не найден" };
  if (u.passwordHash !== hash(password)) return { ok: false, error: "Неверный пароль" };
  localStorage.setItem(AUTH_KEY, JSON.stringify({ email: u.email, name: u.name }));
  window.dispatchEvent(new Event("auth:change"));
  return { ok: true };
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event("auth:change"));
}

export function currentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function onAuthChange(handler: () => void) {
  window.addEventListener("auth:change", handler);
  return () => window.removeEventListener("auth:change", handler);
}
