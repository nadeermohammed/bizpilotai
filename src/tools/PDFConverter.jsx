import { useState, useRef } from 'react'
import { FileUp, FileSpreadsheet, Check, RefreshCw, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PDFConverter() {
  const [file, setFile] = useState(null)
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0]
    if (uploaded) {
      if (uploaded.type !== 'application/pdf') {
        toast.error('Only PDF files are supported')
        return
      }
      setFile(uploaded)
      setSuccess(false)
      setProgress(0)
    }
  }

  const handleConvert = () => {
    if (!file) return
    setConverting(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setConverting(false)
          setSuccess(true)
          toast.success('PDF successfully converted to Excel!')
          return 100
        }
        return prev + 10
      })
    }, 150)
  }

  const handleDownload = () => {
    toast.success('Mock Excel spreadsheet downloaded!')
  }

  const handleReset = () => {
    setFile(null)
    setConverting(false)
    setProgress(0)
    setSuccess(false)
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><FileUp className="w-3.5 h-3.5" /> UTILITY MODULE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">PDF TO EXCEL CONVERTER</h1>
        <p className="text-sm text-slate-500">Extract unstructured bank statement tables or invoice lists from PDF documents into Excel grids instantly.</p>
      </div>

      <div className="glass p-8 rounded-3xl border border-blue-200 flex flex-col items-center justify-center text-center min-h-[350px] relative overflow-hidden bg-slate-55/15">
        {/* Drop zone */}
        {!file && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center cursor-pointer p-10 border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl w-full max-w-lg transition-all duration-300 bg-blue-50/10"
          >
            <FileUp className="w-12 h-12 text-blue-500 mb-4 animate-bounce" />
            <h4 className="text-md font-semibold text-slate-700">Drag & drop your PDF file</h4>
            <p className="text-xs text-slate-400 mt-1.5">or click to browse local files (PDF only, max 10MB)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
          </div>
        )}

        {/* Selected file details */}
        {file && !converting && !success && (
          <div className="flex flex-col items-center gap-4 w-full max-w-md fade-in bg-slate-50 p-6 rounded-2xl border border-blue-200">
            <FileUp className="w-10 h-10 text-blue-500" />
            <div className="overflow-hidden w-full">
              <h4 className="text-sm font-semibold text-slate-800 truncate">{file.name}</h4>
              <p className="text-xs text-slate-500 mt-1">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button onClick={handleConvert} className="btn-primary flex-1 py-3 text-xs font-semibold">
                Convert to Excel (.xlsx)
              </button>
              <button onClick={handleReset} className="btn-secondary px-4 py-3 text-xs" title="Select different file">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Converting Status progress bar */}
        {converting && (
          <div className="flex flex-col items-center gap-4 w-full max-w-md fade-in">
            <span className="spinner w-8 h-8"></span>
            <h4 className="text-sm font-semibold text-slate-700">Converting data tables...</h4>
            <div className="w-full bg-slate-100 rounded-full h-3 border border-blue-250 overflow-hidden">
              <div className="expense-bar h-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-xs font-hud text-blue-600">{progress}% completed</p>
          </div>
        )}

        {/* Successful Conversion Output */}
        {success && (
          <div className="flex flex-col items-center gap-4 w-full max-w-md fade-in bg-slate-50 p-6 rounded-2xl border border-blue-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
              <Check className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Conversion Successful!</h4>
              <p className="text-xs text-slate-500 mt-1">Formatted spreadsheet ledger is ready.</p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={handleDownload}
                className="btn-primary flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" /> Download Excel Sheet
              </button>
              <button onClick={handleReset} className="btn-secondary px-4 py-3 text-xs" title="Convert another file">
                Reset
              </button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100/50 rounded-xl p-3 flex gap-2.5 items-start mt-6 w-full max-w-lg">
          <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-650 text-left leading-normal">
            Conversion processes all tables using client-side in-memory parsing. No documents are uploaded to external databases, keeping your sales accounts 100% private.
          </p>
        </div>
      </div>
    </div>
  )
}
