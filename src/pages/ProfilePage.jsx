import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Mail, Phone, Calendar, Globe, MapPin, Edit, Save, ShieldCheck, BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { updateUserProfile } from '../utils/db'

export default function ProfilePage() {
  const { user, updateProfileInSession } = useAuth()
  
  // Local state for editing fields
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [age, setAge] = useState(user?.dob || '')
  const [gender, setGender] = useState(user?.gender || '')
  const [country, setCountry] = useState(user?.country || '')
  const [state, setState] = useState(user?.state || '')
  const [city, setCity] = useState(user?.city || '')
  const [language, setLanguage] = useState(user?.language || 'English')
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedFields = {
        name,
        phone,
        date_of_birth: age,
        gender,
        country,
        state,
        city,
        preferred_language: language
      }

      await updateUserProfile(user.email, updatedFields)
      
      // Update fields in session/AuthContext state
      updateProfileInSession({
        name,
        phone,
        dob: age,
        gender,
        country,
        state,
        city,
        language
      })

      toast.success('Profile details updated successfully.')
      setIsEditing(false)
    } catch (err) {
      toast.error(err.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  // Format account creation date
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A'
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      {/* Title */}
      <div>
        <span className="badge mb-2"><User className="w-3.5 h-3.5" /> USER METADATA</span>
        <h1 className="text-2xl font-display font-bold text-slate-800">MY PROFILE</h1>
        <p className="text-sm text-slate-500">View and update your personal parameters and localization settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card & Telemetry */}
        <div className="lg:col-span-1 glass p-6 rounded-3xl border border-blue-200 flex flex-col gap-5 items-center relative overflow-hidden text-center">
          <div className="hud-telemetry-circle"></div>
          
          {/* Profile Avatar */}
          <div className="relative">
            <img
              src={user?.profileImage || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.name || 'default')}`}
              alt={user?.name}
              className="w-24 h-24 rounded-3xl bg-blue-50 border border-blue-200 shadow-md p-1 relative z-10"
            />
            {user?.emailVerified && (
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-xl p-1 z-20 border-2 border-white shadow-sm" title="Verified User">
                <BadgeCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="relative z-10">
            <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
            <p className="text-[10px] font-hud font-bold text-blue-600 uppercase tracking-widest mt-0.5">{user?.tier} Member</p>
          </div>

          <div className="w-full border-t border-slate-100 pt-4 flex flex-col gap-3 text-left text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Account status:</span>
              <span className="font-hud font-bold text-emerald-600 uppercase">ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Joined on:</span>
              <span className="font-semibold text-slate-700">{formatDate(user?.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Authentication:</span>
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> WebCrypto SHA-256
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info Details / Editor */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-blue-200 relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {isEditing ? 'EDIT ACCOUNT PARAMETERS' : 'ACCOUNT TELEMETRY'}
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-secondary py-1.5 px-3 flex items-center gap-1.5 text-xs cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="input-field"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-field"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-hud font-bold text-slate-500 uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-2 px-4 flex items-center gap-1.5 text-xs"
                >
                  {loading ? <span className="spinner"></span> : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user?.name || '')
                    setPhone(user?.phone || '')
                    setAge(user?.dob || '')
                    setGender(user?.gender || '')
                    setCountry(user?.country || '')
                    setState(user?.state || '')
                    setCity(user?.city || '')
                    setLanguage(user?.language || 'English')
                    setIsEditing(false)
                  }}
                  className="btn-secondary py-2 px-4 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Display fields */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <User className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Full Name</span>
                  <span className="text-sm font-semibold text-slate-700">{user?.name || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Email Address</span>
                  <span className="text-sm font-semibold text-slate-700 break-all">{user?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Phone Number</span>
                  <span className="text-sm font-semibold text-slate-700">{user?.phone || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Age / Preferred Language</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {user?.dob ? `${user.dob} years` : 'N/A'} / {user?.language || 'English'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <Globe className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Location</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {user?.city || user?.state || user?.country 
                      ? [user?.city, user?.state, user?.country].filter(Boolean).join(', ') 
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Email status</span>
                  <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Verified & Active
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
