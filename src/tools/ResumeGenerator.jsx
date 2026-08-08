import { useState, useEffect } from 'react'
import { FileUser, Printer, Plus, Trash2, Mail, Phone, MapPin, Link as LinkIcon, Save, FolderOpen } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { saveRecord, getRecords, deleteRecord } from '../utils/db'

export default function ResumeGenerator() {
  const { user } = useAuth()
  
  // Editor States
  const [resumeId, setResumeId] = useState('')
  const [personal, setPersonal] = useState({
    name: 'Nadeem Ahmed',
    title: 'Senior Full Stack Engineer',
    email: 'nadeem@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/nadeem-ahmed',
    summary: 'Detail-oriented Full Stack Engineer with over 4 years of experience building secure, scalable cloud architectures. Expert in React, Node.js, and Java Spring Boot. Passionate about automating development pipelines and AI integration workflows.',
  })

  const [skills, setSkills] = useState('React, Node.js, JavaScript (ES6+), Java, Spring Boot, PostgreSQL, MongoDB, Docker, AWS, Git, REST APIs, Tailwind CSS')

  const [experience, setExperience] = useState([
    { role: 'Lead Frontend Developer', company: 'ZenKod Solutions', period: '2024 - Present', desc: 'Led a team of 4 devs to migrate legacy apps to React + Vite. Optimized bundle sizes by 40% and improved Lighthouse performance scores to 95+.' },
    { role: 'Software Engineer', company: 'TechFlow Systems', period: '2022 - 2024', desc: 'Developed Java Spring Boot microservices handling over 100k daily active requests. Implemented OAuth2 authentication schemas.' }
  ])

  const [education, setEducation] = useState([
    { degree: 'B.Tech in Computer Science', school: 'VTU University', period: '2018 - 2022' }
  ])

  // Saved Resumes list state
  const [savedResumes, setSavedResumes] = useState([])

  useEffect(() => {
    const list = getRecords('resumes')
    setSavedResumes(list)
  }, [])

  const handleAddExperience = () => {
    setExperience([...experience, { role: '', company: '', period: '', desc: '' }])
  }

  const handleRemoveExperience = (idx) => {
    setExperience(experience.filter((_, i) => i !== idx))
  }

  const handleExpChange = (index, field, val) => {
    setExperience(experience.map((item, idx) => idx === index ? { ...item, [field]: val } : item))
  }

  const handleAddEducation = () => {
    setEducation([...education, { degree: '', school: '', period: '' }])
  }

  const handleRemoveEducation = (idx) => {
    setEducation(education.filter((_, i) => i !== idx))
  }

  const handleEduChange = (index, field, val) => {
    setEducation(education.map((item, idx) => idx === index ? { ...item, [field]: val } : item))
  }

  const handleSaveToDb = (e) => {
    e.preventDefault()
    if (!personal.name || !personal.title) {
      toast.error('Please enter name and title')
      return
    }

    const currentId = resumeId || `RS-${Date.now().toString(36).toUpperCase()}`
    if (!resumeId) setResumeId(currentId)

    const record = {
      id: currentId,
      personal,
      skills,
      experience,
      education
    }

    const updated = saveRecord('resumes', record)
    setSavedResumes(updated)
    toast.success(`Resume ${currentId} saved to database!`)
  }

  const loadResume = (res) => {
    setResumeId(res.id)
    setPersonal(res.personal || {})
    setSkills(res.skills || '')
    setExperience(res.experience || [])
    setEducation(res.education || [])
    toast.success(`Loaded resume ${res.id}`)
  }

  const handleDeleteResume = (id, e) => {
    e.stopPropagation()
    if (window.confirm('Delete this resume draft?')) {
      const updated = deleteRecord('resumes', id)
      setSavedResumes(updated)
      if (resumeId === id) {
        setResumeId('')
      }
      toast.success('Resume deleted')
    }
  }

  const handlePrint = (e) => {
    e.preventDefault()
    handleSaveToDb(e)
    window.print()
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 fade-in hud-panel">
      {/* Page Header */}
      <div className="flex justify-between items-center print:hidden">
        <div>
          <span className="badge mb-2"><FileUser className="w-3.5 h-3.5" /> PERSONAL CORE</span>
          <h1 className="text-2xl font-display font-bold text-slate-800">AI RESUME BUILDER</h1>
          <p className="text-sm text-slate-500">Design a professional, ATS-friendly resume. Data is persisted to your cloud database automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Editor Form Panel (Left 1 Col) */}
        <div className="lg:col-span-1 flex flex-col gap-5 print:hidden max-h-[85vh] overflow-y-auto pr-1">
          
          {/* Action buttons */}
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn-primary flex-1 py-2 flex items-center justify-center gap-1.5 text-xs">
              <Printer className="w-4 h-4" /> Print / PDF
            </button>
            <button onClick={handleSaveToDb} className="btn-secondary flex-1 py-2 flex items-center justify-center gap-1.5 text-xs">
              <Save className="w-4 h-4" /> Save
            </button>
          </div>

          {/* Saved list */}
          <div className="glass p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-2 flex items-center gap-1.5"><FolderOpen className="w-4 h-4" /> SAVED RESUMES</h4>
            {savedResumes.length === 0 ? (
              <p className="text-[10px] font-hud text-slate-400 italic">No saved resumes in DB.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                {savedResumes.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => loadResume(r)}
                    className="p-2 bg-slate-50 border border-slate-100 hover:border-blue-300 rounded-lg cursor-pointer flex justify-between items-center transition-all group"
                  >
                    <div className="overflow-hidden">
                      <p className="text-xs font-hud font-bold text-slate-700 truncate">{r.personal?.name || r.id}</p>
                      <p className="text-[9px] text-slate-500 truncate">{r.personal?.title}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteResume(r.id, e)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Personal Info */}
          <div className="glass p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">CONTACT PROFILE</h4>
            <input
              type="text"
              placeholder="Full Name"
              value={personal.name}
              onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
              className="input-field py-1.5 text-xs font-hud"
            />
            <input
              type="text"
              placeholder="Professional Title"
              value={personal.title}
              onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
              className="input-field py-1.5 text-xs font-hud"
            />
            <input
              type="email"
              placeholder="Email address"
              value={personal.email}
              onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
              className="input-field py-1.5 text-xs font-hud"
            />
            <input
              type="text"
              placeholder="Phone number"
              value={personal.phone}
              onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
              className="input-field py-1.5 text-xs font-hud"
            />
            <input
              type="text"
              placeholder="Location"
              value={personal.location}
              onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
              className="input-field py-1.5 text-xs font-hud"
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={personal.linkedin}
              onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
              className="input-field py-1.5 text-xs font-hud"
            />
            <textarea
              placeholder="Summary Profile Bio"
              value={personal.summary}
              onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
              className="input-field py-1.5 text-xs min-h-[60px]"
            ></textarea>
          </div>

          {/* Skills Form */}
          <div className="glass p-4 rounded-xl border border-blue-200 flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-1">TECHNICAL SKILLS</h4>
            <textarea
              placeholder="React, CSS, Git, Java, AWS..."
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="input-field py-1.5 text-xs min-h-[50px]"
            ></textarea>
          </div>

          {/* Experience Form */}
          <div className="glass p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">EMPLOYMENT</h4>
              <button onClick={handleAddExperience} className="text-[10px] text-blue-600 font-hud font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
                <Plus className="w-3 h-3" /> [ADD]
              </button>
            </div>
            {experience.map((exp, idx) => (
              <div key={idx} className="flex flex-col gap-2 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Role title"
                    value={exp.role}
                    onChange={(e) => handleExpChange(idx, 'role', e.target.value)}
                    className="input-field py-1 text-[11px] flex-1"
                  />
                  <button onClick={() => handleRemoveExperience(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleExpChange(idx, 'company', e.target.value)}
                    className="input-field py-1 text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Period"
                    value={exp.period}
                    onChange={(e) => handleExpChange(idx, 'period', e.target.value)}
                    className="input-field py-1 text-[11px]"
                  />
                </div>
                <textarea
                  placeholder="Responsibilities"
                  value={exp.desc}
                  onChange={(e) => handleExpChange(idx, 'desc', e.target.value)}
                  className="input-field py-1 text-[11px] min-h-[40px]"
                ></textarea>
              </div>
            ))}
          </div>

          {/* Education Form */}
          <div className="glass p-4 rounded-xl border border-blue-200 flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-100 pb-1">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">EDUCATION</h4>
              <button onClick={handleAddEducation} className="text-[10px] text-blue-600 font-hud font-bold hover:underline flex items-center gap-0.5 cursor-pointer">
                <Plus className="w-3 h-3" /> [ADD]
              </button>
            </div>
            {education.map((edu, idx) => (
              <div key={idx} className="flex flex-col gap-2 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Degree / Major"
                    value={edu.degree}
                    onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                    className="input-field py-1 text-[11px] flex-1"
                  />
                  <button onClick={() => handleRemoveEducation(idx)} className="text-red-500 p-1 hover:bg-red-50 rounded cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="School"
                    value={edu.school}
                    onChange={(e) => handleEduChange(idx, 'school', e.target.value)}
                    className="input-field py-1 text-[11px]"
                  />
                  <input
                    type="text"
                    placeholder="Period"
                    value={edu.period}
                    onChange={(e) => handleEduChange(idx, 'period', e.target.value)}
                    className="input-field py-1 text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Resume Sheet (optimized for Screen and Print) (Right 3 Cols) */}
        <div className="lg:col-span-3 flex flex-col items-center">
          <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-xl border border-blue-200/50 aspect-[1/1.41] w-full max-w-[21cm] flex flex-col gap-6 print:border-0 print:shadow-none print:p-0 print:bg-white print:text-black">
            
            {/* Header section */}
            <div className="border-b-2 border-slate-100 pb-4">
              <h2 className="text-2xl font-display font-extrabold text-slate-900 uppercase tracking-tight">{personal.name || 'Your Name'}</h2>
              <p className="text-xs font-hud font-bold text-blue-600 uppercase tracking-wider mt-1">{personal.title || 'Your Role Title'}</p>
              
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-xs text-slate-500 font-medium">
                {personal.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-800" /> {personal.email}</span>}
                {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-blue-800" /> {personal.phone}</span>}
                {personal.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-800" /> {personal.location}</span>}
                {personal.linkedin && <span className="flex items-center gap-1"><LinkIcon className="w-3.5 h-3.5 text-blue-800" /> {personal.linkedin}</span>}
              </div>
            </div>

            {/* Profile Summary */}
            {personal.summary && (
              <div>
                <h4 className="text-[10px] font-hud font-bold text-blue-900 uppercase tracking-widest border-b border-slate-150 pb-1 mb-2">Professional Summary</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{personal.summary}</p>
              </div>
            )}

            {/* Skills */}
            {skills && (
              <div>
                <h4 className="text-[10px] font-hud font-bold text-blue-900 uppercase tracking-widest border-b border-slate-150 pb-1 mb-2">Technical Skills</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{skills}</p>
              </div>
            )}

            {/* Professional Experience */}
            {experience.length > 0 && (
              <div>
                <h4 className="text-[10px] font-hud font-bold text-blue-900 uppercase tracking-widest border-b border-slate-150 pb-1 mb-3">Employment History</h4>
                <div className="flex flex-col gap-3.5">
                  {experience.map((exp, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between items-start font-bold text-slate-800">
                        <span>{exp.role || 'Role'} <span className="font-normal text-slate-400">at</span> {exp.company || 'Company'}</span>
                        <span className="font-normal text-slate-400 text-[10px] font-hud">{exp.period}</span>
                      </div>
                      {exp.desc && <p className="text-slate-500 mt-1 leading-relaxed font-normal whitespace-pre-line">{exp.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h4 className="text-[10px] font-hud font-bold text-blue-900 uppercase tracking-widest border-b border-slate-150 pb-1 mb-3">Education</h4>
                <div className="flex flex-col gap-2.5">
                  {education.map((edu, idx) => (
                    <div key={idx} className="text-xs flex justify-between items-start text-slate-600">
                      <div>
                        <strong className="text-slate-800">{edu.degree || 'Degree'}</strong>
                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">{edu.school}</p>
                      </div>
                      <span className="text-[10px] font-hud">{edu.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
