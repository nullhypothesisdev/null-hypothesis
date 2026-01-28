"use client";

import { useState, useMemo } from "react";
import { ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label, ReferenceLine } from "recharts";
import Latex from "react-latex-next";
import { BP_DATA } from "@/data/studies/vital-predictor-data";
import { useLanguage } from "@/contexts/LanguageContext";

// Gaussian Kernel Helper
const gaussianKernel = (u: number) => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * u * u);
};

// KDE Calculation Helper
const calculateKDE = (data: number[], bandwidth?: number) => {
    const n = data.length;
    if (n === 0) return [];

    // Silverman's Rule of Thumb for bandwidth if not provided
    // h = 1.06 * std * n^(-1/5)
    // std calculation:
    const mean = data.reduce((a, b) => a + b, 0) / n;
    const std = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (n - 1));
    const h = bandwidth || (1.06 * std * Math.pow(n, -0.2));

    // Generate points
    const min = Math.min(...data);
    const max = Math.max(...data);
    const padding = (max - min) * 0.2; // Add 20% padding
    const start = min - padding;
    const end = max + padding;

    const steps = 50; // Resolution
    const stepSize = (end - start) / steps;

    const densityData = [];
    for (let i = 0; i <= steps; i++) {
        const x = start + i * stepSize;
        let sum = 0;
        for (let j = 0; j < n; j++) {
            sum += gaussianKernel((x - data[j]) / h);
        }
        const density = sum / (n * h);
        densityData.push({ x, density });
    }
    return densityData;
};

// Pearson Correlation Helper
const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    if (n === 0) return 0;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
};

export default function VariableExplorer() {
    const [xVar, setXVar] = useState("age");
    // Initialize yVar to match xVar to show KDE first for impact? 
    // Or keep 'bp' as default. Let's keep 'bp' but maybe default user wants to see BP vs BP first?
    const [yVar, setYVar] = useState("bp");

    const variables = [
        { value: "bp", label: "Blood Pressure" },
        { value: "age", label: "Age" },
        { value: "weight", label: "Weight" },
        { value: "bsa", label: "Body Surface Area" },
        { value: "dur", label: "Drug Utilization Review" },
        { value: "pulse", label: "Pulse" },
        { value: "stress", label: "Stress Level" },
    ];

    const isDistibution = xVar === yVar;

    const chartData = useMemo(() => {
        if (isDistibution) {
            // Get array of values for this variable
            const values = BP_DATA.map(row => row[xVar as keyof typeof row] as number);
            return calculateKDE(values);
        } else {
            return BP_DATA;
        }
    }, [xVar, yVar, isDistibution]);

    const correlation = useMemo(() => {
        if (isDistibution) return null;
        const xValues = BP_DATA.map(row => row[xVar as keyof typeof row] as number);
        const yValues = BP_DATA.map(row => row[yVar as keyof typeof row] as number);
        return calculateCorrelation(xValues, yValues);
    }, [xVar, yVar, isDistibution]);

    return (
        <div className="flex flex-col gap-6">
            <div className="p-6 h-[500px] flex flex-col bg-paper border border-ink/5 rounded-xl shadow-sm">
                <div className="flex gap-4 mb-6 border-b border-ink/10 pb-4">
                    <div>
                        <label className="block text-xs font-mono uppercase text-ink/40 mb-1">X-Axis Variable</label>
                        <select
                            value={xVar}
                            onChange={(e) => setXVar(e.target.value)}
                            className="bg-ink/5 border border-ink/10 rounded px-3 py-1 text-sm font-serif"
                        >
                            {variables.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-mono uppercase text-ink/40 mb-1">Y-Axis Variable</label>
                        <select
                            value={yVar}
                            onChange={(e) => setYVar(e.target.value)}
                            className="bg-ink/5 border border-ink/10 rounded px-3 py-1 text-sm font-serif"
                        >
                            {variables.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                        </select>
                    </div>

                    <div className="ml-auto flex items-end">
                        {isDistibution ? (
                            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded font-mono uppercase tracking-wider">
                                KDE Mode Active
                            </span>
                        ) : (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-ink/40 uppercase tracking-widest font-mono">Pearson Correlation</span>
                                <span className="text-lg font-serif font-bold text-accent">
                                    <Latex>{`$r = ${correlation?.toFixed(3)}$`}</Latex>
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                        {isDistibution ? (
                            <AreaChart data={chartData as { x: number, density: number }[]} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    tick={{ fontSize: 10, fill: 'var(--color-ink)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['auto', 'auto']}
                                >
                                    <Label value={xVar} offset={0} position="insideBottom" style={{ fill: 'var(--color-ink)', textTransform: 'uppercase', fontSize: '10px' }} />
                                </XAxis>
                                <YAxis
                                    type="number"
                                    dataKey="density"
                                    tick={{ fontSize: 10, fill: 'var(--color-ink)' }}
                                    tickLine={false}
                                    axisLine={false}
                                >
                                    <Label value="Density" angle={-90} position="insideLeft" style={{ fill: 'var(--color-ink)', textTransform: 'uppercase', fontSize: '10px' }} />
                                </YAxis>
                                <Tooltip
                                    labelFormatter={(val) => `${xVar}: ${Number(val).toFixed(2)}`}
                                    formatter={(val: number) => [val.toFixed(4), "Density"]}
                                    contentStyle={{ backgroundColor: 'var(--color-paper)', borderColor: 'var(--color-ink)', borderRadius: '8px' }}
                                />
                                <Area type="monotone" dataKey="density" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.2} />
                            </AreaChart>
                        ) : (
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-dim)" />
                                <XAxis
                                    type="number"
                                    dataKey={xVar}
                                    name={xVar}
                                    tick={{ fontSize: 10, fill: 'var(--color-ink)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                    allowDataOverflow={false}
                                >
                                    <Label value={xVar} offset={0} position="insideBottom" style={{ fill: 'var(--color-ink)', textTransform: 'uppercase', fontSize: '10px' }} />
                                </XAxis>
                                <YAxis
                                    type="number"
                                    dataKey={yVar}
                                    name={yVar}
                                    tick={{ fontSize: 10, fill: 'var(--color-ink)' }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                    allowDataOverflow={false}
                                >
                                    <Label value={yVar} angle={-90} position="insideLeft" style={{ fill: 'var(--color-ink)', textTransform: 'uppercase', fontSize: '10px' }} />
                                </YAxis>
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--color-paper)', borderColor: 'var(--color-ink)', borderRadius: '8px' }} />
                                <Scatter name="Data Points" data={chartData as any} fill="var(--color-accent)" />
                            </ScatterChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Explanatory text provided by user */}
            <div className="bg-paper border border-ink/10 rounded-xl p-6 text-sm text-ink/80 leading-relaxed">
                <h4 className="font-bold text-ink mb-2">Note: Why KDE?</h4>
                <p className="mb-2">
                    Kernel Density Estimation (KDE) is preferred over Histograms in our case.
                </p>
                <p>
                    <Latex>
                        {`Histograms use discrete, rectangular bars to show frequency counts within set intervals (bins), making them ideal for identifying exact counts and data spread. Kernel Density Estimation ($KDE$) creates a smooth, continuous probability density curve by summing small Gaussian curves over each data point, making it better for visualizing shape and identifying trends without binning bias.`}
                    </Latex>
                </p>
                <p className="text-xs text-ink/50 mt-4 italic">
                    Try selecting the same variable for both X and Y axes above to see the KDE distribution!
                </p>
            </div>
        </div>
    );
}
