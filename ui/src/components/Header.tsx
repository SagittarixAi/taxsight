import { Link } from 'react-router-dom'
import { Menu, Bell, User } from 'lucide-react'
import AiBadge from './AiBadge'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5E4E7] px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-[#8B8599] hover:text-[#1A1523] transition-colors"
            onClick={onMenuClick}
          >
            <Menu size={22} />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6C3CE1] rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">TS</span>
            </div>
            <span className="text-lg font-extrabold text-[#1A1523] tracking-tight hidden sm:block">TaxSight</span>
          </Link>
          <AiBadge />
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[#8B8599] hover:bg-[#F8F7FA] hover:text-[#3D364A] transition-all duration-200">
            <Bell size={18} />
          </button>
          <button className="w-9 h-9 rounded-lg bg-[#F4F0FC] flex items-center justify-center text-[#6C3CE1] hover:bg-[#E8DEF8] transition-all duration-200">
            <User size={18} />
          </button>
        </div>
      </div>
    </header>
  )
}
