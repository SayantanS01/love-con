'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Camera, Type, Link as LinkIcon, Check, Loader2, Sparkles, Upload } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddPhotoOverlay({ isOpen, onClose, onSuccess }: Props) {
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      // Create a local preview
      setImageUrl(URL.createObjectURL(e.target.files[0]))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file && !imageUrl) return
    setLoading(true)

    try {
      let finalUrl = imageUrl

      // If we have a local file, upload it first
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
        } else {
          throw new Error('Upload failed')
        }
      }

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption: caption || null, imageUrl: finalUrl })
      })

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
          onClose()
          setCaption('')
          setImageUrl('')
          setFile(null)
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
            className="relative w-full max-w-4xl sanctuary-board shadow-premium border-none z-10 my-auto"
          >
            {/* The Biswas Standard - Portrait Balanced Content */}
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col items-center w-full relative mb-10">
                <button 
                  onClick={onClose} 
                  className="absolute -top-4 -right-2 sm:top-0 sm:right-0 p-4 hover:bg-primary/5 rounded-full transition-all text-on-surface-variant/40 hover:text-primary shrink-0 shadow-sm"
                >
                  <X size={32} strokeWidth={1} />
                </button>
                
                <div className="space-y-3 pt-6 flex flex-col items-center">
                   <p className="text-[10px] uppercase tracking-[0.8em] font-bold text-primary">Visual Fragment</p>
                   <h2 className="text-5xl sm:text-7xl font-editorial text-on-surface tracking-tighter leading-none">Add Visual</h2>
                   <p className="text-on-surface-variant/40 font-editorial italic text-2xl sm:text-3xl text-center px-4">Anchor a sight in our shared world.</p>
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
                  <h3 className="text-5xl font-editorial text-center">Visible Forever</h3>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-12 w-full max-w-2xl flex flex-col items-center">
                  
                  {/* Local File Selector */}
                  <div className="w-full space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-[0.8em] text-primary/60 flex items-center justify-center gap-2">
                      <Camera size={16} strokeWidth={1} /> Local Memory
                    </label>
                    
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer group relative w-full h-48 sm:h-64 bg-surface-container-low rounded-[2rem] border-2 border-dashed border-primary/10 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-primary/30"
                    >
                      {imageUrl ? (
                        <>
                          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload size={40} className="text-primary" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-on-surface-variant/30">
                          <Upload size={48} strokeWidth={1} className="group-hover:scale-110 transition-transform" />
                          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-center px-8 leading-relaxed">
                            Click to upload from your device
                          </p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 w-full">
                    <label className="text-[10px] font-bold uppercase tracking-[1em] text-primary/60 flex items-center justify-center gap-2">
                      <Type size={16} strokeWidth={1} /> Caption
                    </label>
                    <input
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Write a sweet whisper..."
                      className="w-full bg-surface-container-low border-none rounded-full px-12 py-8 text-2xl focus:ring-8 focus:ring-primary/5 transition-all outline-none placeholder:text-on-surface-variant/10 shadow-sm font-editorial italic text-center"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading || (!file && !imageUrl)}
                    className="w-full bg-primary text-white py-10 rounded-full font-bold text-[10px] uppercase tracking-[0.8em] shadow-premium hover:shadow-2xl transition-all flex items-center justify-center gap-5 mt-10 mb-6 group"
                  >
                    {loading ? (
                      <Loader2 size={32} className="animate-spin text-white/50" />
                    ) : (
                      <>
                        <Sparkles size={28} strokeWidth={1} className="group-hover:rotate-12 transition-transform" />
                        <span>Add To Collection</span>
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
