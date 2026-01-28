"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Latex from "react-latex-next";

interface Assumption {
    id: number;
    text: string;
    explanation: string;
}

const CHECKLIST: Assumption[] = [
    {
        id: 1,
        text: "The parameters are linear in the deterministic part of the model.",
        explanation: "The relationship between $X$ and $Y$ must be a straight line (equation-wise), not curved or powered."
    },
    {
        id: 2,
        text: "The values of the explanatory variables are recorded without error.",
        explanation: "We assume our input data ($Age$, $Weight$, etc.) is $100\\%$ accurate and wasn't measured incorrectly."
    },
    {
        id: 3,
        text: "The explanatory variables are fixed in repeated samples.",
        explanation: "$X$ values are considered constants set by the experimenter, not random variables."
    },
    {
        id: 4,
        text: "Reasonable variation in the values of the explanatory variables.",
        explanation: "Data points shouldn't all be the same (e.g., everyone is $45$ years old) or we can't find a trend."
    },
    {
        id: 5,
        text: "The sample size must be greater than the number of explanatory variables.",
        explanation: "You need more data points than variables ($n > p$) to mathematically solve the equation."
    },
    {
        id: 6,
        text: "Multicollinearity between the explanatory variables is non-existent.",
        explanation: "Variables shouldn't be too correlated with each other (like $Weight$ vs $BSA$), or they confuse the model."
    },
    {
        id: 7,
        text: "The expected value of the error term is zero.",
        explanation: "On average, the model's predictions should be correct—errors above and below the line should cancel out ($E[\\epsilon] = 0$)."
    },
    {
        id: 8,
        text: "The variability in the random error is constant.",
        explanation: "Homoscedasticity: The 'spread' of errors shouldn't get wider or narrower as values increase ($Var(\\epsilon) = \\sigma^2$)."
    },
    {
        id: 9,
        text: "The errors are independent.",
        explanation: "One prediction's error shouldn't influence the next (no patterns in the timeline)."
    },
    {
        id: 10,
        text: "The errors are normally distributed.",
        explanation: "Most errors should be small and close to zero, following a classic Bell Curve shape ($\\epsilon \\sim N(0, \\sigma^2)$)."
    }
];

export default function AssumptionsScroll() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative w-full max-w-4xl mx-auto my-12 bg-paper shadow-sm border-4 border-double border-ink/80 transition-colors duration-200 overflow-hidden">

            {/* Header Section - Always Visible */}
            <div
                className="text-center p-8 md:p-10 cursor-pointer hover:bg-ink/5 transition-colors group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="block font-mono text-xs uppercase tracking-[0.3em] text-ink/40 mb-3 group-hover:text-accent transition-colors">
                    Theorem I.I
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-ink tracking-tight font-medium mb-4">
                    The Ten Assumptions of OLS
                </h3>

                <button
                    className="flex items-center justify-center gap-2 mx-auto text-ink/50 hover:text-accent transition-colors font-serif italic text-sm"
                >
                    {isExpanded ? (
                        <>
                            <BookOpen className="w-4 h-4" />
                            <span>Close Theorem</span>
                            <ChevronUp className="w-4 h-4 opacity-70" />
                        </>
                    ) : (
                        <>
                            <BookOpen className="w-4 h-4" />
                            <span>Read Full Text</span>
                            <ChevronDown className="w-4 h-4 opacity-70" />
                        </>
                    )}
                </button>
            </div>

            {/* Collapsible Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-10 md:px-14 pb-14 pt-4 border-t border-ink/10 border-dashed">
                            <div className="grid gap-6 latex-prose text-lg leading-relaxed text-ink/90">
                                {CHECKLIST.map((item) => (
                                    <div key={item.id} className="flex items-baseline gap-4 group">
                                        <span className="font-mono text-sm text-ink/40 font-bold min-w-[2rem] text-right">
                                            {item.id}.
                                        </span>

                                        <div className="flex-1">
                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help transition-colors decoration-ink/30 decoration-dotted underline underline-offset-4 hover:decoration-ink hover:text-ink">
                                                            <Latex>{item.text}</Latex>
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom" className="max-w-xs bg-ink text-paper border-none latex-prose text-sm p-4 shadow-xl rounded-md z-[100]">
                                                        <Latex>{item.explanation}</Latex>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-4 border-t border-ink/10 text-center">
                                <p className="font-serif italic text-sm text-ink/40">
                                    Figure 1.1: Foundations of Linear Modeling
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
