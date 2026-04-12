'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Heart, Sparkles, User, Camera, Trash2, Loader2, MapPin } from 'lucide-react'
import AddMomentOverlay from '@/components/AddMomentOverlay'

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
          className="text-primary flex justify-center"
        >
          <Calendar size={100} strokeWidth={1} />
        </motion.div>
        
        <div className="space-y-4 w-full">
          <h1 className="font-editorial text-on-surface tracking-tight leading-none break-words w-full px-6 overflow-visible py-2" style={{ fontSize: 'clamp(3rem, 15vw, 6rem)' }}>Shared Moments</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-xl sm:text-3xl px-2">The rhythmic timestamps of our collective heartbeats.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddOpen(true)}
          className="px-12 py-6 bg-primary text-white rounded-full font-bold uppercase tracking-[0.5em] text-xs shadow-premium flex items-center gap-4 mx-auto"
        >
          <Plus size={20} strokeWidth={2} /> Capture New Fragment
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
            {moments.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col space-y-8 ${index % 2 !== 0 ? 'md:mt-32' : ''}`}
              >
                {moment.photoUrl && (
                  <div className="aspect-[4/5] overflow-hidden rounded-[3rem] shadow-premium relative group">
                    <img 
                      src={moment.photoUrl} 
                      alt={moment.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                       <span className="text-white/80 text-[10px] uppercase font-bold tracking-[0.4em] flex items-center gap-2">
                         <Camera size={12} /> Captured Reflection
                       </span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6 px-4">
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">
                    <div className="flex items-center gap-2 text-primary">
                      <Heart size={14} fill="currentColor" /> {moment.user.username}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-2">
                      <MapPin size={12} /> {new Date(moment.date).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <h3 className="text-5xl font-editorial text-on-surface leading-tight tracking-tight">{moment.title}</h3>
                  <p className="text-2xl font-editorial text-on-surface-variant/60 leading-relaxed italic">{moment.note}</p>
                </div>
              </motion.div>
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
