import { ImageResponse } from "next/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const title = searchParams.get("title") || "AgriVentures India"
  const tagline =
    searchParams.get("tagline") ||
    "The Verified Impact Platform for Indian Agritech"
  const category = searchParams.get("category") || ""
  const stage = searchParams.get("stage") || ""
  const location = searchParams.get("location") || ""
  const upvotes = searchParams.get("upvotes") || "0"
  const views = searchParams.get("views") || "0"
  const verified = searchParams.get("verified") === "true"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0A4A23 0%, #0D6B33 50%, #16A34A 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(74, 222, 128, 0.08)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(74, 222, 128, 0.06)",
            display: "flex",
          }}
        />

        {/* Top Section: Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Shield icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              background: "rgba(74, 222, 128, 0.2)",
              fontSize: "20px",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#4ADE80",
              letterSpacing: "0.5px",
            }}
          >
            AgriVentures India
          </span>
        </div>

        {/* Middle Section: Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flex: 1,
            justifyContent: "center",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <h1
                style={{
                  fontSize: title.length > 30 ? "42px" : "52px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  lineHeight: 1.1,
                  margin: 0,
                  maxWidth: "900px",
                }}
              >
                {title}
              </h1>
              {verified && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(74, 222, 128, 0.2)",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#4ADE80"
                    stroke="none"
                  >
                    <path d="M9 12l2 2 4-4" stroke="#0A4A23" strokeWidth="2" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke="#4ADE80" strokeWidth="2" fill="none" />
                  </svg>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#4ADE80",
                    }}
                  >
                    Verified
                  </span>
                </div>
              )}
            </div>

            {/* Tagline */}
            <p
              style={{
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.75)",
                lineHeight: 1.4,
                margin: 0,
                maxWidth: "800px",
              }}
            >
              {tagline.length > 120 ? tagline.substring(0, 120) + "..." : tagline}
            </p>
          </div>

          {/* Badges Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {category && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(245, 158, 11, 0.2)",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#F59E0B",
                }}
              >
                {category}
              </div>
            )}
            {stage && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.85)",
                }}
              >
                {stage}
              </div>
            )}
            {location && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "20px",
                  padding: "8px 18px",
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.85)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location}
              </div>
            )}
          </div>

          {/* Stats Row */}
          {(upvotes !== "0" || views !== "0") && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.65)",
              }}
            >
              {upvotes !== "0" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  <span style={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.8)" }}>
                    {upvotes}
                  </span>
                  <span>upvotes</span>
                </div>
              )}
              {views !== "0" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.65)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span style={{ fontWeight: 600, color: "rgba(255, 255, 255, 0.8)" }}>
                    {views}
                  </span>
                  <span>views</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "1px",
              background:
                "linear-gradient(90deg, rgba(74, 222, 128, 0.4) 0%, rgba(74, 222, 128, 0.1) 100%)",
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.5)",
                letterSpacing: "1px",
              }}
            >
              agriventures.in
            </span>
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.35)",
              }}
            >
              Making India&apos;s Agritech Startups Visible
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
