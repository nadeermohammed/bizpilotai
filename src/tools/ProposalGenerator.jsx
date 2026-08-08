import { useState } from 'react'
import { FilePenLine, Sparkles, Copy, Check, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function ProposalGenerator() {
  const [clientName, setClientName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [scopeDetails, setScopeDetails] = useState('')
  const [priceEstimate, setPriceEstimate] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!clientName || !projectName || !problemDescription || !scopeDetails || !priceEstimate) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const prompt = `client: ${clientName}\nproject: ${projectName}\nproblem: ${problemDescription}\nscope: ${scopeDetails}\nprice: ${priceEstimate}`
      const sysInstruction = `You are a professional proposal writer. Generate a comprehensive, high-converting business proposal based on the inputs.
Include these exact sections:
1. EXECUTIVE SUMMARY (Detailed analysis of the client problem and our approach)
2. SCOPE & DELIVERABLES (Actionable project milestones and timeline expectations)
3. PROJECT ESTIMATION & PRICING (Price outline of ₹${Number(priceEstimate).toLocaleString('en-IN')} and standard payment terms)
4. ACCEPTANCE & NEXT STEPS

Speak professionally, use clear markdown formatting. Do not output conversational intros or notes.`

      const responseText = await generateAIResponse(prompt, sysInstruction)
      setResult(responseText)
      toast.success('Proposal drafted successfully!')
    } catch (err) {
      console.warn('AI Proposal failed, loading local template fallback.', err)
      const proposalText = `PROJECT PROPOSAL: ${projectName.toUpperCase()}
Prepared For: ${clientName}
Date: ${new Date().toLocaleDateString('en-IN')}

1. EXECUTIVE SUMMARY
--------------------
To address "${projectName}" for ${clientName}.
Core Challenge: "${problemDescription}"

2. SCOPE OF WORK & DELIVERABLES
-------------------------------
${scopeDetails.split('\n').map(line => `- ${line}`).join('\n')}

3. BUDGET & ESTIMATION
----------------------
Proposed Project Fee: ₹${Number(priceEstimate).toLocaleString('en-IN')}
Payment: 50% upfront, 50% on completion.`

      setResult(proposalText)
      toast.success('Generated offline draft.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Proposal copied!')
    setTimeout(() => setCopied(false), 200)
  }

  const handleReset = () => {
    setClientName('')
    setProjectName('')
    setProblemDescription('')
    setScopeDetails('')
    setPriceEstimate('')
    setResult('')
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><FilePenLine className="w-3.5 h-3.5" /> PROPOSALS CORE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">AI PROPOSAL WRITER</h1>
        <p className="text-sm text-slate-500">Generate structured, high-converting business and project proposals for client pitches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form Panel */}
        <form onSubmit={handleGenerate} className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">PROPOSAL METRICS</h3>
          
          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Client Company / Name</label>
            <input
              type="text"
              placeholder="Ramesh Enterprises"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
            <input
              type="text"
              placeholder="React Dashboard Migration"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Client's Problem Statement</label>
            <textarea
              placeholder="Their database frequently crashes and page load times exceed 5 seconds."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="input-field min-h-[70px] text-sm py-2"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Scope of Work (one per line)</label>
            <textarea
              placeholder="Migrate DB to Supabase&#10;Implement React Suspense queries&#10;Optimize bundle layouts"
              value={scopeDetails}
              onChange={(e) => setScopeDetails(e.target.value)}
              className="input-field min-h-[85px] text-sm py-2"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Total Project Fee (₹)</label>
            <input
              type="number"
              placeholder="75000"
              value={priceEstimate}
              onChange={(e) => setPriceEstimate(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-grow py-3 flex items-center justify-center gap-2"
            >
              {loading ? <span className="spinner"></span> : <><Sparkles className="w-4 h-4" /> Generate Proposal</>}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary px-4 flex items-center justify-center cursor-pointer"
              title="Reset Proposal Draft"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Output Panel */}
        <div className="glass p-6 rounded-2xl border border-blue-200 min-h-[460px] flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">DRAFT PROPOSAL</h3>
            {result ? (
              <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 font-sans max-h-[480px] overflow-y-auto">
                {result}
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 font-hud">
                <p className="text-xs">Generated proposal will display here after execution.</p>
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={handleCopy}
              className="btn-primary w-full py-2.5 mt-4 flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-white animate-bounce" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Proposal Draft'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
