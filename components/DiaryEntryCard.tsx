'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Heart, User, Clock, Image as ImageIcon, Trash2, Sparkles } from 'lucide-react'

interface Reply {
  id: string
  content: string
  username: string
  timestamp: string
}

interface DiaryEntry {
  id: string
  content: string
  moodTag?: string
  photoUrl?: string
  date: string
  user: { username: string }
  replies?: string // Optional JSON string
}

export default function DiaryEntryCard({ entry, index, onUpdated }: { entry: DiaryEntry, index: number, onUpdated: () => void }) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Safely parse replies
  const replies: Reply[] = JSON.parse(entry.replies || '[]')

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => setUserRole(data?.role))
  }, [])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove this reflection?')) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/diary/${entry.id}`, { method: 'DELETE' })
      if (res.ok) onUpdated()
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/diary/${entry.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      })

      if (res.ok) {
        setReplyContent('')
        setShowReplyInput(false)
        onUpdated()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="surface-card p-10 shadow-premium group relative border border-primary/5 overflow-hidden text-center flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      {/* Mood Glow Decor */}
      {entry.moodTag && (
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
      )}

      {/* Mood Tag Floating */}
      {entry.moodTag && (
        <div className="absolute top-6 right-10 px-4 py-1.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg z-10">
          Mood: {entry.moodTag}
        </div>
      )}

      <div className="flex justify-between items-start mb-10 w-full text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
            <User size={24} strokeWidth={1} />
          </div>
          <div>
            <p className="font-editorial text-xl text-on-surface tracking-tight">{entry.user.username}</p>
            <p className="text-[10px] text-on-surface-variant/40 flex items-center gap-1 uppercase tracking-widest font-bold">
              <Clock size={12} strokeWidth={1} /> {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        {userRole === 'ADMIN' && (
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-3 text-on-surface-variant/20 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
            title="Admin: Delete Entry"
          >
            <Trash2 size={20} strokeWidth={1} />
          </button>
        )}
      </div>

      <div className="space-y-8 w-full text-center flex flex-col items-center">
        <p className="text-2xl font-editorial leading-relaxed text-on-surface whitespace-pre-wrap max-w-2xl italic">
          "{entry.content}"
        </p>

        {entry.photoUrl && (
          <div className="max-w-3xl overflow-hidden rounded-2xl bg-surface-container shadow-premium border border-white/20">
            <img src={entry.photoUrl} alt="Diary attachment" className="w-full h-auto grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[2s] scale-100 group-hover:scale-105" />
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-primary/5 flex items-center justify-between w-full">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60 hover:text-primary hover:opacity-100 transition-all group/btn"
          >
            <MessageSquare size={18} strokeWidth={1} className="group-hover/btn:scale-110 transition-transform" />
            <span>{replies.length} Reflections</span>
          </button>
        </div>
        <motion.div whileTap={{ scale: 0.8 }} className="text-on-surface-variant/20 hover:text-primary transition-colors cursor-pointer">
          <Heart size={24} strokeWidth={1} />
        </motion.div>
      </div>

      {/* Replies Section */}
      <AnimatePresence>
        {(showReplyInput || replies.length > 0) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden w-full"
          >
            <div className="mt-10 pt-8 space-y-6 border-l border-primary/10 ml-6 pl-10 text-left">
              {replies.map((reply) => (
                <div key={reply.id} className="relative">
                  <div className="absolute -left-[45px] top-1/2 -translate-y-1/2 w-3 h-3 bg-primary/20 rounded-full" />
                  <div className="bg-surface-container-low/50 p-6 rounded-xl relative overflow-hidden border border-primary/5">
                    <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{reply.username}</span>
                      <span className="text-[10px] text-on-surface-variant opacity-30 uppercase font-bold tracking-widest">
                        {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-base text-on-surface leading-relaxed">{reply.content}</p>
                  </div>
                </div>
              ))}

              {showReplyInput && (
                <form onSubmit={handleReply} className="flex gap-4 items-center">
                  <input 
                    autoFocus
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Whisper back..."
                    className="flex-1 bg-surface-container-low border border-primary/5 rounded-full px-8 py-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting || !replyContent}
                    className="p-4 bg-primary text-white rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all disabled:opacity-50"
                  >
                    <Send size={18} strokeWidth={1} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
