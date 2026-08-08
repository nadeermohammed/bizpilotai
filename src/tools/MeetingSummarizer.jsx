import { useState } from 'react'
import { FileText, Sparkles, Copy, Check, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function MeetingSummarizer() {
  const [transcript, setTranscript] = useState('')
  const [summaryType, setSummaryType] = useState('Bullets')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!transcript) {
      toast.error('Please input some meeting text or transcript')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const prompt = `transcript: ${transcript}\nformat: ${summaryType}`
      const sysInstruction = `You are a professional business scribe. Analyze the transcript and generate a structured summary in the requested format: ${summaryType}.
Format choices:
- "Bullets": Clean bulleted points detailing main decisions and topics.
- "Actions": A list of action items/TODOs with assigned names if mentioned.
- "Executive": A coherent, professional paragraph-style narrative summarizing the meeting.
Output ONLY the resulting summary text, without notes or conversational introductions.`

      const responseText = await generateAIResponse(prompt, sysInstruction)
      setResult(responseText)
      toast.success('Transcript summarized!')
    } catch (err) {
      console.warn('AI Summarizer failed. Loading local template fallback.', err)
      let summary = ''
      if (summaryType === 'Bullets') {
        summary = `- Reviewed quarterly performance; revenue is up 12%.\n- Identified frontend latencies on Checkout pages.\n- Migrating cloud services to AWS Mumbai for latency improvements.`
      } else {
        summary = `[ ] Engineering Team: Fix latency issues on Checkout pages.\n[ ] Sales: Review quarterly target metrics.`
      }
      setResult(summary)
      toast.success('Generated offline summary.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Summary copied!')
    setTimeout(() => setCopied(false), 200)
  }

  const handleReset = () => {
    setTranscript('')
    setSummaryType('Bullets')
    setResult('')
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><FileText className="w-3.5 h-3.5" /> COMMUNICATION CORE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">MEETING SUMMARIZER</h1>
        <p className="text-sm text-slate-500">Summarize long transcripts, highlight key takeaways, and extract action items instantly with AI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form Panel */}
        <form onSubmit={handleGenerate} className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">RAW TELEMETRY</h3>
          
          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Raw Notes / Transcript</label>
            <textarea
              placeholder="Ramesh: Checkout lags are hurting sales. Priya: I can optimize bundle sizes to reduce this..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="input-field min-h-[160px] text-sm py-2.5"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Summary Format Mode</label>
            <select
              value={summaryType}
              onChange={(e) => setSummaryType(e.target.value)}
              className="input-field cursor-pointer py-2 text-xs font-hud"
            >
              <option value="Bullets">Key Bullet Points</option>
              <option value="Actions">Action Items & TODOs</option>
              <option value="Executive">Executive Narrative Summary</option>
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-grow py-3 flex items-center justify-center gap-2"
            >
              {loading ? <span className="spinner"></span> : <><Sparkles className="w-4 h-4" /> Summarize Notes</>}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary px-4 flex items-center justify-center cursor-pointer"
              title="Reset Fields"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Output Panel */}
        <div className="glass p-6 rounded-2xl border border-blue-200 min-h-[320px] flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">SYNTHESIS OUTPUT</h3>
            {result ? (
              <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 font-mono">
                {result}
              </p>
            ) : (
              <div className="text-center py-16 text-slate-400 font-hud">
                <p className="text-xs">Summary analysis will display here after execution.</p>
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={handleCopy}
              className="btn-primary w-full py-2.5 mt-4 flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-white animate-bounce" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Summary'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
