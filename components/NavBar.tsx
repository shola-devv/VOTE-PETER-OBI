// /components/NavBar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/",       label: "Home" },
  { href: "/reasons",  label: "All Reasons" },
  { href: "/about",  label: "About" },
  { href: "/view",  label: "Citizens' submissions" },
];

export default function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-playfair font-bold text-sm sm:text-base text-gray-900 group-hover:text-[#00803a] transition-colors">
            VotePeterObi
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 cursor-pointer z-50">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[#00c853]/15 text-[#00803a] font-semibold"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          <Link
            href="/submit"
            className={`ml-3 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              pathname === "/submit"
                ? "bg-[#00803a] text-white"
                : "bg-[#00c853] text-white hover:bg-[#00803a]"
            }`}
          >
            + Submit a Reason
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1 shadow-lg">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[#00c853]/15 text-[#00803a] font-semibold"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/submit"
            onClick={() => setOpen(false)}
            className="mt-1 px-4 py-3 rounded-lg text-sm font-semibold bg-[#00c853] text-white hover:bg-[#00803a] transition-colors text-center"
          >
            + Submit a Reason
          </Link>
        </div>
      )}
    </header>
  );
}