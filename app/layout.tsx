
// /app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import NavBar from "@/components/NavBar";
import { Providers } from "../components/providers";
import "./globals.css";

// ── Your existing local fonts ──────────────────────────────────────────────
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// ── New display fonts for the Peter Obi app ────────────────────────────────
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["300", "400", "500", "600"],
});

// ── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "200+ Reasons to Vote Peter Obi",
  description:
    "A crowd-sourced, evidence-backed collection of reasons why Peter Gregory Obi deserves your vote.",
  openGraph: {
    title: "200+ Reasons to Vote Peter Obi",
    description: "Evidence-backed reasons to vote Peter Gregory Obi.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#00c853",
};

// ── Layout ─────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <Script
          id="jsonld-logo"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "VotePeterObi",
              url: "https://votepeterobi.ng",
              logo: "https://votepeterobi.ng/obi.jpg",
            }),
          }}
        />
      </head>

      <body className="bg-[#0a0f1e] text-white font-dm antialiased h-screen overflow-hidden">
        {/* Dark mode init — runs before paint to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var isDark = localStorage.getItem('darkMode');
                  if (isDark === 'true' ||
                     (!isDark && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Google Analytics - only load if GA_ID is set */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <Providers>
          <NavBar />
          <main className="pt-16 h-full overflow-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}