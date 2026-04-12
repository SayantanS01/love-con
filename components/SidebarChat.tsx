'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Sparkles, User, Heart, X, Loader2 } from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: string
  sender: {
    username: string
  }
}

export default function SidebarChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setCurrentUserId(data?.userId))
    
    if (isOpen) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/chat')
      if (res.ok) setMessages(await res.json())
    } catch (err) {
      console.error('Failed to fetch whispers')
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
      })

      if (res.ok) {
        setMessage('')
        fetchMessages()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed top-24 right-4 sm:top-12 sm:right-12 z-[150]">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="p-4 sm:p-6 bg-primary text-white rounded-full shadow-premium flex items-center justify-center relative group"
        >
          <MessageCircle size={28} strokeWidth={1} className="sm:w-[36px] sm:h-[36px]" />
          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
            <Heart size={10} fill="currentColor" className="text-primary animate-pulse sm:w-3 sm:h-3" />
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 sm:p-20 bg-on-surface/5 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="sanctuary-board w-full max-w-5xl h-[85vh] flex flex-col items-center relative overflow-visible"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-12 right-12 p-4 hover:bg-primary/5 rounded-full transition-all text-on-surface-variant/40 hover:text-primary z-10"
              >
                <X size={40} strokeWidth={1} />
              </button>

              <div className="text-center space-y-4 mb-20 pt-10 flex flex-col items-center">
                <p className="text-[12px] font-bold uppercase tracking-[1em] text-primary">Sacred Connection</p>
                <h2 className="text-7xl font-editorial text-on-surface tracking-tighter leading-none">Whisper Hub</h2>
                <p className="text-on-surface-variant/40 font-editorial italic text-3xl">A timeless dialogue between Mampi Biswas & Her Architect.</p>
              </div>

              {/* Message History - Absolute Center Aligned */}
              <div 
                ref={scrollRef}
                className="flex-1 w-full max-w-4xl overflow-y-auto space-y-16 px-16 py-10 mb-12 scrollbar-hide flex flex-col items-center"
              >
                {messages.length === 0 ? (
                  <div className="text-center py-40 opacity-20 italic font-editorial text-4xl">The echoes are silent for now...</div>
                ) : (
                  messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 25 }}
                      className="flex flex-col items-center w-full"
                    >
                      <div className={`p-12 px-16 rounded-[2.5rem] w-full max-w-2xl relative group shadow-premium flex flex-col items-center text-center ${
                        msg.senderId === currentUserId 
                        ? 'bg-primary text-white' 
                        : 'bg-white text-on-surface border border-primary/5'
                      }`}>
                        <div className={`text-[11px] font-bold uppercase tracking-[0.6em] mb-6 opacity-60 flex items-center justify-center gap-3 w-full ${
                          msg.senderId === currentUserId ? 'text-white/80' : 'text-primary'
                        }`}>
                          <User size={16} strokeWidth={1} /> 
                          {msg.sender?.username?.toLowerCase().includes('mampi') 
                            ? 'MAMPI' 
                            : msg.sender?.username?.toLowerCase().includes('sayan')
                            ? 'SAYANTAN'
                            : msg.sender?.username?.toUpperCase() || 'UNKNOWN'
                          }
                        </div>
                        <p className="text-3xl font-editorial leading-snug tracking-tight italic">"{msg.content}"</p>
                        
                        {/* Entry Decoration */}
                        <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Sparkles size={32} className={msg.senderId === currentUserId ? 'text-white' : 'text-primary'} />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input Box - Perfectly Centered */}
              <form onSubmit={handleSend} className="w-full max-w-3xl px-12 pb-12 flex justify-center">
                <div className="relative group w-full">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Whisper a reflection..."
                    className="w-full bg-surface-container-low border-none rounded-full px-16 py-10 transition-all text-3xl focus:ring-12 focus:ring-primary/5 outline-none shadow-premium placeholder:text-on-surface-variant/20 italic font-editorial text-center"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || loading}
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-primary text-white p-7 rounded-full shadow-premium hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={36} strokeWidth={1} /> : <Send size={36} strokeWidth={1} />}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
