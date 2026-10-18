export const LANGUAGES = ['en', 'ar'] as const

export type Language = (typeof LANGUAGES)[number]
export type Direction = 'ltr' | 'rtl'

export const DEFAULT_LANGUAGE: Language = 'en'
export const LANGUAGE_COOKIE = 'bitget_lang'

export const DIRECTIONS: Record<Language, Direction> = {
  en: 'ltr',
  ar: 'rtl',
}

export function parseLanguage(value: string | undefined): Language {
  return LANGUAGES.find((language) => language === value) ?? DEFAULT_LANGUAGE
}
