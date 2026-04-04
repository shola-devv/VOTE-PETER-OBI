// /components/ReasonCard.tsx
import { ExternalLink } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import ShareButton from "./ShareButton";
import type { Reason } from "../data/reasons";

interface Props {
  reason: Reason;
  total: number;
  showShare?: boolean;
}

export default function ReasonCard({ reason, total, showShare = true }: Props) {
  return (
    <div className="relative rounded-2xl card-glow bg-[#111827]/80 p-6 sm:p-8 backdrop-blur-sm overflow-hidden fade-in">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00c853] via-[#ffd54f] to-transparent border-pulse" />

      {/* Number badge */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="font-playfair font-black text-5xl sm:text-6xl leading-none text-transparent bg-clip-text bg-gradient-to-br from-[#00c853] to-[#ffd54f] slide-up tabular-nums">
            #{reason.id}
          </div>
          <p className="text-white/30 text-xs mt-1 font-medium tabular-nums">
            of {total.toLocaleString()} reasons
          </p>
        </div>
        <CategoryBadge category={reason.category} />
      </div>

      {/* Reason text */}
      <blockquote className="font-playfair text-lg sm:text-xl leading-relaxed text-white/90 mb-6 border-l-2 border-[#00c853]/40 pl-4">
        {reason.reason}
      </blockquote>

      {/* Source & share row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {showShare && <ShareButton reason={reason} />}
        <a
          href={reason.source}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#00c853] transition-colors group truncate"
        >
          <ExternalLink size={12} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="truncate">{reason.source.replace(/^https?:\/\/(www\.)?/, "")}</span>
        </a>
      </div>
    </div>
  );
}
