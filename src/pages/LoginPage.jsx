import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { loginUserInDb, resendVerificationOtp } from '../utils/db'

export default function LoginPage() {
  const { login, setVerificationPending } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password')
      return
    }

    setLoading(true)
    setUnverifiedEmail(null)

    try {
      const dbUser = await loginUserInDb(email, password)
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
      
      login(appUser, rememberMe)
      toast.success(`Welcome back, ${dbUser.name}!`)
      navigate(redirectUrl)
    } catch (error) {
      console.error(error)
      if (error.message === 'USER_NOT_FOUND') {
        toast.error('Account not found. Please check your email or create an account.')
      } else if (error.message === 'INCORRECT_PASSWORD') {
        toast.error('Incorrect password. Please try again or use Forgot Password.')
      } else if (error.message === 'EMAIL_NOT_VERIFIED') {
        toast.error('Please verify your email before logging in.')
        setUnverifiedEmail(email)
        setVerificationPending(email)
      } else {
        toast.error(error.message || 'Login failed. Please verify credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return
    try {
      await resendVerificationOtp(unverifiedEmail)
      toast.success('Verification code resent to your email.')
      navigate(`/verify-email?email=${encodeURIComponent(unverifiedEmail)}`)
    } catch (err) {
      toast.error(err.message || 'Failed to resend code.')
    }
  }

  return (
    <div className="relative min-h-screen hero-bg flex items-center justify-center p-6 text-slate-800 font-sans">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[15%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md glass p-8 rounded-3xl border border-blue-200 shadow-2xl relative z-10 fade-in">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-all mb-4 self-start">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-blue-550/10 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your BizPilot AI workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-[10px] font-bold text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-350 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <span className="spinner"></span> : 'SIGN IN'}
          </button>
        </form>

        {unverifiedEmail && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
            <p className="text-[10px] text-amber-800">
              Need a verification code?
            </p>
            <button
              onClick={handleResendVerification}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 underline mt-1 cursor-pointer"
            >
              Resend Verification Email
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-200/80 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-blue-600 hover:text-blue-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
