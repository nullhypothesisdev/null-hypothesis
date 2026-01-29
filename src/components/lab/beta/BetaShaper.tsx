"use client";

import { useState, useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import Latex from "react-latex-next";
import { Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// --- MATH ENGINE (Unchanged) ---
function gamma(z: number): any {
  const p = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) x += p[i] / (z + i + 1);
  const t = z + p.length - 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function betaFunc(a: number, b: number) {
  return (gamma(a) * gamma(b)) / gamma(a + b);
}

function betaPDF(x: number, a: number, b: number) {
  if (x <= 0.001 || x >= 0.999) return 0;
  return (Math.pow(x, a - 1) * Math.pow(1 - x, b - 1)) / betaFunc(a, b);
}

interface BetaShaperLabels {
  control_alpha: string;
  control_beta: string;
  preset_uniform: string;
  preset_bell: string;
  preset_u: string;
  preset_skew: string;
  stat_mean: string;
  stat_var: string;
  stat_spread: string;
  stat_skew: string;
  stat_kurt: string;
  chart_pdf: string;
  skew_sym: string;
  skew_right: string;
  skew_left: string;
  kurt_normal: string;
  kurt_flat: string;
  kurt_plat: string;
  kurt_lep: string;
}

export default function BetaShaper({ labels = {
  control_alpha: "Alpha",
  control_beta: "Beta",
  preset_uniform: "Uniform",
  preset_bell: "Bell",
  preset_u: "U-Shape",
  preset_skew: "Skew",
  stat_mean: "Mean (μ)",
  stat_var: "Variance (σ²)",
  stat_spread: "Spread",
  stat_skew: "Skewness",
  stat_kurt: "Ex. Kurtosis",
  chart_pdf: "PDF Density",
  skew_sym: "Symmetric",
  skew_right: "Right Skew",
  skew_left: "Left Skew",
  kurt_normal: "Normal-like",
  kurt_flat: "Flat",
  kurt_plat: "Platykurtic",
  kurt_lep: "Leptokurtic"
} }: { labels?: BetaShaperLabels }) {
  const { dir } = useLanguage();
  const [alpha, setAlpha] = useState(2);
  const [beta, setBeta] = useState(5);

  // --- DATA GENERATION ---
  const data = useMemo(() => {
    const points = [];
    for (let x = 0; x <= 1.0; x += 0.01) {
      points.push({
        val: Number(x.toFixed(2)),
        y: betaPDF(x, alpha, beta)
      });
    }
    return points;
  }, [alpha, beta]);

  // --- STATS CALCULATION ---
  const stats = useMemo(() => {
    const sum = alpha + beta;
    const mean = alpha / sum;
    const variance = (alpha * beta) / (Math.pow(sum, 2) * (sum + 1));

    // Skewness
    const numSkew = 2 * (beta - alpha) * Math.sqrt(sum + 1);
    const denSkew = (sum + 2) * Math.sqrt(alpha * beta);
    const skew = numSkew / denSkew;

    // Kurtosis (Excess)
    const numKurt = 6 * (Math.pow(alpha - beta, 2) * (sum + 1) - alpha * beta * (sum + 2));
    const denKurt = alpha * beta * (sum + 2) * (sum + 3);
    const kurt = numKurt / denKurt;

    // Classification Logic (Return Keys)
    let kurtLabel = labels.kurt_normal;
    if (kurt < -1.0) kurtLabel = labels.kurt_flat;
    else if (kurt < -0.2) kurtLabel = labels.kurt_plat;
    else if (kurt > 0.2) kurtLabel = labels.kurt_lep;

    // Skew Label
    let skewLabel = labels.skew_sym;
    if (skew > 0.1) skewLabel = labels.skew_right;
    if (skew < -0.1) skewLabel = labels.skew_left;

    return { mean, variance, skew, kurt, kurtLabel, skewLabel };
  }, [alpha, beta, labels]);

  return (
    <div className="bg-card border border-ink/10 rounded-xl p-6 md:p-8 shadow-sm font-sans relative transition-colors duration-500" dir={dir}>

      {/* HEADER & PRESETS */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">

        {/* LEFT: CONTROLS */}
        <div className="w-full md:w-1/3 space-y-6">

          {/* Alpha Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2 text-ink/60">
              <span>{labels.control_alpha} (<Latex>{`$\\alpha$`}</Latex>)</span>
              <span dir="ltr">{alpha}</span>
            </div>
            <input
              type="range" min="0.1" max="10" step="0.1"
              value={alpha} onChange={(e) => setAlpha(Number(e.target.value))}
              className="w-full h-2 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Beta Slider */}
          <div>
            <div className="flex justify-between text-xs font-mono mb-2 text-ink/60">
              <span>{labels.control_beta} (<Latex>{`$\\beta$`}</Latex>)</span>
              <span dir="ltr">{beta}</span>
            </div>
            <input
              type="range" min="0.1" max="10" step="0.1"
              value={beta} onChange={(e) => setBeta(Number(e.target.value))}
              className="w-full h-2 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-ink"
            />
          </div>

          {/* Quick Snaps */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setAlpha(1); setBeta(1) }} className="px-3 py-3 md:py-2 border border-ink/10 rounded text-[10px] font-mono uppercase hover:bg-ink/5 text-ink/60 transition-colors">
              {labels.preset_uniform}
            </button>
            <button onClick={() => { setAlpha(5); setBeta(5) }} className="px-3 py-3 md:py-2 border border-ink/10 rounded text-[10px] font-mono uppercase hover:bg-ink/5 text-ink/60 transition-colors">
              {labels.preset_bell}
            </button>
            <button onClick={() => { setAlpha(0.5); setBeta(0.5) }} className="px-3 py-3 md:py-2 border border-ink/10 rounded text-[10px] font-mono uppercase hover:bg-ink/5 text-ink/60 transition-colors">
              {labels.preset_u}
            </button>
            <button onClick={() => { setAlpha(8); setBeta(2) }} className="px-3 py-3 md:py-2 border border-ink/10 rounded text-[10px] font-mono uppercase hover:bg-ink/5 text-ink/60 transition-colors">
              {labels.preset_skew}
            </button>
          </div>
        </div>

        {/* RIGHT: STATS DASHBOARD */}
        <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
          <StatCard label={labels.stat_mean} val={stats.mean.toFixed(3)} sub={`α / (α+β)`} />
          <StatCard label={labels.stat_var} val={stats.variance.toFixed(4)} sub={labels.stat_spread} />
          <StatCard label={labels.stat_skew} val={stats.skew.toFixed(3)} sub={stats.skewLabel} />
          <StatCard label={labels.stat_kurt} val={stats.kurt.toFixed(3)} sub={stats.kurtLabel} />
        </div>

      </div>

      {/* GRAPH AREA */}
      <div className="h-[250px] md:h-[350px] w-full relative border border-ink/10 rounded-lg bg-ink/5 overflow-hidden" dir="ltr">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-ink/40 z-10">
          <Activity className="w-3 h-3" /> {labels.chart_pdf}
        </div>

        <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`, backgroundSize: '20px 20px' }}
        />

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="betaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-dim)" vertical={false} />
            <XAxis
              dataKey="val"
              type="number"
              domain={[0, 1]}
              tickCount={11}
              tick={{ fill: 'var(--color-ink)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--color-paper)', borderColor: 'var(--color-ink)', fontFamily: 'var(--font-mono)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--color-ink)' }}
              formatter={(val: number) => val.toFixed(3)}
              labelFormatter={(val) => `x: ${val}`}
            />

            <ReferenceLine x={stats.mean} stroke="var(--color-ink)" strokeDasharray="3 3" label={{ value: 'μ', fill: 'var(--color-ink)', position: 'top', fontSize: 12, fontFamily: 'var(--font-serif)' }} />

            <Area
              type="monotone"
              dataKey="y"
              stroke="var(--color-accent)"
              strokeWidth={3}
              fill="url(#betaFill)"
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

// Helper Card
function StatCard({ label, val, sub }: { label: string, val: string, sub: string }) {
  return (
    <div className="bg-paper p-4 rounded-lg border border-ink/5 flex flex-col justify-between shadow-sm">
      <span className="text-[10px] font-mono uppercase tracking-widest text-ink/40">{label}</span>
      <span className="text-xl md:text-2xl font-mono font-bold text-ink my-1" dir="ltr">{val}</span>
      <span className="text-[9px] md:text-[10px] text-ink/50 font-serif italic truncate">{sub}</span>
    </div>
  );
}