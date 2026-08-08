import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authState, setAuthState] = useState('checking') // 'checking' | 'logged-out' | 'logged-in' | 'verification-pending'
  const [verificationEmail, setVerificationEmail] = useState('')

  useEffect(() => {
    // Check if there is an active session
    const savedLocal = localStorage.getItem('bizpilot_user')
    const savedSession = sessionStorage.getItem('bizpilot_user')
    const saved = savedLocal || savedSession

    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUser(parsed)
        setAuthState('logged-in')
      } catch (e) {
        localStorage.removeItem('bizpilot_user')
        sessionStorage.removeItem('bizpilot_user')
        setAuthState('logged-out')
      }
    } else {
      setAuthState('logged-out')
    }
  }, [])

  const login = (userData, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem('bizpilot_user', JSON.stringify(userData))
      localStorage.removeItem('bizpilot_session_only') // Flag cleanup
    } else {
      sessionStorage.setItem('bizpilot_user', JSON.stringify(userData))
      localStorage.setItem('bizpilot_session_only', 'true') // Keep track of session status
    }
    setUser(userData)
    setAuthState('logged-in')
  }

  const logout = () => {
    localStorage.removeItem('bizpilot_user')
    localStorage.removeItem('bizpilot_session_only')
    sessionStorage.removeItem('bizpilot_user')
    setUser(null)
    setAuthState('logged-out')
    
    // Push state replacement to prevent back-button navigation to private views
    window.history.pushState(null, '', '/login')
  }

  const setVerificationPending = (email) => {
    setVerificationEmail(email)
    setAuthState('verification-pending')
  }

  const updateProfileInSession = (updatedFields) => {
    if (!user) return
    const updated = { ...user, ...updatedFields }
    
    if (localStorage.getItem('bizpilot_user')) {
      localStorage.setItem('bizpilot_user', JSON.stringify(updated))
    } else if (sessionStorage.getItem('bizpilot_user')) {
      sessionStorage.setItem('bizpilot_user', JSON.stringify(updated))
    }
    
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{
      user,
      authState,
      verificationEmail,
      login,
      logout,
      setVerificationPending,
      updateProfileInSession
    }}>
      {children}
    </AuthContext.Provider>
  )
}
