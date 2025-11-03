import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { login as apiLogin, register as apiRegister } from '../auth/api'

export default function AuthCard() {
  const { login } = useAuth()
  const [mode, setMode] = useState<'login'|'register'>('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const res = await apiLogin({ email, password })
        if (!res.ok) throw new Error(res.error || 'Login failed')
        login(res.token, res.user)
      } else {
        const res = await apiRegister({ name, phone, email, instagram, password })
        if (!res.ok) throw new Error(res.error || 'Registration failed')
        login(res.token, res.user)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 w-full max-w-md text-left">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{mode === 'login' ? 'Prisijungti' : 'Registracija'}</h2>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-white/70 underline">
          {mode === 'login' ? 'Neturi paskyros? Registruokis' : 'Jau turi paskyrą? Prisijunk'}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        {mode === 'register' && (
          <>
            <input className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3" placeholder="Vardas" value={name} onChange={e=>setName(e.target.value)} required />
            <input className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3" placeholder="Telefonas" value={phone} onChange={e=>setPhone(e.target.value)} required />
            <input className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3" placeholder="Instagram (@handle)" value={instagram} onChange={e=>setInstagram(e.target.value)} required />
          </>
        )}
        <input type="email" className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3" placeholder="El. paštas" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input type="password" className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3" placeholder="Slaptažodis" value={password} onChange={e=>setPassword(e.target.value)} required />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button disabled={loading} className="w-full rounded-2xl bg-white/90 text-black font-medium py-3 disabled:opacity-60">
          {loading ? '...' : (mode === 'login' ? 'Prisijungti' : 'Registruotis')}
        </button>
      </form>
    </div>
  )
}
