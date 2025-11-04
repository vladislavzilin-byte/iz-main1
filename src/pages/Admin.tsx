import React, { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { loadBookings, updateBookingStatus } from '../lib/localdb'

const ADMIN_EMAIL = 'irina.abramova7@gmail.com'

export default function Admin(){
  const { user } = useAuth()
  const [version, setVersion] = useState(0)
  const rows = useMemo(()=> loadBookings().sort((a,b)=> (a.date+a.time).localeCompare(b.date+b.time)), [version])

  if(!user || user.email !== ADMIN_EMAIL){
    return (<div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 max-w-xl text-center">
        <div className="text-xl mb-2">Нет доступа</div>
        <div className="text-white/60">Для входа в админку используйте аккаунт: <span className="underline">{ADMIN_EMAIL}</span></div>
      </div>
    </div>)
  }

  function act(id: string, status: 'confirmed'|'cancelled'){ 
    updateBookingStatus(id, status); 
    setVersion(v=>v+1) 
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 md:p-10">
        <h1 className="text-3xl font-semibold mb-6">Админ · Заявки</h1>
        <div className="grid grid-cols-1 gap-3">
          {rows.length===0 && <div className="text-white/60">Заявок пока нет</div>}
          {rows.map(b=>(
            <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <div className="text-lg">{b.date} · {b.time} — <span className="text-white/80">{b.service}</span></div>
                <div className="text-white/70 text-sm">{b.name} · {b.phone || ''} · {b.instagram || ''}</div>
                <div className="text-white/50 text-xs">Статус: <b className="uppercase">{b.status}</b></div>
                {b.notes && <div className="text-white/60 text-sm">Комментарий: {b.notes}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={()=>act(b.id,'confirmed')} className="px-3 py-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20">Confirm</button>
                <button onClick={()=>act(b.id,'cancelled')} className="px-3 py-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
