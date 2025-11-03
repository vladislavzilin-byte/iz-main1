IZ Main — Simple Auth Patch (Portfolio gate)

Files included:
1) server/usersStore.js — simple JSON file storage for users
2) server/auth-snippet.txt — paste this block into server/server.js (see markers)
3) server/.env.example — set JWT_SECRET
4) src/auth/AuthContext.tsx — React auth context
5) src/auth/api.ts — client API helpers
6) src/components/AuthCard.tsx — combined Login/Register card
7) src/pages/Portfolio.tsx — protected page (replace existing)
8) src/main.with-auth.tsx — example of wrapping <App/> with <AuthProvider>
9) .env.example — client env for VITE_API_URL

Setup steps (one-time):
- Server: npm i jsonwebtoken bcryptjs
- Client: ensure react-router-dom is installed

How to integrate:
1) Copy new files into your project preserving paths.
2) Open server/server.js and paste the contents of server/auth-snippet.txt where indicated.
   Ensure app.use(express.json()) is present.
3) Create server/.env with a strong JWT_SECRET (see server/.env.example).
4) Create client .env with VITE_API_URL (see .env.example).
5) Replace src/pages/Portfolio.tsx with the provided one.
6) Update your src/main.tsx to match src/main.with-auth.tsx (or adapt).
7) Run:
   - API: cd server && npm run dev
   - Client: npm run dev

Notes:
- This is minimal auth for staging/small sites. Move to a real DB and add rate limiting when ready.
