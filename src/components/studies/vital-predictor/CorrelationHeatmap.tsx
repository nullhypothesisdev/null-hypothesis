
"use client";

import { CORRELATION_MATRIX } from "@/data/studies/vital-predictor-data";

export default function CorrelationHeatmap() {
    const vars = ["BP", "Age", "Weight", "BSA", "Dur", "Pulse", "Stress"];

    const getColor = (val: number) => {
        // Simple heatmap logic: darker red for high correlation
        // Using opacity on a red base
        return `rgba(220, 38, 38, ${Math.abs(val)})`; // tailwind red-600
    };

    return (
        <div className="p-6 overflow-x-auto">
            <div className="min-w-[600px]">
                {/* Header Row */}
                <div className="flex mb-1">
                    <div className="w-24 shrink-0"></div>
                    {vars.map(v => (
                        <div key={v} className="flex-1 text-center text-xs font-mono uppercase text-ink/50 py-2">{v}</div>
                    ))}
                </div>

                {/* Matrix Rows */}
                {CORRELATION_MATRIX.map((row) => (
                    <div key={row.variable} className="flex items-center mb-1">
                        <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono uppercase text-ink/50">{row.variable}</div>
                        {vars.map((v) => {
                            // @ts-ignore
                            const val = row[v];
                            return (
                                <div key={v} className="flex-1 aspect-square flex items-center justify-center mx-0.5 rounded text-xs font-bold text-ink relative group">
                                    <div
                                        className="absolute inset-0 rounded transition-all group-hover:scale-105"
                                        style={{ backgroundColor: getColor(val) }}
                                    />
                                    <span className={`relative z-10 ${Math.abs(val) > 0.5 ? 'text-white' : 'text-ink'}`}>{val}</span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="mt-4 text-xs text-ink/40 font-mono text-center">
                Values &gt; 0.7 indicate high correlation. Notice Weight vs BSA (0.875).
            </div>
        </div>
    );
}
