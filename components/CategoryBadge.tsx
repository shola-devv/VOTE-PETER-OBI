// /components/CategoryBadge.tsx
const categoryColors: Record<string, string> = {
  "Economic Leadership":   "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "Fiscal Discipline":     "bg-green-500/15 text-green-300 border-green-500/30",
  "Education":             "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Healthcare":            "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "Infrastructure":        "bg-orange-500/15 text-orange-300 border-orange-500/30",
  "Anti-Corruption":       "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  "Post-Governor Period":  "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "Security":              "bg-red-500/15 text-red-300 border-red-500/30",
  "Agriculture":           "bg-lime-500/15 text-lime-300 border-lime-500/30",
  "International":         "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "Character":             "bg-pink-500/15 text-pink-300 border-pink-500/30",
  "Transparency":          "bg-teal-500/15 text-teal-300 border-teal-500/30",
};

const DEFAULT = "bg-white/10 text-white/60 border-white/20";

export default function CategoryBadge({ category }: { category: string }) {
  const cls = categoryColors[category] ?? DEFAULT;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${cls} tracking-wide`}
    >
      {category}
    </span>
  );
}
