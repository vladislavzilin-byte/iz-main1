import React from 'react'
import AccountPill from './AccountPill'

export default function HeaderBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 flex items-start justify-between px-4 py-4 pointer-events-none">
      <div className="pointer-events-auto">
        <AccountPill />
      </div>
      <div className="pointer-events-auto">
        {/* place your existing language menu here */}
      </div>
    </div>
  )
}
