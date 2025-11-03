import React, { createContext, useContext, useEffect, useState } from 'react'

export type Address = {
  line1: string
  line2?: string
  city: string
  region?: string
  postalCode: string
  country: string
}

export type User = {
  id: string
  name: string
  email: string
  password?: string
  instagram?: string
  phone?: string
  address?: Address
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
  register: (data: {
    name: string
    email: string
    password: string
    instagram?: string
    phone?: string
    address: Address
  }) => Promise<{ ok: boolean; error?: string }>
  updateProfile: (data: Partial<Omit<User, 'id' | 'email'>> & { address?: Partial<Address> }) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_KEY = 'iz_users_v2'
const SESSION_KEY = 'iz_session_v2'

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}
function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}
function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY)
}
function saveSession(userId: string | null) {
  if (userId) localStorage.setItem(SESSION_KEY, userId)
  else localStorage.removeItem(SESSION_KEY)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const users = loadUsers()
    const currentId = loadSession()
    if (currentId) {
      const u = users.find(u => u.id === currentId)
      if (u) setUser(u)
    }
  }, [])

  async function register(data: {
    name: string
    email: string
    password: string
    instagram?: string
    phone?: string
    address: Address
  }) {
    const users = loadUsers()
    const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase())
    if (exists) return { ok: false, error: 'Email already registered' }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      instagram: data.instagram || '',
      phone: data.phone || '',
      address: data.address,
    }
    users.push(newUser)
    saveUsers(users)
    saveSession(newUser.id)
    setUser(newUser)
    return { ok: true }
  }

  async function login(email: string, password: string) {
    const users = loadUsers()
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!found) return { ok: false, error: 'Wrong email or password' }
    saveSession(found.id)
    setUser(found)
    return { ok: true }
  }

  function logout() {
    saveSession(null)
    setUser(null)
  }

  function updateProfile(data: Partial<Omit<User, 'id' | 'email'>> & { address?: Partial<Address> }) {
    setUser(prev => {
      if (!prev) return prev
      const users = loadUsers()
      const idx = users.findIndex(u => u.id === prev.id)
      if (idx === -1) return prev
      const next: User = {
        ...prev,
        ...data,
        address: { ...prev.address, ...(data.address || {}) } as Address,
      }
      users[idx] = next
      saveUsers(users)
      return next
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
