import React from 'react'
import { useAuth } from '../auth/AuthContext'
import AuthCard from '../components/AuthCard'

export default function Portfolio() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <AuthCard />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-10 text-center max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Portfolio</h1>
          <button onClick={logout} className="text-sm text-white/70 underline">Atsijungti</button>
        </div>
        <p className="text-white/70">Sveikas, {user.name}! Čia bus tavo turinys.</p>
      </div>
    </div>
  )
}
