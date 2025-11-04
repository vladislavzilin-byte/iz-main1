const LS_USERS = 'iz.users.v1'
const LS_BOOKINGS = 'iz.bookings.v1'
const LS_CURRENT = 'iz.current.v1'
const LS_SETTINGS = 'iz.settings.v1'

export function getUsers() {
  return JSON.parse(localStorage.getItem(LS_USERS) || '[]')
}
export function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users))
}
export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(LS_CURRENT) || 'null')
}
export function setCurrentUser(user) {
  if (user) localStorage.setItem(LS_CURRENT, JSON.stringify(user)); else localStorage.removeItem(LS_CURRENT)
}
export function getBookings() {
  return JSON.parse(localStorage.getItem(LS_BOOKINGS) || '[]')
}
export function saveBookings(b) {
  localStorage.setItem(LS_BOOKINGS, JSON.stringify(b))
}
export function getSettings() {
  const def = {
    masterName: 'IZ HAIR TREND',
    slotMinutes: 60,
    workDays: [1,2,3,4,5], // Mon-Fri
    workStart: '10:00',
    workEnd: '19:00',
    blockedDates: [], // '2025-11-10'
    adminPhone: '+37060000000'
  }
  const v = JSON.parse(localStorage.getItem(LS_SETTINGS) || 'null')
  return v || def
}
export function saveSettings(s) {
  localStorage.setItem(LS_SETTINGS, JSON.stringify(s))
}

// Helpers
export function id() { return crypto.randomUUID() }
export function isSameMinute(a,b) { return new Date(a).toISOString().slice(0,16) === new Date(b).toISOString().slice(0,16) }
export function fmtDate(d) { return new Date(d).toLocaleDateString(undefined, { day:'2-digit', month:'2-digit', year:'numeric' }) }
export function fmtTime(d) { return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
