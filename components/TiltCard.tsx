'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import React, { useRef } from 'react'

interface TiltCardProps {
  children: React.ReactNode
  className?: string
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  // Smooth glow position
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"])
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative group ${className}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        {children}
      </div>
      
      {/* Light follow effect */}
      <motion.div
        style={{
          left: glowX,
          top: glowY,
          transform: "translate(-50%, -50%) translateZ(1px)",
        }}
        className="absolute w-64 h-64 bg-primary/20 blur-[80px] pointer-events-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      {/* Reflection effect */}
      <motion.div
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%)",
          transform: "translateZ(80px)",
        }}
        className="absolute inset-0 pointer-events-none rounded-inherit opacity-0 group-hover:opacity-10 transition-opacity duration-500"
      />
    </motion.div>
  )
}
