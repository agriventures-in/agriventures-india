"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Camera } from "lucide-react"
import { FileUpload } from "@/components/ui/file-upload"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  variant?: "avatar" | "banner" | "logo"
  className?: string
}

const variantConfig = {
  avatar: {
    containerClass: "h-24 w-24 rounded-full",
    imageSize: { width: 96, height: 96 },
    label: "Upload photo",
  },
  banner: {
    containerClass: "w-full rounded-lg",
    imageSize: { width: 600, height: 200 },
    label: "Upload banner",
  },
  logo: {
    containerClass: "h-[120px] w-[120px] rounded-lg",
    imageSize: { width: 120, height: 120 },
    label: "Upload logo",
  },
}

export function ImageUpload({
  value,
  onChange,
  variant = "logo",
  className,
}: ImageUploadProps) {
  const [showUploader, setShowUploader] = useState(false)
  const config = variantConfig[variant]

  const handleUpload = (url: string) => {
    onChange(url)
    setShowUploader(false)
  }

  // Show file upload dialog
  if (showUploader) {
    return (
      <div className={cn("space-y-2", className)}>
        <FileUpload
          onUpload={handleUpload}
          accept="image/jpeg,image/png,image/webp,image/gif"
          maxSizeMB={4}
          label={config.label}
        />
        <button
          type="button"
          onClick={() => setShowUploader(false)}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    )
  }

  // Show current image with change overlay
  if (value) {
    return (
      <div className={cn("group relative", className)}>
        <div
          className={cn(
            "relative overflow-hidden border bg-muted",
            config.containerClass,
            variant === "banner" && "aspect-[3/1]"
          )}
        >
          <Image
            src={value}
            alt={config.label}
            width={config.imageSize.width}
            height={config.imageSize.height}
            className={cn(
              "object-cover",
              variant === "avatar" && "h-full w-full rounded-full",
              variant === "banner" && "h-full w-full",
              variant === "logo" && "h-full w-full rounded-lg"
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => setShowUploader(true)}
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100",
            variant === "avatar" && "rounded-full",
            variant !== "avatar" && "rounded-lg"
          )}
        >
          <div className="flex flex-col items-center gap-1">
            <Camera className="h-5 w-5" />
            <span className="text-xs font-medium">Change</span>
          </div>
        </button>
      </div>
    )
  }

  // Show empty state - click to upload
  return (
    <div className={cn("group", className)}>
      <button
        type="button"
        onClick={() => setShowUploader(true)}
        className={cn(
          "flex items-center justify-center border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted",
          config.containerClass,
          variant === "banner" && "aspect-[3/1]"
        )}
      >
        <div className="flex flex-col items-center gap-1">
          <Camera className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{config.label}</span>
        </div>
      </button>
    </div>
  )
}
