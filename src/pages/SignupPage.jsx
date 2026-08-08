import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, User, Briefcase, Phone, Calendar, Globe, MapPin, Eye, EyeOff, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUserInDb } from '../utils/db'

export default function SignupPage() {
  const { setVerificationPending } = useAuth()
  const navigate = useNavigate()

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [country, setCountry] = useState('India')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [language, setLanguage] = useState('English')

  // UI State
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Password Requirements State
  const [reqs, setReqs] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  })
  const [strength, setStrength] = useState(0) // 0 to 4

  // Live password validation checks
  useEffect(() => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    }
    setReqs(checks)

    // Calculate strength based on satisfied criteria
    let score = 0
    if (checks.length) score++
    if (checks.uppercase && checks.lowercase) score++
    if (checks.number) score++
    if (checks.special) score++
    setStrength(score)
  }, [password])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Required fields check
    if (!name || !email || !password || !confirmPassword || !businessName) {
      toast.error('Please fill in all required fields.')
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
      const result = await registerUserInDb({
        name,
        businessName,
        email,
        password,
        phone,
        dob: age,
        gender,
        country,
        state,
        city,
        profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        language
      })
      
      toast.success('Account created! Verification code sent.')
      setVerificationPending(email)
      navigate(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error) {
      console.error(error)
      if (error.message === 'EMAIL_EXISTS') {
        toast.error('An account with this email already exists. Please log in or use Forgot Password.')
      } else {
        toast.error(error.message || 'Registration failed. Please try again.')
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
        <div className="absolute top-[10%] right-[10%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-2xl glass p-8 rounded-3xl border border-blue-200 shadow-2xl relative z-10 my-8 fade-in">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-550/10 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-800">Create Account</h2>
          <p className="text-xs text-slate-500">Register to unlock premium business workflow telemetry</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Section 1: Required profile credentials */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1.5">
              ACCOUNT CREDENTIALS (REQUIRED)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    required
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Company / Business Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Kumar Technologies"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="input-field pl-10"
                    required
                  />
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field pl-10"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Password *</label>
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
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password *</label>
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
            </div>

            {/* Password strength & Requirement list */}
            {password && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-blue-100 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600">Password Strength:</span>
                  <span className="font-hud font-bold text-slate-800">{getStrengthLabel()}</span>
                </div>
                
                {/* Visual Bar Indicator */}
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

                {/* Requirement list */}
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
          </div>

          {/* Section 2: Optional details */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1.5">
              PERSONAL DETAILS (OPTIONAL)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Age or Age Bracket</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input-field pl-10"
                    min="1"
                    max="120"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Preferred Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="input-field cursor-pointer"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Marathi">Marathi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Country</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="input-field pl-10"
                  />
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">State / Province</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <span className="spinner"></span> : 'SUBMIT REGISTRATION'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/80 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
