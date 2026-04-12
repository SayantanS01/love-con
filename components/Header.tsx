'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-12 py-4 sm:py-6 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
          >
            <Heart size={20} fill="currentColor" />
          </motion.div>
          <div className="hidden sm:block">
            <h2 className="font-editorial text-lg text-on-surface font-bold leading-none">Sanctuary</h2>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Our Shared Space</p>
          </div>
        </Link>
      </div>
    </header>
  )
}
