import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'

// Tools
import EmailWriter from './tools/EmailWriter'
import InvoiceGenerator from './tools/InvoiceGenerator'
import GSTCalculator from './tools/GSTCalculator'
import QuotationGenerator from './tools/QuotationGenerator'
import ResumeGenerator from './tools/ResumeGenerator'
import BusinessNameGenerator from './tools/BusinessNameGenerator'
import WhatsAppReply from './tools/WhatsAppReply'
import ProposalGenerator from './tools/ProposalGenerator'
import CaptionGenerator from './tools/CaptionGenerator'
import MeetingSummarizer from './tools/MeetingSummarizer'
import ExpenseTracker from './tools/ExpenseTracker'
import ChatAssistant from './tools/ChatAssistant'
import PDFConverter from './tools/PDFConverter'
import OCRScanner from './tools/OCRScanner'
import Settings from './tools/Settings'

import { AuthContext } from './context/AuthContext'

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('bizpilot_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (userData) => {
    localStorage.setItem('bizpilot_user', JSON.stringify(userData))
    setUser(userData)
  }
  const logout = () => {
    localStorage.removeItem('bizpilot_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid rgba(0, 162, 255, 0.25)',
              borderRadius: '12px',
              fontFamily: 'Outfit, sans-serif'
            },
            success: { iconTheme: { primary: '#0d9488', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/dashboard" element={user ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route index element={<DashboardHome />} />
            <Route path="email" element={<EmailWriter />} />
            <Route path="invoice" element={<InvoiceGenerator />} />
            <Route path="gst" element={<GSTCalculator />} />
            <Route path="quotation" element={<QuotationGenerator />} />
            <Route path="resume" element={<ResumeGenerator />} />
            <Route path="business-name" element={<BusinessNameGenerator />} />
            <Route path="whatsapp" element={<WhatsAppReply />} />
            <Route path="proposal" element={<ProposalGenerator />} />
            <Route path="captions" element={<CaptionGenerator />} />
            <Route path="meeting" element={<MeetingSummarizer />} />
            <Route path="expenses" element={<ExpenseTracker />} />
            <Route path="chat" element={<ChatAssistant />} />
            <Route path="pdf-converter" element={<PDFConverter />} />
            <Route path="ocr" element={<OCRScanner />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
