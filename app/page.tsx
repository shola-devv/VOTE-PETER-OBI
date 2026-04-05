// /app/page.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Shuffle, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { reasons, getReasonByIndex } from "@/data/reasons";
import CategoryBadge from "@/components/CategoryBadge";
import ShareButton from "@/components/ShareButton";

export default function Home() {
  const router = useRouter();
  const total = reasons.length;

  const [index, setIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const indexRef = useRef(0);
  const reason = getReasonByIndex(index);

  // Initialize index from URL params after hydration
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("reason");
    const idx = id ? reasons.findIndex((r) => r.id === Number(id)) : 0;

    const normalizedIdx = idx >= 0 ? idx : 0;
    setIndex(normalizedIdx);
    indexRef.current = normalizedIdx;
    setInitialized(true);
  }, []);

  // Update ref when index changes
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const go = useCallback((newIndex: number) => {
    const clamped = ((newIndex % total) + total) % total;
    setIndex(clamped);
    indexRef.current = clamped;
  }, [total]);

  useEffect(() => {
    if (!initialized) return;

    const currentReasonId = reasons[index].id;
    const params = new URLSearchParams(window.location.search);
    if (params.get("reason") !== String(currentReasonId)) {
      router.replace(`/?reason=${currentReasonId}`, { scroll: false });
    }
  }, [index, initialized, router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(indexRef.current - 1);
      if (e.key === "ArrowRight") go(indexRef.current + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  const randomize = () => go(Math.floor(Math.random() * total));
  const progress = ((index + 1) / total) * 100;

  return (
    <div className="relative z-0 h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-[#0a0f1e]">

      {/* Compact header strip */}
      <div className="flex-shrink-0 px-4 sm:px-8 pt-4 pb-2">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-[#00c853]/50 flex-shrink-0">
            <Image
              src="/peterobi.jpg"
              alt="Peter Obi"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h1 className="font-playfair font-black text-white leading-tight text-base sm:text-lg truncate">
              <span className="text-[#00c853]">{total.toLocaleString()}+</span>
              {" "}reasons to vote{" "}
              <span className="text-[#ffd54f]">Peter Gregory Obi for president</span>
            </h1>
            <p className="text-white/40 text-xs hidden sm:block">
              Evidence-backed · Browse, share, and add your own
            </p>
          </div>

          <div className="ml-auto flex-shrink-0 text-right hidden sm:block">
            <p className="text-white/30 text-xs tabular-nums">
              {index + 1} / {total.toLocaleString()}
            </p>
            <div className="mt-1 w-28 h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full progress-bar transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="flex-1 min-h-0 px-4 sm:px-8 py-2">
        <div className="max-w-3xl mx-auto h-full">
          {reason && (
            <div className="relative h-full rounded-2xl card-glow bg-[#111827] flex flex-col overflow-hidden fade-in">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00c853] via-[#ffd54f] to-transparent flex-shrink-0" />

              <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-7 pt-5 pb-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="font-playfair font-black text-4xl sm:text-5xl leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#00c853] to-[#ffd54f] tabular-nums">
                      #{reason.id}
                    </div>
                    <p className="text-white/30 text-xs mt-0.5 tabular-nums">
                      of {total.toLocaleString()}
                    </p>
                  </div>
                  <CategoryBadge category={reason.category} />
                </div>

                <blockquote className="font-playfair font-bold text-xl sm:text-2xl md:text-2xl leading-relaxed text-white/90 border-l-2 border-[#00c853]/40 pl-4">
                  {reason.reason}
                </blockquote>
              </div>

              {/* Fixed footer */}
              <div className="flex-shrink-0 px-5 sm:px-7 py-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <ShareButton reason={reason} />
                <a
                  href={reason.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#00c853] transition-colors group truncate"
                >
                  <ExternalLink size={11} className="flex-shrink-0" />
                  <span className="truncate">
                    {reason.source.replace(/^https?:\/\/(?:www\.)?/, "")}
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex-shrink-0 px-4 sm:px-8 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => go(index - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#1a2235] text-white border border-white/20 hover:bg-[#243050] hover:border-white/40 active:scale-95 transition-all group flex-1 justify-center sm:flex-none sm:justify-start"
          >
            <ChevronLeft size={17} className="group-hover:-translate-x-0.5 transition-transform" />
            Previous
          </button>

          <button
            onClick={randomize}
            title="Random reason"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-[#ffd54f]/10 text-[#ffd54f] border border-[#ffd54f]/25 hover:bg-[#ffd54f]/20 active:scale-95 transition-all"
          >
            <Shuffle size={13} />
            <span className="hidden sm:inline">Random</span>
          </button>

          <button
            onClick={() => go(index + 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00c853] text-[#0a0f1e] hover:bg-[#00e564] active:scale-95 transition-all group flex-1 justify-center sm:flex-none sm:justify-start"
          >
            Next
            <ChevronRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </button>

          <Link
            href="/index"
            className="hidden sm:flex items-center gap-1.5 ml-auto px-4 py-2.5 rounded-xl text-xs font-medium text-white/50 border border-white/15 hover:text-white hover:border-white/30 transition-all"
          >
            Browse all →
          </Link>
        </div>

        <div className="max-w-3xl mx-auto mt-2 flex items-center justify-between sm:hidden">
          <p className="text-white/25 text-xs tabular-nums">{index + 1} / {total}</p>
          <div className="flex-1 mx-3 h-0.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-[#00c853]" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <p className="text-center text-white/20 text-xs mt-1 hidden sm:block">
          ← → arrow keys to navigate
        </p>
      </div>
    </div>
  );
}