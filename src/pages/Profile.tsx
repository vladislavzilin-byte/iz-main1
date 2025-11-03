import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Profile(){
  const { user } = useAuth()
  if(!user){
    return (
      <div className="max-w-xl mx-auto mt-24 text-white/80 text-center">
        <div className="text-2xl font-semibold mb-2">Not logged in</div>
        <div className="text-white/60">Please <Link className='underline' to='/login'>log in</Link>.</div>
      </div>
    )
  }
  return (
    <div className="max-w-xl mx-auto mt-24 text-white/90">
      <div className="text-2xl font-semibold mb-4">Profile</div>
      <div className="grid grid-cols-1 gap-3 text-sm">
        <Row label="Name" value={user.name}/>
        <Row label="First name" value={user.firstName}/>
        <Row label="Last name" value={user.lastName}/>
        <Row label="Email" value={user.email}/>
        <Row label="Phone" value={user.phone}/>
        <Row label="Instagram" value={user.instagram}/>
        <Row label="Address" value={user.address}/>
      </div>
    </div>
  )
}
function Row({label, value}:{label:string; value?:string}){
  return (
    <div className="flex items-center justify-between border-b border-white/10 py-2">
      <div className="text-white/50">{label}</div>
      <div className="text-white/90">{value||'-'}</div>
    </div>
  )
}