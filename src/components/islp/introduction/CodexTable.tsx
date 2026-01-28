"use client";

import { NotationSystem } from "@/data/islp/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Latex from 'react-latex-next';

interface CodexTableProps {
    notation: NotationSystem;
}

export default function CodexTable({ notation }: CodexTableProps) {
    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-xl border border-ink/10 bg-paper overflow-hidden"
            >
                <div className="px-6 py-4 border-b border-ink/10 bg-ink/[0.02] flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-ink">{notation.title}</h3>
                        <p className="text-xs text-ink/40 font-mono uppercase tracking-widest">{notation.description}</p>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-ink/10 text-ink/40 font-mono text-xs uppercase tracking-wider">
                                <th className="px-6 py-3 font-normal w-32">Symbol</th>
                                <th className="px-6 py-3 font-normal">Definition</th>
                                <th className="px-6 py-3 font-normal hidden md:table-cell">Example</th>
                                <th className="px-6 py-3 font-normal w-24">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ink/5">
                            {notation.entries.map((entry, index) => (
                                <tr
                                    key={index}
                                    className="group hover:bg-ink/[0.02] transition-colors"
                                >
                                    <td className="px-6 py-4 font-serif text-lg text-primary">
                                        <Latex>{`$${entry.symbol}$`}</Latex>
                                    </td>
                                    <td className="px-6 py-4 text-ink/80 leading-relaxed font-medium">
                                        {entry.definition}
                                    </td>
                                    <td className="px-6 py-4 text-ink/50 font-mono text-xs hidden md:table-cell">
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Latex>{entry.example}</Latex>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-ink/5 text-ink/60 font-mono">
                                            {entry.type}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
