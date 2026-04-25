'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, Calendar, LogOut, Sparkles, Heart, Loader2, Check, ShieldCheck, Mail } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function ProfilePage() {
  const { primaryColor } = useTheme()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [newPassword, setNewPassword] = useState('')
  const [isChanging, setIsChanging] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUserData(data)
        setLoading(false)
      })
  }, [])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword.trim() || isChanging) return
    setIsChanging(true)
    
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })

      if (res.ok) {
        setSuccess(true)
        setNewPassword('')
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsChanging(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2 className="animate-spin text-primary" size={48} strokeWidth={1} />
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-32 pb-48 flex flex-col items-center px-6">
      {/* Centered Hero Identification */}
      <header className="text-center space-y-12 gsap-entrance relative pt-20">
        {/* Floating Decor */}
        <div className="candy-glow w-[400px] h-[400px] bg-primary/5 top-0 left-1/2 -translate-x-1/2" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          <div className="w-56 h-56 bg-white rounded-full flex items-center justify-center text-primary mx-auto relative shadow-vibrant border-4 border-white/80">
            <User size={100} strokeWidth={1} />
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ repeat: Infinity, duration: 4 }} 
              className="absolute -bottom-2 -right-2 bg-vibrant-gradient p-5 rounded-full shadow-premium text-white"
            >
              <ShieldCheck size={32} strokeWidth={1.5} />
            </motion.div>
          </div>
        </motion.div>
        
        <div className="space-y-4 relative z-10">
          <h1 className="text-7xl sm:text-9xl font-editorial text-vibrant-gradient tracking-tighter leading-none">Your Identity</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-2xl sm:text-3xl max-w-2xl mx-auto">"A balanced reflection of your presence in our world."</p>
        </div>
      </header>

      {/* Synchronized Board */}
      <div className="sanctuary-board w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 w-full items-start relative z-10">
          
          {/* Detailed Fragments (User Info) */}
          <div className="space-y-16">
            <div className="space-y-12">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary/60 flex items-center gap-4">
                <Sparkles size={16} strokeWidth={1.5} /> Fragment of Existence
              </h2>
              
              <div className="space-y-12">
                <div className="space-y-4 group">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant/30 tracking-[0.4em] px-2">Chosen Username</span>
                  <div className="bg-white/40 rounded-[2rem] p-10 flex items-center justify-between border border-white/60 shadow-sm transition-all group-hover:border-primary/20">
                    <p className="text-4xl sm:text-5xl font-editorial text-on-surface">{userData.username}</p>
                    <Mail size={28} className="text-primary/30" strokeWidth={1} />
                  </div>
                </div>

                <div className="space-y-4 group">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant/30 tracking-[0.4em] px-2">Sanctuary Role</span>
                  <div className="bg-white/40 rounded-[2rem] p-10 flex items-center justify-between border border-white/60 shadow-sm transition-all group-hover:border-primary/20">
                    <p className="text-4xl sm:text-5xl font-editorial text-vibrant-gradient font-bold">{userData.role}</p>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Lock size={20} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-primary/5 flex items-center gap-6 text-on-surface-variant/40 italic font-editorial text-2xl">
              <Calendar size={32} strokeWidth={1} className="text-primary" />
              <span>Registered in the Archive: 2024</span>
            </div>
          </div>

          {/* Secret Code Manifest (Password Form) */}
          <div className="space-y-16">
            <div className="space-y-12">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary/60 flex items-center gap-4">
                <Lock size={16} strokeWidth={1.5} /> Secure Reflection
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-bold text-on-surface-variant/30 uppercase tracking-[0.4em] px-4">New Secret Code</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Whisper a new code..."
                      className="premium-input text-2xl h-24 italic font-editorial px-12"
                    />
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 text-primary/20">
                      <Heart size={24} />
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isChanging || !newPassword.trim()}
                  className={`w-full h-24 rounded-full font-bold text-xs uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-6 disabled:opacity-50 ${
                    success ? 'bg-green-500 text-white shadow-[0_15px_30px_rgba(34,197,94,0.3)]' : 'premium-button'
                  }`}
                >
                  {isChanging ? <Loader2 className="animate-spin" size={28} strokeWidth={1.5} /> : success ? <Check size={28} strokeWidth={2} /> : <Lock size={28} strokeWidth={1.5} />}
                  <span>{success ? 'Code Sealed' : 'Update Secret Code'}</span>
                </motion.button>
              </form>

              <div className="p-10 bg-white/40 rounded-[2.5rem] border border-white/60 italic text-on-surface-variant/50 text-xl font-editorial leading-relaxed">
                 <p>
                   "Ensure your secret code is memorable yet protective. A reflection of your commitment to our world's security."
                 </p>
              </div>
            </div>
          </div>
        </div>

        {/* Distributed Centered Logout */}
        <div className="w-full mt-24 pt-16 border-t border-primary/5 flex justify-center relative z-10">
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/login'
            }}
            className="flex flex-col items-center gap-6 text-on-surface-variant/40 hover:text-primary transition-all group"
          >
            <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <LogOut size={32} strokeWidth={1} className="group-hover:rotate-12 transition-transform" />
            </div>
            <span className="font-bold uppercase tracking-[0.8em] text-[10px]">Evaporate Presence</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
