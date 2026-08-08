import { useState } from 'react'
import { MessageSquare, Sparkles, Copy, Check, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function WhatsAppReply() {
  const [customerMessage, setCustomerMessage] = useState('')
  const [replyTone, setReplyTone] = useState('Friendly')
  const [includeDetails, setIncludeDetails] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!customerMessage) {
      toast.error('Please enter the customer message')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const prompt = `customer_msg: ${customerMessage}\ntone: ${replyTone}\ndetails: ${includeDetails}`
      const sysInstruction = `You are an automated customer communication assistant. Write a short, highly professional WhatsApp reply tailored to: customer_msg, tone, and details.
Keep it extremely concise and direct (chat message style). Use emojis matching the tone.
Output ONLY the reply message text, without conversational introductions.`

      const responseText = await generateAIResponse(prompt, sysInstruction)
      setResult(responseText)
      toast.success('WhatsApp reply generated!')
    } catch (err) {
      console.warn('AI WhatsApp reply failed. Loading local template fallback.', err)
      const detailsStr = includeDetails ? `\n\nRegarding: ${includeDetails}` : ''
      let reply = `Hi there! 👋 Thanks for reaching out. We received your query: "${customerMessage}".${detailsStr}\n\nWe will get back to you shortly! 😊`
      setResult(reply)
      toast.success('Generated offline draft.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Copied WhatsApp message!')
    setTimeout(() => setCopied(false), 200)
  }

  const handleReset = () => {
    setCustomerMessage('')
    setReplyTone('Friendly')
    setIncludeDetails('')
    setResult('')
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><MessageSquare className="w-3.5 h-3.5" /> COMMUNICATION CORE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">WHATSAPP REPLY GENERATOR</h1>
        <p className="text-sm text-slate-500">Generate quick, professional customer support replies optimized for chat messengers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form panel */}
        <form onSubmit={handleGenerate} className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">INPUT PARAMETERS</h3>
          
          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Incoming Customer Message</label>
            <textarea
              placeholder="e.g. Is my order #304 shipped yet? It was supposed to arrive yesterday."
              value={customerMessage}
              onChange={(e) => setCustomerMessage(e.target.value)}
              className="input-field min-h-[90px] text-sm py-2.5"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Reply Tone</label>
            <select
              value={replyTone}
              onChange={(e) => setReplyTone(e.target.value)}
              className="input-field cursor-pointer py-2 text-xs font-hud"
            >
              <option value="Friendly">Friendly & Informative (with Emojis)</option>
              <option value="Support">Formal Support Agent</option>
              <option value="Apologetic">Apologetic & Professional</option>
              <option value="Direct">Direct & Concise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Key Info to Include (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Shipped via BlueDart, tracking code: BD-983"
              value={includeDetails}
              onChange={(e) => setIncludeDetails(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-grow py-3 flex items-center justify-center gap-2"
            >
              {loading ? <span className="spinner"></span> : <><Sparkles className="w-4 h-4" /> Generate Response</>}
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
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">CHANNELS TELEMETRY</h3>
            {result ? (
              <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 font-sans">
                {result}
              </p>
            ) : (
              <div className="text-center py-16 text-slate-400 font-hud">
                <p className="text-xs">Resulting chat response will display here after execution.</p>
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={handleCopy}
              className="btn-primary w-full py-2.5 mt-4 flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-white animate-bounce" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Reply'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
