import { useState, useEffect } from 'react'
import { Coins, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { saveRecord, getRecords, deleteRecord } from '../utils/db'

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([])
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Software')

  useEffect(() => {
    // Read from db.js (localStorage/Supabase hybrid)
    const list = getRecords('expenses')
    setExpenses(list)
  }, [])

  const handleAddExpense = (e) => {
    e.preventDefault()
    if (!desc || !amount) {
      toast.error('Please enter details and amount')
      return
    }

    const record = {
      id: `EX-${Date.now()}`,
      desc,
      amount: Number(amount),
      category
    }

    const updated = saveRecord('expenses', record)
    setExpenses(updated)
    setDesc('')
    setAmount('')
    toast.success('Expense logged successfully!')
  }

  const handleDelete = (id) => {
    if (window.confirm('Remove this expense entry?')) {
      const updated = deleteRecord('expenses', id)
      setExpenses(updated)
      toast.success('Expense removed')
    }
  }

  // Mathematics
  const totalSpent = expenses.reduce((acc, exp) => acc + exp.amount, 0)
  
  // Category splits
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {})

  const categoryProgress = (cat) => {
    if (totalSpent === 0) return 0
    return ((categoryTotals[cat] || 0) / totalSpent) * 100
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      <div>
        <span className="badge mb-2"><Coins className="w-3.5 h-3.5" /> FINANCE CORE</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">EXPENSE TRACKER</h1>
        <p className="text-sm text-slate-500">Track and monitor your business expenses, categorise overheads, and analyze budget splits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Add Expense Form */}
        <div className="glass p-6 rounded-2xl border border-blue-200 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2">LOG EXPENSE</h3>
          <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <input
                type="text"
                placeholder="Domain Renewal, AWS Hosting..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="1200"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field cursor-pointer font-hud"
                >
                  <option value="Software">Software</option>
                  <option value="Rent">Rent</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Travel">Travel</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" /> Add to Log
            </button>
          </form>
        </div>

        {/* Expenses List & Category Progress */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Category split dashboard */}
          <div className="glass p-6 rounded-2xl border border-blue-200">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">BUDGET BREAKDOWN</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Software', 'Rent', 'Marketing', 'Travel', 'Hardware', 'Other'].map(cat => {
                const pct = categoryProgress(cat)
                const amt = categoryTotals[cat] || 0
                if (amt === 0) return null
                return (
                  <div key={cat} className="flex flex-col gap-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span className="font-semibold">{cat}</span>
                      <span className="font-hud">₹{amt.toLocaleString('en-IN')} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div className="expense-bar" style={{ width: `${pct}%`, background: 'linear-gradient(to right, #2563eb, #06b6d4)' }}></div>
                    </div>
                  </div>
                )
              })}
              {expenses.length === 0 && (
                <p className="text-xs text-slate-400 italic col-span-2">No expenses logged yet. Breakdown will display once added.</p>
              )}
            </div>
          </div>

          {/* List panel */}
          <div className="glass rounded-2xl border border-blue-200 overflow-hidden">
            <div className="p-5 border-b border-blue-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">EXPENSE LEDGER HISTORY</h3>
              <span className="text-sm font-bold text-blue-600 font-hud">Total: ₹{totalSpent.toLocaleString('en-IN')}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-hud font-bold uppercase bg-slate-50/50">
                    <th className="p-4">Description</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center w-16">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="border-b border-slate-100 text-slate-700 hover:bg-slate-50 transition-all">
                      <td className="p-4 font-semibold text-slate-800">{exp.desc}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-hud font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-4 text-right font-hud font-bold text-slate-800">₹{exp.amount.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="text-red-400 p-1 hover:bg-red-50 rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                        No expenses logged. Add one to start tracking.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
