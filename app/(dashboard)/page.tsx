'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Calendar, BookOpen, Image as ImageIcon, User, Clock, Star } from 'lucide-react'
import Link from 'next/link'

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  }

  const item: any = {
    hidden: { opacity: 0, y: 30, scale: 1 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-40 flex flex-col items-center px-4"
    >
      {/* The Biswas Standard Hero - Absolute Centering */}
      <header className="text-center space-y-16 max-w-5xl pt-16 flex flex-col items-center">
        <motion.div variants={item} className="flex justify-center mb-4">
           <div className="relative">
             <Heart size={160} fill="currentColor" strokeWidth={1} className="text-primary" />
             <motion.div 
               animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
               transition={{ repeat: Infinity, duration: 4 }}
               className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10"
             />
           </div>
        </motion.div>
        
        <div className="space-y-10 flex flex-col items-center">
          <motion.div variants={item} className="space-y-6">
            <h1 className="text-8xl sm:text-[11rem] font-editorial text-on-surface tracking-tighter leading-[0.85] mb-4 text-center">Mampi Biswas</h1>
            <div className="flex flex-wrap items-center justify-center gap-10 text-primary/50 font-editorial italic text-3xl">
               <div className="flex items-center gap-4">
                 <Calendar size={28} strokeWidth={1} /> 03.09.2003
               </div>
               <span className="opacity-20 hidden sm:block">•</span>
               <div className="flex items-center gap-4">
                 <Clock size={28} strokeWidth={1} /> 21:00:00
               </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="max-w-4xl mx-auto py-16 px-12 glass rounded-[2.5rem] border-none shadow-sm relative overflow-visible flex flex-col items-center text-center">
             <p className="text-3xl sm:text-5xl font-editorial text-on-surface leading-tight italic max-w-2xl px-4">
               "The world gained a special light at 21:00...<br/>
               A soul destined to be the heart of this Sanctuary.<br/>
               In every whisper, your heartbeat resonates."
             </p>
             <div className="mt-12 flex justify-center gap-3">
               {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" className="text-primary/10" />)}
             </div>
          </motion.div>
        </div>
      </header>

      {/* Sanctuary Board - The Biswas Center */}
      <motion.div variants={item} className="sanctuary-board w-full max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 w-full">
          {/* Dashboard Quick Links */}
          <Link href="/moments" className="group">
            <div className="surface-card h-full space-y-10 group-hover:bg-primary/5">
              <div className="w-24 h-24 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:rotate-6 transition-all duration-700">
                <Calendar size={48} strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-editorial text-on-surface">Moments</h2>
                <p className="text-on-surface-variant/50 font-editorial italic text-2xl leading-snug">Timestamps of our shared history.</p>
              </div>
            </div>
          </Link>

          <Link href="/gallery" className="group">
            <div className="surface-card h-full space-y-10 group-hover:bg-primary/5">
              <div className="w-24 h-24 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:rotate-6 transition-all duration-700">
                <ImageIcon size={48} strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-editorial text-on-surface">Archive</h2>
                <p className="text-on-surface-variant/50 font-editorial italic text-2xl leading-snug">Visual fragments of our light.</p>
              </div>
            </div>
          </Link>

          <Link href="/diary" className="group">
            <div className="surface-card h-full space-y-10 group-hover:bg-primary/5">
              <div className="w-24 h-24 bg-primary/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:rotate-6 transition-all duration-700">
                <BookOpen size={48} strokeWidth={1} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-editorial text-on-surface">Reflection</h2>
                <p className="text-on-surface-variant/50 font-editorial italic text-2xl leading-snug">Whispers saved for eternity.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Presence Section - Strictly Centered */}
        <div className="pt-32 border-t border-primary/5 flex flex-col items-center space-y-20 w-full">
          <div className="text-center space-y-8 flex flex-col items-center">
            <p className="text-[12px] font-bold uppercase tracking-[0.8em] text-primary">Identity Presence</p>
            <h3 className="text-4xl font-editorial text-on-surface-variant/40 italic">Sculpt your timeless sanctuary essence.</h3>
          </div>
          
          <div className="flex flex-wrap justify-center gap-12">
            <Link href="/profile" className="px-20 py-10 bg-white rounded-full flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.6em] text-primary hover:bg-primary hover:text-white transition-all shadow-premium border border-primary/5">
              <User size={24} strokeWidth={1} /> Account Settings
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Emerging Healing Haven Reflections */}
      {apologies.length > 0 && (
        <motion.div variants={item} className="w-full max-w-4xl py-20 px-4 flex flex-col items-center border-t border-primary/5 mt-10">
          <div className="text-center space-y-4 mb-16">
            <h3 className="text-5xl font-editorial text-[#ba1a1a]">Recent Reflections</h3>
            <p className="text-on-surface-variant/40 italic font-editorial text-2xl">Echoes of healing from the past 72 hours.</p>
          </div>
          
          <div className="w-full space-y-8">
            {apologies.map((apology) => (
              <div key={apology.id} className="p-10 rounded-[2.5rem] glass border-none shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#ba1a1a]/20" />
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#ba1a1a]/60">
                  <span className="flex items-center gap-2"><Heart size={12} fill="#ba1a1a" /> {apology.user?.username || 'Unknown'}</span>
                  <span>{new Date(apology.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-editorial italic text-on-surface leading-relaxed pl-4">"{apology.message}"</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Decorative Finality */}
      <motion.div variants={item} className="flex flex-col items-center gap-10 opacity-20 py-32 pb-60">
        <Sparkles size={80} className="text-primary" />
        <p className="text-[12px] font-bold uppercase tracking-[1em] text-on-surface text-center">Our Everlasting Fragment</p>
      </motion.div>
    </motion.div>
  )
}
