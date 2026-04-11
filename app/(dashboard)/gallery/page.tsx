'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, Plus, Sparkles, X, Heart, Loader2, Camera, Trash2 } from 'lucide-react'
import AddPhotoOverlay from '@/components/AddPhotoOverlay'

interface Photo {
  id: string
  imageUrl: string
  caption?: string
  userId: string
  user: { username: string }
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null)

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/gallery')
      if (res.ok) setPhotos(await res.json())
    } catch (err) {
      console.error('Failed to fetch gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
  }, [])

  return (
    <div className="space-y-24 gsap-entrance flex flex-col items-center">
      <header className="text-center space-y-8 max-w-4xl">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-primary flex justify-center"
        >
          <ImageIcon size={100} strokeWidth={1} />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-9xl font-editorial text-on-surface tracking-tighter leading-none">Glimpse Archive</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-3xl">Visual fragments of the light we share.</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddOpen(true)}
          className="px-12 py-6 bg-primary text-white rounded-full font-bold uppercase tracking-[0.5em] text-xs shadow-premium flex items-center gap-4 mx-auto"
        >
          <Plus size={20} strokeWidth={2} /> Import New Memory
        </motion.button>
      </header>

      <div className="sanctuary-board w-full">
        {loading ? (
          <div className="flex justify-center py-40">
            <Loader2 className="animate-spin text-primary/20" size={64} strokeWidth={1} />
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-40 space-y-6">
            <p className="text-4xl font-editorial text-on-surface-variant/20 italic">The archive is currently waiting for light...</p>
            <p className="text-xs uppercase font-bold tracking-[0.4em] text-primary/40">Upload your shared images to begin.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-12 space-y-12">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="break-inside-avoid"
              >
                <button 
                  onClick={() => setSelectedImage(photo)}
                  className="w-full relative group rounded-[2.5rem] overflow-hidden shadow-premium aspect-auto"
                >
                  <img 
                    src={photo.imageUrl} 
                    alt={photo.caption || 'Sanctuary Photo'}
                    className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="text-white" size={32} />
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Immersive Lightbox Overlay */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[500] bg-on-surface/90 backdrop-blur-2xl flex flex-col items-center justify-center p-10 sm:p-20"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-10 right-10 p-5 text-white/40 hover:text-white transition-colors"
            >
              <X size={48} strokeWidth={1} />
            </button>

            <motion.div
              layoutId={`photo-${selectedImage.id}`}
              className="w-full max-w-5xl space-y-12 flex flex-col items-center"
            >
              <img 
                src={selectedImage.imageUrl} 
                alt={selectedImage.caption || 'Large view'}
                className="max-h-[70vh] w-auto rounded-[3rem] shadow-2xl"
              />
              
              <div className="text-center space-y-4 max-w-2xl px-4">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em] flex items-center justify-center gap-3">
                  <Camera size={18} strokeWidth={1} /> Captured by {selectedImage.user.username}
                </div>
                <h3 className="text-4xl font-editorial text-white leading-tight tracking-tight">{selectedImage.caption}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AddPhotoOverlay 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={fetchPhotos} 
      />
    </div>
  )
}
