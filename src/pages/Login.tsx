import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await login(email, password)
    if (!res.ok) setError(res.error || 'Login failed')
    else navigate('/shop')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Log in</h1>
        {error && <div className="text-red-400 text-sm mb-3 text-center">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input className="w-full bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <button className="w-full bg-white/15 hover:bg-white/20 border border-white/20 rounded-xl py-3 text-sm font-medium">Sign in</button>
        </form>
        <div className="text-center text-white/40 text-xs mt-6">
          New here? <Link to="/register" className="text-white/70 hover:text-white underline">Create account</Link>
        </div>
      </div>
    </div>
  )
}
