"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Activity, Scale, HeartPulse, Brain, Calculator, FileText, Info, Target, BarChart2 } from "lucide-react";
import Latex from "react-latex-next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine } from "recharts";
import RiskRadar from "@/components/studies/vital-predictor/RiskRadar";

// --- TYPES ---
interface ModelCoeffs {
    intercept: number;
    age: number;
    bsa: number;
    dur: number;
    pulse: number;
    stress: number;
}

interface AxisConfig {
    label: string;
    unit: string;
    min: number;
    max: number;
    step: number;
}

// --- SCALING PARAMS --- 
import { BP_DATA } from "@/data/studies/vital-predictor-data";

// Calculate stats for scaling
const getStats = (key: string) => {
    const values = BP_DATA.map(d => d[key as keyof typeof d] as number);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    // Sample Variance (n-1)
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - 1);
    return { mean, std: Math.sqrt(variance) };
};

// ...

const STATS = {
    age: getStats("age"),
    bsa: getStats("bsa"),
    pulse: getStats("pulse")
};

// Calculate stats for scaling

// --- DEFAULTS ---
const DEFAULT_COEFFS: ModelCoeffs = {
    intercept: 114.00,
    age: 1.3535,
    bsa: 3.5173,
    dur: 0, // Removed
    pulse: 1.4441,
    stress: 0 // Removed
};

const DEFAULT_AXES: Record<string, AxisConfig> = {
    age: { label: "Age", unit: "yrs", min: 40, max: 80, step: 1 },
    bsa: { label: "BSA", unit: "m²", min: 1.6, max: 2.4, step: 0.01 },
    pulse: { label: "Pulse", unit: "bpm", min: 60, max: 80, step: 1 },
};

// --- PURE PREDICTION FUNCTION ---
const predictBP = (inputs: any, coeffs: ModelCoeffs) => {
    // Standardize Inputs
    const zAge = (inputs.age - STATS.age.mean) / STATS.age.std;
    const zBSA = (inputs.bsa - STATS.bsa.mean) / STATS.bsa.std;
    const zPulse = (inputs.pulse - STATS.pulse.mean) / STATS.pulse.std;

    return coeffs.intercept +
        (coeffs.age * zAge) +
        (coeffs.bsa * zBSA) +
        (coeffs.pulse * zPulse);
};

