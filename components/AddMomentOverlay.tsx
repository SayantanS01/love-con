'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Type, Paperclip, Check, Loader2, Sparkles, Upload } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddMomentOverlay({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setImageUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

      const res = await fetch('/api/moments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, photoUrl: finalUrl || null, note: note || null })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
          onClose()
          setTitle('')
          setImageUrl('')
          setFile(null)
          setNote('')
          setSuccess(false)
        }, 1500)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-20 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-4xl sanctuary-board shadow-premium border-none z-10 my-auto flex flex-col items-center"
          >
            {/* The Biswas Standard Content Fit */}
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col items-center w-full relative mb-10">
                <button 
                  onClick={onClose} 
                  className="absolute -top-4 -right-2 sm:top-0 sm:right-0 p-4 hover:bg-primary/5 rounded-full transition-all text-on-surface-variant/40 hover:text-primary shrink-0 shadow-sm"
                >
                  <X size={32} strokeWidth={1} />
                </button>
                
                <div className="space-y-3 pt-6 flex flex-col items-center">
                   <p className="text-[10px] uppercase tracking-[0.8em] font-bold text-primary">Sanctuary Log</p>
                   <h2 className="text-5xl sm:text-7xl font-editorial text-on-surface tracking-tighter leading-none">Mark the Path</h2>
                   <p className="text-on-surface-variant/40 font-editorial italic text-2xl sm:text-3xl px-4 text-center">Anchor a precious moment in our timeless archive.</p>
                </div>
              </div>

              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-primary w-full"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-32 h-32 bg-primary text-white rounded-full flex items-center justify-center mb-10 shadow-premium"
                  >
                    <Check size={64} strokeWidth={1} />
                  </motion.div>
                  <h3 className="text-5xl font-editorial">Etched in Time</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12 w-full max-w-3xl flex flex-col items-center">
                  <div className="space-y-4 w-full">
                    <label className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary/60 flex items-center justify-center gap-2">
                      <Type size={16} strokeWidth={1} /> Moment Title
                    </label>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give this memory a name..."
                      className="w-full bg-surface-container-low border-none rounded-full px-12 py-8 text-2xl focus:ring-8 focus:ring-primary/5 transition-all outline-none placeholder:text-on-surface-variant/10 shadow-sm italic font-editorial text-center"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary/60 flex items-center justify-center gap-2">
                        <Calendar size={16} strokeWidth={1} /> Day of Record
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-surface-container-low border-none rounded-full px-10 py-8 text-2xl focus:ring-8 focus:ring-primary/5 transition-all text-primary outline-none shadow-sm text-center"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary/60 flex items-center justify-center gap-3">
                        <Paperclip size={16} strokeWidth={1} /> Visual Fragment
                      </label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full bg-surface-container-low rounded-full px-10 py-8 text-xl font-bold flex items-center justify-center gap-4 cursor-pointer hover:bg-primary/5 transition-all text-primary/60 shadow-sm"
                       >
                         <Upload size={20} />
                         <span className="truncate max-w-[150px]">{file ? file.name : 'Select File'}</span>
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                       </div>
                    </div>
                  </div>

                  <div className="space-y-4 w-full">
                    <label className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary/60 flex items-center justify-center gap-2">
                      <Sparkles size={16} strokeWidth={1} /> The Deep Narrative
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="What made this moment special? Share the story..."
                      className="w-full bg-surface-container-low border-none rounded-[1.5rem] p-8 text-2xl focus:ring-8 focus:ring-primary/5 transition-all resize-none shadow-sm outline-none placeholder:text-on-surface-variant/10 font-editorial italic text-center"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || !title.trim()}
                    className="w-full bg-primary text-white py-10 rounded-full font-bold text-[10px] uppercase tracking-[1em] shadow-premium hover:shadow-2xl transition-all flex items-center justify-center gap-5 mt-10 mb-6 group"
                  >
                    {loading ? (
                      <Loader2 size={32} className="animate-spin text-white/50" />
                    ) : (
                      <>
                        <Sparkles size={28} strokeWidth={1} className="group-hover:rotate-12 transition-transform" />
                        <span>Preserve Memory</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
