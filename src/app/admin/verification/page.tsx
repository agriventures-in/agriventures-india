import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VerificationActions } from "@/components/admin/verification-actions"
import { formatDate } from "@/lib/utils"
import { TECH_CATEGORIES, STARTUP_STAGES } from "@/lib/constants"
import { Clock, CheckCircle, XCircle } from "lucide-react"

export const dynamic = "force-dynamic"

async function getVerificationRequests() {
  return prisma.verificationRequest.findMany({
    orderBy: { submittedAt: "desc" },
    include: {
      startup: {
        include: {
          founder: {
            select: { fullName: true, email: true },
          },
        },
      },
      reviewer: {
        select: { fullName: true },
      },
    },
  })
}

function getCategoryLabel(value: string) {
  return TECH_CATEGORIES.find((c) => c.value === value)?.label || value
}

function getStageLabel(value: string) {
  return STARTUP_STAGES.find((s) => s.value === value)?.label || value
}

export default async function VerificationQueuePage() {
  const requests = await getVerificationRequests()

  const pending = requests.filter((r: any) => r.status === "pending")
  const approved = requests.filter((r: any) => r.status === "approved")
  const rejected = requests.filter((r: any) => r.status === "rejected")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verification Queue</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review and manage startup verification requests.
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            Approved ({approved.length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1.5">
            <XCircle className="h-3.5 w-3.5" />
            Rejected ({rejected.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <VerificationList requests={pending} showActions />
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <VerificationList requests={approved} />
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          <VerificationList requests={rejected} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function VerificationList({
  requests,
  showActions = false,
}: {
  requests: Awaited<ReturnType<typeof getVerificationRequests>>
  showActions?: boolean
}) {
  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-slate-500">No verification requests found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request: any) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {request.startup.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(request.startup.techCategory)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    Stage: {getStageLabel(request.startup.stage)}
                  </span>
                  <span>
                    Founder: {request.startup.founder.fullName}
                  </span>
                  <span>
                    Submitted: {formatDate(request.submittedAt)}
                  </span>
                </div>
                {request.reviewNotes && (
                  <p className="mt-1 text-xs text-slate-600">
                    <span className="font-medium">Notes:</span> {request.reviewNotes}
                  </p>
                )}
                {request.reviewer && (
                  <p className="text-xs text-slate-400">
                    Reviewed by {request.reviewer.fullName}
                    {request.reviewedAt && ` on ${formatDate(request.reviewedAt)}`}
                  </p>
                )}
              </div>
              {showActions && (
                <div className="flex-shrink-0">
                  <VerificationActions requestId={request.id} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
