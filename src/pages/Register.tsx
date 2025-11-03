import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [instagram, setInstagram] = useState('')
  const [phone, setPhone] = useState('')

  // address (Google style)
  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')

  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await register({
      name,
      email,
      password,
      instagram,
      phone,
      address: {
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
      },
    })
    if (!res.ok) {
      setError(res.error || 'Registration error')
    } else {
      navigate('/shop')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8 shadow-[0_40px_140px_-10px_rgba(255,255,255,0.2)]">
        <h1 className="text-2xl font-semibold text-center mb-6">Create account</h1>

        {error && <div className="text-red-400 mb-3 text-sm text-center">{error}</div>}

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <label className="block text-xs text-white/60 mb-1">Name</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Instagram handle</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="@your.ig"
              value={instagram}
              onChange={e => setInstagram(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Phone</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="+370..."
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <div className="text-sm font-medium mb-2">Address</div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-white/60 mb-1">Address line 1</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="Street address, house number"
              value={line1}
              onChange={e => setLine1(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-white/60 mb-1">Address line 2</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="Apartment, suite, unit, etc. (optional)"
              value={line2}
              onChange={e => setLine2(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">City</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="City"
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">State / Region</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="State / Region"
              value={state}
              onChange={e => setState(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Postal code</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="e.g. 01100"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">Country</label>
            <input
              className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-white/40"
              placeholder="Country"
              value={country}
              onChange={e => setCountry(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full relative overflow-hidden rounded-2xl px-4 py-3 text-sm font-medium text-white bg-white/15 hover:bg-white/20 border border-white/20 backdrop-blur-xl transition-all active:scale-[0.98] shadow-[0_30px_120px_rgba(255,255,255,0.25)]"
            >
              <span className="relative z-10 tracking-wide">Sign up</span>
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </form>

        <div className="text-center text-white/40 text-xs mt-6">
          Already have account? <Link to="/login" className="text-white/70 hover:text-white underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
