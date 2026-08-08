import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Mail, ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateResetToken } from '../utils/db'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  
  // Demo helper state
  const [demoResetLink, setDemoResetLink] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address.')
      return
    }

    setLoading(true)
    setDemoResetLink('')

    try {
      const result = await generateResetToken(email)
      
      // Standard secure behavior: show success message even if account doesn't exist
      setSubmitted(true)
      toast.success('Reset link dispatched if account exists.')

      if (result && result.link) {
        setDemoResetLink(result.link)
      }
    } catch (error) {
      toast.error(error.message || 'Error executing password recovery.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen hero-bg flex items-center justify-center p-6 text-slate-800 font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] right-[15%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] left-[15%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md glass p-8 rounded-3xl border border-blue-200 shadow-2xl relative z-10 fade-in">
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-all mb-4 self-start">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-200 flex items-center justify-center text-rose-600 mb-2">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">
            Request a time-limited secure link to reset credentials
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 justify-center text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
              <span className="text-xs font-semibold">
                If an account exists for this email, a password reset link has been sent.
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Please check your inbox (or your developer console logs) and follow the instructions in the email. The link will remain active for 15 minutes.
            </p>

            <button
              onClick={() => { setSubmitted(false); setEmail(''); setDemoResetLink(''); }}
              className="btn-secondary w-full py-2.5 mt-4"
            >
              Request another link
            </button>

            {/* Demo Reset Link Box */}
            {demoResetLink && (
              <div className="mt-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center flex flex-col gap-2">
                <span className="text-[9px] font-hud font-bold text-teal-800 uppercase tracking-wider">Demo / Development Helper</span>
                <p className="text-[11px] text-teal-700 leading-normal">
                  Click the generated link below to reset the password directly:
                </p>
                <a
                  href={demoResetLink}
                  className="text-xs font-bold text-teal-800 hover:text-teal-900 bg-teal-100/50 hover:bg-teal-100 p-2 rounded border border-teal-200 truncate mt-1 block select-all font-mono"
                >
                  {demoResetLink}
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <span className="spinner"></span> : 'SEND RESET LINK'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
