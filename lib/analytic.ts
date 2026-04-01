// lib/analytics.ts
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const pageview = (url: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === 'function') {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

export {};

