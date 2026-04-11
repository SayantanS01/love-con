'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Send, Smile, Image as ImageIcon, Loader2, Sparkles, Upload } from 'lucide-react'

interface Props {
  onSuccess: () => void
  onClose: () => void
}

const moodTags = ['Happy', 'Romantic', 'Thoughtful', 'Missing You', 'Cozy', 'Excited']

export default function NewDiaryEntry({ onSuccess, onClose }: Props) {
  const [content, setContent] = useState('')
  const [moodTag, setMoodTag] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setImageUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || loading) return

    setLoading(true)
    try {
      let finalUrl = imageUrl

      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          finalUrl = uploadData.url
        }
      }

      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, moodTag, photoUrl: finalUrl || null })
      })

      if (res.ok) {
        onSuccess()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto w-full relative z-20 flex flex-col items-center justify-center my-auto"
    >
      {/* The Biswas Standard - CENTERED SCREEN POP */}
      <div className="glass rounded-[3rem] p-10 sm:p-20 shadow-premium border-none relative flex flex-col items-center text-center max-h-[95vh] overflow-y-auto w-full scrollbar-hide py-16">
        
        {/* Header - Fixed Overlap & Cutting */}
        <div className="flex flex-col items-center w-full relative mb-12 sm:pt-10">
          <button 
            onClick={onClose} 
            className="absolute -top-10 -right-2 sm:top-0 sm:right-4 p-4 hover:bg-primary/5 rounded-full transition-all text-on-surface-variant/40 hover:text-primary shrink-0 z-10"
          >
            <X size={36} strokeWidth={1} />
          </button>
          
          <div className="space-y-3 pt-6 flex flex-col items-center">
            <p className="text-[12px] uppercase tracking-[0.8em] font-bold text-primary">Soul Reflection</p>
            <h3 className="font-editorial text-6xl sm:text-8xl text-on-surface tracking-tighter leading-none">Soul Pour</h3>
            <p className="text-on-surface-variant/40 font-editorial italic text-2xl sm:text-4xl px-8 text-center leading-snug">Capture the essence of this shared heartbeat.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 sm:space-y-16 w-full max-w-4xl flex flex-col items-center">
          <div className="relative w-full">
            <textarea
              autoFocus
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's whispering in your heart today?"
              className="w-full bg-surface-container-low border-none rounded-[2rem] p-12 sm:p-16 font-editorial text-3xl sm:text-5xl leading-tight focus:outline-none focus:ring-12 focus:ring-primary/5 placeholder:text-on-surface-variant/10 transition-all resize-none shadow-sm outline-none italic text-center"
            />
          </div>

          <div className="flex flex-col items-center gap-12 sm:gap-16 w-full">
            <div className="space-y-6 flex flex-col items-center">
              <label className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/60 flex items-center gap-2">
                <Smile size={16} strokeWidth={1} /> Mood Resonance
              </label>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-2">
                {moodTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setMoodTag(tag === moodTag ? '' : tag)}
                    className={`px-8 py-3 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-700 shadow-sm ${
                      moodTag === tag 
                        ? 'bg-primary text-white shadow-premium scale-110' 
                        : 'bg-white text-on-surface-variant hover:bg-primary/5 hover:text-primary'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8 w-full max-w-xl flex flex-col items-center px-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/60 flex items-center gap-2">
                <ImageIcon size={16} strokeWidth={1} /> Visual Link (Optional)
              </label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="w-full bg-white border-none rounded-full px-12 py-6 text-lg font-bold flex items-center justify-center gap-4 cursor-pointer hover:bg-primary/5 transition-all text-primary/60 shadow-sm border border-primary/5"
               >
                 <Upload size={18} />
                 <span className="truncate max-w-[200px]">{file ? file.name : 'Select Local Photo'}</span>
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
               </div>
            </div>
          </div>

          <div className="flex justify-center pt-8 pb-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading || !content.trim()}
              className="bg-primary text-white px-24 py-8 rounded-full font-bold shadow-premium hover:shadow-2xl transition-all flex items-center gap-5 disabled:opacity-50 uppercase tracking-[0.8em] text-[10px] group"
            >
              {loading ? <Loader2 size={28} className="animate-spin text-white/50" /> : <Send size={28} strokeWidth={1} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />}
              <span>Seal Reflection</span>
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
