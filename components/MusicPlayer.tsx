'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function MusicPlayer() {
  const { activeSongId } = useTheme()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Detect if source is Local or YouTube
  const isLocal = activeSongId.startsWith('/')

  useEffect(() => {
    if (isLocal && audioRef.current) {
      audioRef.current.muted = isMuted
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, isMuted, isLocal, activeSongId])

  return (
    <div className="fixed bottom-8 left-8 z-[120]">
      <motion.div 
        className="flex items-center gap-4"
        onMouseEnter={() => setShowPlayer(true)}
        onMouseLeave={() => setShowPlayer(false)}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsPlaying(!isPlaying)}
          className={`p-6 rounded-full shadow-premium flex items-center justify-center transition-all duration-700 ${
            isPlaying ? 'bg-primary text-white scale-110' : 'bg-white text-primary'
          }`}
        >
          {isPlaying ? <Music size={28} strokeWidth={1} className={isLocal ? "animate-spin-slow" : "animate-pulse"} /> : <Play size={28} strokeWidth={1} />}
        </motion.button>

        <AnimatePresence>
          {showPlayer && (
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.9 }}
              className="glass px-8 py-4 rounded-[2rem] shadow-premium flex items-center gap-6 border-none"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1 flex items-center gap-1">
                  <Sparkles size={10} strokeWidth={1} /> Resonance
                </span>
                <span className="text-lg font-editorial font-medium text-on-surface leading-tight tracking-tight">
                  {isLocal ? 'Local Archive' : 'YouTube Sync'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 border-l border-primary/10 pl-6">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/5"
                >
                  {isMuted ? <VolumeX size={20} strokeWidth={1} /> : <Volume2 size={20} strokeWidth={1} />}
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-primary text-white rounded-full hover:scale-110 active:scale-90 transition-transform shadow-md"
                >
                  {isPlaying ? <Pause size={18} strokeWidth={2} /> : <Play size={18} strokeWidth={2} />}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* DUAL PLAYER ENGINE */}
      {isPlaying && (
        <>
          {isLocal ? (
            <audio 
              ref={audioRef}
              src={activeSongId}
              loop
              autoPlay
              className="hidden"
            />
          ) : (
            <div className="hidden pointer-events-none opacity-0">
              <iframe
                width="0"
                height="0"
                src={`https://www.youtube.com/embed/${activeSongId}?autoplay=1&loop=1&playlist=${activeSongId}${isMuted ? '&mute=1' : ''}`}
                allow="autoplay"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
