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
    <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass px-6 py-3 rounded-full shadow-premium flex items-center gap-2 border-none pointer-events-auto relative group-hover:scale-105 transition-transform duration-700"
      >
        {/* Dock Decor */}
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl -z-10 group-hover:opacity-100 opacity-50 transition-opacity" />
        
        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link 
                key={item.path} 
                href={item.path}
                onMouseEnter={() => setIsHovered(item.path)}
                onMouseLeave={() => setIsHovered(null)}
                className={`relative p-2 sm:p-4 flex items-center justify-center transition-all duration-500 rounded-full group/nav ${
                  isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                }`}
              >
                <item.icon size={20} strokeWidth={1} className={`sm:w-[22px] sm:h-[22px] ${isActive ? 'animate-pulse scale-125' : 'group-hover/nav:scale-110'}`} />
                
                <AnimatePresence>
                  {isHovered === item.path && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: -45, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.8 }}
                      className="absolute bg-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-lg border-none whitespace-nowrap pointer-events-none hidden sm:block"
                    >
                      {item.name}
                      <Sparkles size={8} className="absolute -top-1 -right-1 text-primary animate-pulse" />
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div 
                    layoutId="nav-dock-bg"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="h-6 sm:h-8 w-[1px] bg-primary/10 mx-1 sm:mx-2" />

        <div className="flex items-center gap-1 sm:gap-2">
          {isAdmin && (
            <Link 
              href="/admin" 
              onMouseEnter={() => setIsHovered('/admin')}
              onMouseLeave={() => setIsHovered(null)}
              className={`relative p-2 sm:p-4 flex items-center justify-center transition-all duration-500 rounded-full group/nav ${
                pathname === '/admin' ? 'text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Settings size={20} strokeWidth={1} className={`sm:w-[22px] sm:h-[22px] ${pathname === '/admin' ? 'rotate-90 scale-125' : 'group-hover/nav:rotate-12 transition-transform'}`} />
              <AnimatePresence>
                {isHovered === '/admin' && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute bg-on-surface text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg border-none whitespace-nowrap pointer-events-none hidden sm:block"
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
            className={`relative p-2 sm:p-4 flex items-center justify-center transition-all duration-500 rounded-full group/nav ${
              pathname === '/profile' ? 'text-primary' : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
            }`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${pathname === '/profile' ? 'bg-primary text-white scale-125 shadow-md' : 'bg-primary/10 text-primary'}`}>
              <User size={16} strokeWidth={1} className="sm:w-[18px] sm:h-[18px]" />
            </div>
            <AnimatePresence>
              {isHovered === '/profile' && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute bg-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-lg border-none whitespace-nowrap pointer-events-none"
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
