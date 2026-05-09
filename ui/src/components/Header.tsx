import { Link } from 'react-router-dom'
import { Menu, Bell, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../api/client'
import AiBadge from './AiBadge'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    api.get('/auth/me').then((res) => {
      setUserName(res.data.full_name || res.data.email || '')
    }).catch(() => {})
  }, [])
  return (
    <header className="sticky top-0 z-30 bg-surface-white border-b border-border px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-ink-muted hover:text-ink transition-colors"
            onClick={onMenuClick}
          >
            <Menu size={22} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">TS</span>
            </div>
            <span className="font-display text-lg font-extrabold text-ink tracking-tight hidden sm:block">TaxSight</span>
          </Link>
          <AiBadge />
        </div>
        <div className="flex items-center gap-3">
          {userName && (
            <span className="text-sm font-medium text-ink-muted hidden sm:block">{userName}</span>
          )}
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-muted hover:bg-surface hover:text-ink-light transition-all duration-200">
            <Bell size={18} />
          </button>
          <button className="w-9 h-9 rounded-lg bg-primary-bg flex items-center justify-center text-primary hover:bg-primary-bg/80 transition-all duration-200">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
