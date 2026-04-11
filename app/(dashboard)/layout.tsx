'use client'

import Navbar from '@/components/Navbar'
import MusicPlayer from '@/components/MusicPlayer'
import SidebarChat from '@/components/SidebarChat'
import { motion } from 'framer-motion'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen relative flex flex-col bg-[var(--background)]">
      {/* Global Sanctuary Navigation & Presence */}
      <Navbar />
      <MusicPlayer />
      
      {/* The Focused Sanctuary Content Board */}
      <main className="flex-1 pt-24 pb-32 px-4 sm:px-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Whispers Dialogue Hub */}
      <SidebarChat />
      
      {/* Frame Decor Sparkle (Global) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-sanctuary-gradient opacity-20 pointer-events-none -z-10" />
    </div>
  )
}
