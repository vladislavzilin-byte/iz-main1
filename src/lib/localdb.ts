// src/lib/localdb.ts
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export type Booking = {
  id: string
  userEmail: string
  name: string
  phone?: string
  instagram?: string
  service: string
  date: string    // YYYY-MM-DD
  time: string    // HH:mm
  durationMin: number
  notes?: string
  status: BookingStatus
  createdAt: string
}

const USERS_KEY = 'users'
const BOOKINGS_KEY = 'bookings'

export function loadUsers(): any[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') } catch { return [] }
}
export function saveUsers(users: any[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadBookings(): Booking[] {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]') } catch { return [] }
}
export function saveBookings(rows: Booking[]) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(rows))
}

export function upsertBooking(b: Booking){
  const rows = loadBookings()
  const idx = rows.findIndex(r => r.id === b.id)
  if(idx >= 0) rows[idx] = b; else rows.push(b)
  saveBookings(rows)
}

export function updateBookingStatus(id: string, status: BookingStatus){
  const rows = loadBookings().map(r => r.id === id ? {...r, status} : r)
  saveBookings(rows)
}

export function uuid(){
  // simple uuid v4-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c=>{
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8)
    return v.toString(16)
  })
}
