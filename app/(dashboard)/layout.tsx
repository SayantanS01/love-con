'use client'

import Navbar from '@/components/Navbar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
      <Header />
      <Navbar />
      <MusicPlayer />
      
      {/* The Focused Sanctuary Content Board */}
      <main className="flex-1 pt-24 sm:pt-28 pb-10 px-2 sm:px-12 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      <Footer />

      {/* Whispers Dialogue Hub */}
      <SidebarChat />
      
      {/* Frame Decor Sparkle (Global) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-sanctuary-gradient opacity-20 pointer-events-none -z-10" />
    </div>
  )
}
