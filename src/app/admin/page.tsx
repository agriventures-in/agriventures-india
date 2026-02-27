import { prisma } from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  Users,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
  Eye,
} from "lucide-react"

export const dynamic = "force-dynamic"


async function getAdminStats() {
  const [
    totalStartups,
    startupsByStatus,
    pendingVerifications,
    totalUsers,
    usersByRole,
    totalUpvotes,
    recentStartups,
  ] = await Promise.all([
    prisma.startup.count(),
    prisma.startup.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.verificationRequest.count({
      where: { status: "pending" },
    }),
    prisma.user.count(),
    prisma.user.groupBy({
      by: ["role"],
      _count: { id: true },
    }),
    prisma.upvote.count(),
    prisma.startup.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        founder: { select: { fullName: true } },
      },
    }),
  ])

  const statusMap: Record<string, number> = {}
  startupsByStatus.forEach((s: { status: string; _count: { id: number } }) => {
    statusMap[s.status] = s._count.id
  })

  const roleMap: Record<string, number> = {}
  usersByRole.forEach((r: { role: string; _count: { id: number } }) => {
    roleMap[r.role] = r._count.id
  })

  return {
    totalStartups,
    statusMap,
    pendingVerifications,
    totalUsers,
    roleMap,
    totalUpvotes,
    recentStartups,
  }
}

const statusColorMap: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  VERIFIED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor platform activity and manage operations.
        </p>
      </div>

      {/* Top Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Startups */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Startups
            </CardTitle>
            <Rocket className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats.totalStartups}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                {stats.statusMap.VERIFIED || 0} verified
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {stats.statusMap.SUBMITTED || 0} submitted
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Verifications
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats.pendingVerifications}
            </div>
            <p className="mt-2 flex items-center text-xs text-amber-600">
              <Clock className="mr-1 h-3 w-3" />
              Awaiting review
            </p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats.totalUsers}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                {stats.roleMap.FOUNDER || 0} founders
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {stats.roleMap.INVESTOR || 0} investors
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Total Upvotes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Upvotes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats.totalUpvotes}
            </div>
            <p className="mt-2 flex items-center text-xs text-emerald-600">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Community engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Startup Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Startup Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { status: "DRAFT", label: "Draft", icon: FileEdit },
                { status: "SUBMITTED", label: "Submitted", icon: ArrowUpRight },
                { status: "UNDER_REVIEW", label: "Under Review", icon: Eye },
                { status: "VERIFIED", label: "Verified", icon: CheckCircle },
                { status: "REJECTED", label: "Rejected", icon: XCircle },
              ].map(({ status, label, icon: Icon }) => {
                const count = stats.statusMap[status] || 0
                const percentage =
                  stats.totalStartups > 0
                    ? Math.round((count / stats.totalStartups) * 100)
                    : 0

                return (
                  <div key={status} className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">{label}</span>
                        <span className="text-slate-500">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            status === "VERIFIED"
                              ? "bg-emerald-500"
                              : status === "REJECTED"
                              ? "bg-red-500"
                              : status === "UNDER_REVIEW"
                              ? "bg-amber-500"
                              : status === "SUBMITTED"
                              ? "bg-blue-500"
                              : "bg-slate-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Startups */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Startups</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentStartups.length === 0 ? (
              <p className="text-sm text-slate-500">No startups yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentStartups.map((startup: any) => (
                  <div
                    key={startup.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {startup.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        by {startup.founder.fullName}
                      </p>
                    </div>
                    <Badge
                      className={`ml-2 ${
                        statusColorMap[startup.status] || "bg-slate-100 text-slate-700"
                      } hover:opacity-90`}
                    >
                      {startup.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* User Role Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { role: "FOUNDER", label: "Founders", color: "bg-purple-500" },
              { role: "INVESTOR", label: "Investors", color: "bg-blue-500" },
              { role: "COMMUNITY", label: "Community", color: "bg-emerald-500" },
              { role: "ADMIN", label: "Admins", color: "bg-rose-500" },
            ].map(({ role, label, color }) => (
              <div
                key={role}
                className="flex items-center gap-3 rounded-lg border border-slate-100 p-4"
              >
                <div className={`h-3 w-3 rounded-full ${color}`} />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {stats.roleMap[role] || 0}
                  </p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
