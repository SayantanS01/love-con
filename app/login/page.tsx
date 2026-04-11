'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Lock, User, Sparkles, Loader2, Info } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (res.ok) {
        window.location.href = '/'
      } else {
        const data = await res.json()
        setError(data.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background px-4 py-12 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-container rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, -30, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-secondary-container rounded-full blur-[120px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl z-10 mx-auto"
      >
        <div className="glass rounded-[4rem] p-8 sm:p-20 shadow-premium text-center relative border-none flex flex-col items-center">
          {/* Top Notch Decor */}
          <div className="w-48 h-12 bg-primary/5 rounded-b-[2rem] absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
             <div className="w-12 h-1 bg-primary/20 rounded-full" />
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-primary mt-8 mb-8 flex justify-center"
          >
            <Heart size={100} fill="currentColor" strokeWidth={1} />
          </motion.div>

          <h1 className="text-5xl sm:text-7xl font-editorial text-on-surface tracking-tighter mb-4 leading-tight">The Sanctuary</h1>
          <p className="text-on-surface-variant/60 font-editorial italic text-xl mb-12 px-4 max-w-md mx-auto">Whisper your secret to enter our shared world.</p>

          <form onSubmit={handleSubmit} className="space-y-8 text-left w-full max-w-[380px] mx-auto px-4">
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary ml-4 flex items-center gap-2">
                <User size={14} strokeWidth={1} /> Identity
              </label>
              <div className="relative">
                <input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your username"
                  className="w-full bg-surface-container border-none rounded-full px-8 py-6 focus:ring-4 focus:ring-primary/5 transition-all text-xl outline-none placeholder:text-on-surface-variant/20 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary ml-4 flex items-center gap-2">
                <Lock size={14} strokeWidth={1} /> Secret Code
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container border-none rounded-full px-8 py-6 focus:ring-4 focus:ring-primary/5 transition-all text-xl outline-none shadow-sm"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 text-[#ba1a1a] p-6 rounded-[2.5rem] text-[10px] flex items-center gap-4 font-bold uppercase tracking-[0.3em] shadow-sm border border-red-100"
                >
                  <Info size={18} strokeWidth={1} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-primary text-white py-7 rounded-full font-bold text-xl shadow-premium hover:shadow-2xl transition-all flex items-center justify-center gap-4 mt-12 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={28} strokeWidth={1} />
              ) : (
                <>
                  <Sparkles size={24} strokeWidth={1} />
                  <span>Enter Sanctuary</span>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-16 flex justify-center gap-3">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer Sparkle */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none hidden sm:block">
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-on-surface text-center">Built for Love • 2024</p>
      </div>
    </div>
  )
}
