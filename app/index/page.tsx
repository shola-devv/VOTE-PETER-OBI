// /app/index/page.tsx
"use client";
import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, ExternalLink } from "lucide-react";
import { reasons, categories, searchReasons } from "@/data/reasons";
import CategoryBadge from "@/components/CategoryBadge";

const PAGE_SIZE = 24;

export default function IndexPage() {
  const [query, setQuery]       = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage]         = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    setPage(1);
    return searchReasons(query, category);
  }, [query, category]);

  const paginated  = results.slice(0, page * PAGE_SIZE);
  const hasMore    = paginated.length < results.length;

  const clear = () => {
    setQuery("");
    setCategory("");
    searchRef.current?.focus();
  };

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00c853]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="font-playfair font-black text-3xl sm:text-4xl text-white mb-2">
            All Reasons
          </h1>
          <p className="text-white/40 text-sm">
            {reasons.length.toLocaleString()} + evidence-backed reasons — searchable and filterable
          </p>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="sticky top-16 z-30 bg-[#0a0f1e]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reasons, categories…"
              className="search-input w-full pl-9 pr-9 py-2.5 rounded-xl text-sm text-white placeholder-white/30"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              category
                ? "bg-[#00c853]/15 border-[#00c853]/40 text-[#00c853]"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filter</span>
            {category && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c853] flex-shrink-0" />
            )}
          </button>
        </div>

        {/* Category pills - hidden on mobile by default, visible with filter toggle on larger screens */}
        {(filterOpen || true) && (
          <div className="border-t border-white/10 px-4 sm:px-6 py-3 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setCategory("")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex-shrink-0 ${
                  !category
                    ? "bg-[#00c853]/20 border-[#00c853]/40 text-[#00c853]"
                    : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                }`}
              >
                All
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c === category ? "" : c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex-shrink-0 whitespace-nowrap ${
                    category === c
                      ? "bg-[#00c853]/20 border-[#00c853]/40 text-[#00c853]"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-white/40 text-sm">
            {results.length > 0
              ? `${results.length.toLocaleString()} result${results.length !== 1 ? "s" : ""}`
              : "No results"}
            {query && <span> for "<span className="text-white/70">{query}</span>"</span>}
            {category && <span> in <span className="text-[#00c853]">{category}</span></span>}
          </p>
          {(query || category) && (
            <button
              onClick={clear}
              className="text-xs text-white/40 hover:text-white flex items-center gap-1"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <Search size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-playfair text-xl">No reasons found</p>
            <p className="text-sm mt-2">Try a different search term or clear filters</p>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginated.map((r) => (
                <Link
                  key={r.id}
                  href={`/?reason=${r.id}`}
                  className="group block rounded-xl bg-[#111827]/70 border border-white/8 hover:border-[#00c853]/30 hover:bg-[#111827] transition-all p-5 relative overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#00c853]/0 via-[#00c853]/50 to-[#00c853]/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="font-playfair font-black text-2xl text-[#00c853]/80 group-hover:text-[#00c853] transition-colors tabular-nums">
                      #{r.id}
                    </span>
                    <CategoryBadge category={r.category} />
                  </div>

                  <p className="text-white/70 text-sm leading-relaxed line-clamp-4 group-hover:text-white/90 transition-colors">
                    {r.reason}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-[10px] text-white/25 group-hover:text-white/40 transition-colors truncate">
                    <ExternalLink size={10} className="flex-shrink-0" />
                    <span className="truncate">
                      {r.source.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-8 py-3 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                >
                  Load more ({results.length - paginated.length} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
