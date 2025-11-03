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

  const [line1, setLine1] = useState('')
  const [line2, setLine2] = useState('')
  const [city, setCity] = useState('')
  const [region, setRegion] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')

  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const res = await register({
      name, email, password, instagram, phone,
      address: { line1, line2, city, region, postalCode, country }
    })
    if (!res.ok) setError(res.error || 'Registration error')
    else navigate('/shop')
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-6">Create account</h1>
        {error && <div className="text-red-400 text-sm mb-3 text-center">{error}</div>}

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="col-span-1 md:col-span-2 bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={4} />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Instagram @handle" value={instagram} onChange={e=>setInstagram(e.target.value)} />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Phone (+370...)" value={phone} onChange={e=>setPhone(e.target.value)} />

          <div className="col-span-1 md:col-span-2 mt-2 text-white/60 text-xs">Address</div>
          <input className="col-span-1 md:col-span-2 bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Address line 1" value={line1} onChange={e=>setLine1(e.target.value)} required />
          <input className="col-span-1 md:col-span-2 bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Address line 2 (optional)" value={line2} onChange={e=>setLine2(e.target.value)} />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="City" value={city} onChange={e=>setCity(e.target.value)} required />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Region / State" value={region} onChange={e=>setRegion(e.target.value)} />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Postal code" value={postalCode} onChange={e=>setPostalCode(e.target.value)} required />
          <input className="bg-black/40 border border-white/20 rounded-xl p-2 text-sm" placeholder="Country" value={country} onChange={e=>setCountry(e.target.value)} required />

          <button className="col-span-1 md:col-span-2 mt-2 bg-white/15 hover:bg-white/20 border border-white/20 rounded-xl py-3 text-sm font-medium" type="submit">
            Sign up
          </button>
        </form>

        <div className="text-center text-white/40 text-xs mt-6">
          Already have account? <Link to="/login" className="text-white/70 hover:text-white underline">Log in</Link>
        </div>
      </div>
    </div>
  )
}
