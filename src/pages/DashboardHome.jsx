import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Search,
  Sparkles,
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
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react'

const toolsData = [
  { path: '/dashboard/email', label: 'AI Email Writer', icon: Mail, category: 'Communication', desc: 'Draft professional emails in seconds with custom styles and tone.' },
  { path: '/dashboard/invoice', label: 'AI Invoice Generator', icon: FileText, category: 'Finance', desc: 'Create beautiful, compliant GST invoices and download instantly.' },
  { path: '/dashboard/gst', label: 'GST Calculator', icon: Percent, category: 'Finance', desc: 'Calculate CGST, SGST, IGST ledger breakdown based on tax slabs.' },
  { path: '/dashboard/quotation', label: 'AI Quotation Generator', icon: Briefcase, category: 'Business', desc: 'Generate professional quotations and estimates for prospective clients.' },
  { path: '/dashboard/resume', label: 'AI Resume Builder', icon: FileUser, category: 'Personal', desc: 'Build job-winning professional resumes and cover layouts.' },
  { path: '/dashboard/business-name', label: 'Business Name Gen', icon: Wand2, category: 'Creative', desc: 'Generate unique brand names, matching slogans, and domain checks.' },
  { path: '/dashboard/whatsapp', label: 'WhatsApp Reply', icon: MessageSquare, category: 'Communication', desc: 'Generate customer support and social responses in multiple tones.' },
  { path: '/dashboard/proposal', label: 'AI Proposal Writer', icon: FilePenLine, category: 'Business', desc: 'Draft comprehensive, structured project proposals for clients.' },
  { path: '/dashboard/captions', label: 'Caption Generator', icon: Sparkles, category: 'Marketing', desc: 'Generate engaging captions and hashtags for social media growth.' },
  { path: '/dashboard/meeting', label: 'Meeting Summarizer', icon: FileText, category: 'Communication', desc: 'Convert transcripts or rough meeting notes into formatted summaries.' },
  { path: '/dashboard/expenses', label: 'Expense Tracker', icon: Coins, category: 'Finance', desc: 'Log sales, track business expenses, and view visual category logs.' },
  { path: '/dashboard/chat', label: 'AI Chat Assistant', icon: MessageCircle, category: 'Assistant', desc: 'Brainstorm business growth ideas or chat with an AI consultant.' },
  { path: '/dashboard/pdf-converter', label: 'PDF to Excel Tool', icon: FileUp, category: 'Utility', desc: 'Extract data tables from PDF documents into spreadsheet grids.' },
  { path: '/dashboard/ocr', label: 'OCR Scanner Tool', icon: ScanLine, category: 'Utility', desc: 'Extract numbers, dates, and amounts from receipt or invoice images.' },
]

export default function DashboardHome() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Communication', 'Finance', 'Business', 'Marketing', 'Creative', 'Utility']

  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.desc.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'All' || tool.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col gap-8 fade-in">
      {/* Welcome Banner */}
      <div className="rounded-3xl glass border border-blue-200 p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
        </div>

        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-2">
            Hello, {user?.name || 'Entrepreneur'}! <Sparkles className="w-6 h-6 text-blue-500" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            What business task would you like to automate with AI today?
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-center">
            <span className="text-xs text-slate-400 block">AI Tier</span>
            <span className="text-md font-bold text-slate-800 font-display uppercase tracking-wider">{user?.tier || 'Free'}</span>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-3 text-center">
            <span className="text-xs text-slate-400 block">Available Credits</span>
            <span className="text-md font-bold text-blue-600 font-display">{user?.credits ?? 50} / 50</span>
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Credits Saved</span>
            <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">₹1,850</h3>
            <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5"><TrendingUp className="w-3.5 h-3.5" /> +12% this week</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Completed Tasks</span>
            <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">24</h3>
            <span className="text-xs text-blue-600 flex items-center gap-1 mt-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 100% success rate</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Avg Generation Time</span>
            <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">1.8s</h3>
            <span className="text-xs text-blue-600 flex items-center gap-1 mt-1.5"><Clock className="w-3.5 h-3.5" /> High-speed AI active</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-500/20 text-white shadow-md'
                  : 'bg-blue-50 border border-blue-100 text-slate-500 hover:text-slate-800 hover:bg-blue-100/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search through 14 tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 py-2.5 text-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, idx) => {
            const Icon = tool.icon
            return (
              <Link to={tool.path} key={idx} className="tool-card group text-decoration-none">
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 uppercase tracking-wider">
                    {tool.category}
                  </span>
                </div>
                <h3 className="text-md font-semibold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  {tool.label} <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">{tool.desc}</p>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 glass rounded-3xl border border-blue-200">
          <p className="text-slate-500 font-medium">No tools found matching your criteria.</p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
            className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-semibold hover:underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
