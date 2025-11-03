import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Profile(){
  const { user } = useAuth()
  if(!user){
    return <div className="p-6 text-white/80">Пожалуйста, войдите в систему.</div>
  }
  return (
    <div className="min-h-[60vh] flex items-start justify-center pt-24">
      <div className="w-[92%] max-w-md bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6 text-white">
        <h1 className="text-xl font-semibold mb-4">Профиль</h1>
        <div className="space-y-3 text-sm">
          <div><span className="text-white/50">Имя:</span> {user.name || '-'}</div>
          <div><span className="text-white/50">Фамилия:</span> {user.lastName || '-'}</div>
          <div><span className="text-white/50">Email:</span> {user.email || '-'}</div>
          <div><span className="text-white/50">Телефон:</span> {user.phone || '-'}</div>
          <div><span className="text-white/50">Instagram:</span> {user.instagram || '-'}</div>
          <div><span className="text-white/50">Адрес:</span> {user.address || '-'}</div>
        </div>
      </div>
    </div>
  )
}
