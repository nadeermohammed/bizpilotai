import { useState, useEffect } from 'react'
import { Briefcase, Printer, Plus, Trash2, CheckCircle2, Save, FolderOpen, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { saveRecord, getRecords, deleteRecord } from '../utils/db'

export default function QuotationGenerator() {
  const { user } = useAuth()
  
  // Editor States
  const [clientName, setClientName] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [projectName, setProjectName] = useState('')
  const [quoteValidity, setQuoteValidity] = useState('30 Days')
  const [timeline, setTimeline] = useState('4 Weeks')
  const [deliverables, setDeliverables] = useState([
    { name: 'Initial Design & Blueprinting', cost: 12000 },
    { name: 'Frontend React Development', cost: 35000 },
    { name: 'Backend Integration & Deployment', cost: 25000 },
  ])

  // Saved Quotes state
  const [savedQuotes, setSavedQuotes] = useState([])
  const [quoteId, setQuoteId] = useState('')

  useEffect(() => {
    // Fetch saved quotations on mount
    const list = getRecords('quotations')
    setSavedQuotes(list)
  }, [])

  const handleAddDeliverable = () => {
    setDeliverables([...deliverables, { name: '', cost: 0 }])
  }

  const handleRemoveDeliverable = (index) => {
    if (deliverables.length === 1) {
      toast.error('Quotation must contain at least one deliverable')
      return
    }
    setDeliverables(deliverables.filter((_, i) => i !== index))
  }

  const handleDeliverableChange = (index, field, val) => {
    const updated = deliverables.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val }
      }
      return item
    })
    setDeliverables(updated)
  }

  const totalCost = deliverables.reduce((acc, d) => acc + Number(d.cost), 0)

  const handleSaveToDb = (e) => {
    e.preventDefault()
    if (!clientName || !projectName) {
      toast.error('Please enter client and project details')
      return
    }

    const currentId = quoteId || `QT-${Date.now().toString(36).toUpperCase()}`
    if (!quoteId) setQuoteId(currentId)

    const record = {
      id: currentId,
      client_name: clientName,
      client_company: clientCompany,
      project_name: projectName,
      quote_validity: quoteValidity,
      timeline: timeline,
      deliverables: deliverables,
      total_cost: totalCost
    }

    const updated = saveRecord('quotations', record)
    setSavedQuotes(updated)
    toast.success(`Proposal ${currentId} saved to database!`)
  }

  const loadQuote = (q) => {
    setQuoteId(q.id)
    setClientName(q.client_name || '')
    setClientCompany(q.client_company || '')
    setProjectName(q.project_name || '')
    setQuoteValidity(q.quote_validity || '30 Days')
    setTimeline(q.timeline || '4 Weeks')
    setDeliverables(q.deliverables || [])
    toast.success(`Loaded quote ${q.id}`)
  }

  const handleDeleteQuote = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this quotation from database?')) {
      const updated = deleteRecord('quotations', id)
      setSavedQuotes(updated)
      if (quoteId === id) {
        setQuoteId('')
        setClientName('')
        setClientCompany('')
        setProjectName('')
      }
      toast.success('Quotation deleted')
    }
  }

  const handlePrint = (e) => {
    e.preventDefault()
    if (!clientName || !projectName) {
      toast.error('Please enter client and project details')
      return
    }
    handleSaveToDb(e)
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      {/* Page Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <span className="badge mb-2"><Briefcase className="w-3.5 h-3.5" /> BUSINESS CORE</span>
          <h1 className="text-2xl font-display font-bold text-slate-800">PROPOSAL ESTIMATOR</h1>
          <p className="text-sm text-slate-500">Draft budget estimations and quotations. Syncs with local storage and your cloud table.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Editor Form Panel (Left 1 Col) */}
        <div className="lg:col-span-1 flex flex-col gap-6 print:hidden">
          
          {/* Quote Form Editor */}
          <div className="glass p-5 rounded-2xl border border-blue-200 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">PROPOSAL TERMS</h3>
            
            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="Ramesh Patil"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="input-field py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Client Company</label>
              <input
                type="text"
                placeholder="Patil Enterprises"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="input-field py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Project Name</label>
              <input
                type="text"
                placeholder="React Web Platform"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="input-field py-2 text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Timeline</label>
                <input
                  type="text"
                  placeholder="4 Weeks"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="input-field py-2 text-sm font-hud"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Validity</label>
                <input
                  type="text"
                  placeholder="30 Days"
                  value={quoteValidity}
                  onChange={(e) => setQuoteValidity(e.target.value)}
                  className="input-field py-2 text-sm font-hud"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handlePrint}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Proposal
              </button>
              <button
                onClick={handleSaveToDb}
                className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Sync / Save
              </button>
            </div>
          </div>

          {/* Saved Proposals list */}
          <div className="glass p-5 rounded-2xl border border-blue-200 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center gap-1.5"><FolderOpen className="w-4 h-4" /> SAVED RECORDS</h3>
            
            {savedQuotes.length === 0 ? (
              <p className="text-[10px] font-hud text-slate-400 italic">No saved proposals found in database.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
                {savedQuotes.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => loadQuote(q)}
                    className="p-2 bg-slate-50 border border-slate-100 hover:border-blue-300 rounded-xl cursor-pointer flex justify-between items-center transition-all group"
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs font-hud font-bold text-slate-700 truncate">{q.id}</p>
                      <p className="text-[10px] text-slate-500 truncate">{q.project_name}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteQuote(q.id, e)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Milestones Editor & Live Proposal Preview (Right 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Deliverables Builder (Screen Only) */}
          <div className="glass p-6 rounded-2xl border border-blue-200 print:hidden">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">BUDGET MILESTONES</h3>
              <button
                onClick={handleAddDeliverable}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-hud font-bold cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> [ADD MILESTONE]
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {deliverables.map((d, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-grow">
                    <label className="block text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-1">Scope Description</label>
                    <input
                      type="text"
                      placeholder="UI mockups, Backend API design..."
                      value={d.name}
                      onChange={(e) => handleDeliverableChange(idx, 'name', e.target.value)}
                      className="input-field py-1.5 text-sm"
                      required
                    />
                  </div>
                  <div className="w-36">
                    <label className="block text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-1">Cost (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={d.cost}
                      onChange={(e) => handleDeliverableChange(idx, 'cost', e.target.value)}
                      className="input-field py-1.5 text-sm"
                      required
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveDeliverable(idx)}
                    className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg hover:border-red-400 mb-0.5 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Styled Proposal Paper sheet */}
          <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-xl border border-blue-200/50 flex flex-col justify-between aspect-[1/1.41] w-full max-w-[21cm] mx-auto print:border-0 print:shadow-none print:p-0 print:bg-white print:text-black">
            <div>
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-blue-900 font-display">BUSINESS PROPOSAL</h2>
                  <p className="text-[10px] font-hud font-bold text-blue-500 mt-1 uppercase tracking-wider">Project Budget Estimation & Quotation</p>
                </div>
                <div className="text-right">
                  <h3 className="text-md font-bold text-slate-800">{user?.businessName || 'BIZPILOT AI ASSOCIATE'}</h3>
                  <p className="text-xs text-slate-500">{user?.email || 'admin@bizpilot.in'}</p>
                </div>
              </div>

              {/* Scope details */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <h4 className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-1">Prepared For:</h4>
                    <p className="font-bold text-slate-800">{clientName || '------------------'}</p>
                    {clientCompany && <p className="text-xs text-slate-500 mt-0.5">{clientCompany}</p>}
                  </div>
                  <div className="text-right text-xs">
                    <p className="text-slate-500"><strong className="text-slate-700">Project:</strong> {projectName || '------------------'}</p>
                    <p className="text-slate-500 mt-1"><strong className="text-slate-700">Est. Timeline:</strong> {timeline}</p>
                    <p className="text-slate-500 mt-1"><strong className="text-slate-700">Validity:</strong> {quoteValidity}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                  <h5 className="text-[10px] font-hud font-bold text-blue-900 uppercase tracking-wider mb-1">Project Outline</h5>
                  <p className="text-xs text-blue-950 leading-relaxed">
                    This quotation details the estimate for providing development and design services for the project **"{projectName || '------------------'}"**.
                  </p>
                </div>
              </div>

              {/* Milestones list */}
              <h4 className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-3">Project Milestones & Costs</h4>
              <div className="flex flex-col gap-3">
                {deliverables.map((d, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 px-4 bg-slate-50 rounded-xl text-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-medium text-slate-800">{d.name || 'Unnamed Milestone'}</span>
                    </div>
                    <span className="font-hud font-bold text-slate-700">₹{Number(d.cost).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Budget calculation */}
            <div className="border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center bg-blue-900 text-white rounded-xl p-4 font-bold text-lg">
                <span className="font-display">Total Proposed Project Cost:</span>
                <span className="font-hud text-xl">₹{totalCost.toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-12 text-center text-[10px] font-hud text-slate-400 border-t border-slate-100 pt-6">
                Quotes are subject to the project contract specifications. Generated by BizPilot AI.
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
