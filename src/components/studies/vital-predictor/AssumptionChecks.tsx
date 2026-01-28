"use client";

import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import Latex from "react-latex-next";
import { BP_DATA, OLS_RESULTS, DIAGNOSTICS } from "@/data/studies/vital-predictor-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AssumptionChecks() {
    const { t } = useLanguage();

    // 1. Calculate Residuals Live
    const residualsData = useMemo(() => {
        const coefs = OLS_RESULTS.final.coefficients;
        const getCoef = (name: string) => coefs.find(c => c.name === name)?.coef || 0;

        const b0 = getCoef("const");
        const bAge = getCoef("Age");
        const bBSA = getCoef("BSA");
        const bPulse = getCoef("Pulse");

        return BP_DATA.map((row) => {
            // Standardizing inputs similar to notebook logic:
            // (x - mean) / std
            const stats = {
                age: { mean: 48.6, std: 2.50 },
                bsa: { mean: 1.998, std: 0.136 },
                pulse: { mean: 69.6, std: 3.80 }
            };

            const zAge = (row.age - stats.age.mean) / stats.age.std;
            const zBSA = (row.bsa - stats.bsa.mean) / stats.bsa.std;
            const zPulse = (row.pulse - stats.pulse.mean) / stats.pulse.std;

            const predicted = b0 + (bAge * zAge) + (bBSA * zBSA) + (bPulse * zPulse);
            const residual = row.bp - predicted;

            return {
                id: row.pt,
                fitted: parseFloat(predicted.toFixed(2)),
                residual: parseFloat(residual.toFixed(2))
            };
        });
    }, []);

    // 2. Prepare Q-Q Plot Data
    const qqData = useMemo(() => {
        // Standardize residuals: (r - mean) / std
        const residuals = residualsData.map(d => d.residual);
        const mean = residuals.reduce((a, b) => a + b, 0) / residuals.length;
        const std = Math.sqrt(residuals.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (residuals.length - 1));
        const standardized = residuals.map(r => (r - mean) / std).sort((a, b) => a - b);

        // Theoretical Quantiles for N=20 (Standard Normal)
        // Calculated for p = (i - 0.5) / 20
        // Using approximate standard normal quantiles (Probplot positions)
        const theoretical = [
            -1.87, -1.40, -1.13, -0.92, -0.74, -0.59, -0.44, -0.31, -0.19, -0.06,
            0.06, 0.19, 0.31, 0.44, 0.59, 0.74, 0.92, 1.13, 1.40, 1.87
        ];

        return standardized.map((val, i) => ({
            x: theoretical[i],
            y: val
        }));
    }, [residualsData]);

    return (
        <div className="space-y-8 my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Linearity & Homoscedasticity: Residuals vs Fitted */}
                <div className="bg-paper border border-ink/10 rounded-xl p-6 shadow-sm">
                    <h4 className="font-bold text-ink mb-2">Residuals vs. Fitted</h4>
                    <p className="text-xs text-ink/50 mb-6 font-mono">(Should be random cloud)</p>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis
                                    type="number"
                                    dataKey="fitted"
                                    name="Fitted BP"
                                    domain={['auto', 'auto']}
                                    label={{ value: 'Predicted BP (Std)', position: 'bottom', offset: 0, fontSize: 10 }}
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="residual"
                                    name="Residual"
                                    label={{ value: 'Residuals', angle: -90, position: 'insideLeft', fontSize: 10 }}
                                    tick={{ fontSize: 10 }}
                                />
                                <ReferenceLine y={0} stroke="red" strokeDasharray="3 3" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Residuals" data={residualsData} fill="var(--color-accent)" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Normality: Q-Q Plot */}
                <div className="bg-paper border border-ink/10 rounded-xl p-6 shadow-sm">
                    <h4 className="font-bold text-ink mb-2">Q-Q Plot</h4>
                    <p className="text-xs text-ink/50 mb-6 font-mono">(Should follow the red line)</p>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="Theoretical"
                                    domain={[-3, 3]}
                                    label={{ value: 'Theoretical Quantiles', position: 'bottom', offset: 0, fontSize: 10 }}
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="Observed"
                                    domain={[-3, 3]}
                                    label={{ value: 'Ordered Values', angle: -90, position: 'insideLeft', fontSize: 10 }}
                                    tick={{ fontSize: 10 }}
                                />
                                {/* 45-degree line for reference y=x */}
                                <ReferenceLine segment={[{ x: -3, y: -3 }, { x: 3, y: 3 }]} stroke="red" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Quantiles" data={qqData} fill="blue" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. Normality Test (Shapiro-Wilk) */}
            <div className="bg-paper border border-ink/10 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h4 className="font-bold text-ink mb-2">Normality Test (Shapiro-Wilk)</h4>
                    <p className="text-sm text-ink/60 max-w-md">
                        <Latex>We fail to reject the null hypothesis of normality ($p &gt; 0.05$). The residuals follow a normal distribution, allowing us to trust our confidence intervals.</Latex>
                    </p>
                </div>

                <div className="flex items-center gap-12 bg-ink/5 rounded-lg p-6">
                    <div className="text-center">
                        <div className="text-3xl font-mono text-ink font-bold">{DIAGNOSTICS.shapiro.statistic}</div>
                        <div className="text-xs text-ink/50 uppercase tracking-widest mt-1">Statistic (W)</div>
                    </div>
                    <div className="h-12 w-px bg-ink/10"></div>
                    <div className="text-center">
                        <div className="text-3xl font-mono text-green-600 font-bold">&gt; 0.05</div>
                        <div className="text-xs text-ink/50 uppercase tracking-widest mt-1">P-Value</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
