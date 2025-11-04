import { addDays, startOfWeek, format, addMinutes, isBefore, isEqual } from 'date-fns'
import { useMemo, useState } from 'react'
import { getBookings, saveBookings, getSettings, getCurrentUser, id, isSameMinute, fmtDate, fmtTime } from '../lib/storage'

function dayISO(d) { return new Date(d).toISOString().slice(0,10) }

export default function Calendar() {
  const settings = getSettings()
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selected, setSelected] = useState(null)
  const [busy, setBusy] = useState(false)

  const days = useMemo(() => Array.from({length:7},(_,i)=> addDays(weekStart,i)), [weekStart])
  const slotsByDay = useMemo(() => {
    const res = {}
    const [sh, sm] = settings.workStart.split(':').map(Number)
    const [eh, em] = settings.workEnd.split(':').map(Number)
    for (const d of days) {
      const isWork = settings.workDays.includes(d.getDay())
      const blocked = settings.blockedDates.includes(dayISO(d))
      res[dayISO(d)] = []
      if (!isWork || blocked) continue
      const start = new Date(d); start.setHours(sh, sm, 0, 0)
      const end = new Date(d); end.setHours(eh, em, 0, 0)
      let cur = start
      while (!isBefore(end, cur)) {
        res[dayISO(d)].push(new Date(cur))
        cur = addMinutes(cur, settings.slotMinutes)
      }
    }
    return res
  }, [days, settings])

  const bookings = getBookings()

  const isBooked = (date) => {
    return bookings.some(b => isSameMinute(b.start, date))
  }

  const book = () => {
    const user = getCurrentUser()
    if (!user) return alert('Войдите или зарегистрируйтесь')
    if (!selected) return
    setBusy(true)
    const start = selected
    if (isBooked(start)) { setBusy(false); return alert('Этот слот уже занят') }
    const end = new Date(start); end.setMinutes(end.getMinutes() + settings.slotMinutes)
    const newB = { id: id(), userPhone: user.phone, userName: user.name, start, end, createdAt: new Date().toISOString() }
    saveBookings([ ...bookings, newB ])
    setBusy(false)
    alert('Бронь подтверждена!')
  }

  const my = getCurrentUser()

  return (
    <div className="card">
      <div className="row">
        <div className="col">
          <div style={{display:'flex', gap:8, alignItems:'center', justifyContent:'space-between'}}>
            <button className="ghost" onClick={()=>setWeekStart(addDays(weekStart, -7))}>← Неделя</button>
            <div className="badge">
              {format(days[0], 'dd.MM.yyyy')} – {format(days[6], 'dd.MM.yyyy')}
            </div>
            <button className="ghost" onClick={()=>setWeekStart(addDays(weekStart, 7))}>Неделя →</button>
          </div>
          <div className="hr" />
          <div className="grid">
            {days.map(d => {
              const key = dayISO(d)
              return (
                <div key={key} className="col">
                  <div className={"datebtn " + (selected && dayISO(selected)===key ? 'active':'')} onClick={()=>setSelected(null)}>
                    {format(d, 'EEEE dd.MM', { locale: undefined })}
                  </div>
                  <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:8}}>
                    {slotsByDay[key].map(t => {
                      const taken = isBooked(t)
                      const isSel = selected && isEqual(selected, t)
                      return (
                        <div key={t.toISOString()} className={"slot "+(taken?'booked':'')+" "+(isSel?'selected':'')} onClick={()=> !taken && setSelected(t)}>
                          {format(t, 'HH:mm')}
                        </div>
                      )
                    })}
                    {!slotsByDay[key].length && (
                      <small className="muted">Выходной/нет слотов</small>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="col">
          <div className="card">
            <h3 style={{marginTop:0}}>Бронирование</h3>
            <p><small className="muted">Мастер: {settings.masterName}</small></p>
            <p><b>Выбрано:</b> {selected ? (fmtDate(selected)+' '+fmtTime(selected)) : 'выберите слот'}</p>
            <div className="row">
              <div className="col">
                <button className="ok" disabled={!selected || busy} onClick={book}>Подтвердить запись</button>
              </div>
              <div className="col">
                <button className="ghost" onClick={()=>setSelected(null)}>Сбросить</button>
              </div>
            </div>
            {my && (
              <>
                <div className="hr" />
                <h4 style={{marginTop:0}}>Мои записи</h4>
                <table className="table">
                  <thead><tr><th>Дата</th><th>Время</th></tr></thead>
                  <tbody>
                    {getBookings().filter(b=>b.userPhone===my.phone).sort((a,b)=> new Date(a.start)-new Date(b.start)).map(b=> (
                      <tr key={b.id}><td>{fmtDate(b.start)}</td><td>{fmtTime(b.start)}–{fmtTime(b.end)}</td></tr>
                    ))}
                    {!getBookings().some(b=>b.userPhone===my.phone) && (
                      <tr><td colSpan="2"><small className="muted">Нет записей</small></td></tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
