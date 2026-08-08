import { useState } from 'react'
import { Sparkles, Copy, Check, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function CaptionGenerator() {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('Instagram')
  const [tone, setTone] = useState('Inspirational')
  const [emojiCount, setEmojiCount] = useState(true)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!topic) {
      toast.error('Please enter a description or topic')
      return
    }

    setLoading(true)
    setResult('')

    try {
      const prompt = `topic/theme: ${topic}\nplatform: ${platform}\ntone: ${tone}\ninclude_emojis: ${emojiCount}`
      const sysInstruction = `You are a social media copywriter. Write a highly engaging post/caption for the platform: ${platform} with a ${tone} tone based on the provided topic. 
If include_emojis is true, scatter appropriate emojis. If false, do not include any emojis at all. Add a separate line at the bottom with 3-5 highly relevant hashtags.
Output ONLY the post content, do not write any conversational intro or notes.`

      let caption = await generateAIResponse(prompt, sysInstruction)
      
      // Strip emojis if toggled off (regex safety)
      if (!emojiCount) {
        caption = caption.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDC00-\uDFFF]/g, '')
      }

      setResult(caption)
      toast.success('Social caption generated!')
    } catch (err) {
      console.warn('AI Caption failed, returning local preset.', err)
      const mockResult = `Consistency wins in the long run. Working on ${topic} today! 🚀 #buildinpublic #business`
      setResult(mockResult)
      toast.success('Generated offline draft.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Caption copied!')
    setTimeout(() => setCopied(false), 200)
  }

  const handleReset = () => {
    setTopic('')
    setPlatform('Instagram')
    setTone('Inspirational')
    setResult('')
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><Sparkles className="w-3.5 h-3.5" /> MARKETING CORE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">SOCIAL CAPTION GENERATOR</h1>
        <p className="text-sm text-slate-500">Write engaging social media posts with optimized emojis and hashtags tailored to target platforms.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form Panel */}
        <form onSubmit={handleGenerate} className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">POST DEFINITIONS</h3>
          
          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">What is your post about?</label>
            <textarea
              placeholder="e.g. launching our new organic product, tips for young designers, why we migrated to React..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input-field min-h-[100px] text-sm py-2.5"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Target Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="input-field py-2 text-xs font-hud cursor-pointer"
              >
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter/X">Twitter/X</option>
                <option value="Facebook">Facebook</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="input-field py-2 text-xs font-hud cursor-pointer"
              >
                <option value="Inspirational">Inspirational</option>
                <option value="Professional">Professional</option>
                <option value="Funny / Witty">Funny / Witty</option>
                <option value="Educational">Educational</option>
                <option value="Hype / Bold">Hype / Bold</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="emojis"
              checked={emojiCount}
              onChange={(e) => setEmojiCount(e.target.checked)}
              className="w-4 h-4 rounded border-blue-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="emojis" className="text-xs text-slate-600 font-semibold cursor-pointer">
              Enable Context Emojis
            </label>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-grow py-3 flex items-center justify-center gap-2"
            >
              {loading ? <span className="spinner"></span> : <><Sparkles className="w-4 h-4" /> Generate Caption</>}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary px-4 flex items-center justify-center cursor-pointer"
              title="Reset Settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Output Area */}
        <div className="glass p-6 rounded-2xl border border-blue-200 min-h-[340px] flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">COPYWRITING RESULT</h3>
            {result ? (
              <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 font-sans">
                {result}
              </p>
            ) : (
              <div className="text-center py-16 text-slate-400 font-hud">
                <p className="text-xs">Resulting copy will display here after execution.</p>
              </div>
            )}
          </div>

          {result && (
            <button
              onClick={handleCopy}
              className="btn-primary w-full py-2.5 mt-4 flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-white animate-bounce" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy social post'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
