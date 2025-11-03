import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPills(){
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout(){
    logout()
    navigate('/')
  }

  const base = 'px-4 py-1 rounded-full border border-white/20 bg-white/10 text-white/80 hover:text-white hover:bg-white/15 backdrop-blur transition text-xs'

  return (
    <div className="fixed top-3 left-3 z-50 flex gap-2">
      {!user && (
        <>
          <Link to="/login" className={base}>LOGIN</Link>
          <Link to="/register" className={base}>SIGN UP</Link>
        </>
      )}
      {user && (
        <>
          <Link to="/profile" className={base}>PROFILE</Link>
          <button onClick={handleLogout} className={base}>LOGOUT</button>
        </>
      )}
    </div>
  )
}
