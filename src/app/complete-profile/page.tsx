'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createClient } from "@supabase/supabase-js"
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowLeft } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MANIPAL_DEPARTMENTS = ['DLHS', 'DOC', 'MIT', 'MIRM', 'MLS', 'SMI']

const CompleteProfile = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'student-type' | 'details'>('student-type')

  const [isUniversityStudent, setIsUniversityStudent] = useState<boolean | undefined>(undefined)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    collegeName: '',
    registrationNumber: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
    if (session?.user?.name) {
      setFormData(prev => ({ ...prev, fullName: session.user.name || '' }))
    }
  }, [status, session, router])

  useEffect(() => {
    async function checkProfile() {
      if (!session?.user?.id) return
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single()
      if (profile && profile.mobile_number && profile.full_name && profile.college_name) {
        router.push('/profile')
      }
    }
    checkProfile()
  }, [session, router])

  useEffect(() => {
    if (isUniversityStudent === true && selectedDepartment) {
      setFormData(prev => ({
        ...prev,
        collegeName: `MAHE-${selectedDepartment}`
      }))
    } else if (isUniversityStudent === false) {
      setFormData(prev => ({
        ...prev,
        collegeName: ''
      }))
    }
  }, [isUniversityStudent, selectedDepartment])

  const handleSelectStudentType = (value: boolean) => {
    setIsUniversityStudent(value)
    setSelectedDepartment('')
    setError(null)
    setStep('details')
  }

  const handleCancel = async () => {
    const { signOut } = await import('next-auth/react')
    await signOut({ callbackUrl: '/' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.fullName || !formData.mobileNumber || !formData.collegeName) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      setError('Mobile number must be exactly 10 digits')
      setLoading(false)
      return
    }

    if (isUniversityStudent === true && !selectedDepartment) {
      setError('Please select a department')
      setLoading(false)
      return
    }

    try {
      if (!session?.user) {
        setError('Not authenticated')
        return
      }

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: session.user.id,
          email: session.user.email,
          full_name: formData.fullName,
          mobile_number: formData.mobileNumber,
          college_name: formData.collegeName,
          registration_number: formData.registrationNumber || null,
          is_university_student: isUniversityStudent,
        })

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This mobile number is already registered')
        } else {
          setError('Failed to create profile. Please try again.')
        }
        setLoading(false)
        return
      }

      router.push('/profile')
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-4 py-12 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'student-type' ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-5xl font-bold text-white michroma-regular tracking-tight leading-tight uppercase">
                    Identity
                  </h1>
                  <p className="text-neutral-500 text-[10px] font-black tracking-[0.3em] uppercase">Set your academic standing</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <button
                    onClick={() => handleSelectStudentType(true)}
                    className="group relative flex items-center justify-between w-full rounded-3xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-blue-500/30 p-7 transition-all duration-500 ease-out active:scale-[0.98]"
                  >
                    <div className="text-left space-y-1">
                      <p className="text-white font-semibold text-xl tracking-tight">MAHE Student</p>
                      <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest opacity-60">Internal Registration</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                    </div>
                  </button>

                  <button
                    onClick={() => handleSelectStudentType(false)}
                    className="group relative flex items-center justify-between w-full rounded-3xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] hover:border-blue-500/30 p-7 transition-all duration-500 ease-out active:scale-[0.98]"
                  >
                    <div className="text-left space-y-1">
                      <p className="text-white font-semibold text-xl tracking-tight">External</p>
                      <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest opacity-60">Open Registration</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
                      <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white" />
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep('student-type')}
                    className="group flex items-center text-neutral-500 hover:text-white transition-all text-[10px] uppercase tracking-[0.2em] font-black outline-none"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>
                  <div className="h-px flex-1 mx-6 bg-white/[0.05]"></div>
                  <span className="text-[10px] text-blue-500/60 uppercase tracking-[0.2em] font-black">02/02</span>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold text-white michroma-regular leading-tight uppercase">
                    Details
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-5">
                    {isUniversityStudent && (
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-black ml-1">Department</label>
                        <div className="relative group">
                          <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.04] px-5 py-4 text-white text-sm focus:border-blue-500/40 focus:outline-none transition-all appearance-none cursor-pointer group-hover:border-white/[0.1] outline-none"
                            required
                          >
                            <option value="" className="bg-neutral-900">Select Department</option>
                            {MANIPAL_DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept} className="bg-neutral-900">{dept}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-black ml-1">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] px-5 py-4 text-white text-sm placeholder-neutral-800 focus:border-blue-500/40 focus:outline-none transition-all outline-none"
                        placeholder="e.g. John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-black ml-1">Mobile</label>
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] px-5 py-4 text-white text-sm placeholder-neutral-800 focus:border-blue-500/40 focus:outline-none transition-all outline-none"
                        placeholder="10 digit contact"
                        maxLength={10}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-black ml-1">College</label>
                      <input
                        type="text"
                        value={formData.collegeName}
                        onChange={(e) => !isUniversityStudent && setFormData({ ...formData, collegeName: e.target.value })}
                        disabled={isUniversityStudent}
                        className={`w-full rounded-2xl border px-5 py-4 text-sm transition-all focus:outline-none outline-none ${isUniversityStudent
                          ? 'border-white/[0.01] bg-white/[0.01] text-neutral-600 cursor-not-allowed italic'
                          : 'border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] text-white placeholder-neutral-800 focus:border-blue-500/40'
                          }`}
                        placeholder={isUniversityStudent ? 'Determined by Dept' : 'e.g. Stanford University'}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-black ml-1">Registration</label>
                      <input
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        className="w-full rounded-2xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] px-5 py-4 text-white text-sm placeholder-neutral-800 focus:border-blue-500/40 focus:outline-none transition-all outline-none"
                        placeholder="Reg Number (Optional)"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-500 text-[10px] text-center font-black uppercase tracking-[0.2em]"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2.5] rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed py-5 text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-blue-500/20 active:scale-[0.97] outline-none"
                    >
                      {loading ? 'Submitting...' : 'Confirm Profile'}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] text-white text-[10px] uppercase tracking-[0.2em] font-black transition-all duration-500 outline-none"
                    >
                      Exit
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      <div className="mt-8 z-10">
        <p className="text-[10px] text-neutral-600 uppercase tracking-[0.5em] font-black opacity-40">Technical Solstice '26</p>
      </div>
    </div>
  )
}

export default CompleteProfile
