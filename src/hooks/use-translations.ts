"use client"

import { useMemo } from "react"
import { useAppStore } from "@/store/app-store"
import { getMessages, t as translate } from "@/i18n/config"

export function useTranslations() {
  const language = useAppStore((state) => state.language)

  const messages = useMemo(() => getMessages(language), [language])

  const t = useMemo(() => {
    return (key: string) => translate(messages, key)
  }, [messages])

  return { t, messages, language }
}
