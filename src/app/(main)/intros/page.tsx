"use client"

import { useEffect, useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IntroList } from "@/components/intros/intro-list"
import { IntroResponseDialog } from "@/components/intros/intro-response-dialog"
import { Loader2, Send, Inbox } from "lucide-react"

export const dynamic = "force-dynamic"

interface IntroRequestItem {
  id: string
  message: string
  status: "PENDING" | "ACCEPTED" | "DECLINED"
  responseNote?: string | null
  createdAt: string
  respondedAt?: string | null
  startup: {
    id: string
    name: string
    slug?: string
  }
  fromUser?: {
    id: string
    fullName: string
    email?: string
    organization?: string | null
    avatarUrl?: string | null
  }
  toUser?: {
    id: string
    fullName: string
    organization?: string | null
    avatarUrl?: string | null
  }
}

export default function IntrosPage() {
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent")
  const [sentIntros, setSentIntros] = useState<IntroRequestItem[]>([])
  const [receivedIntros, setReceivedIntros] = useState<IntroRequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIntro, setSelectedIntro] = useState<IntroRequestItem | null>(null)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)

  const fetchIntros = useCallback(async (role: "sent" | "received") => {
    try {
      const res = await fetch(`/api/intros?role=${role}&limit=50`)
      if (!res.ok) return
      const data = await res.json()
      if (role === "sent") {
        setSentIntros(data.intros)
      } else {
        setReceivedIntros(data.intros)
      }
    } catch (err) {
      console.error(`Error fetching ${role} intros:`, err)
    }
  }, [])

  useEffect(() => {
    async function loadAll() {
      setLoading(true)
      await Promise.all([fetchIntros("sent"), fetchIntros("received")])
      setLoading(false)
    }
    loadAll()
  }, [fetchIntros])

  function handleIntroClick(intro: IntroRequestItem) {
    setSelectedIntro(intro)
    setResponseDialogOpen(true)
  }

  function handleRespond() {
    // Refresh both lists
    fetchIntros("sent")
    fetchIntros("received")
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          My Introductions
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your introduction requests with founders and investors.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "sent" | "received")}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="sent" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Sent
            {sentIntros.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                {sentIntros.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="received" className="flex items-center gap-2">
            <Inbox className="h-4 w-4" />
            Received
            {receivedIntros.filter((i) => i.status === "PENDING").length > 0 && (
              <span className="ml-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                {receivedIntros.filter((i) => i.status === "PENDING").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sent">
          <IntroList intros={sentIntros} perspective="sent" />
        </TabsContent>

        <TabsContent value="received">
          <IntroList
            intros={receivedIntros}
            perspective="received"
            onIntroClick={handleIntroClick}
          />
        </TabsContent>
      </Tabs>

      <IntroResponseDialog
        intro={selectedIntro}
        open={responseDialogOpen}
        onOpenChange={setResponseDialogOpen}
        onRespond={handleRespond}
      />
    </div>
  )
}