export default function BPRegressionDashboard({ modelConfig }: { modelConfig?: any }) {

    // --- STATE ---
    const [coeffs, setCoeffs] = useState<ModelCoeffs>(DEFAULT_COEFFS);
    const [axisConfig, setAxisConfig] = useState<Record<string, AxisConfig>>(DEFAULT_AXES);

    // --- TOOL STATE ---
    const [inputs, setInputs] = useState({ age: 48, bsa: 2.00, pulse: 70 });
    const [prediction, setPrediction] = useState(0);
    const [activeAxis, setActiveAxis] = useState("bsa");

    useEffect(() => {
        setPrediction(predictBP(inputs, coeffs));
    }, [inputs, coeffs]);

    // --- ACTIONS ---
    const optimizeBSA = () => {

        const zAge = (inputs.age - STATS.age.mean) / STATS.age.std;
        const zPulse = (inputs.pulse - STATS.pulse.mean) / STATS.pulse.std;

        const otherTerms = coeffs.intercept + (coeffs.age * zAge) + (coeffs.pulse * zPulse);
        const targetBP = 119;

        const requiredZBSA = (targetBP - otherTerms) / coeffs.bsa;
        const requiredBSA = requiredZBSA * STATS.bsa.std + STATS.bsa.mean;

        const config = axisConfig.bsa;
        const clampedBSA = Math.min(config.max, Math.max(config.min, requiredBSA));

        setInputs(prev => ({ ...prev, bsa: Number(clampedBSA.toFixed(2)) }));
    };

    // --- CHART ---
    const chartData = useMemo(() => {
        const config = axisConfig[activeAxis];
        if (!config) return [];
        const data = [];
        // Generate points around the range
        const range = config.max - config.min;
        const step = range / 20; // 20 points

        for (let x = config.min; x <= config.max; x += step) {
            const tempInputs = { ...inputs, [activeAxis]: x };
            data.push({
                xValue: Number(x.toFixed(2)),
                bp: Number(predictBP(tempInputs, coeffs).toFixed(2))
            });
        }
        return data;
    }, [inputs, activeAxis, axisConfig, coeffs]);

    const status = prediction < 120 ? { label: "Normal", color: "#059669", bg: "bg-emerald-500/10", text: "text-emerald-600" }
        : prediction < 130 ? { label: "Elevated", color: "#D97706", bg: "bg-amber-500/10", text: "text-amber-600" }
            : { label: "Hypertensive", color: "#DC2626", bg: "bg-red-500/10", text: "text-red-600" };

    return (
        <div className="w-full font-serif" dir="ltr">
            {/* --- GRID: TOOLS & CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-16">

                {/* LEFT: INPUTS (3 Cols) */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-ink/5 p-6 rounded-xl border border-ink/5">
                        <h3 className="font-serif text-xl text-ink mb-6 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-ink/40" /> Inputs
                        </h3>
                        <div className="space-y-6">
                            {[
                                { key: "age", icon: undefined },
                                { key: "bsa", icon: Scale },
                                { key: "pulse", icon: HeartPulse }
                            ].map((item) => {
                                const config = axisConfig[item.key];
                                if (!config) return null;
                                return (
                                    <div key={item.key}>
                                        <div className="flex justify-between text-xs font-mono mb-2 text-ink/60">
                                            <span className="flex items-center gap-2">
                                                {item.icon && <item.icon className="w-3 h-3" />} {config.label}
                                            </span>
                                            {/* @ts-ignore */}
                                            <span>{inputs[item.key]}</span>
                                        </div>
                                        <input
                                            type="range" min={config.min} max={config.max} step={config.step}
                                            // @ts-ignore
                                            value={inputs[item.key]}
                                            // @ts-ignore
                                            onChange={(e) => setInputs({ ...inputs, [item.key]: Number(e.target.value) })}
                                            className="w-full h-1.5 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-accent"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={optimizeBSA} className="w-full mt-8 py-3 bg-paper border border-ink/10 rounded-lg flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest hover:bg-accent hover:text-white hover:border-accent transition-all group">
                            <Target className="w-4 h-4 group-hover:animate-ping" />
                            Target Normal (&lt;120)
                        </button>
                    </div>
                </div>

                {/* CENTER: MONITOR & CHART (6 Cols) */}
                <div className="lg:col-span-6 flex flex-col gap-8">
                    <div className="bg-card border border-ink/10 rounded-2xl p-8 flex flex-col justify-center items-center relative overflow-hidden min-h-[300px]">
                        <div className={`absolute top-0 right-0 p-6 ${status.text}`}><Activity className="w-10 h-10 animate-pulse opacity-50" /></div>
                        <span className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-8">Predicted Systolic Pressure</span>
                        <div className="flex items-baseline gap-2">
                            <span className="font-serif text-8xl md:text-9xl text-ink tracking-tighter leading-none">{prediction.toFixed(0)}</span>
                            <span className="text-2xl text-ink/40 font-serif italic">mmHg</span>
                        </div>
                        <div className={`mt-8 px-6 py-2 rounded-full border border-ink/5 ${status.bg}`}>
                            <span className={`text-sm font-bold uppercase tracking-widest ${status.text}`}>{status.label} Condition</span>
                        </div>
                    </div>

                    <div className="bg-paper border border-ink/10 rounded-2xl p-6 flex flex-col h-[350px]">
                        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                            <span className="font-mono text-xs text-ink/40 uppercase tracking-widest flex items-center gap-2">
                                <BarChart2 className="w-3 h-3" /> Sensitivity Analysis
                            </span>
                            <div className="flex gap-1 bg-ink/5 p-1 rounded-lg overflow-x-auto max-w-full">
                                {Object.entries(axisConfig).map(([key, config]) => (
                                    <button key={key} onClick={() => setActiveAxis(key)} className={`px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap ${activeAxis === key ? "bg-paper text-ink shadow-sm font-bold" : "text-ink/40 hover:text-ink/70"}`}>
                                        {config.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full" dir="ltr">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-dim)" />
                                    <XAxis dataKey="xValue" tick={{ fontSize: 10, fill: 'var(--color-ink)', opacity: 0.5 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--color-ink)', opacity: 0.5 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-paper)', borderColor: 'var(--color-ink)', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: 'var(--color-ink)' }} formatter={(val: number) => val.toFixed(1) + " mmHg"} />
                                    <Line type="monotone" dataKey="bp" stroke="var(--color-accent)" strokeWidth={3} dot={false} isAnimationActive={false} />
                                    <ReferenceDot
                                        // @ts-ignore
                                        x={inputs[activeAxis]} y={prediction} r={6} fill="var(--color-ink)" stroke="var(--color-paper)" strokeWidth={2}
                                    />
                                    <ReferenceLine y={120} stroke="red" strokeDasharray="3 3" opacity={0.3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* RIGHT: RADAR & INSIGHTS (3 Cols) */}
                <div className="lg:col-span-3 space-y-6">
                    <div dir="ltr"><RiskRadar inputs={inputs} /></div>

                    <div className="bg-ink/5 border border-ink/10 p-6 rounded-xl">
                        <h4 className="font-bold text-ink mb-4 font-serif text-lg flex items-center gap-2">
                            <Info className="w-4 h-4 text-accent" /> Key Insights
                        </h4>
                        <ul className="text-sm text-ink/80 space-y-4 font-serif leading-relaxed">
                            <li className="border-l-2 border-ink/10 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
                                <strong className="block text-ink mb-1 font-bold text-base">BSA Dominance</strong>
                                Body Surface Area is the strongest predictor. A 1 standard deviation increase in BSA raises BP by ~{coeffs.bsa.toFixed(1)} mmHg.
                            </li>
                            <li className="border-l-2 border-ink/10 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pl-0 rtl:pr-4">
                                <strong className="block text-ink mb-1 font-bold text-base">Pulse Impact</strong>
                                Heart Rate is a significant runner-up. Every standardized unit increase adds another ~{coeffs.pulse.toFixed(2)} mmHg to the pressure.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

