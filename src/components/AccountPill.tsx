import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AccountPill() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState<string>('')

  const pillClass =
    'inline-flex items-center gap-1 rounded-2xl bg-black/70 border border-white/10 px-1 py-1 text-[12px] text-white/80 shadow-sm backdrop-blur-md'

  const btnClass = (isActive: boolean) =>
    'px-3 py-1 rounded-xl transition ' + (
      isActive ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white/90'
    )

  function go(path: string) {
    setActive(path)
    navigate(path)
    setTimeout(() => setActive(''), 300)
  }

  if (!user) {
    return (
      <div className={pillClass} role="group" aria-label="Account segmented">
        <button className={btnClass(active==='login')} onClick={() => go('/login')}>
          Login
        </button>
        <button className={btnClass(active==='register')} onClick={() => go('/register')}>
          Register
        </button>
      </div>
    )
  }

  return (
    <div className={pillClass} role="group" aria-label="Account segmented">
      <button className={btnClass(active==='profile')} onClick={() => go('/profile')}>
        {user.name ? (user.name.split(' ')[0]) : 'Profile'}
      </button>
      <button
        className={btnClass(active==='logout')}
        onClick={() => {
          setActive('logout')
          logout()
          setTimeout(() => setActive(''), 300)
        }}
      >
        Logout
      </button>
    </div>
  )
}
