'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, MessageCircle, Send, Plus, X, Loader2, User } from 'lucide-react'

export default function ApologyPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [apologyMessage, setApologyMessage] = useState('')
  const [showHeart, setShowHeart] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const steps = [
    { title: "Pause and Reflect", subtitle: "Take a deep breath. Acknowledge the fragment of friction." },
    { title: "Formulate Your Sincerity", subtitle: "Whisper the words that heal without justification." },
    { title: "Seal with Love", subtitle: "Your reflection will be sent to her soul." }
  ]

  const handleSend = async () => {
    setIsSending(true)
    // Simulate API call for apology
    setTimeout(() => {
      setShowHeart(true)
      setIsSending(false)
    }, 1500)
  }

  return (
    <div className="space-y-24 gsap-entrance flex flex-col items-center">
      <header className="text-center space-y-8 max-w-4xl">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="text-[#ba1a1a] flex justify-center"
        >
          <Heart size={100} fill="currentColor" strokeWidth={1} />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-9xl font-editorial text-on-surface tracking-tighter leading-none">Healing Haven</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-3xl">A sacred space for reconciliation and whispered truth.</p>
        </div>
      </header>

      <div className="sanctuary-board w-full max-w-5xl flex flex-col items-center gap-16">
        {/* Progress Tracker */}
        <div className="flex items-center gap-6 sm:gap-12">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center gap-6 sm:gap-12 group">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-700 ${
                  i <= activeStep ? 'bg-primary text-white shadow-premium scale-110' : 'bg-primary/5 text-primary/40'
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-24 rounded-full transition-all duration-1000 ${
                  i < activeStep ? 'bg-primary' : 'bg-primary/5'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!showHeart ? (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.98, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -20 }}
              className="w-full text-center space-y-12 flex flex-col items-center"
            >
              <div className="space-y-4 max-w-2xl px-4">
                <h2 className="text-5xl font-editorial text-on-surface tracking-tight">{steps[activeStep].title}</h2>
                <p className="text-on-surface-variant/60 font-editorial italic text-xl">{steps[activeStep].subtitle}</p>
              </div>

              {activeStep === 1 && (
                <textarea
                  value={apologyMessage}
                  onChange={(e) => setApologyMessage(e.target.value)}
                  placeholder="Whisper your heart..."
                  className="w-full max-w-2xl bg-surface-container-low border-none rounded-[3rem] p-12 text-2xl font-editorial focus:ring-4 focus:ring-primary/5 outline-none shadow-premium h-64 italic transition-all"
                />
              )}

              {activeStep === 2 && (
                <div className="p-16 glass rounded-[3rem] space-y-8 animate-pulse border-none">
                  <Sparkles size={48} className="text-primary mx-auto opacity-40" />
                  <p className="text-4xl font-editorial text-primary tracking-tighter">Are you ready to seal this healing?</p>
                </div>
              )}

              <div className="flex gap-8">
                {activeStep > 0 && (
                  <button 
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary transition-colors"
                  >
                    Walk Back
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => activeStep < 2 ? setActiveStep(activeStep + 1) : handleSend()}
                  disabled={activeStep === 1 && !apologyMessage.trim() || isSending}
                  className="px-12 py-6 bg-primary text-white rounded-full font-bold uppercase tracking-[0.5em] text-xs shadow-premium flex items-center gap-4"
                >
                  {isSending ? (
                    <div className="flex items-center gap-4">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Healing...</span>
                    </div>
                  ) : (
                    <>
                      <span>{activeStep === 2 ? 'Seal Reflection' : 'Proceed Forward'}</span>
                      <Plus size={20} strokeWidth={1} />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-10 py-20"
            >
              <div className="relative inline-block">
                <Heart size={160} fill="#ba1a1a" className="text-[#ba1a1a]" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-[#ba1a1a] rounded-full blur-2xl"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-6xl font-editorial text-[#ba1a1a] tracking-tight">Heart Sealed & Sent</h3>
                <p className="text-on-surface-variant/40 font-editorial italic text-2xl">The bridge to reconciliation is now forming.</p>
              </div>
              <button 
                onClick={() => { setShowHeart(false); setActiveStep(0); setApologyMessage(''); }}
                className="text-xs uppercase font-bold tracking-[0.4em] text-primary/40 hover:text-primary transition-colors pt-12"
              >
                Return to Sanctuary Home
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
