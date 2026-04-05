import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const res = NextResponse.next()

  // Security headers
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("X-XSS-Protection", "1; mode=block")
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' https: data:",
      "style-src 'self' 'unsafe-inline'",
      // Added 'unsafe-eval' for Next.js hydration + GA domains
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      // Added fonts.googleapis.com and fonts.gstatic.com for Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://fonts.googleapis.com",
    ].join("; ")
  )

  // CORS for API routes only
  if (pathname.startsWith("/api")) {
    const origin = req.headers.get("origin")
    const allowed = [
      process.env.APP_URL || "https://example.com",
      process.env.NODE_ENV === "development" && "http://localhost:3000",
    ].filter(Boolean)

    if (origin && allowed.includes(origin)) {
      res.headers.set("Access-Control-Allow-Origin", origin)
    }

    res.headers.set("Access-Control-Allow-Credentials", "true")
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 200, headers: res.headers })
    }
  }

  return res
}

export const config = {
  // Expanded matcher to cover ALL pages, not just "/" and "/api/*"
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}