import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Authentication
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Core Pages
import LandingPage from './pages/LandingPage'
import DashboardLayout from './pages/DashboardLayout'
import DashboardHome from './pages/DashboardHome'
import BuilderPage from './pages/BuilderPage'
import ProfilePage from './pages/ProfilePage'
import AccountSettingsPage from './pages/AccountSettingsPage'

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

function ProtectedRoute({ children }) {
  const { user, authState } = useAuth()
  const location = useLocation()

  if (authState === 'checking') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans">
        <div className="spinner mb-4"></div>
        <p className="text-sm font-hud text-slate-500 animate-pulse">Checking credentials status...</p>
      </div>
    )
  }

  if (authState === 'verification-pending') {
    return <Navigate to="/verify-email" replace />
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  return children
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export default function App() {
  return (
    <AuthProvider>
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
          {/* Public Views */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected Dashboard Tools */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
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
            <Route path="builder" element={<AdminRoute><BuilderPage /></AdminRoute>} />
          </Route>

          {/* Protected Top-Level User Views Sharing the Shell Layout */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<AccountSettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
