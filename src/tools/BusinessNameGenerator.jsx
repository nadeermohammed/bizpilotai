import { useState } from 'react'
import { Wand2, Sparkles, Copy, Check, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function BusinessNameGenerator() {
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('Tech')
  const [style, setStyle] = useState('Modern')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!keyword) {
      toast.error('Please enter keywords')
      return
    }

    setLoading(true)
    setResults([])

    try {
      const prompt = `keywords: ${keyword}\nindustry: ${industry}\nstyle: ${style}`
      const sysInstruction = `You are an expert brand developer. Suggest 4 creative business names based on the keywords, industry, and branding style.
Format your output strictly as a JSON array of objects. Each object must have these exact keys: "name", "slogan", "domains". The "domains" key must be an object with keys "com" (boolean) and "in" (boolean) representing domain availability.
Example format:
[
  {"name": "NovaCloud", "slogan": "The next generation of tech infrastructure", "domains": {"com": true, "in": false}}
]
Do not write markdown wrapping, do not write \`\`\`json. Output ONLY the raw JSON string.`

      const responseText = await generateAIResponse(prompt, sysInstruction)
      
      // Clean up markdown block wraps if present
      let cleanJson = responseText.trim()
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```(json)?\n/, '').replace(/\n```$/, '')
      }

      const parsed = JSON.parse(cleanJson)
      if (Array.isArray(parsed)) {
        setResults(parsed)
        toast.success('Generated business names!')
      } else {
        throw new Error('Not an array')
      }
    } catch (err) {
      console.warn('AI Parsing failed, running local template builder.', err)
      // Fallback local builder
      const base = keyword.trim().split(' ')[0]
      const capitalized = base.charAt(0).toUpperCase() + base.slice(1).toLowerCase()
      
      let generated = []
      if (style === 'Modern') {
        generated = [
          { name: `${capitalized}ly`, slogan: `Smart solutions for ${industry}`, domains: { com: true, in: true } },
          { name: `Nova${capitalized}`, slogan: `The next generation of ${industry}`, domains: { com: true, in: false } },
          { name: `Velo${capitalized}`, slogan: `Accelerating your ${industry} growth`, domains: { com: false, in: true } },
          { name: `${capitalized} Grid`, slogan: `Connected infrastructure for developers`, domains: { com: true, in: true } },
        ]
      } else {
        generated = [
          { name: `${capitalized} Stack`, slogan: `High-scale engine for ${industry}`, domains: { com: true, in: true } },
          { name: `${capitalized} Core`, slogan: `Decentralized infrastructure models`, domains: { com: true, in: false } },
          { name: `Aura${capitalized}`, slogan: `Premium experiences in ${industry}`, domains: { com: false, in: true } },
          { name: `Sync${capitalized}`, slogan: `Realtime state configurations`, domains: { com: true, in: true } },
        ]
      }
      setResults(generated)
      toast.success('Generated names from offline repository.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedIndex(null), 1000)
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><Wand2 className="w-3.5 h-3.5" /> CREATIVE CORE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">BUSINESS NAME GENERATOR</h1>
        <p className="text-sm text-slate-500">Generate creative brand names, matching slogans, and verify domain availability guesses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form Inputs */}
        <form onSubmit={handleGenerate} className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">BRAND INPUTS</h3>
          
          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Core Keyword / Idea</label>
            <input
              type="text"
              placeholder="Cloud, Spice, Travel, Code..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Industry Sector</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="input-field cursor-pointer font-hud"
            >
              <option value="Tech & SaaS">Tech & SaaS</option>
              <option value="Food & Cafe">Food & Cafe</option>
              <option value="Retail & Fashion">Retail & Fashion</option>
              <option value="Finance & Tax">Finance & Tax</option>
              <option value="Education">Education</option>
              <option value="Consulting">Consulting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Branding Style</label>
            <div className="grid grid-cols-3 gap-2">
              {['Modern', 'Elegant', 'Tech'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`py-2 px-3 rounded-lg text-xs font-hud font-bold border transition-all cursor-pointer ${
                    style === s
                      ? 'bg-blue-100 border border-blue-300 text-blue-800'
                      : 'bg-white border border-blue-100 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
          >
            {loading ? <span className="spinner"></span> : <><Sparkles className="w-4 h-4" /> Suggest Brand Names</>}
          </button>
        </form>

        {/* Results output */}
        <div className="glass p-6 rounded-2xl border border-blue-200 min-h-[380px] flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">SUGGESTIONS</h3>
          
          {results.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center text-center text-slate-400 font-hud">
              <Info className="w-8 h-8 text-blue-300 mb-2" />
              <p className="text-xs">Provide brand inputs and execute suggestion engine.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {results.map((res, index) => (
                <div key={index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 transition-all flex justify-between items-start">
                  <div>
                    <h4 className="text-md font-bold text-slate-800">{res.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{res.slogan}</p>
                    
                    <div className="flex gap-2 mt-2">
                      <span className={`text-[9px] font-hud font-bold px-1.5 py-0.5 rounded border ${
                        res.domains?.com ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        .COM {res.domains?.com ? 'AVAILABLE' : 'TAKEN'}
                      </span>
                      <span className={`text-[9px] font-hud font-bold px-1.5 py-0.5 rounded border ${
                        res.domains?.in ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        .IN {res.domains?.in ? 'AVAILABLE' : 'TAKEN'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCopy(res.name, index)}
                    className="copy-btn py-1 px-2 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === index ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
