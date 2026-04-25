'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Calendar, BookOpen, Image as ImageIcon, User, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import TiltCard from '@/components/TiltCard'

export default function DashboardHome() {
  const [apologies, setApologies] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/apology')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setApologies(data)
      })
      .catch(err => console.error(err))
  }, [])

  const handleForgiven = async (id: string) => {
    try {
      const res = await fetch(`/api/apology/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setApologies(prev => prev.filter(a => a.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const item: any = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: [0.23, 1, 0.32, 1] } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-32 sm:space-y-48 flex flex-col items-center px-4 py-20"
    >
      {/* The Biswas Standard Hero - Absolute Centering */}
      <header className="text-center space-y-12 sm:space-y-20 w-full max-w-5xl flex flex-col items-center">
        <motion.div 
          variants={item} 
          className="relative perspective-container"
        >
           <motion.div 
             animate={{ 
               rotateY: [0, 10, -10, 0],
               rotateX: [0, -5, 5, 0],
               y: [0, -10, 0]
             }}
             transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
             className="relative z-10 preserve-3d"
           >
             <Heart size={140} fill="currentColor" strokeWidth={0.5} className="text-primary sm:w-[180px] sm:h-[180px] w-[120px] h-[120px] drop-shadow-2xl" />
           </motion.div>
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
             transition={{ repeat: Infinity, duration: 4 }}
             className="absolute inset-[-40px] bg-primary/20 rounded-full blur-[100px] -z-10"
           />
        </motion.div>
        
        <div className="space-y-8 flex flex-col items-center w-full">
          <motion.div variants={item} className="space-y-6 w-full">
            <h1 className="font-editorial text-on-surface tracking-tighter leading-[0.9] text-center" style={{ fontSize: 'clamp(3.5rem, 18vw, 8rem)' }}>
              Mampi Biswas
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-primary/60 font-editorial italic text-xl sm:text-2xl">
               <div className="flex items-center gap-3">
                 <Calendar size={20} strokeWidth={1.5} /> 03.09.2003
               </div>
               <span className="opacity-30 hidden sm:block">/</span>
               <div className="flex items-center gap-3">
                 <Clock size={20} strokeWidth={1.5} /> 21:00:00
               </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="w-full max-w-4xl mx-auto py-12 sm:py-20 px-8 sm:px-16 glass rounded-[3rem] relative flex flex-col items-center text-center overflow-hidden">
             <p className="text-2xl sm:text-4xl md:text-5xl font-editorial text-on-surface leading-snug sm:leading-tight italic relative z-10">
               "The world gained a special light at 21:00...<br/>
               A soul destined to be the heart of this Sanctuary.<br/>
               In every whisper, your heartbeat resonates."
             </p>
             <div className="mt-10 flex justify-center gap-4 opacity-30">
               {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" className="text-primary" />)}
             </div>
             {/* Subtle background glow */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </header>

      {/* Sanctuary Board - The Biswas Center */}
      <motion.div variants={item} className="w-full max-w-7xl perspective-container">
        <div className="sanctuary-board">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16 w-full">
            <Link href="/moments">
              <TiltCard>
                <div className="surface-card h-full space-y-10 group">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                    <Calendar size={48} strokeWidth={1} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-editorial text-on-surface">Moments</h2>
                    <p className="text-on-surface-variant/50 font-editorial italic text-2xl leading-snug">Timestamps of our shared history.</p>
                  </div>
                </div>
              </TiltCard>
            </Link>

            <Link href="/gallery">
              <TiltCard>
                <div className="surface-card h-full space-y-10 group">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-editorial text-on-surface">Archive</h2>
                    <p className="text-on-surface-variant/50 font-editorial italic text-2xl leading-snug">Visual fragments of our light.</p>
                  </div>
                </div>
              </TiltCard>
            </Link>

            <Link href="/diary">
              <TiltCard>
                <div className="surface-card h-full space-y-10 group">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                    <BookOpen size={48} strokeWidth={1} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-editorial text-on-surface">Reflection</h2>
                    <p className="text-on-surface-variant/50 font-editorial italic text-2xl leading-snug">Whispers saved for eternity.</p>
                  </div>
                </div>
              </TiltCard>
            </Link>
          </div>

          {/* Presence Section - Strictly Centered */}
          <div className="pt-32 mt-32 border-t border-primary/10 flex flex-col items-center space-y-16 w-full">
            <div className="text-center space-y-6 flex flex-col items-center">
              <p className="text-[12px] font-bold uppercase tracking-[1em] text-primary/60">Identity Presence</p>
              <h3 className="text-4xl font-editorial text-on-surface-variant/50 italic">Sculpt your timeless sanctuary essence.</h3>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href="/profile" className="px-16 py-8 bg-white/80 backdrop-blur-md rounded-full flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.5em] text-primary hover:bg-primary hover:text-white transition-all shadow-premium border border-primary/5">
                <User size={20} strokeWidth={1.5} /> Account Settings
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Emerging Healing Haven Reflections */}
      {apologies.length > 0 && (
        <motion.div variants={item} className="w-full max-w-5xl py-24 px-4 flex flex-col items-center border-t border-primary/10">
          <div className="text-center space-y-6 mb-20">
            <h3 className="text-6xl font-editorial text-[#ba1a1a]">Healing Reflections</h3>
            <p className="text-on-surface-variant/50 italic font-editorial text-2xl">Whispers of reconciliation awaiting your grace.</p>
          </div>
          
          <div className="w-full space-y-12">
            {apologies.map((apology) => (
              <TiltCard key={apology.id}>
                <div className="p-12 rounded-[3rem] glass space-y-8 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#ba1a1a]/40" />
                  <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-[#ba1a1a]/70">
                    <span className="flex items-center gap-3"><Heart size={14} fill="#ba1a1a" /> {apology.user?.username || 'Soulmate'}</span>
                    <span>{new Date(apology.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-10 pl-6">
                    <p className="text-3xl sm:text-4xl font-editorial italic text-on-surface leading-relaxed flex-1">"{apology.message}"</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleForgiven(apology.id)}
                      className="px-10 py-5 bg-[#ba1a1a] text-white rounded-full text-[11px] font-bold uppercase tracking-widest shadow-premium opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0"
                    >
                      Forgiven
                    </motion.button>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Decorative Finality */}
      <motion.div variants={item} className="flex flex-col items-center gap-12 opacity-30 py-40 pb-64">
        <Sparkles size={100} strokeWidth={1} className="text-primary" />
        <p className="text-[12px] font-bold uppercase tracking-[1.2em] text-on-surface text-center">Our Everlasting Fragment</p>
      </motion.div>
    </motion.div>
  )
}
