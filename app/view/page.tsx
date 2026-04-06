// /app/submissions/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, ExternalLink, RefreshCw, Clock } from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";

const VALID_CATEGORIES = [
  "Economic Leadership", "Fiscal Discipline", "Education", "Healthcare",
  "Infrastructure", "Anti-Corruption", "Post-Governor Period", "Security",
  "Agriculture", "International", "Character", "Transparency", "Other",
] as const;

interface Submission {
  id: number;
  category: string;
  reason: string;
  source: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}

interface ApiResponse {
  submissions: Submission[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [page,        setPage]        = useState(1);
  const [total,       setTotal]       = useState(0);
  const [hasMore,     setHasMore]     = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState("");
  const [query,       setQuery]       = useState("");
  const [category,    setCategory]    = useState("");
  const [filterOpen,  setFilterOpen]  = useState(false);

  const fetchPage = useCallback(async (pageNum: number, replace: boolean) => {
    try {
      replace ? setLoading(true) : setLoadingMore(true);
      setError("");

      const res = await fetch(`/api/submissions?page=${pageNum}`);

      if (res.status === 429) {
        setError("Too many requests — please wait a moment before refreshing.");
        return;
      }
      if (!res.ok) {
        setError("Failed to load submissions. Please try again.");
        return;
      }

      const data: ApiResponse = await res.json();

      setSubmissions((prev) => replace ? data.submissions : [...prev, ...data.submissions]);
      setTotal(data.total);
      setHasMore(data.hasMore);
      setPage(pageNum);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(1, true);
  }, [fetchPage]);

  // Client-side filter on top of fetched data
  const filtered = submissions.filter((s) => {
    const matchesQuery =
      !query ||
      s.reason.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || s.category === category;
    return matchesQuery && matchesCategory;
  });

  const clear = () => {
    setQuery("");
    setCategory("");
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00c853]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-playfair font-black text-3xl sm:text-4xl text-white mb-2">
                Citizens' Submissions
              </h1>
              <p className="text-white/40 text-sm">
                {total > 0
                  ? `${total.toLocaleString()} submission${total !== 1 ? "s" : ""} awaiting review`
                  : "Community-submitted reasons, pending review"}
              </p>
            </div>
            <button
              onClick={() => fetchPage(1, true)}
              disabled={loading}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="sticky top-16 z-30 bg-[#0a0f1e]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search submissions…"
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

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              category
                ? "bg-[#00c853]/15 border-[#00c853]/40 text-[#00c853]"
                : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
            {category && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#00c853] flex-shrink-0" />
            )}
          </button>
        </div>

        <div className={`border-t border-white/10 px-4 sm:px-6 py-3 max-w-7xl mx-auto ${filterOpen ? "block" : "hidden"}`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                !category
                  ? "bg-[#00c853]/20 border-[#00c853]/40 text-[#00c853]"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              All categories
            </button>
            {VALID_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c === category ? "" : c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
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
      </div>

      {/* ── Results ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Result count + clear */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-white/40 text-sm">
            {loading ? (
              "Loading…"
            ) : filtered.length > 0 ? (
              <>
                {filtered.length.toLocaleString()} result{filtered.length !== 1 ? "s" : ""}
                {query && <span> for "<span className="text-white/70">{query}</span>"</span>}
                {category && <span> in <span className="text-[#00c853]">{category}</span></span>}
              </>
            ) : (
              "No results"
            )}
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

        {/* ── Error ── */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300 mb-6">
            {error}
          </div>
        )}

        {/* ── Skeleton loader ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-[#111827]/70 border border-white/8 p-5 space-y-3 animate-pulse"
              >
                <div className="flex justify-between">
                  <div className="h-5 w-10 rounded bg-white/10" />
                  <div className="h-5 w-24 rounded-full bg-white/10" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="h-3 w-5/6 rounded bg-white/10" />
                  <div className="h-3 w-4/6 rounded bg-white/10" />
                </div>
                <div className="h-3 w-2/3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-24 text-white/30">
            <Search size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-playfair text-xl">No submissions found</p>
            <p className="text-sm mt-2">
              {query || category
                ? "Try a different search term or clear filters"
                : "No pending submissions yet"}
            </p>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="group block rounded-xl bg-[#111827]/70 border border-white/8 hover:border-[#ffd54f]/20 hover:bg-[#111827] transition-all p-5 relative overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#ffd54f]/0 via-[#ffd54f]/40 to-[#ffd54f]/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="font-playfair font-black text-2xl text-white/30 group-hover:text-white/50 transition-colors tabular-nums">
                        #{s.id}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <CategoryBadge category={s.category} />
                      <span className="flex items-center gap-1 text-[10px] text-yellow-500/60 font-medium">
                        <Clock size={9} />
                        Pending review
                      </span>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm leading-relaxed line-clamp-4 group-hover:text-white/90 transition-colors">
                    {s.reason}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <a
                      href={s.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[10px] text-white/25 hover:text-[#00c853] transition-colors truncate"
                    >
                      <ExternalLink size={10} className="flex-shrink-0" />
                      <span className="truncate">
                        {s.source.replace(/^https?:\/\/(www\.)?/, "")}
                      </span>
                    </a>
                    <span className="text-[10px] text-white/20 flex-shrink-0">
                      {formatDate(s.submittedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Load more from API */}
            {hasMore && !query && !category && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => fetchPage(page + 1, false)}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40 flex items-center gap-2 mx-auto"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Loading…
                    </>
                  ) : (
                    `Load more (${total - submissions.length} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}