// server/usersStore.js
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const USERS_PATH = resolve(process.cwd(), 'users.json')

function readAll() {
  if (!existsSync(USERS_PATH)) return []
  try {
    return JSON.parse(readFileSync(USERS_PATH, 'utf8'))
  } catch {
    return []
  }
}

function writeAll(users) {
  writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf8')
}

export function findByEmail(email) {
  const users = readAll()
  return users.find(u => (u.email || '').toLowerCase() == String(email).toLowerCase()) || null
}

export function createUser(user) {
  const users = readAll()
  users.push(user)
  writeAll(users)
  return user
}
