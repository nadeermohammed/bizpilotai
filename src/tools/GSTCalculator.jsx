import { useState } from 'react'
import { Percent, Info, RotateCcw, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GSTCalculator() {
  const [amount, setAmount] = useState(10000)
  const [gstRate, setGstRate] = useState(18)
  const [calcType, setCalcType] = useState('exclusive') // exclusive = Add GST, inclusive = Remove GST
  const [copied, setCopied] = useState(false)

  const handleReset = () => {
    setAmount(10000)
    setGstRate(18)
    setCalcType('exclusive')
  }

  // GST Math
  let baseAmount = 0
  let totalGst = 0
  let totalAmount = 0

  if (calcType === 'exclusive') {
    baseAmount = Number(amount)
    totalGst = baseAmount * (gstRate / 100)
    totalAmount = baseAmount + totalGst
  } else {
    totalAmount = Number(amount)
    baseAmount = totalAmount / (1 + gstRate / 100)
    totalGst = totalAmount - baseAmount
  }

  const cgst = totalGst / 2
  const sgst = totalGst / 2
  const igst = totalGst

  const handleCopy = () => {
    const text = `GST Calculation Report\n-------------------------\nCalculation Type: ${calcType === 'exclusive' ? 'GST Exclusive (Add Tax)' : 'GST Inclusive (Remove Tax)'}\nGST Rate: ${gstRate}%\nBase Net Amount: ₹${baseAmount.toFixed(2)}\nCGST (Half split): ₹${cgst.toFixed(2)}\nSGST (Half split): ₹${sgst.toFixed(2)}\nIGST (Full rate): ₹${igst.toFixed(2)}\nTotal GST Amount: ₹${totalGst.toFixed(2)}\nGrand Total Gross: ₹${totalAmount.toFixed(2)}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Ledger report copied!')
    setTimeout(() => setCopied(false), 200)
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><Percent className="w-3.5 h-3.5" /> FINANCE CORE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">GST CALCULATOR</h1>
        <p className="text-sm text-slate-500">Split taxable base values, CGST, SGST, and IGST ledger components instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Input Panel */}
        <div className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Calculation Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCalcType('exclusive')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all duration-300 cursor-pointer ${
                  calcType === 'exclusive'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-500/20 text-white shadow-md'
                    : 'bg-blue-50 border border-blue-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                GST Exclusive (+ Add)
              </button>
              <button
                type="button"
                onClick={() => setCalcType('inclusive')}
                className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all duration-300 cursor-pointer ${
                  calcType === 'inclusive'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-500/20 text-white shadow-md'
                    : 'bg-blue-50 border border-blue-100 text-slate-500 hover:text-slate-800'
                }`}
              >
                GST Inclusive (- Remove)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">
              {calcType === 'exclusive' ? 'Base net Amount (₹)' : 'Total Inclusive gross Amount (₹)'}
            </label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">GST Slab Rate</label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 12, 18, 28].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => setGstRate(rate)}
                  className={`py-2 px-3 rounded-lg text-xs font-hud font-bold border transition-all cursor-pointer ${
                    gstRate === rate
                      ? 'bg-blue-100 border border-blue-300 text-blue-800'
                      : 'bg-white border border-blue-100 text-slate-500 hover:text-slate-800 hover:bg-blue-50'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCopy}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-white animate-bounce" /> : <Copy className="w-4 h-4" />}
              Copy Ledger Details
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary px-4 py-2 flex items-center justify-center"
              title="Reset Calculator"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breakdown Output Ledger */}
        <div className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-6 bg-blue-50/20">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">LEDGER DISTRIBUTION</h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
              <span className="text-slate-500">Net Taxable Amount (Base):</span>
              <span className="font-hud font-bold text-slate-800">₹{baseAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
              <span className="text-slate-500">Central Tax (CGST - {(gstRate / 2)}%):</span>
              <span className="font-hud text-blue-700">₹{cgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
              <span className="text-slate-500">State Tax (SGST - {(gstRate / 2)}%):</span>
              <span className="font-hud text-blue-700">₹{sgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm">
              <span className="text-slate-500">Inter-State Tax (IGST - {gstRate}%):</span>
              <span className="font-hud text-orange-700">₹{igst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-sm font-semibold">
              <span className="text-slate-600">Total GST Levy:</span>
              <span className="font-hud font-bold text-blue-700">₹{totalGst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between items-center pt-4 text-md font-bold text-slate-800">
              <span className="font-display">Grand Total (Gross):</span>
              <span className="font-hud text-xl text-blue-700">₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-3 flex gap-2.5 items-start mt-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-600 leading-normal">
              For intra-state sales within the same state, charge **CGST + SGST** (each half rate). For inter-state sales, charge **IGST** (full rate).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
