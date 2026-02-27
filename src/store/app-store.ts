"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AppState {
  isSarpanchMode: boolean
  toggleSarpanchMode: () => void
  language: "en" | "hi" | "mr" | "te"
  setLanguage: (lang: "en" | "hi" | "mr" | "te") => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isSarpanchMode: false,
      toggleSarpanchMode: () =>
        set((s) => ({
          isSarpanchMode: !s.isSarpanchMode,
          language: !s.isSarpanchMode ? "hi" : "en",
        })),
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    { name: "agriventures-app" }
  )
)
