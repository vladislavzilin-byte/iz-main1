import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

/**
 * Language-style segmented pill for account actions.
 * - Logged out: segments [Login] [Sign up]
 * - Logged in : segments [Profile] [Logout]
 */
export default function AccountPill() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const wrapper =
    'inline-flex items-center rounded-2xl bg-white/5 border border-white/15 p-1 backdrop-blur-xl shadow-[0_10px_40px_rgba(255,255,255,0.15)]'
  const segBase =
    'px-3 py-1.5 text-[11px] font-semibold tracking-wide rounded-xl transition-colors select-none'
  const segInactive = 'text-white/70 hover:text-white hover:bg-white/10'
  const segActive = 'text-white bg-white/15'

  if (!user) {
    return (
      <div className={wrapper}>
        <button
          className={[segBase, segActive].join(' ')}
          onClick={() => navigate('/login')}
        >
          LOGIN
        </button>
        <button
          className={[segBase, segInactive].join(' ')}
          onClick={() => navigate('/register')}
        >
          SIGN&nbsp;UP
        </button>
      </div>
    )
  }

  return (
    <div className={wrapper}>
      <button
        className={[segBase, segActive].join(' ')}
        onClick={() => navigate('/login')}
        title={user.email}
      >
        {user.name?.split(' ')[0] || 'PROFILE'}
      </button>
      <button
        className={[segBase, segInactive, 'text-red-300 hover:text-red-200'].join(' ')}
        onClick={() => logout()}
      >
        LOGOUT
      </button>
    </div>
  )
}
