import { useState } from 'react'
import { Mail, Sparkles, Copy, Check, RotateCcw, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function EmailWriter() {
  const [recipient, setRecipient] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [tone, setTone] = useState('Professional')
  const [keyPoints, setKeyPoints] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!recipient || !subject || !keyPoints) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const prompt = `recipient: ${recipient}\nsubject: ${subject}\ntone: ${tone}\npoints: ${keyPoints}`
      const sysInstruction = `You are an expert AI Email Writer. Generate a professional email tailored to the recipient, subject, and tone using the provided key points. Output only the finished email draft, including the Subject line at the very top. Do not include any notes or chat preamble.`
      
      const emailText = await generateAIResponse(prompt, sysInstruction)
      setResult(emailText)
      toast.success('Email drafted successfully!')
    } catch (err) {
      toast.error('Generation failed. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 200)
  }

  const handleSendEmail = () => {
    if (!recipientEmail) {
      toast.error('Please enter a recipient email address first')
      return
    }

    let mailSubject = subject
    let mailBody = result

    // Try to separate the Subject line from the generated body
    const subjectMatch = result.match(/Subject:\s*([^\n]+)/i)
    if (subjectMatch) {
      mailSubject = subjectMatch[1].trim()
      mailBody = result.replace(/Subject:\s*[^\n]+\n*/i, '').trim()
    }

    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`
    window.location.href = mailtoUrl
    toast.success('Launching your email client...')
  }

  const handleReset = () => {
    setRecipient('')
    setRecipientEmail('')
    setSubject('')
    setTone('Professional')
    setKeyPoints('')
    setResult('')
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><Mail className="w-3.5 h-3.5" /> COMMUNICATION MODULE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">AI EMAIL WRITER</h1>
        <p className="text-sm text-slate-500">Draft professional client, staff, or vendor correspondence and dispatch it instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form panel */}
        <form onSubmit={handleGenerate} className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4 bg-slate-55/15">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">EMAIL DETAILS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-600 uppercase tracking-wider mb-1.5">Recipient Name</label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-600 uppercase tracking-wider mb-1.5">Recipient Email</label>
              <input
                type="email"
                placeholder="e.g. ramesh@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-hud font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Subject / Purpose</label>
            <input
              type="text"
              placeholder="e.g. Request for Quotation / Project Extension Delay"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-hud font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="input-field cursor-pointer"
            >
              <option value="Professional">Professional & Formal</option>
              <option value="Casual">Casual & Friendly</option>
              <option value="Urgent">Urgent & Direct</option>
              <option value="Apologetic">Apologetic & Polite</option>
              <option value="Persuasive">Persuasive / Sales pitching</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-hud font-bold text-slate-600 uppercase tracking-wider mb-1.5">Key Points / Details</label>
            <textarea
              placeholder="e.g. We need to postpone our meeting to next Thursday because of a product scheduling conflict."
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              className="input-field min-h-[120px]"
              required
            ></textarea>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> DRAFTING ENGINE...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Email Draft
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary px-4 py-2"
              title="Reset fields"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Results Panel */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center h-8">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">DRAFTED TELEMETRY</h3>
            
            {result && (
              <div className="flex gap-2">
                <button onClick={handleCopy} className="copy-btn py-1 px-3 text-xs flex items-center gap-1.5 border border-blue-200 rounded-lg hover:bg-blue-50/50">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                
                {recipientEmail && (
                  <button onClick={handleSendEmail} className="btn-primary py-1 px-3 text-xs flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Mail</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {result ? (
            <div className="result-box font-hud text-sm leading-relaxed border border-blue-200 bg-slate-50 p-5 rounded-2xl whitespace-pre-wrap max-h-[480px] overflow-y-auto fade-in text-slate-800">
              {result}
            </div>
          ) : (
            <div className="result-box flex flex-col items-center justify-center text-center text-slate-400 border border-dashed border-blue-200 min-h-[300px] rounded-2xl glass">
              <Mail className="w-10 h-10 text-blue-300 mb-2" />
              <p className="text-xs">Generated draft result output will populate here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
