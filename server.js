// server.js
// Простая система логина/регистрации в одном файле
// Стек: Node.js + Express + express-session + connect-sqlite3 + bcryptjs
// Фронтенд (HTML/CSS/JS) вшит в этот файл и отдаётся с /
// Меню входа/профиля закреплено слева сверху

const express = require('express');
const session = require('express-session');
const SQLiteStoreFactory = require('connect-sqlite3');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const SQLiteStore = SQLiteStoreFactory(session);

// ===== Настройки =====
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'auth.db');
const SESSION_SECRET = process.env.SESSION_SECRET || 'change_this_secret';

// ===== База данных =====
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ===== Мидлвары =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: __dirname }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 дней
    },
  })
);

// Утилиты
const createUser = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
const findUserByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findUserById = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');

function requireAuth(req, res, next) {
  if (req.session.userId) return next();
  res.status(401).json({ error: 'Требуется авторизация' });
}

// ===== Маршруты API =====
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Укажите email и пароль' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть не короче 6 символов' });
    }

    const existing = findUserByEmail.get(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const info = createUser.run(email.toLowerCase(), password_hash);
    req.session.userId = info.lastInsertRowid;
    const user = findUserById.get(req.session.userId);
    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Укажите email и пароль' });
    }
    const user = findUserByEmail.get(email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Неверный логин или пароль' });
    req.session.userId = user.id;
    const safeUser = findUserById.get(user.id);
    res.json({ user: safeUser });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = findUserById.get(req.session.userId);
  res.json({ user });
});

