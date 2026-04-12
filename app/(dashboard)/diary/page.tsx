'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Plus, Heart, Sparkles, User, Loader2, MessageSquare, Trash2 } from 'lucide-react'
import NewDiaryEntry from '@/components/NewDiaryEntry'
import DiaryEntryCard from '@/components/DiaryEntryCard'

interface DiaryEntry {
  id: string
  content: string
  moodTag?: string
  photoUrl?: string
  date: string
  userId: string
  replies?: string
  user: { username: string }
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/diary')
      if (res.ok) setEntries(await res.json())
    } catch (err) {
      console.error('Failed to fetch diary')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEntries()
  }, [])

  return (
    <div className="space-y-24 gsap-entrance flex flex-col items-center">
      <header className="text-center space-y-8 max-w-4xl">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="text-primary flex justify-center"
        >
          <BookOpen size={100} strokeWidth={1} />
        </motion.div>
        
        <div className="space-y-4 w-full">
          <h1 className="font-editorial text-on-surface tracking-tight leading-none break-words w-full px-6 overflow-visible py-2" style={{ fontSize: 'clamp(3rem, 15vw, 6rem)' }}>Whispered Diary</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-xl sm:text-3xl px-2">Deep reflections saved for eternity.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddOpen(true)}
          className="px-12 py-6 bg-primary text-white rounded-full font-bold uppercase tracking-[0.5em] text-xs shadow-premium flex items-center gap-4 mx-auto"
        >
          <Plus size={20} strokeWidth={2} /> Pen a New Reflection
        </motion.button>
      </header>

      <div className="sanctuary-board w-full">
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-primary/20" size={64} strokeWidth={1} />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-40 space-y-6">
            <p className="text-4xl font-editorial text-on-surface-variant/20 italic">No whispers have reached these pages yet...</p>
            <p className="text-xs uppercase font-bold tracking-[0.4em] text-primary/40">Open your heart and write the first entry.</p>
          </div>
        ) : (
          <div className="space-y-32 flex flex-col items-center">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl"
              >
                <DiaryEntryCard 
                  entry={entry} 
                  index={index}
                  onUpdated={fetchEntries} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-on-surface/5 backdrop-blur-3xl">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-4xl"
            >
              <NewDiaryEntry 
                onClose={() => setIsAddOpen(false)} 
                onSuccess={fetchEntries} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
