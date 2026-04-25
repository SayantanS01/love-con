'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion'
import confetti from 'canvas-confetti'

export default function HeartPopIcon() {
  const [isPressing, setIsPressing] = useState(false)
  const [hasPopped, setHasPopped] = useState(false)
  const growControls = useAnimation()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // 3D Tilt for the icon itself
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]))
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]))

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    if (isPressing) stopPress()
  }

  const startPress = () => {
    if (hasPopped) return
    setIsPressing(true)
    growControls.start({
      scale: 2.5,
      rotate: [0, -5, 5, -5, 5, 0],
      transition: { duration: 2, ease: "linear" }
    })

    timerRef.current = setTimeout(() => {
      pop()
    }, 2000)
  }

  const stopPress = () => {
    setIsPressing(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!hasPopped) {
      growControls.start({
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      })
    }
  }

  const pop = () => {
    setHasPopped(true)
    setIsPressing(false)
    
    // Confetti Heart Rain
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        shapes: ['circle'],
        colors: ['#ab2c5d', '#ff4d8d', '#ff85b3', '#ffffff']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        shapes: ['circle'],
        colors: ['#ab2c5d', '#ff4d8d', '#ff85b3', '#ffffff']
      })
    }, 250)

    // Reset after some time
    setTimeout(() => {
      setHasPopped(false)
      growControls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5 }
      })
    }, 6000)
  }

  return (
    <div className="relative perspective-container flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      <motion.div
        animate={growControls}
        onMouseDown={startPress}
        onMouseUp={stopPress}
        onTouchStart={startPress}
        onTouchEnd={stopPress}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative cursor-pointer select-none ${hasPopped ? 'pointer-events-none' : ''}`}
      >
        {/* Layered 3D Heart */}
        <div className="relative preserve-3d">
          {/* Back shadow layer */}
          <div className="absolute inset-0 text-primary/20 blur-md translate-z-[-10px] transform">
            <HeartSVG />
          </div>
          
          {/* Middle depth layers */}
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="absolute inset-0 text-primary/40" 
              style={{ transform: `translateZ(${(i + 1) * -2}px)` }}
            >
              <HeartSVG />
            </div>
          ))}
          
          {/* Front layer */}
          <motion.div 
            className="relative text-primary"
            animate={hasPopped ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] } : {}}
          >
            <HeartSVG fill={true} />
            
            {/* Glossy reflection */}
            <div className="absolute inset-2 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm pointer-events-none" />
          </motion.div>
        </div>

        {/* Glow effect when pressing */}
        {isPressing && (
          <motion.div
            layoutId="glow"
            className="absolute inset-[-20px] bg-primary/20 rounded-full blur-2xl -z-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
          />
        )}
      </motion.div>
    </div>
  )
}

function HeartSVG({ fill = false }: { fill?: boolean }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill={fill ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-full h-full drop-shadow-sm"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
