import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, ShieldAlert, Cpu, Database, Save, RotateCcw, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [geminiKey, setGeminiKey] = useState('')
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  
  // Status check variables
  const [aiStatus, setAiStatus] = useState('OFFLINE // NO KEY')
  const [dbStatus, setDbStatus] = useState('LOCAL ONLY')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Load from local storage with environment variable fallbacks
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
  }, [])

  const handleSave = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      // Save credentials
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

      toast.success('Core systems config updated!')
    }, 800)
  }

  const handleReset = () => {
    if (window.confirm('Reset all credentials? Systems will fall back to local mocks.')) {
      setGeminiKey('')
      setSupabaseUrl('')
      setSupabaseKey('')
      localStorage.removeItem('gemini_api_key')
      localStorage.removeItem('supabase_url')
      localStorage.removeItem('supabase_anon_key')
      setAiStatus('OFFLINE // NO KEY')
      setDbStatus('LOCAL ONLY')
      toast.success('System credentials flushed.')
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><SettingsIcon className="w-3.5 h-3.5" /> SYSTEM OPERATIONS</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">CORE SYSTEM CONFIGURATION</h1>
        <p className="text-sm text-slate-500">Provide keys to initialize real-time Gemini AI modules and connect a cloud Postgres database.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* System Diagnostics status panel */}
        <div className="lg:col-span-1 glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-5 relative overflow-hidden">
          <div className="hud-telemetry-circle"></div>
          
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">SYS.DIAGNOSTICS</h3>

          {/* AI CPU Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center text-blue-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">AI GENERATOR</span>
              <span className="text-xs font-hud font-bold text-blue-700">{aiStatus}</span>
            </div>
          </div>

          {/* Database Link Status */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center text-amber-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">DATABASE ENGINE</span>
              <span className="text-xs font-hud font-bold text-amber-700">{dbStatus}</span>
            </div>
          </div>

          <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-500 leading-relaxed font-hud">
            <p className="font-bold text-slate-600 uppercase mb-1">Stark Core Logs:</p>
            <p>&gt; Checking api heartbeat... OK</p>
            <p>&gt; Storage tier... LOCAL_INDEXED_DB</p>
            <p>&gt; Sync engine status... {supabaseUrl ? 'ONLINE_READY' : 'STANDBY'}</p>
          </div>
        </div>

        {/* Configurations Form */}
        <form onSubmit={handleSave} className="lg:col-span-2 glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">SYSTEM PARAMETERS</h3>

          {/* Gemini API Key */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-hud font-bold text-slate-600 uppercase tracking-wider">Gemini API Key</label>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-blue-600 font-hud font-bold hover:underline"
              >
                [GET FREE KEY]
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="input-field"
            />
            <p className="text-[10px] text-slate-400">Keys are saved locally in your browser storage and sent directly to Google's API.</p>
          </div>

          {/* Supabase Config */}
          <div className="border-t border-slate-100 pt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-hud font-bold text-slate-600 uppercase tracking-wider">Supabase Connection</label>
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-[10px] text-amber-600 font-hud font-bold hover:underline"
              >
                [CREATE FREE DATABASE]
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Project URL</span>
                <input
                  type="text"
                  placeholder="https://yourproject.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Anon Key / API Key</span>
                <input
                  type="password"
                  placeholder="eyJhbGciOi..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex gap-2 items-start mt-1 bg-amber-50 border border-amber-200/50 rounded-xl p-3 text-[11px] text-amber-800 leading-normal">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold uppercase mb-0.5">Database Table requirements:</p>
                <p>Ensure you have tables named <code className="bg-amber-100 px-1 rounded">invoices</code>, <code className="bg-amber-100 px-1 rounded">expenses</code>, <code className="bg-amber-100 px-1 rounded">resumes</code>, and <code className="bg-amber-100 px-1 rounded">quotations</code> in your Supabase database with Row Level Security disabled or configured for public inserts.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? <span className="spinner"></span> : <><Save className="w-4 h-4" /> Save System Config</>}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Keys
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
