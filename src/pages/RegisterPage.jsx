import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, User, Briefcase, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !businessName || !email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    // Simulate signup processing
    setTimeout(() => {
      setLoading(false)
      const mockUser = {
        name: name,
        businessName: businessName,
        email: email,
        tier: 'Free',
        credits: 50
      }
      login(mockUser)
      toast.success(`Account created! Welcome, ${name}!`)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="relative min-h-screen hero-bg flex items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[15%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[15%] w-72 h-72 bg-purple-500/10 rounded-full blur-[110px]"></div>
      </div>

      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </div>

      <div className="w-full max-w-md glass rounded-3xl border border-indigo-500/15 p-8 relative z-10 glow-indigo">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white">Create Account</h2>
          <p className="text-sm text-gray-400 mt-1">Get 50 free AI credits instantly</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nadeem Ahmed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field pl-12"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business / Company Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="ZenKod Solutions"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input-field pl-12"
                required
              />
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="nadeem@zenkod.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 mt-2 flex items-center justify-center gap-2"
          >
            {loading ? <span className="spinner"></span> : 'Create Free Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
