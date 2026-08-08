import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Lock, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    // Simulate login processing
    setTimeout(() => {
      setLoading(false)
      const mockUser = {
        name: email.split('@')[0].toUpperCase(),
        email: email,
        tier: 'Free',
        credits: 50
      }
      login(mockUser)
      toast.success('Successfully logged in!')
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="relative min-h-screen hero-bg flex items-center justify-center p-6">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[30%] left-[20%] w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[30%] right-[20%] w-72 h-72 bg-purple-500/10 rounded-full blur-[110px]"></div>
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
          <h2 className="text-2xl font-display font-bold text-white">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-1">Access your AI Business Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline">Forgot password?</a>
            </div>
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
            {loading ? <span className="spinner"></span> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold hover:underline">
            Register here
          </Link>
        </p>

        {/* Demo Credentials suggestion */}
        <div className="mt-6 border-t border-indigo-500/5 pt-4 text-center">
          <p className="text-[11px] text-gray-500 font-mono">Demo mode: Enter any email/password to sign in</p>
        </div>
      </div>
    </div>
  )
}
