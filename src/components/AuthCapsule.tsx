import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthCapsule(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="fixed top-3 left-3 z-50">
      <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl px-3 py-1.5 shadow-lg">
        {!user && (<>
          <Link to="/login" className="px-2 py-1 text-xs font-medium text-white/80 hover:text-white">LOGIN</Link>
          <span className="text-white/20">|</span>
          <Link to="/register" className="px-2 py-1 text-xs font-semibold text-white hover:opacity-90">SIGN&nbsp;UP</Link>
        </>)}
        {user && (<>
          <button onClick={()=>navigate('/profile')} className="px-2 py-1 text-xs font-medium text-white/90 hover:text-white">
            PROFILE
          </button>
          <span className="text-white/20">|</span>
          <button onClick={logout} className="px-2 py-1 text-xs font-semibold text-white hover:opacity-90">
            LOGOUT
          </button>
        </>)}
      </div>
    </div>
  )
}