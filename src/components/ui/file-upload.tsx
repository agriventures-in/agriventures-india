"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from "lucide-react"

interface FileUploadProps {
  onUpload: (url: string) => void
  accept?: string
  maxSizeMB?: number
  className?: string
  label?: string
}

export function FileUpload({
  onUpload,
  accept,
  maxSizeMB = 4,
  className,
  label = "Upload a file",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    name: string
    type: string
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const validateFile = useCallback(
    (file: File): string | null => {
      // Validate against accept prop if provided
      if (accept) {
        const acceptedTypes = accept.split(",").map((t) => t.trim())
        const isAccepted = acceptedTypes.some((type) => {
          if (type.endsWith("/*")) {
            const category = type.split("/")[0]
            return file.type.startsWith(category + "/")
          }
          return file.type === type
        })
        if (!isAccepted) {
          return `File type "${file.type}" is not accepted`
        }
      }

      if (file.size > maxSizeBytes) {
        return `File is too large. Maximum size is ${maxSizeMB}MB`
      }

      return null
    },
    [accept, maxSizeBytes, maxSizeMB]
  )

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      setError(null)
      setIsUploading(true)

      try {
        const formData = new FormData()
        formData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || "Upload failed")
        }

        const data = await res.json()
        setUploadedFile({
          url: data.url,
          name: file.name,
          type: file.type,
        })
        onUpload(data.url)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Upload failed. Please try again."
        )
      } finally {
        setIsUploading(false)
      }
    },
    [validateFile, onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        uploadFile(file)
      }
    },
    [uploadFile]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(true)
    },
    []
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)
    },
    []
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        uploadFile(file)
      }
      // Reset input value so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    },
    [uploadFile]
  )

  const handleRemove = useCallback(() => {
    setUploadedFile(null)
    setError(null)
  }, [])

  const isImage = uploadedFile?.type.startsWith("image/")

  // Show uploaded file preview
  if (uploadedFile) {
    return (
      <div
        className={cn(
          "relative rounded-lg border bg-muted/50 p-4",
          className
        )}
      >
        <button
          type="button"
          onClick={handleRemove}
          className="absolute right-2 top-2 rounded-full bg-background p-1 shadow-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
          aria-label="Remove file"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex items-center gap-3">
          {isImage ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={uploadedFile.url}
                alt={uploadedFile.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border bg-muted">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">Uploaded successfully</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
          isUploading && "pointer-events-none opacity-60"
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Uploading...
            </p>
          </>
        ) : (
          <>
            <div className="rounded-full bg-muted p-3">
              {accept?.startsWith("image") ? (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Max {maxSizeMB}MB
              </p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        aria-label={label}
      />

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  )
}
