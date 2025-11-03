const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function register(data: { name: string; phone: string; email: string; instagram: string; password: string }) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  return res.json()
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  return res.json()
}
