'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  DIRECTIONS,
  LANGUAGE_COOKIE,
  type Direction,
  type Language,
} from './config'
import { getDictionary, type Dictionary } from './dictionaries'

interface LanguageContextValue {
  language: Language
  direction: Direction
  t: Dictionary
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({
  initialLanguage,
  children,
}: {
  initialLanguage: Language
  children: React.ReactNode
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next)
    document.cookie = `${LANGUAGE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = next
    document.documentElement.dir = DIRECTIONS[next]
  }, [])

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: DIRECTIONS[language],
      t: getDictionary(language),
      setLanguage,
    }),
    [language, setLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
