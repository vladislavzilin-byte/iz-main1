import { useMemo, useState } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isSameDay, format } from 'date-fns'
import { getBookings, saveBookings, getSettings, getCurrentUser, id, isSameMinute, fmtDate, fmtTime } from '../lib/storage'

function dayISO(d) { return new Date(d).toISOString().slice(0,10) }

export default function Calendar() {
  const settings = getSettings()
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [busy, setBusy] = useState(false)

  const minDate = new Date() // today
  const maxDate = addMonths(new Date(), 1) // one month ahead

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = useMemo(() => {
    const arr = []
    let d = gridStart
    while (d <= gridEnd) {
      arr.push(d)
      d = addDays(d, 1)
    }
    return arr
  }, [currentMonth])

  const bookings = getBookings()

  const slotsForDay = (d) => {
    const [sh, sm] = settings.workStart.split(':').map(Number)
    const [eh, em] = settings.workEnd.split(':').map(Number)
    const start = new Date(d); start.setHours(sh, sm, 0, 0)
    const end = new Date(d); end.setHours(eh, em, 0, 0)
    const slots = []
    let cur = new Date(start)
    while (cur <= end) {
      slots.push(new Date(cur))
      cur = new Date(cur.getTime() + settings.slotMinutes*60000)
    }
    const isWorkDay = settings.workDays.includes(new Date(d).getDay())
    const isBlocked = settings.blockedDates.includes(dayISO(d))
    if (!isWorkDay || isBlocked) return []
    if (d < new Date(minDate.toDateString()) || d > maxDate) return []
    return slots
  }

  const isBooked = (date) => bookings.some(b => isSameMinute(b.start, date))

  const book = (start) => {
    const user = getCurrentUser()
    if (!user) return alert('Войдите или зарегистрируйтесь')
    if (!start) return
    if (isBooked(start)) return alert('Этот слот уже занят')
    setBusy(true)
    const end = new Date(start); end.setMinutes(end.getMinutes() + settings.slotMinutes)
    const newB = { id: id(), userPhone: user.phone, userName: user.name, userInstagram: user.instagram || '', start, end, createdAt: new Date().toISOString() }
    saveBookings([ ...bookings, newB ])
    setBusy(false)
    alert('Бронь подтверждена!')
  }

  const goPrev = () => setCurrentMonth(addMonths(currentMonth, -1))
  const goNext = () => setCurrentMonth(addMonths(currentMonth, 1))

  return (
    <div className="card">
      <div style={{display:'flex', gap:8, alignItems:'center', justifyContent:'space-between'}}>
        <button className="ghost" onClick={goPrev}>← Месяц</button>
        <div className="badge">{format(currentMonth, 'LLLL yyyy')}</div>
        <button className="ghost" onClick={goNext}>Месяц →</button>
      </div>

      <div className="hr" />

      {/* Month grid */}
      <div className="grid" style={{gridTemplateColumns:'repeat(7, 1fr)'}}>
        {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((w,i)=>(
          <div key={i} className="muted" style={{textAlign:'center', fontWeight:600, padding:'6px 0'}}>{w}</div>
        ))}
        {days.map((d, idx) => {
          const inMonth = isSameMonth(d, monthStart)
          const isActive = isSameDay(d, selectedDate)
          const disabled = d < new Date(minDate.toDateString()) || d > maxDate
          return (
            <div key={idx} className={"datebtn " + (isActive?'active':'')} onClick={()=>!disabled && setSelectedDate(d)}
              style={{opacity: inMonth ? 1 : .4, pointerEvents: disabled ? 'none':'auto'}}>
              {format(d, 'd')}
            </div>
          )
        })}
      </div>

      <div className="hr" />

      {/* Slots for selected date */}
      <div>
        <div className="badge">Слоты на {format(selectedDate, 'dd.MM.yyyy')}</div>
        <div className="row" style={{marginTop:8}}>
          <div className="col">
            <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
              {slotsForDay(selectedDate).map(t => {
                const taken = isBooked(t)
                return (
                  <button key={t.toISOString()} disabled={taken || busy} className={taken?'ghost':'ok'} onClick={()=>book(t)}>
                    {format(t, 'HH:mm')}{taken?' — занято':''}
                  </button>
                )
              })}
              {!slotsForDay(selectedDate).length && <small className="muted">Нет доступных слотов для этой даты</small>}
            </div>
          </div>
          <div className="col">
            {/* My bookings table */}
            {getCurrentUser() && (
              <div className="card">
                <h4 style={{marginTop:0}}>Мои записи</h4>
                <table className="table">
                  <thead><tr><th>Дата</th><th>Время</th></tr></thead>
                  <tbody>
                    {getBookings().filter(b=>b.userPhone===getCurrentUser().phone).sort((a,b)=> new Date(a.start)-new Date(b.start)).map(b=> (
                      <tr key={b.id}><td>{fmtDate(b.start)}</td><td>{fmtTime(b.start)}–{fmtTime(b.end)}</td></tr>
                    ))}
                    {!getBookings().some(b=>b.userPhone===getCurrentUser().phone) && (
                      <tr><td colSpan="2"><small className="muted">Нет записей</small></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
