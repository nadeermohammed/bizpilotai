import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
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
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react'

const toolsList = [
  { icon: Mail, name: 'AI Email Writer', desc: 'Draft professional emails for clients, follow-ups, and marketing.' },
  { icon: FileText, name: 'AI Invoice Generator', desc: 'Create beautiful GST-compliant invoices and track payments.' },
  { icon: Percent, name: 'GST Calculator', desc: 'Calculate CGST, SGST, IGST ledger breakdowns in seconds.' },
  { icon: Briefcase, name: 'AI Quotation Generator', desc: 'Generate high-converting business quotes for prospective clients.' },
  { icon: FileUser, name: 'AI Resume Builder', desc: 'Build stunning professional resumes in a few steps.' },
  { icon: Wand2, name: 'Business Name Generator', desc: 'Generate catchy name suggestions with slogan ideas.' },
  { icon: MessageSquare, name: 'WhatsApp Auto-Reply', desc: 'Craft prompt replies to customer chats in multiple tones.' },
  { icon: FilePenLine, name: 'AI Proposal Writer', desc: 'Write comprehensive, structured project and business proposals.' },
  { icon: Sparkles, name: 'Social Caption Generator', desc: 'Engaging captions for Instagram, LinkedIn, and Facebook.' },
  { icon: FileText, name: 'Meeting Summarizer', desc: 'Transcribe and extract key action items from raw meeting notes.' },
  { icon: Coins, name: 'Expense Tracker', desc: 'Log expenses, sort by categories, and monitor cash flow budgets.' },
  { icon: MessageCircle, name: 'AI Chat Assistant', desc: 'Ask business development and growth questions to your AI partner.' },
  { icon: FileUp, name: 'PDF to Excel Tool', desc: 'Clean layout to import and mock convert PDF data tables.' },
  { icon: ScanLine, name: 'Receipt OCR Scanner', desc: 'Extract key amounts and metadata from scanned invoice images.' },
]

