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
    <div className="max-w-7xl mx-auto space-y-24 pb-32 flex flex-col items-center">
      {/* Centered Hero Identification */}
      <header className="text-center space-y-8 gsap-entrance">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center text-primary mx-auto relative group shadow-premium"
        >
          <User size={96} strokeWidth={1} />
          <div className="absolute inset-0 bg-primary/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-1000 opacity-0 group-hover:opacity-100" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -bottom-2 -right-2 bg-white p-4 rounded-full shadow-md text-primary">
            <Sparkles size={24} strokeWidth={1} />
          </motion.div>
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-8xl font-editorial text-on-surface tracking-tighter leading-none">Your Identity</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-2xl">A balanced reflection of your presence in our world.</p>
        </div>
      </header>

      {/* Synchronized Full-Width Board */}
      <div className="sanctuary-board w-full flex flex-col items-center gap-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 w-full items-start">
          
          {/* Detailed Fragments (User Info) */}
          <div className="space-y-16">
            <div className="space-y-12">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary flex items-center gap-3">
                <User size={14} strokeWidth={1} /> Fragment of Existence
              </h2>
              
              <div className="space-y-10 group/item">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest px-1">Chosen Username</span>
                  <div className="bg-surface-container-low rounded-3xl p-8 flex items-center justify-between group-hover/item:bg-primary/5 transition-colors duration-500">
                    <p className="text-4xl font-editorial text-on-surface">{userData.username}</p>
                    <Mail size={24} className="text-primary/20" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest px-1">Sanctuary Role</span>
                  <div className="bg-surface-container-low rounded-3xl p-8 flex items-center justify-between group-hover/item:bg-primary/5 transition-colors duration-500">
                    <p className="text-4xl font-editorial text-primary">{userData.role}</p>
                    {userData.role === 'ADMIN' && <ShieldCheck size={28} className="text-primary" strokeWidth={1} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-primary/5 flex items-center gap-4 text-on-surface-variant/40 italic font-editorial text-xl">
              <Calendar size={28} strokeWidth={1} />
              <span>Registered in the Archive: 2024</span>
            </div>
          </div>

          {/* Secret Code Manifest (Password Form) */}
          <div className="space-y-12">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary flex items-center gap-3">
              <Lock size={14} strokeWidth={1} /> Secure Reflection
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest px-4">New Secret Code</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-white/60 border-none rounded-full px-12 py-8 focus:ring-4 focus:ring-primary/5 transition-all text-2xl outline-none shadow-sm italic font-editorial"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isChanging || !newPassword.trim()}
                className={`w-full py-8 rounded-full font-bold text-xs uppercase tracking-[0.5em] shadow-premium transition-all flex items-center justify-center gap-4 disabled:opacity-50 ${
                  success ? 'bg-green-500 text-white' : 'bg-primary text-white'
                }`}
              >
                {isChanging ? <Loader2 className="animate-spin" size={24} strokeWidth={1} /> : success ? <Check size={24} strokeWidth={1} /> : <Lock size={24} strokeWidth={1} />}
                <span>{success ? 'Code Sealed' : 'Update Secret Code'}</span>
              </motion.button>
            </form>

            <div className="p-10 bg-primary/5 rounded-[2.5rem] border border-primary/5">
               <p className="text-xs text-on-surface-variant/60 leading-relaxed tracking-wider font-sans font-medium uppercase">
                 * Ensure your secret code is memorable yet protective. A reflection of your commitment to our world's security.
               </p>
            </div>
          </div>
        </div>

        {/* Distributed Centered Logout */}
        <div className="w-full pt-12 border-t border-primary/5 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              window.location.href = '/login'
            }}
            className="flex items-center gap-6 text-on-surface-variant/40 hover:text-[#ba1a1a] transition-all font-bold uppercase tracking-[0.6em] text-xs group"
          >
            <LogOut size={32} strokeWidth={1} className="group-hover:rotate-12 transition-transform" />
            <span>Evaporate Presence</span>
          </motion.button>
        </div>
      </div>
    </div>
  )
}
