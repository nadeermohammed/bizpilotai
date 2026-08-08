import { useState, useEffect } from 'react'
import { FileText, Plus, Trash2, Printer, Check, PlusCircle, Save, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { saveRecord, getRecords, deleteRecord } from '../utils/db'

export default function InvoiceGenerator() {
  const { user } = useAuth()
  
  // Editor States
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState(`BP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`)
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [gstRate, setGstRate] = useState(18) // 18% standard
  const [items, setItems] = useState([
    { desc: 'AI Consulting Service', qty: 1, price: 15000 }
  ])

  // Database list state
  const [savedInvoices, setSavedInvoices] = useState([])

  useEffect(() => {
    // Load saved invoices from db.js (Local/Supabase hybrid)
    const list = getRecords('invoices')
    setSavedInvoices(list)
  }, [])

  const handleAddItem = () => {
    setItems([...items, { desc: '', qty: 1, price: 0 }])
  }

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      toast.error('Invoice must contain at least one item')
      return
    }
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index, field, val) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val }
      }
      return item
    })
    setItems(updated)
  }

  const subtotal = items.reduce((acc, item) => acc + (Number(item.qty) * Number(item.price)), 0)
  const gstAmount = subtotal * (gstRate / 100)
  const total = subtotal + gstAmount

  const handleSaveToDb = (e) => {
    e.preventDefault()
    if (!clientName || !clientAddress) {
      toast.error('Please enter client details before saving')
      return
    }

    const record = {
      id: invoiceNumber,
      invoice_number: invoiceNumber,
      client_name: clientName,
      client_email: clientEmail,
      client_address: clientAddress,
      invoice_date: invoiceDate,
      gst_rate: gstRate,
      items: items,
      subtotal: subtotal,
      gst_amount: gstAmount,
      total: total
    }

    const updated = saveRecord('invoices', record)
    setSavedInvoices(updated)
    toast.success(`Invoice ${invoiceNumber} saved to DB!`)
  }

  const loadInvoice = (inv) => {
    setInvoiceNumber(inv.invoice_number || inv.id)
    setClientName(inv.client_name || '')
    setClientEmail(inv.client_email || '')
    setClientAddress(inv.client_address || '')
    setInvoiceDate(inv.invoice_date || '')
    setGstRate(inv.gst_rate ?? 18)
    setItems(inv.items || [])
    toast.success(`Loaded invoice ${inv.invoice_number}`)
  }

  const handleDeleteInvoice = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this invoice from database?')) {
      const updated = deleteRecord('invoices', id)
      setSavedInvoices(updated)
      toast.success('Invoice deleted')
    }
  }

  const handlePrint = (e) => {
    e.preventDefault()
    if (!clientName || !clientAddress) {
      toast.error('Please enter client details before printing')
      return
    }
    // Also save in background
    handleSaveToDb(e)
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      {/* Page Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <span className="badge mb-2"><FileText className="w-3.5 h-3.5" /> FINANCE CORE</span>
          <h1 className="text-2xl font-display font-bold text-slate-800">GST INVOICE ENGINE</h1>
          <p className="text-sm text-slate-500">Draft compliant Indian GST invoices. Data synchronizes to your connected database automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Editor Form & Saved Invoices Panel (Left 1 Col) */}
        <div className="lg:col-span-1 flex flex-col gap-6 print:hidden">
          
          {/* Editor Form */}
          <div className="glass p-5 rounded-2xl border border-blue-200 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">BILLING PARAMETERS</h3>
            
            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Client Name</label>
              <input
                type="text"
                placeholder="Ramesh Enterprises"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="input-field py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Client Email</label>
              <input
                type="email"
                placeholder="client@ramesh.in"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="input-field py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Billing Address</label>
              <textarea
                placeholder="Sector 62, Noida, UP"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="input-field min-h-[50px] py-2 text-sm"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Invoice ID</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="input-field py-2 text-sm font-hud"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="input-field py-2 text-sm font-hud"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-1">GST slab rate</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="input-field py-2 text-sm cursor-pointer font-hud"
              >
                <option value={0}>0% Exempted</option>
                <option value={5}>5% Slab</option>
                <option value={12}>12% Slab</option>
                <option value={18}>18% Standard</option>
                <option value={28}>28% Luxury</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handlePrint}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
              <button
                onClick={handleSaveToDb}
                className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Sync / Save
              </button>
            </div>
          </div>

          {/* Saved Invoices List */}
          <div className="glass p-5 rounded-2xl border border-blue-200 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center gap-1.5"><FolderOpen className="w-4 h-4" /> SAVED RECORDS</h3>
            
            {savedInvoices.length === 0 ? (
              <p className="text-[10px] font-hud text-slate-400 italic">No saved invoices found in database.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto">
                {savedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => loadInvoice(inv)}
                    className="p-2 bg-slate-50 border border-slate-100 hover:border-blue-300 rounded-xl cursor-pointer flex justify-between items-center transition-all group"
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs font-hud font-bold text-slate-700 truncate">{inv.invoice_number || inv.id}</p>
                      <p className="text-[10px] text-slate-500 truncate">{inv.client_name}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteInvoice(inv.id, e)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor Items and Live Visual Invoice Layout (Right 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Line Items Builder */}
          <div className="glass p-6 rounded-2xl border border-blue-200 print:hidden">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">INVOICE LINE ITEMS</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-hud font-bold cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> [ADD ITEM]
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-1">Item Description</label>
                    <input
                      type="text"
                      placeholder="Consulting Services, SaaS Subscription..."
                      value={item.desc}
                      onChange={(e) => handleItemChange(idx, 'desc', e.target.value)}
                      className="input-field py-1.5 text-sm"
                      required
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-1">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
                      className="input-field py-1.5 text-sm text-center"
                      required
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-1">Rate (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                      className="input-field py-1.5 text-sm"
                      required
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg hover:border-red-400 mb-0.5 cursor-pointer"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Invoice Paper sheet layout */}
          <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-xl border border-blue-200/50 flex flex-col justify-between aspect-[1/1.41] w-full max-w-[21cm] mx-auto print:border-0 print:shadow-none print:p-0 print:bg-white print:text-black">
            
            {/* Header / Brand details */}
            <div>
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-blue-900 font-display">TAX INVOICE</h2>
                  <p className="text-[10px] font-hud font-bold text-blue-500 mt-1 uppercase tracking-wider">GST Compliant Document</p>
                </div>
                <div className="text-right">
                  <h3 className="text-md font-bold text-slate-800">{user?.businessName || 'BIZPILOT AI ASSOCIATE'}</h3>
                  <p className="text-xs text-slate-500">{user?.email || 'admin@bizpilot.in'}</p>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <h4 className="text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider mb-1">Billed To:</h4>
                  <p className="font-bold text-slate-800">{clientName || '------------------'}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed whitespace-pre-wrap">{clientAddress || '------------------'}</p>
                  {clientEmail && <p className="text-xs text-slate-400 mt-1">{clientEmail}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500"><strong className="text-slate-700">Invoice No:</strong> {invoiceNumber}</p>
                  <p className="text-xs text-slate-500 mt-1"><strong className="text-slate-700">Date:</strong> {invoiceDate}</p>
                </div>
              </div>

              {/* Items grid */}
              <table className="w-full border-collapse text-sm mb-8">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-left text-[10px] font-hud font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-center w-16">Qty</th>
                    <th className="py-2 text-right w-24">Rate (₹)</th>
                    <th className="py-2 text-right w-28">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 text-slate-700">
                      <td className="py-3 font-medium text-slate-800">{item.desc || 'Unnamed Item'}</td>
                      <td className="py-3 text-center">{item.qty}</td>
                      <td className="py-3 text-right">₹{Number(item.price).toLocaleString('en-IN')}</td>
                      <td className="py-3 text-right font-semibold">₹{(item.qty * item.price).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations and Total Breakdown */}
            <div>
              <div className="flex justify-end border-t border-slate-100 pt-6">
                <div className="w-80 flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>GST ({gstRate}%):</span>
                    <span>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-blue-900 border-t border-slate-200 pt-2.5">
                    <span>Grand Total:</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center text-[10px] font-hud text-slate-400 border-t border-slate-100 pt-6 print:mt-12">
                Thank you for your business! Generated via BizPilot AI platform.
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
