import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image src="/images/mascot.png" alt="AgriVentures India" width={120} height={120} className="h-28 w-28 opacity-40" />
        <div>
          <h1 className="text-6xl font-bold tracking-tight text-forest">404</h1>
          <p className="mt-2 text-xl font-medium text-foreground">
            Page Not Found
          </p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            The page you are looking for does not exist or has been moved.
            Let&apos;s get you back on track.
          </p>
        </div>
        <Link href="/">
          <Button className="gap-2 bg-forest hover:bg-forest/90 text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
