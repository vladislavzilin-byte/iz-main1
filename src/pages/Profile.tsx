import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
        <div className="text-white/70">You are not logged in.</div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-8">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="space-y-2 text-sm">
          <div><span className="text-white/50">Name:</span> {user.name}</div>
          <div><span className="text-white/50">Email:</span> {user.email}</div>
          {user.instagram && <div><span className="text-white/50">Instagram:</span> {user.instagram}</div>}
          {user.phone && <div><span className="text-white/50">Phone:</span> {user.phone}</div>}
          {user.address && (
            <div className="mt-3">
              <div className="text-white/60 text-xs mb-1">Address</div>
              <div>{user.address.line1}</div>
              {user.address.line2 && <div>{user.address.line2}</div>}
              <div>{user.address.city}{user.address.region ? ', ' + user.address.region : ''}</div>
              <div>{user.address.postalCode}, {user.address.country}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
