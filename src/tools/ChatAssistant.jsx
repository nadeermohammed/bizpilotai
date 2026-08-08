import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Sparkles, User, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { generateAIResponse } from '../utils/ai'

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Greetings. 👋 I am your Jarvis-inspired Stark HUD growth consultant. Ask me anything regarding business scaling, GST splits, invoice compliance, marketing strategies, or company setups.'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const prompt = `User query: ${userMessage.text}\nContext history: ${JSON.stringify(messages.slice(-5))}`
      const sysInstruction = `You are a Jarvis-style AI business advisor. Speak politely but efficiently with Stark Industries precision. 
Provide concise, actionable business intelligence and suggest dashboard tools (GST Calculator, Invoice Generator, Quotation Generator) where appropriate. 
Output only the response without conversational intro chat headers.`

      const responseText = await generateAIResponse(prompt, sysInstruction)
      setMessages((prev) => [...prev, { sender: 'ai', text: responseText }])
    } catch (err) {
      console.warn('Chat AI failed. Triggering offline template response.', err)
      const q = userMessage.text.toLowerCase()
      let reply = 'I am offline. Please verify your Gemini API key in System Settings.'
      
      if (q.includes('gst') || q.includes('tax')) {
        reply = 'In India, GST standard slabs are 5%, 12%, 18%, and 28%. CGST/SGST apply to local sales, while IGST applies to interstate commerce. Use our GST Calculator in the sidebar for automated splits.'
      } else if (q.includes('invoice') || q.includes('bill')) {
        reply = 'Indian invoices must feature business name, GSTIN (if registered), serial invoice numbers, dates, HSN/SAC codes, and separate tax columns. Use our GST Invoice Generator to draft this instantly.'
      }
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Telemetry reset. Communication channel cleared. How can I assist you now?'
      }
    ])
    toast.success('Chat telemetry cleared')
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[80vh] fade-in hud-panel">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="badge mb-2"><MessageCircle className="w-3.5 h-3.5" /> TELEMETRY MODULE</span>
          <h1 className="text-2xl font-display font-bold text-slate-800">JARVIS CO-PILOT</h1>
          <p className="text-sm text-slate-500">Consult on marketing strategies, business scaling models, or Indian accounting compliance.</p>
        </div>
        <button
          onClick={handleClear}
          className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5 cursor-pointer"
          title="Clear Chat History"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Clear Telemetry
        </button>
      </div>

      {/* Chat Box Panel */}
      <div className="flex-grow glass rounded-2xl border border-blue-200 flex flex-col justify-between overflow-hidden shadow-xl relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 bottom-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px]"></div>
        </div>

        {/* Message Container */}
        <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 max-h-[58vh]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-hud font-bold ${
                  msg.sender === 'user'
                    ? 'bg-slate-200 text-slate-700 border border-slate-350'
                    : 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div
                className={
                  msg.sender === 'user' ? 'chat-bubble-user font-medium' : 'chat-bubble-ai'
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="chat-bubble-ai flex items-center gap-2">
                <span className="spinner w-4 h-4"></span>
                <span className="font-hud text-xs text-blue-600">CONSULTING JARVIS DATABANK...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-3">
          <input
            type="text"
            placeholder="Type your growth query here... (e.g. How do I start Facebook ads?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="input-field flex-1 text-sm py-3"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-5 py-3 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
