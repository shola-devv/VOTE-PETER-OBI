// /components/ShareButton.tsx
"use client";
import { useState } from "react";
import {
  Share2,
  Twitter,
  Facebook,
  MessageCircle,
  Link2,
  Check,
  ChevronDown,
} from "lucide-react";
import type { Reason } from "../data/reasons";

interface Props {
  reason: Reason;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://votepeterobi.tech";

export default function ShareButton({ reason }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = `Reason #${reason.id} to vote Peter Obi:\n\n"${reason.reason}"\n\nSource: ${reason.source}\n\n${SITE_URL}`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl  = encodeURIComponent(`${SITE_URL}?reason=${reason.id}`);

  const platforms = [
    {
      label: "Twitter / X",
      icon: Twitter,
      color: "hover:bg-sky-500/20 hover:text-sky-400",
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
    },
    {
      label: "WhatsApp",
      icon: MessageCircle,
      color: "hover:bg-green-500/20 hover:text-green-400",
      href: `https://wa.me/?text=${encodedText}`,
    },
    {
      label: "Facebook",
      icon: Facebook,
      color: "hover:bg-blue-500/20 hover:text-blue-400",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodeURIComponent(
        `Reason #${reason.id} to vote Peter Obi: "${reason.reason}"`
      )}`,
    },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${SITE_URL}?reason=${reason.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm
          bg-gradient-to-r from-[#00c853] to-[#00a844] text-[#0a0f1e]
          hover:from-[#00e564] hover:to-[#00c853] transition-all shadow-lg shadow-green-900/30
          active:scale-95"
      >
        <Share2 size={16} />
        Share Evidence
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute bottom-full mb-2 left-0 z-20 w-56 rounded-xl border border-white/10 bg-[#111827] shadow-2xl overflow-hidden">
            <p className="px-4 py-2 text-xs text-white/40 border-b border-white/10 font-medium uppercase tracking-widest">
              Share to
            </p>
            {platforms.map(({ label, icon: Icon, color, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm text-white/70 transition-colors ${color}`}
              >
                <Icon size={15} />
                {label}
              </a>
            ))}
            <button
              onClick={copyLink}
              className={`flex items-center gap-3 px-4 py-3 text-sm w-full text-left border-t border-white/10 transition-colors
                ${copied ? "text-[#00c853]" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
            >
              {copied ? <Check size={15} /> : <Link2 size={15} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
