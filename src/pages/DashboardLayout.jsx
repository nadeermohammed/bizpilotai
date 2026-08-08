import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Sparkles,
  LayoutDashboard,
  Mail,
  FileText,
  Percent,
  Briefcase,
  FileUser,
  Wand2,
  MessageSquare,
  FilePenLine,
  Coins,
  MessageCircle,
  FileUp,
  ScanLine,
  LogOut,
  Menu,
  X,
  CreditCard,
  Building,
  Settings as SettingsIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

const navItems = [
  { path: '/dashboard', label: 'Dashboard Home', icon: LayoutDashboard, end: true },
  { path: '/dashboard/email', label: 'AI Email Writer', icon: Mail },
  { path: '/dashboard/invoice', label: 'AI Invoice Generator', icon: FileText },
  { path: '/dashboard/gst', label: 'GST Calculator', icon: Percent },
  { path: '/dashboard/quotation', label: 'AI Quotation Generator', icon: Briefcase },
  { path: '/dashboard/resume', label: 'AI Resume Builder', icon: FileUser },
  { path: '/dashboard/business-name', label: 'Business Name Gen', icon: Wand2 },
  { path: '/dashboard/whatsapp', label: 'WhatsApp Reply', icon: MessageSquare },
  { path: '/dashboard/proposal', label: 'AI Proposal Writer', icon: FilePenLine },
  { path: '/dashboard/captions', label: 'Caption Generator', icon: Sparkles },
  { path: '/dashboard/meeting', label: 'Meeting Summarizer', icon: FileText },
  { path: '/dashboard/expenses', label: 'Expense Tracker', icon: Coins },
  { path: '/dashboard/chat', label: 'AI Chat Assistant', icon: MessageCircle },
  { path: '/dashboard/pdf-converter', label: 'PDF to Excel Tool', icon: FileUp },
  { path: '/dashboard/ocr', label: 'OCR Scanner Tool', icon: ScanLine },
  { path: '/dashboard/settings', label: 'System Settings', icon: SettingsIcon },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  // Get active path name for breadcrumbs / title
  const activeItem = navItems.find(item => item.path === location.pathname)
  const pageTitle = activeItem ? activeItem.label : 'AI Toolkit'

  return (
    <div className="min-h-screen bg-[#f1f4f9] text-slate-800 flex">
      {/* Mobile Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      ></div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar flex flex-col justify-between ${mobileOpen ? 'open' : ''}`}>
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-blue-100 flex items-center justify-between">
            <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 text-decoration-none">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-slate-800">BizPilot <span className="text-blue-600">AI</span></span>
            </Link>
            <button className="md:hidden text-slate-400 hover:text-slate-600" onClick={() => setMobileOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-0.5 overflow-y-auto max-h-[70vh]">
            {navItems.map((item, idx) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-blue-100 bg-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'User'}</h4>
              <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                <Building className="w-3 h-3 text-blue-500 shrink-0" /> {user?.businessName || 'Business'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-left text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-4.5 h-4.5 text-red-500 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-blue-100 bg-white/80 flex items-center justify-between px-6 sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-slate-500 hover:text-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-md font-display font-semibold text-slate-800 tracking-wide">{pageTitle}</h2>
          </div>

          {/* Credits Counter */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-200/50 rounded-xl px-3 py-1.5 text-xs text-blue-700">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Credits: <strong>{user?.credits ?? 50} / 50</strong></span>
            </div>
            <div className="px-2.5 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-200 text-blue-800 rounded-lg text-[10px] font-bold tracking-wider uppercase">
              {user?.tier || 'Free'} Tier
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
