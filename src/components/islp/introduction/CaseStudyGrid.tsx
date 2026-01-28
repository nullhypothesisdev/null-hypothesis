"use client";

import { CaseStudy } from "@/data/islp/types";
import { motion } from "framer-motion";
import { ArrowRight, Database, Target, Users, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface CaseStudyGridProps {
    cases: CaseStudy[];
}

export default function CaseStudyGrid({ cases }: CaseStudyGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((study, index) => (
                <CaseStudyCard key={study.id} study={study} index={index} />
            ))}
        </div>
    );
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
    const isUnsolved = study.status === "UNSOLVED";
    const isPending = study.status === "PENDING";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
                "group relative p-6 rounded-xl border border-ink/10 bg-paper hover:border-ink/20 transition-all duration-300 overflow-hidden min-h-[400px] flex flex-col justify-between",
                isUnsolved && "border-red-500/10 hover:border-red-500/20 bg-red-500/[0.02]",
                isPending && "border-amber-500/10 hover:border-amber-500/20 bg-amber-500/[0.02]"
            )}
        >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                        "text-xs font-mono px-2 py-1 rounded bg-ink/5 text-ink/60",
                        isUnsolved && "bg-red-500/10 text-red-600",
                        isPending && "bg-amber-500/10 text-amber-600"
                    )}>
                        {study.id}
                    </span>
                    <span className={cn(
                        "text-[10px] font-bold tracking-widest uppercase",
                        isUnsolved ? "text-red-500" : (isPending ? "text-amber-500" : "text-emerald-500")
                    )}>
                        {study.status}
                    </span>
                </div>

                <h3 className="text-xl font-medium text-ink mb-1 group-hover:text-primary transition-colors">
                    {study.title}
                </h3>
                <p className="text-sm text-ink/40 font-mono mb-4">{study.classification}</p>

                <p className="text-sm text-ink/70 leading-relaxed mb-6">
                    {study.briefing}
                </p>
            </div>

            {/* Variables Section (Matrix Dimensions) */}
            <div className="relative z-10 border-t border-ink/5 pt-4 mt-auto">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-ink/40 block mb-1">
                            Dataset (n)
                        </span>
                        <div className="flex items-center gap-2 text-ink">
                            <Database className="w-3 h-3 text-ink/40" />
                            <span className="font-mono text-sm">{study.variables.n.toLocaleString()}</span>
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] uppercase tracking-wider text-ink/40 block mb-1">
                            Features (p)
                        </span>
                        <div className="flex items-center gap-2 text-ink">
                            <Target className="w-3 h-3 text-ink/40" />
                            <span className="font-mono text-sm">{study.variables.p}</span>
                        </div>
                    </div>
                </div>

                {/* Hover Content: Investigation Points */}
                <div className="max-h-0 overflow-hidden group-hover:max-h-[200px] transition-all duration-500 ease-in-out">
                    <div className="pt-2">
                        <p className="text-[10px] uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                            <Search className="w-3 h-3" /> Research Questions
                        </p>
                        <ul className="space-y-2">
                            {study.investigation_points.slice(0, 2).map((point, i) => (
                                <li key={i} className="text-xs text-ink/60 pl-3 border-l border-ink/10">
                                    {point.split('[')[0]}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
