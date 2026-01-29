// AlphaSelector.tsx

"use client";
import { useState } from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import Latex from "react-latex-next";
import { useLanguage } from "@/contexts/LanguageContext";


interface AlphaSelectorLabels {
  title: string;
  desc: string;
  std: string;
  std_desc: string;
  strict: string;
  strict_desc: string;
  physics: string;
  physics_desc: string;
  level: string;
  type1: string;
  type2: string;
}

export default function AlphaSelector({ labels = {
  title: "Setting the Trap",
  desc: "The threshold α defines how much evidence we demand before rejecting the Null.",
  std: "Standard (0.05)",
  std_desc: "1 in 20 chance of a False Positive.",
  strict: "Strict (0.01)",
  strict_desc: "1 in 100 chance. Used in Pharma/Physics.",
  physics: "Physics (5σ)",
  physics_desc: "1 in 3.5 million.",
  level: "Significance Level",
  type1: "Type I Risk (False Positive)",
  type2: "Type II Risk (Missed Discovery)"
} }: { labels?: AlphaSelectorLabels }) {
  const { dir } = useLanguage();
  const [alpha, setAlpha] = useState(0.05);

  // NOTE: This relationship is purely illustrative and relies on a fixed power assumption (1-beta = 1 - (alpha * 6) + const).
  const falsePositiveRisk = alpha * 100;
  // Illustrative inverse relationship for Type II (Beta), scaled for display
  const falseNegativeRisk = Math.max(5, 100 - (alpha * 300));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center bg-card border border-ink/10 rounded-xl p-4 md:p-8 shadow-sm" dir={dir}>

      {/* LEFT COLUMN: THEORY AND LIST */}
      <div>
        <h3 className="font-serif text-xl md:text-2xl text-ink mb-4">{labels.title}: <Latex>$\alpha$</Latex></h3>
        <div className="prose prose-ink text-ink/80 text-base leading-relaxed font-serif">
          <p>
            {labels.desc}
          </p>
          <ul className="space-y-3 mt-4 text-sm border-l-2 border-ink/10 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
            <li className="flex flex-col">
              <span className="text-accent font-bold font-mono text-xs uppercase tracking-wide">{labels.std}</span>
              <span>{labels.std_desc}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-accent font-bold font-mono text-xs uppercase tracking-wide">{labels.strict}</span>
              <span>{labels.strict_desc}</span>
            </li>
            <li className="flex flex-col">
              <span className="text-accent font-bold font-mono text-xs uppercase tracking-wide">{labels.physics}</span>
              <span>{labels.physics_desc}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT COLUMN: CONTROLS AND VISUALIZATION */}
      <div className="bg-ink/5 p-4 rounded-xl border border-ink/5">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-ink/60">{labels.level} (<Latex>$\alpha$</Latex>)</span>
          <span className="font-mono text-xl md:text-2xl font-bold text-ink" dir="ltr">{alpha.toFixed(3)}</span>
        </div>

        <input
          type="range" min="0.001" max="0.10" step="0.001"
          value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))}
          className="w-full mb-6 md:mb-8 h-1.5 bg-ink/20 rounded-lg appearance-none cursor-pointer accent-accent"
        />

        <div className="space-y-4 md:space-y-6">

          {/* TYPE I RISK (ALPHA) */}
          <div>
            <div className="flex justify-between text-[10px] font-mono uppercase mb-2 text-ink/50">
              <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {labels.type1}</span>
              <span dir="ltr">{falsePositiveRisk.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-ink/10 rounded-sm overflow-hidden border border-ink/5">
              <div className="h-full bg-red-600/80 transition-all duration-300" style={{ width: `${falsePositiveRisk}%` }} />
            </div>
          </div>

          {/* TYPE II RISK (BETA) - ILLUSTRATIVE */}
          <div>
            <div className="flex justify-between text-[10px] font-mono uppercase mb-2 text-ink/50">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> {labels.type2}</span>
              {/* Note: Displaying the risk, not the inverse */}
              <span dir="ltr">{Math.max(5, falseNegativeRisk).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-ink/10 rounded-sm overflow-hidden border border-ink/5">
              {/* Bar width decreases as alpha increases */}
              <div className="h-full bg-blue-600/80 transition-all duration-300" style={{ width: `${Math.max(5, falseNegativeRisk)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}