import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

function toCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`
  const lines = [headers.map(escape).join(",")]
  rows.forEach((row) => lines.push(row.map(escape).join(",")))
  return lines.join("\n")
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ message: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (!type || !["startups", "users", "jobs"].includes(type)) {
      return new Response(
        JSON.stringify({ message: "Invalid export type. Use: startups, users, or jobs" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    let csv = ""

    if (type === "startups") {
      const startups = await prisma.startup.findMany({
        include: {
          founder: {
            select: { email: true, fullName: true },
          },
        },
        orderBy: { createdAt: "desc" },
      })

      const headers = [
        "ID",
        "Name",
        "Tagline",
        "Founder Email",
        "Founder Name",
        "Tech Category",
        "Stage",
        "Status",
        "Verification Level",
        "Upvote Count",
        "View Count",
        "State",
        "District",
        "Created At",
      ]

      const rows = startups.map((s) => [
        s.id,
        s.name,
        s.tagline,
        s.founder.email,
        s.founder.fullName,
        s.techCategory,
        s.stage,
        s.status,
        s.verificationLevel,
        String(s.upvoteCount),
        String(s.viewCount),
        s.state || "",
        s.district || "",
        s.createdAt.toISOString(),
      ])

      csv = toCSV(headers, rows)
    } else if (type === "users") {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          organization: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })

      const headers = [
        "ID",
        "Full Name",
        "Email",
        "Role",
        "Organization",
        "Created At",
      ]

      const rows = users.map((u) => [
        u.id,
        u.fullName,
        u.email,
        u.role,
        u.organization || "",
        u.createdAt.toISOString(),
      ])

      csv = toCSV(headers, rows)
    } else if (type === "jobs") {
      const jobs = await prisma.job.findMany({
        include: {
          startup: { select: { name: true } },
        },
        orderBy: { postedAt: "desc" },
      })

      const headers = [
        "ID",
        "Title",
        "Startup Name",
        "Location",
        "Type",
        "Is Active",
        "Posted At",
      ]

      const rows = jobs.map((j) => [
        j.id,
        j.title,
        j.startup.name,
        j.location,
        j.type,
        j.isActive ? "Yes" : "No",
        j.postedAt.toISOString(),
      ])

      csv = toCSV(headers, rows)
    }

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-export-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("CSV export error:", error)
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
