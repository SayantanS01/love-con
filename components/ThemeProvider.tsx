'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  primaryColor: string
  accentColor: string
  activeSongId: string
  updateTheme: (settings: { primaryColor?: string; accentColor?: string; activeSongId?: string }) => Promise<void>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [primaryColor, setPrimaryColor] = useState('#ab2c5d')
  const [accentColor, setAccentColor] = useState('#ffe3e8')
  const [activeSongId, setActiveSongId] = useState('P-qXpD_Y88o')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        if (res.ok) {
          const data = await res.json()
          setPrimaryColor(data.primaryColor || '#ab2c5d')
          setAccentColor(data.accentColor || '#ffe3e8')
          setActiveSongId(data.activeSongId || 'P-qXpD_Y88o')
        }
      } catch (err) {
        console.error('Failed to load theme settings')
      }
    }
    fetchSettings()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary-dynamic', primaryColor)
    root.style.setProperty('--accent-dynamic', accentColor)
    root.style.setProperty('--bg-dynamic', `${primaryColor}05`) 
    root.style.setProperty('--surface-dynamic', `${primaryColor}08`)
  }, [primaryColor, accentColor])

  const updateTheme = async (settings: { primaryColor?: string; accentColor?: string; activeSongId?: string }) => {
    // Update local state first for immediate feedback
    if (settings.primaryColor) setPrimaryColor(settings.primaryColor)
    if (settings.accentColor) setAccentColor(settings.accentColor)
    if (settings.activeSongId !== undefined) setActiveSongId(settings.activeSongId)

    // Persist to database
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryColor: settings.primaryColor || primaryColor,
          accentColor: settings.accentColor || accentColor,
          activeSongId: settings.activeSongId !== undefined ? settings.activeSongId : activeSongId
        })
      })
    } catch (err) {
      console.error('Failed to persist theme settings')
    }
  }

  return (
    <ThemeContext.Provider value={{ primaryColor, accentColor, activeSongId, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
