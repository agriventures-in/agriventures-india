import en from "./messages/en.json"
import hi from "./messages/hi.json"
import mr from "./messages/mr.json"
import te from "./messages/te.json"

export const languages = {
  en: { name: "English", nativeName: "English", messages: en },
  hi: { name: "Hindi", nativeName: "हिन्दी", messages: hi },
  mr: { name: "Marathi", nativeName: "मराठी", messages: mr },
  te: { name: "Telugu", nativeName: "తెలుగు", messages: te },
} as const

export type Language = keyof typeof languages
export type Messages = typeof en

// Simple translation function
export function getMessages(lang: Language): Messages {
  return languages[lang].messages
}

// Helper to get a nested translation key
export function t(messages: Messages, key: string): string {
  const keys = key.split(".")
  let result: unknown = messages
  for (const k of keys) {
    result = (result as Record<string, unknown>)?.[k]
  }
  return typeof result === "string" ? result : key
}
