import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Upload, Calculator, Clock, X, LogOut } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload' },
  { to: '/calculations', icon: Calculator, label: 'Calculations' },
  { to: '/history', icon: Clock, label: 'History' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-[#E5E4E7] flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-[#E5E4E7]">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={onClose}>
            <div className="w-8 h-8 bg-[#6C3CE1] rounded-lg flex items-center justify-center">
              <span className="text-white font-extrabold text-sm">TS</span>
            </div>
            <span className="text-lg font-extrabold text-[#1A1523] tracking-tight">TaxSight</span>
          </Link>
          <button className="lg:hidden text-[#8B8599] hover:text-[#1A1523]" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to === '/dashboard' && location.pathname === '/')
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-[#F4F0FC] text-[#6C3CE1]'
                    : 'text-[#8B8599] hover:bg-[#F8F7FA] hover:text-[#3D364A]'}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-[#E5E4E7]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-[#8B8599] hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
