'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Heart, Sparkles, User, Camera, Trash2, Loader2, MapPin } from 'lucide-react'
import AddMomentOverlay from '@/components/AddMomentOverlay'
import TiltCard from '@/components/TiltCard'

interface Moment {
  id: string
  title: string
  date: string
  photoUrl?: string
  note?: string
  userId: string
  user: { username: string }
}

export default function MomentsPage() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchMoments = async () => {
    try {
      const res = await fetch('/api/moments')
      if (res.ok) setMoments(await res.json())
    } catch (err) {
      console.error('Failed to fetch moments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMoments()
  }, [])

  return (
    <div className="space-y-24 gsap-entrance flex flex-col items-center">
      <header className="text-center space-y-8 max-w-4xl">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="text-primary flex justify-center drop-shadow-[0_0_20px_rgba(255,51,102,0.3)]"
        >
          <Calendar size={120} strokeWidth={1} />
        </motion.div>
        
        <div className="space-y-6 w-full">
          <h1 className="font-editorial text-vibrant-gradient tracking-tighter leading-none break-words w-full px-6 overflow-visible py-2" style={{ fontSize: 'clamp(3.5rem, 18vw, 8rem)' }}>Shared Moments</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-2xl sm:text-4xl px-2">The rhythmic timestamps of our collective heartbeats.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddOpen(true)}
          className="px-14 py-7 bg-vibrant-gradient text-white rounded-full font-bold uppercase tracking-[0.5em] text-[11px] shadow-vibrant flex items-center gap-6 mx-auto transition-all"
        >
          <Plus size={24} strokeWidth={2} /> Capture New Fragment
        </motion.button>
      </header>

      <div className="sanctuary-board w-full">
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-primary/20" size={64} strokeWidth={1} />
          </div>
        ) : moments.length === 0 ? (
          <div className="text-center py-40 space-y-6">
            <p className="text-4xl font-editorial text-on-surface-variant/20 italic">No fragments captured in the archive yet...</p>
            <p className="text-xs uppercase font-bold tracking-[0.4em] text-primary/40">Start by adding your first special day.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 w-full px-6 sm:px-20 relative">
            {/* Decorative Glows */}
            <div className="candy-glow w-[500px] h-[500px] bg-primary/5 top-1/4 -left-20" />
            <div className="candy-glow w-[500px] h-[500px] bg-secondary/5 bottom-1/4 -right-20" />

            {moments.map((moment, index) => (
              <TiltCard
                key={moment.id}
                className={`flex flex-col w-full relative z-10 ${index % 2 !== 0 ? 'md:mt-48' : ''}`}
              >
                <div className="space-y-12 text-center sm:text-left flex flex-col items-center sm:items-start">
                  {moment.photoUrl && (
                    <div className="w-full aspect-[4/5] overflow-hidden rounded-[3.5rem] shadow-vibrant relative group border-2 border-white/60">
                      <img 
                        src={moment.photoUrl} 
                        alt={moment.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10 sm:p-14">
                         <span className="text-white/80 text-[11px] uppercase font-bold tracking-[0.4em] flex items-center gap-3">
                           <Camera size={16} /> Captured Reflection
                         </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-8 px-6">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 text-[11px] font-bold uppercase tracking-[0.4em] text-primary/60">
                      <div className="flex items-center gap-2">
                        <Heart size={16} fill="currentColor" className="text-primary" /> {moment.user.username}
                      </div>
                      <span className="opacity-20">•</span>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} /> {new Date(moment.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    
                    <h3 className="text-5xl sm:text-6xl font-editorial text-on-surface leading-tight tracking-tighter group-hover:text-vibrant-gradient transition-all">{moment.title}</h3>
                    <p className="text-2xl sm:text-3xl font-editorial text-on-surface-variant/40 leading-relaxed italic line-clamp-3">{moment.note}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        )}
      </div>

      <AddMomentOverlay 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={fetchMoments} 
      />
    </div>
  )
}
