"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Table as TableIcon } from "lucide-react";
import { BP_DATA, DESCRIPTIVE_STATS } from "@/data/studies/vital-predictor-data";
import { cn } from "@/lib/utils";

export default function DataInspection() {
    const [showStats, setShowStats] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initial view: Truncate at 5 rows
    const visibleRows = BP_DATA.slice(0, 5);

    // Handle Scroll Lock and ESC key
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';

            const handleEsc = (e: KeyboardEvent) => {
                if (e.key === "Escape") setIsModalOpen(false);
            };
            window.addEventListener('keydown', handleEsc);

            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [isModalOpen]);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-mono text-sm uppercase tracking-widest text-ink/50">
                    {showStats ? "Descriptive Statistics" : "Raw Dataset Preview (n=20)"}
                </h3>
                <button
                    onClick={() => setShowStats(!showStats)}
                    className="text-xs font-mono uppercase tracking-widest text-accent hover:underline"
                >
                    {showStats ? "Hide Stats" : "Show Descriptive Stats"}
                </button>
            </div>

            <div className="overflow-x-auto">
                {showStats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 latex-prose">
                        {Object.entries(DESCRIPTIVE_STATS).map(([key, stats]) => (
                            <div key={key} className="bg-ink/5 p-5 rounded-lg border border-ink/5">
                                <h4 className="font-bold text-ink uppercase text-sm mb-3 border-b border-ink/10 pb-2 flex justify-between">
                                    {key}
                                    <span className="text-xs font-normal text-ink/40 normal-case">n=20</span>
                                </h4>

                                <div className="space-y-3">
                                    {/* Central Tendency */}
                                    <div className="grid grid-cols-2 gap-2 text-xs font-mono border-b border-ink/5 pb-2">
                                        <div>
                                            <span className="text-ink/40 block">Mean</span>
                                            <span className="text-ink font-bold">{stats.mean}</span>
                                        </div>
                                        <div>
                                            <span className="text-ink/40 block">Std Dev</span>
                                            <span className="text-ink font-bold">{stats.std}</span>
                                        </div>
                                    </div>

                                    {/* Quantiles */}
                                    <div className="space-y-1 text-xs font-mono text-ink/70">
                                        <div className="flex justify-between"><span>Min:</span> <span>{stats.min}</span></div>
                                        <div className="flex justify-between"><span>25%:</span> <span>{stats.q1}</span></div>
                                        <div className="flex justify-between font-bold text-ink"><span>Median:</span> <span>{stats.median}</span></div>
                                        <div className="flex justify-between"><span>75%:</span> <span>{stats.q3}</span></div>
                                        <div className="flex justify-between"><span>Max:</span> <span>{stats.max}</span></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="relative">
                        <table className="w-full text-sm text-center">
                            <thead className="text-xs font-mono uppercase text-ink/40 border-b border-ink/10">
                                <tr>
                                    <th className="px-4 py-2 text-left">Pt ID</th>
                                    <th className="px-4 py-2 font-bold text-ink">BP</th>
                                    <th className="px-4 py-2">Age</th>
                                    <th className="px-4 py-2">Weight</th>
                                    <th className="px-4 py-2">BSA</th>
                                    <th className="px-4 py-2">Dur</th>
                                    <th className="px-4 py-2">Pulse</th>
                                    <th className="px-4 py-2">Stress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-ink/5 font-mono text-ink/80">
                                {visibleRows.map((row) => (
                                    <tr key={row.pt} className="hover:bg-ink/5 transition-colors">
                                        <td className="px-4 py-2 text-left text-ink/30">#{row.pt}</td>
                                        <td className="px-4 py-2 font-bold text-accent">{row.bp}</td>
                                        <td className="px-4 py-2">{row.age}</td>
                                        <td className="px-4 py-2">{row.weight}</td>
                                        <td className="px-4 py-2">{row.bsa}</td>
                                        <td className="px-4 py-2">{row.dur}</td>
                                        <td className="px-4 py-2">{row.pulse}</td>
                                        <td className="px-4 py-2">{row.stress}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Cutoff Fade and Button */}
                        <div className="relative mt-2 text-center">
                            <div className="absolute -top-12 left-0 w-full h-12 bg-gradient-to-t from-paper to-transparent pointer-events-none"></div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-ink text-paper font-serif text-sm rounded-full hover:bg-ink/90 transition-transform hover:scale-105 active:scale-95 shadow-md z-10 relative"
                            >
                                <TableIcon className="w-4 h-4" />
                                View Full Dataset ({BP_DATA.length} Rows)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* FULL DATA MODAL (Portal to Body) */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-ink/20 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-4xl max-h-[85vh] bg-paper shadow-2xl rounded-xl border border-ink/10 flex flex-col animate-in zoom-in-95 duration-200 z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-ink/10 bg-ink/5 rounded-t-xl shrink-0">
                            <div>
                                <h3 className="font-serif text-xl font-bold text-ink">Full Dataset</h3>
                                <p className="text-sm text-ink/50 font-mono mt-1">bloodpress.txt • n={BP_DATA.length}</p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-ink/10 rounded-full transition-colors text-ink/60 hover:text-ink"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="overflow-auto flex-1 p-6 custom-scrollbar">
                            <table className="w-full text-sm text-center">
                                <thead className="text-xs font-mono uppercase text-ink/40 border-b border-ink/10 sticky top-0 bg-paper z-10 shadow-sm">
                                    <tr>
                                        <th className="px-4 py-3 text-left bg-paper">Pt ID</th>
                                        <th className="px-4 py-3 font-bold text-ink bg-paper">BP</th>
                                        <th className="px-4 py-3 bg-paper">Age</th>
                                        <th className="px-4 py-3 bg-paper">Weight</th>
                                        <th className="px-4 py-3 bg-paper">BSA</th>
                                        <th className="px-4 py-3 bg-paper">Dur</th>
                                        <th className="px-4 py-3 bg-paper">Pulse</th>
                                        <th className="px-4 py-3 bg-paper">Stress</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-ink/5 font-mono text-ink/80">
                                    {BP_DATA.map((row) => (
                                        <tr key={row.pt} className="hover:bg-ink/5 transition-colors">
                                            <td className="px-4 py-3 text-left text-ink/30">#{row.pt}</td>
                                            <td className="px-4 py-3 font-bold text-accent">{row.bp}</td>
                                            <td className="px-4 py-3">{row.age}</td>
                                            <td className="px-4 py-3">{row.weight}</td>
                                            <td className="px-4 py-3">{row.bsa}</td>
                                            <td className="px-4 py-3">{row.dur}</td>
                                            <td className="px-4 py-3">{row.pulse}</td>
                                            <td className="px-4 py-3">{row.stress}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-ink/10 bg-ink/5 text-xs text-ink/40 text-center font-mono rounded-b-xl shrink-0">
                            Source: <a href="https://online.stat.psu.edu/stat462/sites/onlinecourses.science.psu.edu.stat462/files/data/bloodpress/index.txt" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">bloodpress.txt</a>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
