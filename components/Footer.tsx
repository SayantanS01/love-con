'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-primary/5 mt-auto relative z-10 bottom-0 pb-36 pt-10 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-12 flex flex-col items-center justify-center text-center space-y-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-primary/40 flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
        </motion.div>
        <div className="space-y-2">
          <p className="font-editorial italic text-on-surface-variant/60 text-lg sm:text-xl">
            "Endless love, eternal sanctuary."
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/40">
            Crafted for Mampi Biswas
          </p>
        </div>
      </div>
    </footer>
  )
}
