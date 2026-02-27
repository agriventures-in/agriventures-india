import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { UserRoleSelect } from "@/components/admin/user-role-select"
import { formatDate } from "@/lib/utils"

export const dynamic = "force-dynamic"

const roleColors: Record<string, string> = {
  FOUNDER: "bg-purple-100 text-purple-700",
  INVESTOR: "bg-blue-100 text-blue-700",
  COMMUNITY: "bg-emerald-100 text-emerald-700",
  ADMIN: "bg-rose-100 text-rose-700",
}

async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          startups: true,
        },
      },
    },
  })
}

export default async function UsersManagementPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and manage all platform users. Total: {users.length} users.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {users.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-slate-500">No users found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell text-right">
                    Startups
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Joined</TableHead>
                  <TableHead className="text-right pr-4">Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt={user.fullName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                            {user.fullName
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {user.fullName}
                          </p>
                          {user.organization && (
                            <p className="text-xs text-slate-400">
                              {user.organization}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          roleColors[user.role] || "bg-slate-100 text-slate-600"
                        } hover:opacity-90`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">
                      <span className="text-sm text-slate-700">
                        {user._count.startups}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <UserRoleSelect
                        userId={user.id}
                        currentRole={user.role}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
