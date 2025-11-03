import React from 'react'
import AccountPill from './AccountPill'

export default function Header() {
  return (
    <header className="fixed top-4 left-4 z-40 pointer-events-none">
      <div className="pointer-events-auto">
        <AccountPill />
      </div>
    </header>
  )
}
