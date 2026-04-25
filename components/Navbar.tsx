'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Home, Calendar, Image as ImageIcon, BookOpen, User, Settings, LogOut, Sparkles } from 'lucide-react'

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Moments', path: '/moments', icon: Calendar },
  { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  { name: 'Diary', path: '/diary', icon: BookOpen },
  { name: 'Apology', path: '/apology', icon: Heart },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isHovered, setIsHovered] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setIsAdmin(data?.role === 'ADMIN'))
  }, [])

  return (
    <nav className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass px-8 py-4 rounded-[2.5rem] shadow-premium flex items-center gap-2 border border-white/60 pointer-events-auto relative group hover:scale-[1.02] transition-all duration-700"
      >
        {/* Dock Decor */}
        <div className="absolute inset-0 bg-white/40 rounded-[2.5rem] -z-10" />
        
        <div className="flex items-center gap-2 sm:gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onMouseEnter={() => setIsHovered(item.path)}
                onMouseLeave={() => setIsHovered(null)}
                className={`relative p-3 sm:p-5 flex items-center justify-center transition-all duration-500 rounded-2xl group/nav ${
                  isActive ? 'text-primary' : 'text-on-surface-variant/60 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <item.icon size={22} strokeWidth={isActive ? 1.5 : 1} className={`${isActive ? 'scale-110' : 'group-hover/nav:scale-110'}`} />
                
                <AnimatePresence>
                  {isHovered === item.path && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -50, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute bg-on-surface text-white px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] shadow-premium whitespace-nowrap pointer-events-none hidden sm:block"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div 
                    layoutId="nav-dock-bg"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="h-8 w-[1px] bg-primary/10 mx-2 sm:mx-4" />

        <div className="flex items-center gap-2 sm:gap-4">
          {isAdmin && (
            <Link 
              href="/admin" 
              onMouseEnter={() => setIsHovered('/admin')}
              onMouseLeave={() => setIsHovered(null)}
              className={`relative p-3 sm:p-5 flex items-center justify-center transition-all duration-500 rounded-2xl group/nav ${
                pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant/60 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Settings size={22} strokeWidth={1} className={`${pathname === '/admin' ? 'rotate-90 scale-110' : 'group-hover/nav:rotate-12 transition-transform'}`} />
              <AnimatePresence>
                {isHovered === '/admin' && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -50, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute bg-on-surface text-white px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] shadow-premium whitespace-nowrap pointer-events-none hidden sm:block"
                  >
                    Sanctuary Controls
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          <Link 
            href="/profile" 
            onMouseEnter={() => setIsHovered('/profile')}
            onMouseLeave={() => setIsHovered(null)}
            className={`relative p-2 sm:p-2 flex items-center justify-center transition-all duration-500 rounded-full group/nav ${
              pathname === '/profile' ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
          >
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center ${pathname === '/profile' ? 'bg-vibrant-gradient text-white shadow-premium' : 'bg-primary/10 text-primary'}`}>
              <User size={18} strokeWidth={1.5} className="sm:w-[20px] sm:h-[20px]" />
            </div>
            <AnimatePresence>
              {isHovered === '/profile' && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -50, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute bg-white px-5 py-2.5 rounded-full text-[9px] font-bold uppercase tracking-[0.4em] text-primary shadow-premium border border-primary/5 whitespace-nowrap pointer-events-none"
                >
                  Your Identity
                  <Heart size={8} fill="currentColor" className="absolute -top-1 -right-1 text-primary animate-pulse" />
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </motion.div>
    </nav>
  )
}
