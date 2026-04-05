// /app/about/page.tsx
import Link from "next/link";
import { Shield, Users, Globe, Heart } from "lucide-react";
import { reasons } from "@/data/reasons";

const values = [
  {
    icon: Shield,
    title: "Evidence-backed",
    body: "Every reason links to a verifiable source — news articles, official records, biographies. No rumours, no conjecture.",
  },
  {
    icon: Users,
    title: "Community-built",
    body: "Citizens can submit reasons. Each submission is reviewed before going live, ensuring quality and accuracy.",
  },
  {
    icon: Globe,
    title: "Open and transparent",
    body: "This project is open to scrutiny. The sources are public. The data is yours to share freely.",
  },
  {
    icon: Heart,
    title: "Non-partisan in method",
    body: "We focus solely on evidence of competence, character, and track record — the kind of standard that should apply to every candidate.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#00c853]/6 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center relative">
          <div className="flex justify-center gap-1 mb-6">
            {["#00c853","#ffffff","#00c853"].map((c, i) => (
              <div key={i} style={{ background: c }} className="h-1.5 w-10 rounded-full opacity-70" />
            ))}
          </div>
          <h1 className="font-playfair font-black text-4xl sm:text-5xl text-white mb-5 leading-tight">
            Why This Project Exists
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto">
            Nigerian democracy deserves better than tribalism, emotion, and propaganda.
            It deserves <em className="text-white not-italic font-medium">evidence</em>.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="rounded-2xl bg-[#111827]/60 border border-white/10 p-7 sm:p-9">
          <h2 className="font-playfair font-bold text-2xl text-white mb-4">Our story</h2>
          <div className="text-white/60 leading-relaxed space-y-4 text-[15px]">
            <p>
              In every Nigerian election cycle, billions of naira are spent on campaigns
              designed to confuse, manipulate, and distract. Voters are shown rallies, not
              records. They are fed slogans, not statistics. The result is that genuine
              competence often loses to whoever has the loudest machine.
            </p>
            <p>
              This project was born out of frustration with that reality. We believe that
              Peter Gregory Obi's record — as a businessman, as Governor of Anambra State,
              as a public servant — deserves to be seen clearly, without noise. So we have
              started collecting reasons, each backed by a source you can verify yourself.
            </p>
            <p>
              We now have{" "}
              <span className="text-[#00c853] font-semibold">
                {reasons.length.toLocaleString()}+
              </span>{" "}
              and counting — because Nigerians from every corner of the country have been
              adding their own. This is not a campaign website. It is a civic archive.
            </p>
            <p>
              Whether you agree or disagree with Peter Obi, we invite you to read the
              evidence. Judge it on its merits. And hold every candidate to the same
              standard.
            </p>
          </div>
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-xl bg-[#111827]/60 border border-white/10 p-5 hover:border-[#00c853]/20 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[#00c853]/10 flex items-center justify-center mb-3">
                <Icon size={17} className="text-[#00c853]" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-gradient-to-br from-[#00c853]/10 to-[#ffd54f]/5 border border-[#00c853]/20 p-8 text-center">
          <h3 className="font-playfair font-bold text-2xl text-white mb-3">
            Add your reason
          </h3>
          <p className="text-white/50 text-sm mb-5 max-w-md mx-auto">
            If you know a reason that isn't on this list, submit it. One submission per
            person, sources required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/submit"
              className="px-6 py-3 rounded-xl bg-[#00c853] text-[#0a0f1e] font-semibold text-sm hover:bg-[#00a844] transition-colors"
            >
              Submit a reason
            </Link>
            <Link
              href="/index"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium text-sm hover:text-white hover:bg-white/10 transition-colors"
            >
              Browse all {reasons.length.toLocaleString()}+ reasons
            </Link>
          </div>
        </div>
      </div>
    {/* Voters Card CTA */}
<div className="max-w-3xl mx-auto px-4 sm:px-6 pb-14 text-center">
  <a
    href="https://cvr.inecnigeria.org"
    target="_blank"
    rel="noopener noreferrer nofollow"
    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ffd54f]/10 border border-[#ffd54f]/30 text-[#ffd54f] font-semibold text-sm hover:bg-[#ffd54f]/20 transition-colors"
  >
     Get your Voters Card
  </a>
</div>

    </div>
  );
}
