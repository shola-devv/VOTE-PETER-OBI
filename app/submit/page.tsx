// /app/submit/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Send, CheckCircle2, AlertCircle, Lightbulb, Ban } from "lucide-react";

const SUBMISSION_KEY = "submit_reason_token";

const CATEGORIES = [
  "Economic Leadership",
  "Fiscal Discipline",
  "Education",
  "Healthcare",
  "Infrastructure",
  "Anti-Corruption",
  "Post-Governor Period",
  "Security",
  "Agriculture",
  "International",
  "Character",
  "Transparency",
  "Other",
];

type Status = "idle" | "loading" | "success" | "error" | "duplicate";

export default function SubmitPage() {
  const [reason,      setReason]      = useState("");
  const [category,   setCategory]    = useState("");
  const [source,     setSource]      = useState("");
  const [status,     setStatus]      = useState<Status>("idle");
  const [message,    setMessage]     = useState("");
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // ✅ Check for existing token on mount
  useEffect(() => {
    if (localStorage.getItem(SUBMISSION_KEY)) {
      setAlreadySubmitted(true);
    }
  }, []);


  const isValidUrl = (val: string): boolean => {
  try {
    const url = new URL(val.trim());
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.includes(".") &&        // must have a real TLD
      url.hostname.length > 3 &&           // rules out "a.b"
      !url.hostname.startsWith(".")  &&    // no leading dot
      url.pathname !== undefined           // just a sanity check
    );
  } catch {
    return false;
  }
};

const valid =
  reason.trim().length >= 30 &&
  category.length > 0 &&
  isValidUrl(source);

  const submit = async () => {
    if (!valid) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim(), category, source: source.trim() }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setStatus("duplicate");
        setMessage(data.message);
      } else if (!res.ok) {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      } else {
        // ✅ Save token so the user can't submit again from this browser
        localStorage.setItem(SUBMISSION_KEY, "1");
        setStatus("success");
        setReason("");
        setCategory("");
        setSource("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection.");
    }
  };

  // ✅ Already-submitted banner (shown instead of form)
  if (alreadySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <Ban size={48} className="mx-auto text-[#ffd54f] mb-5" />
          <h2 className="font-playfair font-black text-3xl text-white mb-3">
            Already submitted
          </h2>
          <p className="text-white/50 leading-relaxed">
            You've already added a reason. One submission per
            person — thanks for contributing!
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle2 size={56} className="mx-auto text-[#00c853] mb-5" />
          <h2 className="font-playfair font-black text-3xl text-white mb-3">
            Thank you!
          </h2>
          <p className="text-white/50 leading-relaxed mb-6">
            Your reason has been submitted for review. Once verified it will be
            added to the list.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00c853]/5 to-transparent pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 relative">
          <h1 className="font-playfair font-black text-3xl sm:text-4xl text-white mb-2">
            Submit a Reason
          </h1>
          <p className="text-white/40 text-sm leading-relaxed">
            Know a reason that's missing? Add it here. All submissions are
            reviewed and require a credible source link. One submission per
            person.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Tip box */}
        <div className="rounded-xl bg-yellow-500/8 border border-yellow-500/20 p-4 flex gap-3 mb-8">
          <Lightbulb size={18} className="text-[#ffd54f] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/60 leading-relaxed">
            <span className="text-[#ffd54f] font-medium">Tip:</span> The best
            reasons are specific, factual, and cite a credible source (news
            article, government record, official biography, etc.)
          </p>
        </div>

        <div className="space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Category <span className="text-[#00c853]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="search-input w-full px-4 py-3 rounded-xl text-sm text-white bg-[#111827] appearance-none"
            >
              <option value="" disabled>Select a category…</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Reason <span className="text-[#00c853]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe a specific, factual reason why Peter Obi deserves your vote…"
              rows={5}
              className="search-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 resize-none"
            />
            <p className={`text-xs mt-1 ${reason.length < 30 ? "text-white/30" : "text-[#00c853]"}`}>
              {reason.length} characters {reason.length < 30 && `(minimum 30)`}
            </p>
          </div>

         {/* Source */}
<div>
  <label className="block text-sm font-medium text-white/70 mb-2">
    Source URL <span className="text-[#00c853]">*</span>
  </label>
  <input
    type="url"
    value={source}
    onChange={(e) => setSource(e.target.value)}
    placeholder="https://…"
    maxLength={2048}
    className={`search-input w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 transition-colors ${
      source.length > 0 && !isValidUrl(source)
        ? "border border-red-500/50"
        : ""
    }`}
  />
  {source.length > 0 && !isValidUrl(source) ? (
    <p className="text-xs text-red-400 mt-1">
      Please enter a valid URL starting with https:// or http://
    </p>
  ) : (
    <p className="text-xs text-white/30 mt-1">
      Link to a news article, Wikipedia page, government record, or other credible source.
    </p>
  )}
</div>

          {/* Error / duplicate message */}
          {(status === "error" || status === "duplicate") && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex gap-3">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{message}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={!valid || status === "loading"}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              valid && status !== "loading"
                ? "bg-[#00c853] text-[#0a0f1e] hover:bg-[#00a844] active:scale-[0.99]"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            {status === "loading" ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send size={15} />
                Submit Reason
              </>
            )}
          </button>

          <p className="text-xs text-white/25 text-center">
            Submissions are moderated. One per IP address.
          </p>
        </div>
      </div>
    </div>
  );
}