"use client";

import { TimelineEvent } from "@/data/islp/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Circle, GitCommit, GitPullRequest } from "lucide-react";

interface TimelineProps {
    events: TimelineEvent[];
}

export default function HistoricalTimeline({ events }: TimelineProps) {
    return (
        <div className="relative pl-8 md:pl-0 sm:max-w-3xl mx-auto py-12">
            {/* Central Vertical Line (hidden on mobile, visible on desktop) */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ink/20 to-transparent transform -translate-x-1/2" />

            {events.map((event, index) => {
                const isLeft = index % 2 === 0;

                return (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={cn(
                            "relative flex md:justify-between items-center mb-16 last:mb-0 group",
                            isLeft ? "md:flex-row-reverse" : "md:flex-row" // Invert for alignment
                        )}
                    >
                        {/* The Dot on the timeline */}
                        <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-paper border-2 border-primary rounded-full transform -translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_rgba(var(--primary),0.3)]" />

                        {/* Content Card - 45% width to sit on one side */}
                        <div className={cn(
                            "ml-10 md:ml-0 md:w-[45%]",
                        )}>
                            <div className={cn(
                                "p-6 rounded-lg border border-ink/10 bg-paper hover:border-primary/30 transition-colors relative",
                                "before:absolute before:top-1/2 before:w-6 before:h-px before:bg-ink/20 before:block md:before:hidden", // Mobile connector
                                "before:-left-6"
                            )}>
                                {/* Desktop Connector Line */}
                                <div className={cn(
                                    "hidden md:block absolute top-[28px] h-px w-8 bg-ink/20",
                                    isLeft ? "-right-8" : "-left-8" // Point towards center
                                )} />

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">
                                        {event.era}
                                    </span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border",
                                        event.status === "FOUNDATIONAL" && "border-blue-500/20 text-blue-600 bg-blue-500/5",
                                        event.status === "CRITICAL" && "border-amber-500/20 text-amber-600 bg-amber-500/5",
                                        event.status === "STANDARD" && "border-emerald-500/20 text-emerald-600 bg-emerald-500/5",
                                        event.status === "UNIFYING" && "border-purple-500/20 text-purple-600 bg-purple-500/5",
                                        event.status === "MODERN" && "border-pink-500/20 text-pink-600 bg-pink-500/5",
                                    )}>
                                        {event.status}
                                    </span>
                                </div>

                                <h4 className="text-lg font-medium text-ink mb-2">
                                    {event.event}
                                </h4>

                                <p className="text-sm text-ink/70 leading-relaxed mb-4">
                                    {event.impact}
                                </p>

                                <div className="flex items-center gap-2">
                                    <Users size={12} className="text-ink/40" />
                                    <div className="flex flex-wrap gap-2">
                                        {event.architects.map((name, i) => (
                                            <span key={i} className="text-xs font-mono text-ink/60 bg-ink/5 px-1.5 py-0.5 rounded">
                                                {name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Empty Space for the other side */}
                        <div className="hidden md:block md:w-[45%]" />
                    </motion.div>
                );
            })}
        </div>
    );
}

// Need to import Users icon
import { Users } from "lucide-react";
