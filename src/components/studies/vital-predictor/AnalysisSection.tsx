"use client";

import { ReactNode, useState } from "react";
import { Code, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CodeBlock from "../../common/CodeBlock";

export default function AnalysisSection({
    title,
    children,
    description,
    pythonCode
}: {
    title: string,
    children: ReactNode,
    description?: ReactNode,
    pythonCode?: string
}) {
    const [showCode, setShowCode] = useState(false);

    return (
        <section className="mb-24 last:mb-0">
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-serif text-ink font-bold mb-4">{title}</h2>
                    {pythonCode && (
                        <button
                            onClick={() => setShowCode(!showCode)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${showCode ? 'bg-ink text-paper border-ink' : 'bg-transparent text-ink/50 border-ink/20 hover:border-ink/50 hover:text-ink'}`}
                            title={showCode ? "Hide Python Code" : "Show Python Code"}
                        >
                            <Code className="w-3.5 h-3.5" />
                            <span>{showCode ? "Hide Logic" : "View Source"}</span>
                        </button>
                    )}
                </div>
                {/* Ensure this is a div, not a p */}
                {description && <div className="text-lg text-ink/70 leading-relaxed max-w-2xl">{description}</div>}
            </div>

            {/* Collapsible Code Section */}
            <AnimatePresence>
                {showCode && pythonCode && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                        animate={{ height: "auto", opacity: 1, marginBottom: 32 }}
                        exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                        className="overflow-hidden"
                    >
                        <CodeBlock code={pythonCode} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-paper border border-ink/10 rounded-2xl overflow-hidden shadow-sm">
                {children}
            </div>
        </section>
    );
}
