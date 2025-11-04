import { useState } from 'react'
import Auth from './components/Auth.jsx'
import Calendar from './components/Calendar.jsx'
import Admin from './components/Admin.jsx'
import { getCurrentUser } from './lib/storage'

export default function App() {
  const [user, setUser] = useState(getCurrentUser())
  const [tab, setTab] = useState('calendar')

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">IZ <span>Booking</span></div>
        <div style={{display:'flex', gap:8}}>
          <button className={tab==='calendar'?'':'ghost'} onClick={()=>setTab('calendar')}>Календарь</button>
          <button className={tab==='admin'?'':'ghost'} onClick={()=>setTab('admin')}>Админ</button>
        </div>
      </div>

      <Auth onAuth={setUser} />

      {tab==='calendar' && <Calendar />}
      {tab==='admin' && <Admin />}

      <div style={{marginTop:16}}>
        <small className="muted">
          Подсказка: админ-доступ по номеру, указанному в настройках («Админ» → «Телефон администратора»).
        </small>
      </div>
    </div>
  )
}
