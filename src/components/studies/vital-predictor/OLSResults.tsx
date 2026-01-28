"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface CoefRow {
    name: string;
    coef: number;
    stdErr: number;
    t: number;
    p: number;
    conf: number[];
    status?: string; // 'remove' | 'keep'
}

interface OLSData {
    r2: number;
    adjR2: number;
    fStat: number;
    aic: number;
    bic: number;
    durbinWatson?: number;
    jarqueBera?: number;
    coefficients: CoefRow[];
}

export default function OLSResults({ data, title, phase }: { data: OLSData, title: string, phase?: "initial" | "final" }) {
    const { t } = useLanguage();

    return (
        <div className="bg-paper border border-ink/10 rounded-xl overflow-hidden shadow-sm my-8 font-mono text-sm">
            <div className="bg-ink/5 p-4 border-b border-ink/10 flex justify-between items-center">
                <h3 className="font-bold text-ink uppercase tracking-wider">{title}</h3>
                <div className="flex gap-4 text-xs text-ink/60">
                    <span>R²: <strong>{data.r2.toFixed(3)}</strong></span>
                    <span>Adj. R²: <strong>{data.adjR2.toFixed(3)}</strong></span>
                    <span>AIC: <strong>{data.aic.toFixed(2)}</strong></span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-ink/10 bg-ink/5 text-xs uppercase text-ink/50">
                            <th className="p-3 w-24">Variable</th>
                            <th className="p-3 text-right">Coef</th>
                            <th className="p-3 text-right">Std Err</th>
                            <th className="p-3 text-right">t</th>
                            <th className="p-3 text-right">P&gt;|t|</th>
                            <th className="p-3 text-right w-32">[0.025 - 0.975]</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.coefficients.map((row) => (
                            <tr
                                key={row.name}
                                className={`border-b border-ink/5 last:border-0 transition-colors ${row.status === 'remove' ? 'bg-red-500/5 text-red-600' : 'hover:bg-ink/5'}`}
                            >
                                <td className="p-3 font-semibold">{row.name}</td>
                                <td className="p-3 text-right">{row.coef.toFixed(4)}</td>
                                <td className="p-3 text-right">{row.stdErr.toFixed(3)}</td>
                                <td className="p-3 text-right">{row.t.toFixed(3)}</td>
                                <td className={`p-3 text-right font-bold ${row.p < 0.05 ? 'text-green-600' : 'text-red-500'}`}>
                                    {row.p.toFixed(3)}
                                </td>
                                <td className="p-3 text-right text-xs text-ink/50 font-sans">
                                    {row.conf[0].toFixed(3)} , {row.conf[1].toFixed(3)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Diagnostics Footer if available */}
            {(data.durbinWatson || data.jarqueBera) && (
                <div className="bg-ink/5 p-3 border-t border-ink/10 flex gap-6 text-xs text-ink/60 justify-end">
                    {data.durbinWatson && <span>Durbin-Watson: <strong>{data.durbinWatson.toFixed(3)}</strong></span>}
                    {data.jarqueBera && <span>Jarque-Bera: <strong>{data.jarqueBera.toFixed(3)}</strong></span>}
                </div>
            )}
        </div>
    );
}
