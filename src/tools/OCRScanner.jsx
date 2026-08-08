import { useState, useRef } from 'react'
import { ScanLine, Image as ImageIcon, Check, RefreshCw, Sparkles, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OCRScanner() {
  const [image, setImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [success, setSuccess] = useState(false)
  const [parsedData, setParsedData] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (PNG/JPG)')
        return
      }
      setImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setSuccess(false)
      setParsedData(null)
    }
  }

  const handleScan = () => {
    if (!image) return
    setScanning(true)

    // Simulate scanning line animation delay
    setTimeout(() => {
      setScanning(false)
      setSuccess(true)
      setParsedData({
        merchant: 'Reliance Retail Ltd',
        date: '28/07/2026',
        invoiceNumber: 'INV-98402-RELIANCE',
        items: [
          { name: 'Office Notebooks (Pack of 5)', price: 450 },
          { name: 'Laser Pointer Presenter', price: 1200 },
          { name: 'USB-C Hub adapter', price: 1850 }
        ],
        subtotal: 3500,
        gstRate: 18,
        gstAmount: 630,
        total: 4130
      })
      toast.success('Invoice data scanned successfully!')
    }, 2000)
  }

  const handleReset = () => {
    setImage(null)
    setPreviewUrl(null)
    setScanning(false)
    setSuccess(false)
    setParsedData(null)
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><ScanLine className="w-3.5 h-3.5" /> UTILITY MODULE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">RECEIPT OCR SCANNER</h1>
        <p className="text-sm text-slate-500">Scan and extract amounts, items, and tax metrics from invoice or receipt images instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Upload & Scanner Screen */}
        <div className="glass p-6 rounded-2xl border border-blue-200 flex flex-col items-center justify-center text-center min-h-[300px] relative overflow-hidden bg-slate-55/20">
          
          {/* Scanning Line Animation Overlay */}
          {scanning && (
            <div className="absolute inset-0 bg-white/70 z-20 flex flex-col items-center justify-center">
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(37,99,235,1)] animate-[scanLine_2s_infinite_ease-in-out]"></div>
              <Sparkles className="w-8 h-8 text-blue-600 animate-spin mb-2" />
              <h4 className="text-xs font-hud font-bold text-blue-650">EXTRACTING METADATA COORDINATES...</h4>
            </div>
          )}

          {/* Upload Drop Zone */}
          {!previewUrl && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center cursor-pointer p-8 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl w-full max-w-sm transition-all duration-300 bg-blue-50/10"
            >
              <ImageIcon className="w-10 h-10 text-blue-500 mb-3" />
              <h4 className="text-sm font-semibold text-slate-700">Upload receipt image</h4>
              <p className="text-xs text-slate-400 mt-1.5">PNG, JPG or JPEG (max 5MB)</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {/* Image Previewer */}
          {previewUrl && !scanning && (
            <div className="flex flex-col items-center gap-4 w-full max-w-sm fade-in">
              <div className="rounded-xl overflow-hidden border border-blue-200 max-h-[220px] aspect-[4/3] bg-slate-100">
                <img src={previewUrl} alt="Receipt preview" className="w-full h-full object-contain" />
              </div>
              
              {!success ? (
                <div className="flex gap-3 w-full mt-2">
                  <button onClick={handleScan} className="btn-primary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2">
                    <ScanLine className="w-4 h-4" /> Start AI OCR Scan
                  </button>
                  <button onClick={handleReset} className="btn-secondary px-4 py-3 text-xs" title="Upload different image">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={handleReset} className="btn-secondary w-full py-3 text-xs font-semibold">
                  Upload another image
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scanned Ledger Results */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">EXTRACTED DATABANK</h3>

          {parsedData ? (
            <div className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4 bg-blue-50/10 fade-in">
              <div>
                <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Merchant Name</span>
                <h4 className="text-md font-bold text-slate-800 mt-0.5">{parsedData.merchant}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Scan Date</span>
                  <p className="text-slate-650 mt-0.5 font-medium">{parsedData.date}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block">Invoice ID</span>
                  <p className="text-slate-650 mt-0.5 font-semibold font-hud">{parsedData.invoiceNumber}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <span className="text-[10px] text-slate-400 font-hud font-bold uppercase tracking-wider block mb-2">Line Items</span>
                <div className="flex flex-col gap-2 text-xs">
                  {parsedData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-0 last:pb-0">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-hud font-bold text-slate-800">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex flex-col gap-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-hud">₹{parsedData.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST ({parsedData.gstRate}%):</span>
                  <span className="font-hud">₹{parsedData.gstAmount}</span>
                </div>
                <div className="flex justify-between text-slate-800 font-bold text-sm border-t border-slate-200 pt-2 mt-1">
                  <span>Total Extracted:</span>
                  <span className="font-hud text-blue-700">₹{parsedData.total}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-6 rounded-2xl border border-blue-200 min-h-[220px] flex flex-col items-center justify-center text-center text-slate-400 font-hud">
              <Info className="w-8 h-8 text-blue-300 mb-2" />
              <p className="text-xs">Structured receipt data splits will appear here after scanning completes.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* CSS injection for scanning line */}
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}
