import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Settings as SettingsIcon, User, Lock, Cpu, Database, Save, RotateCcw, 
  Trash2, ShieldCheck, Eye, EyeOff, BadgeAlert, LogOut, CheckCircle2 
} from 'lucide-react'
import toast from 'react-hot-toast'
import { changeUserPassword, deleteUserAccount, updateUserProfile } from '../utils/db'

export default function AccountSettingsPage() {
  const { user, logout, updateProfileInSession } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'security' | 'system' | 'danger'
  const [loading, setLoading] = useState(false)

  // Tab 1: Profile State
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [country, setCountry] = useState(user?.country || '')
  const [state, setState] = useState(user?.state || '')
  const [city, setCity] = useState(user?.city || '')

  // Tab 2: Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Tab 3: System API State
  const [geminiKey, setGeminiKey] = useState('')
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [aiStatus, setAiStatus] = useState('OFFLINE // NO KEY')
  const [dbStatus, setDbStatus] = useState('LOCAL ONLY')

  // Tab 4: Delete Account State
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('')
  const [showDeletePassword, setShowDeletePassword] = useState(false)
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false)

  useEffect(() => {
    // Populate profile fields
    if (user) {
      setName(user.name || '')
      setPhone(user.phone || '')
      setCountry(user.country || '')
      setState(user.state || '')
      setCity(user.city || '')
    }

    // Load System API settings
    const savedGemini = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
    const savedSubUrl = localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''
    const savedSubKey = localStorage.getItem('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''

    setGeminiKey(savedGemini)
    setSupabaseUrl(savedSubUrl)
    setSupabaseKey(savedSubKey)

    if (savedGemini.trim().length > 10) {
      setAiStatus('ACTIVE // READY')
    }
    if (savedSubUrl.trim().length > 10 && savedSubKey.trim().length > 10) {
      setDbStatus('CLOUD LINK ACTIVE')
    }
  }, [user])

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = {
        name,
        phone,
        country,
        state,
        city
      }
      await updateUserProfile(user.email, updated)
      updateProfileInSession(updated)
      toast.success('Profile settings updated successfully.')
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  // Password Save
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error('All password fields are required.')
      return
    }

    // Requirements check
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword)
    }

    if (!Object.values(checks).every(Boolean)) {
      toast.error('New password does not satisfy complexity requirements.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await changeUserPassword(user.email, currentPassword, newPassword)
      toast.success('Your password has been changed successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      if (err.message === 'INCORRECT_CURRENT_PASSWORD') {
        toast.error('Current password is incorrect.')
      } else {
        toast.error(err.message || 'Failed to update password.')
      }
    } finally {
      setLoading(false)
    }
  }

  // System Save
  const handleSaveSystem = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      localStorage.setItem('gemini_api_key', geminiKey.trim())
      localStorage.setItem('supabase_url', supabaseUrl.trim())
      localStorage.setItem('supabase_anon_key', supabaseKey.trim())

      if (geminiKey.trim().length > 10) {
        setAiStatus('ACTIVE // READY')
      } else {
        setAiStatus('OFFLINE // NO KEY')
      }

      if (supabaseUrl.trim().length > 10 && supabaseKey.trim().length > 10) {
        setDbStatus('CLOUD LINK ACTIVE')
      } else {
        setDbStatus('LOCAL ONLY')
      }

      toast.success('Core system credentials updated!')
    }, 600)
  }

  const handleResetSystem = () => {
    if (window.confirm('Reset all system keys? Fallback simulation templates will be active.')) {
      setGeminiKey('')
      setSupabaseUrl('')
      setSupabaseKey('')
      localStorage.removeItem('gemini_api_key')
      localStorage.removeItem('supabase_url')
      localStorage.removeItem('supabase_anon_key')
      setAiStatus('OFFLINE // NO KEY')
      setDbStatus('LOCAL ONLY')
      toast.success('System credentials cleared.')
    }
  }

  // Delete Account
  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    if (!deleteConfirmPassword) {
      toast.error('Please enter your password to confirm deletion.')
      return
    }

    if (!isDeleteConfirmed) {
      toast.error('Please check the confirmation box.')
      return
    }

    setLoading(true)
    try {
      await deleteUserAccount(user.email, deleteConfirmPassword)
      toast.success('Your account has been deleted permanently.')
      logout()
      navigate('/login')
    } catch (err) {
      if (err.message === 'INCORRECT_PASSWORD') {
        toast.error('Incorrect password. Action aborted.')
      } else {
        toast.error(err.message || 'Failed to delete account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      {/* Title */}
      <div>
        <span className="badge mb-2"><SettingsIcon className="w-3.5 h-3.5" /> SYSTEM & OPERATIONS</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">ACCOUNT SETTINGS</h1>
        <p className="text-sm text-slate-500">Configure profile, security details, system keys, and subscription controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-1 glass p-3 rounded-2xl border border-blue-200">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" /> Edit Profile
          </button>
          
          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'security' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4" /> Security & Pass
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'system' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            <Cpu className="w-4 h-4" /> System API Keys
          </button>

          <button
            onClick={() => setActiveTab('danger')}
            className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'danger' 
                ? 'bg-rose-600 text-white shadow-sm' 
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>

        {/* Tab Contents */}
        <div className="md:col-span-3 glass p-6 rounded-3xl border border-blue-200 min-h-[300px]">
          
          {/* TAB 1: PROFILE EDIT */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-2">
                PROFILE METADATA
              </h3>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-2.5 px-4 self-end flex items-center gap-1.5 text-xs mt-4"
              >
                {loading ? <span className="spinner"></span> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </form>
          )}

          {/* TAB 2: SECURITY & PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-2">
                CREDENTIAL CHANGE
              </h3>

              <div className="bg-emerald-50 border border-emerald-250 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block uppercase text-[10px]">Email Verified Status</span>
                  <span>Your email address ({user?.email}) is successfully verified.</span>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-2.5 px-4 self-end flex items-center gap-1.5 text-xs mt-4"
              >
                {loading ? <span className="spinner"></span> : 'CHANGE PASSWORD'}
              </button>
            </form>
          )}

          {/* TAB 3: SYSTEM API CONFIG */}
          {activeTab === 'system' && (
            <form onSubmit={handleSaveSystem} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 mb-2">
                SYSTEM API CONFIGURATIONS
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-2">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">AI Engines</span>
                  <span className="text-xs font-hud font-bold text-blue-600">{aiStatus}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Sync State</span>
                  <span className="text-xs font-hud font-bold text-amber-600">{dbStatus}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-hud font-bold text-slate-605 uppercase tracking-wider">Gemini API Key</label>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[9px] text-blue-600 font-hud font-bold hover:underline">
                    [GET FREE KEY]
                  </a>
                </div>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="input-field"
                  placeholder="AIzaSy..."
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-hud font-bold text-slate-605 uppercase tracking-wider">Supabase Endpoint URL</label>
                <input
                  type="text"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="input-field"
                  placeholder="https://xxx.supabase.co"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-hud font-bold text-slate-605 uppercase tracking-wider">Supabase Anon Key</label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="input-field"
                  placeholder="eyJhbGci..."
                />
              </div>

              <div className="flex justify-end gap-3 mt-4 border-t border-slate-100 pt-4">
                <button type="submit" className="btn-primary py-2.5 px-4 flex items-center gap-1.5 text-xs">
                  <Save className="w-4 h-4" /> Save System Config
                </button>
                <button type="button" onClick={handleResetSystem} className="btn-secondary py-2.5 px-4 flex items-center gap-1.5 text-xs">
                  <RotateCcw className="w-4 h-4" /> Clear Keys
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: DELETE ACCOUNT */}
          {activeTab === 'danger' && (
            <form onSubmit={handleDeleteAccount} className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest border-b border-rose-100 pb-2 mb-2">
                DANGER ZONE
              </h3>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex gap-3 text-rose-800 text-xs mb-2">
                <BadgeAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase text-[10px] mb-0.5">IRREVERSIBLE OPERATION</span>
                  <p className="leading-relaxed">
                    Are you sure you want to delete your account? This action cannot be undone. All of your custom generated invoices, expenses, documents, and credentials will be purged permanently from our servers.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm with your Password</label>
                <div className="relative">
                  <input
                    type={showDeletePassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={deleteConfirmPassword}
                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                    className="input-field pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showDeletePassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-2 text-xs text-rose-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isDeleteConfirmed}
                    onChange={(e) => setIsDeleteConfirmed(e.target.checked)}
                    className="rounded border-rose-350 text-rose-650 focus:ring-rose-500 w-4 h-4 cursor-pointer animate-pulse"
                  />
                  <span>Yes, I confirm that I want to delete my account permanently</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || !isDeleteConfirmed || !deleteConfirmPassword}
                className="btn-primary py-2.5 px-4 bg-rose-600 hover:bg-rose-700 self-end flex items-center gap-1.5 text-xs mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span className="spinner"></span> : <><Trash2 className="w-4 h-4" /> DELETE MY ACCOUNT</>}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
