import type { Language } from '../config'
import { ar } from './ar'
import { en, type Dictionary } from './en'

export type { Dictionary }

const dictionaries: Record<Language, Dictionary> = { en, ar }

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language]
}