// ===== Одностраничный фронтенд =====
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Демо: Вход/Регистрация</title>
  <style>
    :root { --bg: #0f172a; --card: #111827; --text: #e5e7eb; --muted: #9ca3af; --accent: #22c55e; --danger: #ef4444; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial; background: var(--bg); color: var(--text); }
    header { position: sticky; top:0; padding: 12px 16px; background: rgba(17,24,39,0.7); backdrop-filter: blur(8px); border-bottom: 1px solid #1f2937; display:flex; align-items:center; gap:12px; }
    .brand { font-weight:700; }
    .auth-menu { position: fixed; left: 12px; top: 12px; display:flex; gap:8px; align-items:center; }
    .btn { border:1px solid #374151; background:#111827; color:var(--text); padding:8px 12px; border-radius:10px; cursor:pointer; }
    .btn:hover { border-color:#4b5563; }
    .btn.primary { background:#14532d; border-color:#166534; }
    .container { max-width: 960px; margin: 80px auto; padding: 0 16px; }
    .card { background: var(--card); border:1px solid #1f2937; border-radius: 14px; padding: 18px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
    .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:16px; }
    label { display:block; font-size: 14px; color: var(--muted); margin-bottom:6px; }
    input { width:100%; padding:10px 12px; border-radius:10px; border:1px solid #374151; background:#0b1220; color:var(--text); }
    form { display:grid; gap:12px; }
    .error { color: var(--danger); font-size: 14px; }
    .success { color: var(--accent); font-size: 14px; }
    .hidden { display:none; }
    .row { display:flex; gap:8px; align-items:center; }
    .badge { font-size:12px; padding:4px 8px; border-radius:999px; background:#0b1220; border:1px solid #334155; color:#a7f3d0; }
  </style>
</head>
<body>
  <div class="auth-menu" id="authMenu">
    <span class="brand">🔒 Demo</span>
    <div id="authButtons">
      <button class="btn" onclick="openModal('login')">Войти</button>
      <button class="btn" onclick="openModal('register')">Регистрация</button>
    </div>
    <div id="profile" class="hidden row">
      <span id="userEmail" class="badge"></span>
      <button class="btn" onclick="logout()">Выйти</button>
    </div>
  </div>

  <div class="container">
    <div class="card">
      <h2>Простая система логина с регистрацией</h2>
      <p style="color:var(--muted)">Это демо. Данные сохраняются в локальной базе SQLite. Сессии — через cookie.</p>
    </div>

    <div class="grid" style="margin-top:16px">
      <div class="card">
        <h3>Регистрация</h3>
        <form id="registerForm">
          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label>Пароль (мин. 6 символов)</label>
            <input type="password" name="password" minlength="6" required />
          </div>
          <button class="btn primary" type="submit">Создать аккаунт</button>
          <div id="registerMsg" class="error"></div>
        </form>
      </div>

      <div class="card">
        <h3>Вход</h3>
        <form id="loginForm">
          <div>
            <label>Email</label>
            <input type="email" name="email" placeholder="you@example.com" required />
          </div>
          <div>
            <label>Пароль</label>
            <input type="password" name="password" required />
          </div>
          <button class="btn" type="submit">Войти</button>
          <div id="loginMsg" class="error"></div>
        </form>
      </div>

      <div class="card">
        <h3>Проверка авторизации</h3>
        <div id="meBlock">
          <button class="btn" onclick="me()">Кто я?</button>
          <div id="meMsg" class="success" style="margin-top:8px"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Модалка (простая) -->
  <div id="modal" class="hidden" style="position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.5);">
    <div class="card" style="width:min(92vw,420px);">
      <div class="row" style="justify-content:space-between;margin-bottom:8px">
        <strong id="modalTitle">Вход</strong>
        <button class="btn" onclick="closeModal()">✕</button>
      </div>
      <form id="modalForm"></form>
    </div>
  </div>

  <script>
    async function api(url, data) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || {})
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Ошибка');
      return json;
    }

    function setAuthUI(user){
      const authButtons = document.getElementById('authButtons');
      const profile = document.getElementById('profile');
      if (user) {
        authButtons.classList.add('hidden');
        profile.classList.remove('hidden');
        document.getElementById('userEmail').textContent = user.email;
      } else {
        profile.classList.add('hidden');
        authButtons.classList.remove('hidden');
      }
    }

    async function me(){
      const res = await fetch('/api/me');
      const json = await res.json();
      document.getElementById('meMsg').textContent = json.user ? ('Вы вошли как ' + json.user.email) : 'Вы не авторизованы';
      setAuthUI(json.user);
      return json.user;
    }

    async function logout(){
      await api('/api/logout');
      setAuthUI(null);
      document.getElementById('meMsg').textContent = 'Вы вышли из аккаунта';
    }

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const msg = document.getElementById('registerMsg');
      msg.textContent = '';
      try {
        const json = await api('/api/register', { email: f.email.value, password: f.password.value });
        msg.className = 'success';
        msg.textContent = 'Регистрация успешна: ' + json.user.email;
        setAuthUI(json.user);
      } catch (err) {
        msg.className = 'error';
        msg.textContent = err.message;
      }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const msg = document.getElementById('loginMsg');
      msg.textContent = '';
      try {
        const json = await api('/api/login', { email: f.email.value, password: f.password.value });
        msg.className = 'success';
        msg.textContent = 'Вход выполнен: ' + json.user.email;
        setAuthUI(json.user);
      } catch (err) {
        msg.className = 'error';
        msg.textContent = err.message;
      }
    });

    // Простая модалка для входа/регистрации из левого верхнего меню
    function openModal(mode){
      const modal = document.getElementById('modal');
      const form = document.getElementById('modalForm');
      const title = document.getElementById('modalTitle');
      title.textContent = mode === 'login' ? 'Вход' : 'Регистрация';
      form.innerHTML = `
        <div>
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Пароль${mode==='register'?' (мин. 6 символов)':''}</label>
          <input type="password" name="password" ${'${mode===\\'register\\'?\\'minlength=\"6\"\\':\\'\\''}'} required />
        </div>
        <button class="btn ${'${mode===\\'register\\'?\\'primary\\':\\'\\''}'}" type="submit">${'${mode===\\'login\\'?\\'Войти\\':\\'Создать аккаунт\\''}'}</button>
        <div id="modalMsg" class="error" style="margin-top:8px"></div>
      `;
      form.onsubmit = async (e) => {
        e.preventDefault();
        const msg = document.getElementById('modalMsg');
        msg.textContent = '';
        try {
          const json = await api('/api/' + (mode==='login'?'login':'register'), { email: form.email.value, password: form.password.value });
          setAuthUI(json.user);
          closeModal();
        } catch (err) {
          msg.textContent = err.message;
        }
      };
      modal.classList.remove('hidden');
    }
    function closeModal(){ document.getElementById('modal').classList.add('hidden'); }

    // Инициализация
    me();
  </script>
</body>
</html>`);
});

// ===== Старт =====
app.listen(PORT, () => {
  console.log(`Auth demo running on http://localhost:${PORT}`);
});
