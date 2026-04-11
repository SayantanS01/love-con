'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Music, Palette, Activity, Save, Loader2, Sparkles, AlertCircle, Calendar, User, Upload, Link as LinkIcon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export default function AdminDashboard() {
  const { primaryColor, accentColor, activeSongId, updateTheme } = useTheme()
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Local states for inputs to avoid lag
  const [localPrimary, setLocalPrimary] = useState(primaryColor)
  const [localAccent, setLocalAccent] = useState(accentColor)
  const [localSong, setLocalSong] = useState(activeSongId)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    fetchLogs()
    // Sync local state when theme context loads
    setLocalPrimary(primaryColor)
    setLocalAccent(accentColor)
    setLocalSong(activeSongId)
  }, [primaryColor, accentColor, activeSongId])

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs')
      if (res.ok) setLogs(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0])
      setLocalSong('') // Clear YT link when file is selected
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let finalResonance = localSong

      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          finalResonance = uploadData.url
        }
      }

      await updateTheme({
        primaryColor: localPrimary,
        accentColor: localAccent,
        activeSongId: finalResonance
      })
      
      setSelectedFile(null)
      fetchLogs() 
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]">
      <Loader2 className="animate-spin text-primary" size={48} strokeWidth={1} />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32 flex flex-col items-center">
      <header className="text-center space-y-8 gsap-entrance">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="w-40 h-40 bg-primary/10 rounded-[3rem] flex items-center justify-center text-primary mx-auto shadow-premium"
        >
          <ShieldCheck size={80} strokeWidth={1} />
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-8xl font-editorial text-on-surface tracking-tighter leading-none">Architect Center</h1>
          <p className="text-on-surface-variant/40 font-editorial italic text-2xl px-4 max-w-2xl mx-auto text-center">The sacred controls to sculpt our shared sanctuary's resonance and vibrance.</p>
        </div>
      </header>

      <div className="sanctuary-board w-full space-y-24">
        {/* Core Control Center (Grid Distributed) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start w-full">
          
          {/* Aesthetic Sculpting (Theme Controls) */}
          <div className="space-y-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary flex items-center gap-3">
              <Palette size={14} strokeWidth={1} /> Aesthetic Resonance
            </h2>

            <div className="space-y-12 bg-white/40 p-12 rounded-[3.5rem] border border-primary/5">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest px-1">Primary Essence</span>
                  <div className="flex flex-col gap-4">
                     <div className="w-full h-24 rounded-3xl shadow-inner border-4 border-white" style={{ background: localPrimary }} />
                     <input 
                       type="color" 
                       value={localPrimary} 
                       onChange={(e) => setLocalPrimary(e.target.value)} 
                       className="w-full h-12 bg-transparent cursor-pointer rounded-full overflow-hidden" 
                     />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest px-1">Accent Glow</span>
                  <div className="flex flex-col gap-4">
                    <div className="w-full h-24 rounded-3xl shadow-inner border-4 border-white" style={{ background: localAccent }} />
                    <input 
                       type="color" 
                       value={localAccent} 
                       onChange={(e) => setLocalAccent(e.target.value)} 
                       className="w-full h-12 bg-transparent cursor-pointer rounded-full overflow-hidden" 
                     />
                  </div>
                </div>
              </div>

              {/* Resonance Selection: Local or YT */}
              <div className="space-y-6">
                 <span className="text-[10px] uppercase font-bold text-on-surface-variant/40 tracking-widest px-4 flex items-center gap-2">
                   <Music size={12} /> Active Sanctuary Resonance
                 </span>
                 
                 <div className="space-y-6 bg-surface-container-low/50 p-6 rounded-[2.5rem] border border-primary/5">
                    <div className="relative group">
                      <LinkIcon size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30" />
                      <input 
                        value={localSong} 
                        onChange={(e) => {
                          setLocalSong(e.target.value)
                          setSelectedFile(null)
                        }}
                        className="w-full bg-white border-none rounded-full pl-14 pr-8 py-5 focus:ring-4 focus:ring-primary/5 transition-all text-lg outline-none shadow-sm placeholder:text-on-surface-variant/10 italic font-editorial"
                        placeholder="YouTube Video ID (e.g. jfKfPfyJRdk)"
                      />
                    </div>

                    <div className="text-[9px] uppercase font-bold text-on-surface-variant/20 tracking-[0.4em] text-center">— OR —</div>

                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full py-5 rounded-full border-2 border-dashed transition-all flex items-center justify-center gap-4 cursor-pointer ${
                        selectedFile 
                        ? 'bg-primary/10 border-primary text-primary' 
                        : 'bg-white border-primary/10 text-on-surface-variant/40 hover:border-primary/30'
                      }`}
                    >
                      <Upload size={18} />
                      <span className="text-[10px] uppercase font-bold tracking-widest truncate max-w-[200px]">
                        {selectedFile ? selectedFile.name : 'Upload Local Resonance (.mp3)'}
                      </span>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="audio/*" 
                        className="hidden" 
                      />
                    </div>
                 </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                className="w-full py-8 bg-primary text-white rounded-full font-bold text-xs uppercase tracking-[0.6em] shadow-premium transition-all flex items-center justify-center gap-4"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} strokeWidth={1} />}
                <span>Manifest Changes</span>
              </motion.button>
            </div>
          </div>

          {/* Activity Heartbeat (Real-time Logs) */}
          <div className="space-y-16">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.5em] text-primary flex items-center gap-3">
              <Activity size={14} strokeWidth={1} /> Sanctum Heartbeat
            </h2>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-8 scrollbar-hide">
              {logs.length === 0 ? (
                <div className="p-12 text-center opacity-20 italic font-editorial text-2xl">The archive is silent...</div>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-8 rounded-[2.5rem] bg-surface-container-low/50 border-l-4 border-primary/20 flex items-start gap-6 group hover:bg-white transition-all shadow-sm"
                  >
                    <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary shrink-0">
                       <Sparkles size={18} strokeWidth={1} className={log.action.includes('LOGIN') ? 'animate-pulse' : ''} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
                         <User size={12} strokeWidth={1} /> {log.user.username} 
                         <span>•</span> 
                         <Calendar size={12} strokeWidth={1} /> {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                      <p className="text-xl font-editorial text-on-surface leading-tight leading-none">{log.description}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Global Warning Footer */}
        <div className="pt-20 border-t border-primary/5 flex justify-center">
            <div className="flex items-center gap-4 text-on-surface-variant/20 text-xs font-bold uppercase tracking-[0.4em] text-center">
               <AlertCircle size={24} strokeWidth={1} />
               <span>Authority is a responsibility to the Sanctuary's heart</span>
            </div>
        </div>
      </div>
    </div>
  )
}
