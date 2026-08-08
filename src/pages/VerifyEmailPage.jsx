import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, ShieldAlert, ArrowLeft, RefreshCw, KeyRound, Edit } from 'lucide-react'
import toast from 'react-hot-toast'
import { verifyUserEmail, resendVerificationOtp, changeVerificationEmail, getAdminAllRecords } from '../utils/db'

export default function VerifyEmailPage() {
  const { login, verificationEmail } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Resolve email address from query string or context
  const emailParam = searchParams.get('email') || verificationEmail
  
  const [email, setEmail] = useState(emailParam || '')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Timer state (60 seconds resend countdown)
  const [resendTimer, setResendTimer] = useState(0)
  
  // Toggle editing email
  const [isEditingEmail, setIsEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState(email)

  // Demo helper state
  const [demoCode, setDemoCode] = useState('')

  // Check database for code in dev/demo contexts so user doesn't have to search console
  const fetchDemoCode = async () => {
    try {
      const allUsers = await getAdminAllRecords('users')
      const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
      if (user && user.verification_token) {
        setDemoCode(user.verification_token)
      }
    } catch (e) {
      console.warn('Could not read demo code:', e)
    }
  }

  useEffect(() => {
    if (!email) {
      toast.error('No email address provided for verification.')
      navigate('/login')
    } else {
      fetchDemoCode()
    }
  }, [email])

  // Timer countdown hook
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [resendTimer])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!otp) {
      toast.error('Please enter the 6-digit verification code.')
      return
    }

    setLoading(true)
    try {
      const dbUser = await verifyUserEmail(email, otp)
      const appUser = {
        id: dbUser.id,
        name: dbUser.name,
        businessName: dbUser.business_name,
        email: dbUser.email,
        role: dbUser.role,
        tier: dbUser.tier || (dbUser.role === 'admin' ? 'Enterprise' : 'Free'),
        credits: dbUser.credits,
        phone: dbUser.phone,
        dob: dbUser.date_of_birth,
        gender: dbUser.gender,
        country: dbUser.country,
        state: dbUser.state,
        city: dbUser.city,
        profileImage: dbUser.profile_image,
        language: dbUser.preferred_language,
        createdAt: dbUser.created_at,
        emailVerified: dbUser.email_verified
      }
      
      login(appUser)
      toast.success('Email verified successfully! Welcome to your workspace.')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Verification failed. Please check the code.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    
    setLoading(true)
    try {
      await resendVerificationOtp(email)
      toast.success('A new 6-digit verification code has been dispatched.')
      setResendTimer(60) // 1 minute cooldown
      fetchDemoCode()
    } catch (err) {
      toast.error(err.message || 'Failed to resend code.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    if (!newEmail || newEmail.toLowerCase() === email.toLowerCase()) {
      setIsEditingEmail(false)
      return
    }

    setLoading(true)
    try {
      await changeVerificationEmail(email, newEmail)
      setEmail(newEmail)
      toast.success(`Verification email updated to ${newEmail}`)
      setIsEditingEmail(false)
      setResendTimer(60)
      fetchDemoCode()
    } catch (err) {
      if (err.message === 'EMAIL_EXISTS') {
        toast.error('An account with this email already exists.')
      } else {
        toast.error(err.message || 'Failed to update email.')
      }
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
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-600 mb-2">
            <KeyRound className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-800 font-display">Verify Your Email</h2>
          <p className="text-xs text-slate-500 mt-1">
            Verification code sent to <span className="font-semibold text-slate-700">{email}</span>
          </p>
        </div>

        {/* Edit Email option */}
        {isEditingEmail ? (
          <form onSubmit={handleUpdateEmail} className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-3">
            <div>
              <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Update Email Address</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 py-2 text-xs">Save</button>
              <button type="button" onClick={() => setIsEditingEmail(false)} className="btn-secondary py-2 text-xs">Cancel</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => { setNewEmail(email); setIsEditingEmail(true); }}
            className="w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 mb-6 cursor-pointer"
          >
            <Edit className="w-3 h-3" /> Change email address
          </button>
        )}

        <form onSubmit={handleVerify} className="flex flex-col gap-5">
          <div>
            <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
              ENTER 6-DIGIT CODE
            </label>
            <input
              type="text"
              maxLength="6"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full text-center text-2xl tracking-[0.7em] font-mono font-bold input-field py-3 focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <span className="spinner"></span> : 'VERIFY CODE'}
          </button>
        </form>

        {/* Resend actions */}
        <div className="mt-6 flex flex-col items-center gap-2">
          {resendTimer > 0 ? (
            <p className="text-[10px] text-slate-400 font-hud">
              Resend code available in {resendTimer}s
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Resend verification code
            </button>
          )}
        </div>

        {/* Demo Code Box */}
        {demoCode && (
          <div className="mt-8 p-3 rounded-2xl bg-teal-50 border border-teal-200 text-center flex flex-col gap-1">
            <span className="text-[9px] font-hud font-bold text-teal-800 uppercase tracking-wider">Demo / Development Helper</span>
            <p className="text-[11px] text-teal-700">
              Your generated verification code is: <strong className="font-mono text-teal-800 text-sm select-all">{demoCode}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
