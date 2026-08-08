import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Sparkles, Lock, Eye, EyeOff, Check, X, KeyRound, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { resetPasswordWithToken, getAdminAllRecords } from '../utils/db'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tokenError, setTokenError] = useState(null)

  // Live password validation
  const [reqs, setReqs] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })
  const [strength, setStrength] = useState(0)

  // Validate reset token on load
  useEffect(() => {
    const checkToken = async () => {
      if (!token || !email) {
        setTokenError('Missing token or email parameter. Please request a new link.')
        return
      }

      try {
        const allUsers = await getAdminAllRecords('users')
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
        
        if (!user || user.password_reset_token !== token) {
          setTokenError('The password reset link is invalid. Please request a new one.')
          return
        }

        const isExpired = new Date(user.password_reset_token_expiry) < new Date()
        if (isExpired) {
          setTokenError('The password reset link has expired (active for 15 minutes).')
          return
        }
      } catch (err) {
        setTokenError('Error validating recovery token.')
      }
    }

    checkToken()
  }, [token, email])

  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }
    setReqs(checks)

    let score = 0
    if (checks.length) score++
    if (checks.uppercase && checks.lowercase) score++
    if (checks.number) score++
    if (checks.special) score++
    setStrength(score)
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (tokenError) {
      toast.error('Cannot reset password. Request a new link first.')
      return
    }

    // Password requirements check
    const allSatisfied = Object.values(reqs).every(val => val)
    if (!allSatisfied) {
      toast.error('Please satisfy all password strength requirements.')
      return
    }

    // Password match check
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await resetPasswordWithToken(email, token, password)
      setSuccess(true)
      toast.success('Password updated successfully!')
    } catch (error) {
      console.error(error)
      if (error.message === 'INVALID_TOKEN') {
        toast.error('Invalid password reset token.')
      } else if (error.message === 'EXPIRED_TOKEN') {
        toast.error('This password reset link has expired.')
      } else {
        toast.error(error.message || 'Failed to reset password.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getStrengthLabel = () => {
    if (!password) return 'None'
    if (strength <= 1) return 'Weak 🔴'
    if (strength === 2) return 'Fair 🟡'
    if (strength === 3) return 'Good 🔵'
    return 'Strong 🔥'
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
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-2">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Set New Password</h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose a strong password to secure your account credentials
          </p>
        </div>

        {tokenError ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-800">
              <X className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span className="text-xs font-semibold text-left">
                {tokenError}
              </span>
            </div>
            
            <Link
              to="/forgot-password"
              className="btn-primary w-full py-2.5 mt-4 text-xs font-hud font-bold"
            >
              REQUEST NEW RESET LINK
            </Link>
          </div>
        ) : success ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 justify-center text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 animate-bounce" />
              <span className="text-xs font-semibold">
                Your password has been successfully updated.
              </span>
            </div>
            
            <Link
              to="/login"
              className="btn-primary w-full py-3 mt-4 text-xs font-hud font-bold"
            >
              SIGN IN TO ACCOUNT
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password strength & Requirement list */}
            {password && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-blue-100 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">Password Strength:</span>
                  <span className="font-hud font-bold text-slate-800">{getStrengthLabel()}</span>
                </div>
                
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex gap-1">
                  {[1, 2, 3, 4].map(idx => (
                    <div
                      key={idx}
                      className={`h-full flex-grow rounded-full transition-all duration-300 ${
                        idx <= strength 
                          ? strength === 4 
                            ? 'bg-emerald-500' 
                            : strength === 3 
                            ? 'bg-blue-500' 
                            : strength === 2 
                            ? 'bg-amber-500' 
                            : 'bg-rose-500'
                          : 'bg-slate-200'
                      }`}
                    ></div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'uppercase', text: 'One uppercase letter' },
                    { key: 'lowercase', text: 'One lowercase letter' },
                    { key: 'number', text: 'One number' },
                    { key: 'special', text: 'One special character' }
                  ].map(req => (
                    <div key={req.key} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      {reqs[req.key] ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                      )}
                      <span className={reqs[req.key] ? 'text-slate-700 font-semibold' : ''}>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? <span className="spinner"></span> : 'RESET PASSWORD'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
