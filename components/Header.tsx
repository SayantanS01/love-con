'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import HeartPopIcon from './HeartPopIcon'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-[100] px-4 sm:px-12 py-4 sm:py-6 pointer-events-none">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="hidden sm:block"
            >
              <h2 className="font-editorial text-2xl font-bold leading-none text-vibrant-gradient">Sanctuary</h2>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.4em] mt-1 opacity-60">Our Shared Space</p>
            </motion.div>
          </Link>
        </div>

        {/* The 3D Pop Icon - Center/Right aligned */}
        <div className="flex items-center gap-4">
          <HeartPopIcon />
        </div>
      </div>
    </header>
  )
}
