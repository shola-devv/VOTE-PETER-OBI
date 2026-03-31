
'use client'

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from "next/script";
import { inter } from "./fonts";
import { SessionProvider } from 'next-auth/react';


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





export const viewport = {
  themeColor: "#d575fc",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>

    <head>
    <Script
      id="jsonld-logo"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CryptoSnoop",
          url: "https://cryptosnoop.app",
          logo: "https://cryptosnoop.app/cryptosnoopwall.jpg",
        }),
      }}
    />
  </head>

      <body className="antialiased">

      <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
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

        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}