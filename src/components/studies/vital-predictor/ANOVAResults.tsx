"use client";

import Latex from "react-latex-next";
import { DIAGNOSTICS } from "@/data/studies/vital-predictor-data";

export default function ANOVAResults() {
    return (
        <div className="bg-paper border border-ink/10 rounded-xl overflow-hidden shadow-sm my-8 font-mono text-sm">
            <div className="bg-ink/5 p-4 border-b border-ink/10 flex justify-between items-center">
                <h3 className="font-bold text-ink uppercase tracking-wider">Analysis of Variance (ANOVA)</h3>
                <div className="flex gap-4 text-xs text-ink/60">
                    <span>Type: <strong>II</strong></span>
                    <span>Method: <strong>OLS</strong></span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-ink/10 bg-ink/5 text-xs uppercase text-ink/50">
                            <th className="p-3 w-32">Source</th>
                            <th className="p-3 text-right">Sum Sq</th>
                            <th className="p-3 text-right">DF</th>
                            <th className="p-3 text-right">Mean Sq</th>
                            <th className="p-3 text-right">F</th>
                            <th className="p-3 text-right">PR(&gt;F)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DIAGNOSTICS.anova.table.map((row) => (
                            <tr
                                key={row.source}
                                className="border-b border-ink/5 last:border-0 hover:bg-ink/5 transition-colors"
                            >
                                <td className="p-3 font-semibold">{row.source}</td>
                                <td className="p-3 text-right">{row.sumSq.toFixed(2)}</td>
                                <td className="p-3 text-right">{row.df}</td>
                                <td className="p-3 text-right">{row.meanSq.toFixed(2)}</td>
                                <td className="p-3 text-right">{row.f !== null ? row.f.toFixed(2) : '-'}</td>
                                <td className={`p-3 text-right font-bold ${row.p !== null && row.p < 0.05 ? 'text-green-600' : ''}`}>
                                    {row.p !== null ? (row.p < 0.001 ? '< 0.001' : row.p.toFixed(4)) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-ink/5 p-3 border-t border-ink/10 text-xs text-ink/60 italic text-center">
                Table 3.2: Variance decomposition of the final model.
            </div>
        </div>
    );
}
