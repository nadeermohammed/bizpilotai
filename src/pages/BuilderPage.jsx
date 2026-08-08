import { useState, useEffect } from 'react'
import {
  Shield,
  Users,
  Database,
  Search,
  Sparkles,
  CreditCard,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FolderSync,
  Cpu,
  UserCheck,
  TrendingUp,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getAdminAllRecords, saveRecord, deleteRecord } from '../utils/db'

export default function BuilderPage() {
  const [users, setUsers] = useState([])
  const [invoices, setInvoices] = useState([])
  const [expenses, setExpenses] = useState([])
  const [quotations, setQuotations] = useState([])
  const [resumes, setResumes] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [dbConfigUrl, setDbConfigUrl] = useState('')
  const [dbConfigActive, setDbConfigActive] = useState(false)

  // Reload database data
  const loadData = async () => {
    setLoading(true)
    try {
      const allUsers = await getAdminAllRecords('users')
      const allInvoices = await getAdminAllRecords('invoices')
      const allExpenses = await getAdminAllRecords('expenses')
      const allQuotations = await getAdminAllRecords('quotations')
      const allResumes = await getAdminAllRecords('resumes')

      setUsers(allUsers)
      setInvoices(allInvoices)
      setExpenses(allExpenses)
      setQuotations(allQuotations)
      setResumes(allResumes)

      const url = localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL || ''
      const key = localStorage.getItem('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || ''
      setDbConfigUrl(url)
      setDbConfigActive(url.trim().length > 10 && key.trim().length > 10)
    } catch (err) {
      console.error('Builder page failed to pull records:', err)
      toast.error('Failed to load database records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Admin Actions
  const handleUpdateUserTier = (user, newTier) => {
    const updatedUser = {
      ...user,
      tier: newTier,
      credits: newTier === 'Enterprise' ? 9999 : newTier === 'Pro' ? 250 : 50
    }
    saveRecord('users', updatedUser)
    toast.success(`Updated ${user.name} to ${newTier} tier!`)
    loadData()
  }

  const handleAdjustCredits = (user, amount) => {
    const updatedUser = {
      ...user,
      credits: Math.max(0, (user.credits || 0) + amount)
    }
    saveRecord('users', updatedUser)
    toast.success(`Adjusted credits for ${user.name} by ${amount > 0 ? '+' : ''}${amount}`)
    loadData()
  }

  const handleToggleRole = (user) => {
    const updatedUser = {
      ...user,
      role: user.role === 'admin' ? 'user' : 'admin'
    }
    saveRecord('users', updatedUser)
    toast.success(`Updated ${user.name}'s role to ${updatedUser.role.toUpperCase()}`)
    loadData()
  }

  const handleDeleteUser = (userToDelete) => {
    if (window.confirm(`Are you absolutely sure you want to delete ${userToDelete.name}? This will remove their user credentials.`)) {
      deleteRecord('users', userToDelete.id)
      toast.success(`Deleted user account: ${userToDelete.email}`)
      loadData()
    }
  }

  // Statistics Computations
  const totalUsers = users.length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const totalGenerations = invoices.length + expenses.length + quotations.length + resumes.length
  const totalCreditsUsed = users.reduce((acc, u) => acc + (50 - (u.credits || 0)), 0)

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchString = (u.name || '') + ' ' + (u.email || '') + ' ' + (u.business_name || '')
    return matchString.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Get record count per user
  const getUserRecordCounts = (email) => {
    const invCount = invoices.filter(i => i.user_email === email).length
    const expCount = expenses.filter(e => e.user_email === email).length
    const quotCount = quotations.filter(q => q.user_email === email).length
    const resCount = resumes.filter(r => r.user_email === email).length
    return {
      invoices: invCount,
      expenses: expCount,
      quotations: quotCount,
      resumes: resCount,
      total: invCount + expCount + quotCount + resCount
    }
  }

  return (
    <div className="flex flex-col gap-6 fade-in text-slate-800">
      {/* Top Banner Header */}
      <div className="rounded-3xl glass border border-blue-200 p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
        </div>

        <div>
          <span className="badge mb-2"><Shield className="w-3.5 h-3.5" /> BUILDER HUB</span>
          <h1 className="text-3xl font-display font-bold text-slate-800 flex items-center gap-2">
            ADMINISTRATOR ENGINE <Sparkles className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Analyze, monitor, and configure system resources, accounts, and credits allocation.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <FolderSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'SYNCING...' : 'FORCE REFRESH'}
        </button>
      </div>

      {/* Telemetry Stats Rows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Registered Accounts</span>
            <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">{totalUsers}</h3>
            <span className="text-xs text-blue-600 flex items-center gap-1 mt-1.5"><Users className="w-3.5 h-3.5" /> Active in database</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Total Workspaces</span>
            <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">{totalGenerations}</h3>
            <span className="text-xs text-indigo-600 flex items-center gap-1 mt-1.5"><FileText className="w-3.5 h-3.5" /> Shared assets count</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Core Administrators</span>
            <h3 className="text-2xl font-bold font-display text-slate-800 mt-1">{adminUsers}</h3>
            <span className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5"><UserCheck className="w-3.5 h-3.5" /> System controllers</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="stat-card flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Database Connection</span>
            <h3 className="text-sm font-bold font-display text-slate-800 mt-2 truncate max-w-[160px]">
              {dbConfigActive ? 'CLOUD (SUPABASE)' : 'LOCAL STORAGE'}
            </h3>
            <span className="text-xs text-amber-600 flex items-center gap-1 mt-1.5">
              <Database className="w-3.5 h-3.5" /> {dbConfigActive ? 'Connected online' : 'Standby mode'}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
            dbConfigActive 
              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
              : 'bg-amber-50 border-amber-100 text-amber-600'
          }`}>
            <Database className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* User list table panel (Left 3 Columns) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="glass rounded-2xl border border-blue-200 overflow-hidden">
            <div className="p-5 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">SYSTEM USERS REGISTERED</h3>
                <p className="text-[10px] text-slate-400 font-hud mt-0.5">Edit tiers, adjust credits, or flush accounts</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 py-1.5 text-xs"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <span className="spinner mx-auto mb-3"></span>
                <p className="text-xs font-hud text-slate-400">Loading user matrix...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-xs font-hud">No accounts found in database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-hud font-bold uppercase bg-slate-50/50">
                      <th className="p-4">User Details</th>
                      <th className="p-4">Business Info</th>
                      <th className="p-4">Tier / Role</th>
                      <th className="p-4 text-center">AI Credits</th>
                      <th className="p-4 text-center">Activity Logs</th>
                      <th className="p-4 text-right w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => {
                      const counts = getUserRecordCounts(u.email)
                      return (
                        <tr key={u.id} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-all">
                          {/* User details */}
                          <td className="p-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-semibold text-slate-800">{u.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono font-hud">{u.email}</span>
                            </div>
                          </td>

                          {/* Business Info */}
                          <td className="p-4">
                            <span className="text-slate-600 font-medium">{u.business_name || 'N/A'}</span>
                          </td>

                          {/* Tier/Role */}
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1.5">
                              <span className={`text-[9px] font-hud font-bold px-1.5 py-0.5 rounded border uppercase ${
                                u.tier === 'Enterprise'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : u.tier === 'Pro'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                                {u.tier || 'Free'}
                              </span>
                              <span className={`text-[9px] font-hud font-bold px-1.5 py-0.5 rounded border uppercase ${
                                u.role === 'admin'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-100'
                              }`}>
                                {u.role || 'user'}
                              </span>
                            </div>
                          </td>

                          {/* Credits */}
                          <td className="p-4 text-center font-hud font-bold">
                            <span className={u.credits > 15 ? 'text-slate-800' : 'text-rose-600'}>
                              {u.credits ?? 50}
                            </span>
                          </td>

                          {/* Activity Logs */}
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="font-hud font-bold text-slate-800">{counts.total} items</span>
                              <span className="text-[9px] text-slate-400 font-hud">
                                (inv: {counts.invoices}, exp: {counts.expenses}, quot: {counts.quotations})
                              </span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              {/* Edit Credits */}
                              <button
                                onClick={() => handleAdjustCredits(u, 25)}
                                className="p-1 border border-blue-200 text-blue-600 rounded bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300"
                                title="Add 25 credits"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle Tier */}
                              <button
                                onClick={() => handleUpdateUserTier(u, u.tier === 'Enterprise' ? 'Free' : u.tier === 'Pro' ? 'Enterprise' : 'Pro')}
                                className="p-1 border border-indigo-200 text-indigo-600 rounded bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-300"
                                title="Upgrade Tier"
                              >
                                <TrendingUp className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle admin */}
                              <button
                                onClick={() => handleToggleRole(u)}
                                className="p-1 border border-amber-200 text-amber-600 rounded bg-amber-50/50 hover:bg-amber-50 hover:border-amber-300"
                                title="Toggle Admin Role"
                              >
                                <Shield className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete account */}
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1 border border-red-200 text-red-600 rounded bg-red-50/50 hover:bg-red-50 hover:border-red-300"
                                title="Delete account"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Database Config side panel (Right 1 Column) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Cloud Connection status details */}
          <div className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-5 relative overflow-hidden">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">CORE METADATA</h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">CLOUD ENGINE</span>
                  <span className="text-xs font-hud font-bold text-indigo-700">
                    {dbConfigActive ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">DIAGNOSTICS</span>
                  <span className="text-xs font-hud font-bold text-emerald-700">STABLE</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[10px] text-slate-500 leading-relaxed font-mono font-hud">
              <p className="font-bold text-slate-600 uppercase mb-1">Telemetry Sync logs:</p>
              <p>&gt; Table invoices: OK ({invoices.length} rows)</p>
              <p>&gt; Table expenses: OK ({expenses.length} rows)</p>
              <p>&gt; Table quotations: OK ({quotations.length} rows)</p>
              <p>&gt; Table resumes: OK ({resumes.length} rows)</p>
              <p>&gt; Cloud Endpoint: {dbConfigUrl ? dbConfigUrl.substring(0, 20) + '...' : 'NONE'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
