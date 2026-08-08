import { useState } from 'react'
import { Mail, Sparkles, Copy, Check, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function EmailWriter() {
  const [recipient, setRecipient] = useState('')
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

  const handleReset = () => {
    setRecipient('')
    setSubject('')
    setTone('Professional')
    setKeyPoints('')
    setResult('')
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <span className="badge mb-2"><Mail className="w-3.5 h-3.5" /> Communication</span>
          <h1 className="text-2xl font-display font-bold text-white">AI Email Writer</h1>
          <p className="text-sm text-gray-400">Generate professional emails customized for your clients, staff, or vendors.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form panel */}
        <form onSubmit={handleGenerate} className="glass p-6 rounded-2xl border border-indigo-500/10 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recipient Name</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar / Client Support Team"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Subject / Purpose</label>
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
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email Tone</label>
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
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Key Points / Details</label>
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
                  <span className="spinner"></span> Drafting...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Generate Email
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
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">AI Drafted Result</h3>
            {result && (
              <button onClick={handleCopy} className="copy-btn">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Email'}</span>
              </button>
            )}
          </div>

          {result ? (
            <div className="result-box font-mono text-sm leading-relaxed border border-indigo-500/20 bg-indigo-500/5 glow-indigo fade-in">
              {result}
            </div>
          ) : (
            <div className="result-box flex flex-col items-center justify-center text-center text-gray-500 border border-dashed border-indigo-500/10">
              <Mail className="w-10 h-10 text-gray-600 mb-2" />
              <p className="text-sm">Generated email output will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
