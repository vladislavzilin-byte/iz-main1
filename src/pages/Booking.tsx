import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { format, addMinutes, setHours, setMinutes, isBefore } from 'date-fns'
import { uuid, loadBookings, upsertBooking } from '../lib/localdb'

const SERVICES = [
  { id: 'style-updo', name: 'Šukuosena / Updo', duration: 60 },
  { id: 'style-bridal', name: 'Vestuvinė šukuosena', duration: 90 },
  { id: 'consult', name: 'Konsultacija', duration: 30 },
]

const WORKDAY = { startHour: 10, endHour: 19 } // 10:00 – 19:00

function makeSlots(date: Date){
  const slots: string[] = []
  let t = setMinutes(setHours(date, WORKDAY.startHour), 0)
  const end = setMinutes(setHours(date, WORKDAY.endHour), 0)
  while(isBefore(t, end)){
    slots.push(format(t, 'HH:mm'))
    t = addMinutes(t, 15)
  }
  return slots
}

export default function Booking(){
  const { user } = useAuth()
  const [date, setDate] = useState(new Date())
  const [serviceId, setServiceId] = useState(SERVICES[0].id)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [instagram, setInstagram] = useState(user?.instagram || '')
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const duration = useMemo(()=> SERVICES.find(s=>s.id===serviceId)?.duration ?? 60, [serviceId])
  const slots = useMemo(()=> makeSlots(date), [date])

  const availableSlots = useMemo(()=>{
    const blocked = new Set(busy)
    return slots.filter(s=>{
      const startIndex = slots.indexOf(s)
      const steps = Math.ceil(duration / 15)
      for(let i=0;i<steps;i++){
        const val = slots[startIndex + i]
        if(!val || blocked.has(val)) return false
      }
      return true
    })
  }, [slots, busy, duration])

  useEffect(()=>{
    const yyyy = format(date, 'yyyy-MM-dd')
    const rows = loadBookings().filter(b => b.date === yyyy && (b.status==='pending'||b.status==='confirmed'))
    const blocked = new Set<string>()
    for(const b of rows){
      const start = b.time
      const steps = Math.ceil((b.durationMin ?? 60) / 15)
      const idx = slots.indexOf(start)
      for(let i=0;i<steps;i++){
        const val = slots[idx + i]
        if(val) blocked.add(val)
      }
    }
    setBusy(Array.from(blocked))
  }, [date])

  async function submit(slot: string){
    if(!user){ setErr('Нужно войти в аккаунт, чтобы записаться.'); return }
    setSaving(true); setErr(null); setOk(null)
    const payload = {
      id: uuid(),
      userEmail: user.email,
      name: name || user.name,
      phone: phone || user.phone || '',
      instagram: instagram || user.instagram || '',
      service: SERVICES.find(s=>s.id===serviceId)?.name || serviceId,
      date: format(date, 'yyyy-MM-dd'),
      time: slot,
      durationMin: duration,
      notes,
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    }
    try{
      upsertBooking(payload as any)
      setOk('Заявка отправлена! Я свяжусь для подтверждения.')
      setNotes('')
    }catch(e:any){
      setErr(e?.message || 'Ошибка при сохранении')
    }finally{
      setSaving(false)
    }
  }

  function DayButton({d}:{d:Date}){
    const isActive = d.toDateString() === date.toDateString()
    return (
      <button onClick={()=>setDate(d)} className={['px-3 py-2 rounded-xl border text-sm', isActive?'bg-white/20 border-white/30':'bg-white/5 border-white/10 hover:bg-white/10'].join(' ')}>
        {format(d,'d MMM')}
      </button>
    )
  }

  const days = Array.from({length:14}, (_,i)=>{ const t=new Date(); t.setDate(t.getDate()+i); return t })

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 md:p-10">
        <h1 className="text-3xl font-semibold mb-6">Запись к мастеру</h1>

        {!user && <div className="mb-6 text-sm text-red-300">Чтобы записаться, войдите в аккаунт на странице <a href="/login" className="underline">Login</a>.</div>}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 space-y-3">
            <div className="text-sm text-white/60">Ближайшие даты</div>
            <div className="flex flex-wrap gap-2">
              {days.map((d,i)=>(<DayButton key={i} d={d}/>))}
            </div>
          </div>
          <div className="md:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <label className="col-span-2 text-sm text-white/60">Услуга</label>
              <select value={serviceId} onChange={e=>setServiceId(e.target.value)} className="col-span-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2 focus:outline-none">
                {SERVICES.map(s=>(<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>

              <label className="col-span-2 text-sm text-white/60">Контакты (для связи)</label>
              <input value={name} onChange={e=>setName(e.target.value)} className="col-span-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2" placeholder="Имя"/>
              <input value={phone} onChange={e=>setPhone(e.target.value)} className="bg-white/10 border border-white/10 rounded-xl px-3 py-2" placeholder="Телефон"/>
              <input value={instagram} onChange={e=>setInstagram(e.target.value)} className="bg-white/10 border border-white/10 rounded-xl px-3 py-2" placeholder="Instagram (@...)"/>

              <label className="col-span-2 text-sm text-white/60">Пожелания</label>
              <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="col-span-2 bg-white/10 border border-white/10 rounded-xl px-3 py-2" rows={3} placeholder="Например: локоны до плеч" />
            </div>

            <div>
              <div className="text-sm text-white/60 mb-2">Доступное время</div>
              <div className="flex flex-wrap gap-2">
                {availableSlots.length===0 && <div className="text-white/50 text-sm">Нет свободных слотов в этот день</div>}
                {availableSlots.map(s=>(
                  <button key={s} disabled={saving || !user} onClick={()=>submit(s)}
                    className="px-3 py-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 disabled:opacity-50">
                    {s}
                  </button>
                ))}
              </div>
              {err && <div className="text-red-400 mt-3 text-sm">{err}</div>}
              {ok && <div className="text-green-400 mt-3 text-sm">{ok}</div>}
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs text-white/40">После отправки заявки мы подтвердим время в личных сообщениях.</p>
      </div>
    </div>
  )
}
