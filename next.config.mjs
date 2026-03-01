/** @type {import('next').NextConfig} */
const nextConfig = {
  // Domain redirects (www ↔ non-www) are handled by Vercel's domain settings.
  // Do NOT add redirects here — they clash with Vercel's edge-level redirects
  // and cause ERR_TOO_MANY_REDIRECTS.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "*.licdn.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "framer-motion"],
  },
  poweredByHeader: false,
};

export default nextConfig;
