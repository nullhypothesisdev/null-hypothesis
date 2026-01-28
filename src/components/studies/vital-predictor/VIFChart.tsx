"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";
import { VIF_DATA } from "@/data/studies/vital-predictor-data";

export default function VIFChart() {
    const [stage, setStage] = useState<"before" | "after">("before");

    const data = VIF_DATA[stage];

    return (
        <div className="p-6">
            <div className="flex justify-center mb-6">
                <div className="bg-ink/5 p-1 rounded-lg flex gap-1">
                    <button
                        onClick={() => setStage("before")}
                        className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${stage === "before" ? "bg-paper shadow-sm text-ink font-bold" : "text-ink/40 hover:text-ink/70"}`}
                    >
                        Phase 1: Initial Model
                    </button>
                    <button
                        onClick={() => setStage("after")}
                        className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-all ${stage === "after" ? "bg-paper shadow-sm text-ink font-bold" : "text-ink/40 hover:text-ink/70"}`}
                    >
                        Phase 2: After Tuning
                    </button>
                </div>
            </div>

            <div className="h-[300px] w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border-dim)" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: 'var(--color-ink)' }} width={50} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'var(--color-ink)', opacity: 0.05 }}
                            contentStyle={{ backgroundColor: 'var(--color-paper)', borderColor: 'var(--color-ink)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--color-ink)' }}
                        />
                        <ReferenceLine x={5} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Threshold (5)', fill: 'red', fontSize: 10 }} />
                        <Bar dataKey="vif" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.status === "danger" ? "#DC2626" : entry.status === "warning" ? "#F59E0B" : "#10B981"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-xs text-ink/40 font-mono">
                {stage === "before" ? "Weight and BSA are highly correlated (VIF > 5), causing multicollinearity." : "Dropping Weight resolves the multicollinearity issue."}
            </div>
        </div>
    );
}
