import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { put } from "@vercel/blob"
import { authOptions } from "@/lib/auth"

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]

const ALLOWED_DOCUMENT_TYPES = ["application/pdf"]

const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES]

const MAX_IMAGE_SIZE = 4 * 1024 * 1024 // 4MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          message: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP, GIF, PDF`,
        },
        { status: 400 }
      )
    }

    // Validate file size based on type
    const isDocument = ALLOWED_DOCUMENT_TYPES.includes(file.type)
    const maxSize = isDocument ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE
    const maxSizeLabel = isDocument ? "10MB" : "4MB"

    if (file.size > maxSize) {
      return NextResponse.json(
        { message: `File too large. Maximum size is ${maxSizeLabel}` },
        { status: 400 }
      )
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    return NextResponse.json(
      { url: blob.url, pathname: blob.pathname },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