export default function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    { q: "Is BizPilot AI really built for Indian small businesses?", a: "Yes, absolutely! The toolkit includes a GST Calculator and a GST-compliant Invoice Generator specifically designed to suit the Indian business ecosystem, alongside general AI writing and management tools." },
    { q: "How does the AI credits system work?", a: "On the Free Plan, you get 50 free AI generation credits every month. Upgrading to the Premium Plan gives you unlimited credits, advanced template formats, and high-priority AI processing speeds." },
    { q: "Can I cancel my subscription at any time?", a: "Yes, you can upgrade, downgrade, or cancel your subscription at any time directly from your billing profile page with no cancellation fees." },
    { q: "Do you store my uploaded documents or scanned receipts?", a: "No, security is our priority. All files uploaded for OCR scanning or PDF extraction are processed entirely client-side or securely in-memory, and are never saved to our servers." }
  ]

  return (
    <div className="relative min-h-screen hero-bg">
      {/* Background Particles Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[50%] right-[5%) w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[10%] left-[30%] w-80 h-80 bg-cyan-500/10 rounded-full blur-[130px]"></div>
      </div>

      {/* Navigation */}
      <nav className="navbar border-b border-indigo-500/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">BizPilot <span className="text-indigo-400">AI</span></span>
          </div>

          {/* Desktop Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Pricing</a>
            <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">FAQ</a>
            {user ? (
              <Link to="/dashboard" className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-300 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
                <Link to="/register" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-400 hover:text-white">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-b border-indigo-500/10 px-6 py-4 flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white py-2 text-sm font-medium">Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white py-2 text-sm font-medium">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white py-2 text-sm font-medium">FAQ</a>
            <hr className="border-indigo-500/10" />
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center py-2.5 flex items-center justify-center gap-2 text-sm">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white py-2 text-center text-sm font-medium">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center py-2.5 flex items-center justify-center gap-2 text-sm">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-32 pb-24 text-center relative z-10">
        <div className="fade-in inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Automate your business operations
        </div>
        <h1 className="fade-in-delay-1 text-5xl md:text-7xl font-display font-extrabold tracking-tight text-white mb-6 leading-tight">
          Supercharge Your Business <br />
          with <span className="gradient-text">BizPilot AI</span>
        </h1>
        <p className="fade-in-delay-2 max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-normal mb-10 leading-relaxed">
          The ultimate AI-powered business toolkit crafted for Indian startups, freelancers, and small businesses. Generate GST invoices, quotations, professional emails, social media content, and track expenses all in one place.
        </p>
        <div className="fade-in-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to={user ? "/dashboard" : "/register"} className="btn-primary w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30">
            Start Free Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="btn-secondary w-full sm:w-auto px-8 py-4 flex items-center justify-center">
            Explore 14 Tools
          </a>
        </div>

        {/* Dashboard Preview mockup */}
        <div className="fade-in-delay-3 mt-16 max-w-5xl mx-auto animated-border glow-indigo">
          <div className="animated-border-inner rounded-[15px] p-2 bg-black/40">
            <div className="rounded-[10px] overflow-hidden border border-indigo-500/10 bg-[#0c0c14] aspect-[16/9] flex flex-col">
              <div className="h-6 bg-black/50 border-b border-indigo-500/10 flex items-center gap-2 px-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                <span className="text-[10px] text-gray-500 ml-4 font-mono font-medium">bizpilot-dashboard-v1.0</span>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-display font-semibold text-white">BizPilot AI Dashboard</h3>
                    <p className="text-xs text-gray-400">Indian Small Business Assistant Toolkit</p>
                  </div>
                  <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold">
                    Free Tier: 50 Credits Left
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 my-4">
                  <div className="glass-light p-4 rounded-xl border border-indigo-500/10">
                    <span className="text-xs text-gray-500 block mb-1">Total Invoices</span>
                    <span className="text-xl font-bold font-display text-white">₹1,24,500</span>
                  </div>
                  <div className="glass-light p-4 rounded-xl border border-indigo-500/10">
                    <span className="text-xs text-gray-500 block mb-1">AI Task Completion</span>
                    <span className="text-xl font-bold font-display text-white">98.4%</span>
                  </div>
                  <div className="glass-light p-4 rounded-xl border border-indigo-500/10">
                    <span className="text-xs text-gray-500 block mb-1">Active AI Services</span>
                    <span className="text-xl font-bold font-display text-white">14 Tools Active</span>
                  </div>
                </div>
                <div className="h-24 bg-indigo-500/5 rounded-xl border border-indigo-500/10 p-3 text-xs text-indigo-300 font-mono overflow-hidden">
                  {"$ bizpilot --generate-invoice\n> Gathering GST details...\n> Applying 18% HSN Code 998313...\n> Generating invoice BP-2026-004...\n> Completed! PDF downloaded."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-indigo-500/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4">
            Everything You Need, <span className="gradient-text">Unified</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-base md:text-lg">
            Stop switching between tab tools. We pack 14 core AI and utility applications in one dashboard designed for small business productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolsList.map((tool, idx) => {
            const Icon = tool.icon
            return (
              <div key={idx} className="tool-card group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">{tool.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{tool.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-indigo-500/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 text-base">
            Start completely free. Upgrade whenever your business grows and you need unlimited credits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free plan */}
          <div className="pricing-card">
            <h3 className="text-xl font-bold text-white mb-2">Free Plan</h3>
            <p className="text-gray-400 text-sm mb-6">Perfect for side projects and beginners.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold font-display text-white">₹0</span>
              <span className="text-gray-500 text-sm">/ forever</span>
            </div>
            <ul className="flex flex-col gap-3.5 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 50 AI Credits / month</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Access to all 14 tools</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Local data storage</li>
              <li className="flex items-center gap-2.5 text-gray-500"><X className="w-4 h-4 text-gray-600 shrink-0" /> Priority processing support</li>
            </ul>
            <button onClick={() => navigate('/register')} className="btn-secondary w-full py-3 text-sm">Get Started</button>
          </div>

          {/* Premium plan */}
          <div className="pricing-card featured glow-indigo">
            <div className="absolute top-4 right-4 tag bg-indigo-500 text-white font-semibold">POPULAR</div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Plan</h3>
            <p className="text-gray-400 text-sm mb-6">Built for active startups and freelancers.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold font-display text-white">₹199</span>
              <span className="text-gray-500 text-sm">/ month</span>
            </div>
            <ul className="flex flex-col gap-3.5 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited AI Credits</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Priority response generation</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Advanced report exports</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Premium design templates</li>
            </ul>
            <button onClick={() => navigate('/register')} className="btn-primary w-full py-3 text-sm">Go Premium</button>
          </div>

          {/* Business plan */}
          <div className="pricing-card">
            <h3 className="text-xl font-bold text-white mb-2">Business Plan</h3>
            <p className="text-gray-400 text-sm mb-6">Designed for larger operations and teams.</p>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-extrabold font-display text-white">₹499</span>
              <span className="text-gray-500 text-sm">/ month</span>
            </div>
            <ul className="flex flex-col gap-3.5 text-sm text-gray-300 mb-8">
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Unlimited AI Credits</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> Up to 5 Team Members</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> API access integration</li>
              <li className="flex items-center gap-2.5"><Check className="w-4 h-4 text-emerald-400 shrink-0" /> 24/7 dedicated call support</li>
            </ul>
            <button onClick={() => navigate('/register')} className="btn-secondary w-full py-3 text-sm">Unlock Teams</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-24 relative z-10 border-t border-indigo-500/10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-400">
            Got questions? We've got answers.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass rounded-2xl border border-indigo-500/10 overflow-hidden transition-all duration-300">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-white hover:text-indigo-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-indigo-500/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 relative z-10 border-t border-indigo-500/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-md text-white">BizPilot AI</span>
        </div>
        <p>&copy; {new Date().getFullYear()} BizPilot AI. Built for small business productivity.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>
    </div>
  )
}
