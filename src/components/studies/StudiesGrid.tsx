"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Filter, Activity, TrendingUp, Wheat,
    Brain, Database, BarChart3, Binary
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import FolioCard, { FolioCardSkeleton, ProjectAsset } from "@/components/studies/FolioCard";

interface StudiesGridProps {
    dynamicProjects: any[];
}

// 1. IMPROVEMENT: Map Assets to CATEGORIES, not specific IDs.
// This makes your code scalable. Any new "Time Series" project gets the right icon automatically.
const CATEGORY_STYLE_MAP: Record<string, Omit<ProjectAsset, 'link'>> = {
    "Regression": {
        icon: Activity,
        iconColor: "text-rose-700",
        bg: "bg-rose-900/5",
        defaultCategory: "Regression"
    },
    "Time Series": {
        icon: TrendingUp,
        iconColor: "text-emerald-700",
        bg: "bg-emerald-900/5",
        defaultCategory: "Time Series"
    },
    "Econometrics": { // Merged logic below, but kept for legacy support
        icon: Wheat,
        iconColor: "text-amber-700",
        bg: "bg-amber-900/5",
        defaultCategory: "Econometrics"
    },
    "Classification": {
        icon: Binary,
        iconColor: "text-blue-700",
        bg: "bg-blue-900/5",
        defaultCategory: "Classification"
    },
    "NLP": {
        icon: Brain,
        iconColor: "text-purple-700",
        bg: "bg-purple-900/5",
        defaultCategory: "NLP"
    },
    // Fallback for unknown categories
    "Default": {
        icon: Filter,
        iconColor: "text-ink/50",
        bg: "bg-ink/5",
        defaultCategory: "Other"
    }
};

export default function StudiesGrid({ dynamicProjects }: StudiesGridProps) {
    const { t, isLoading, language } = useLanguage();
    const [activeFilter, setActiveFilter] = useState("All");

    // 2. IMPROVEMENT: Standardize your taxonomy here.
    const isAr = language === 'ar';
    const uniqueCategories = Array.from(new Set(dynamicProjects.map(p =>
        isAr && p.category_ar ? p.category_ar : p.category
    ).filter(Boolean)));

    // Also need to map back to original English keys for filtering logic if the category stored on item is English
    // But wait, the item prop passed to FolioCard uses the English category or Ar category?
    // The filter logic below matches `item.category === activeFilter`.
    // Let's make sure we filter based on ONE source of truth (English key) but DISPLAY localized label.

    // Better approach: Get unique English categories for filtering logic
    const uniqueKeys = Array.from(new Set(dynamicProjects.map(p => p.category).filter(Boolean)));

    const FILTERS = [
        { key: "All", label: t('projects.filter_all') || "All" },
        ...uniqueKeys.map(cat => {
            // Find a project with this category to get its AR label
            const sample = dynamicProjects.find(p => p.category === cat);
            const label = (isAr && sample?.category_ar) ? sample.category_ar : cat;
            return { key: cat, label };
        })
    ];

    // Helper: Gets the asset style based on the category string
    const getStyleForCategory = (cat: string) => {
        return CATEGORY_STYLE_MAP[cat] || CATEGORY_STYLE_MAP["Default"];
    };

    // 3. IMPROVEMENT: Unified processing.
    // All projects now come from database - no more legacy system needed!
    const allItems = dynamicProjects.map(node => {
        const cat = node.category || "Regression"; // Fallback
        return {
            id: node.slug,
            category: cat,
            asset: { ...getStyleForCategory(cat), link: `/studies/${node.slug}` }
        };
    });

    const filteredItems = allItems.filter(item => {
        if (activeFilter === "All") return true;

        return item.category === activeFilter;
    });

    return (
        <>
            {/* Filter Bar */}
            <div className="flex flex-wrap gap-2 mb-8">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.key}
                        onClick={() => setActiveFilter(filter.key)}
                        className={`
                            px-4 py-2 rounded-sm text-[10px] font-mono uppercase tracking-widest transition-all duration-300 border
                            ${activeFilter === filter.key
                                ? "bg-ink text-paper border-ink shadow-sm"
                                : "bg-transparent text-ink/50 border-ink/10 hover:border-ink/30 hover:text-ink"}
                        `}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                        <FolioCardSkeleton key={`skeleton-${index}`} />
                    ))
                ) : (
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item) => {
                            const projectData = dynamicProjects.find(d => d.slug === item.id);

                            // Calculate localized content
                            const isAr = language === 'ar';
                            const title = (isAr && projectData?.title_ar) ? projectData.title_ar : projectData?.title;
                            const desc = (isAr && projectData?.tagline_ar) ? projectData.tagline_ar : projectData?.tagline;
                            const category = (isAr && projectData?.category_ar) ? projectData.category_ar : projectData?.category;

                            return (
                                <FolioCard
                                    key={item.id}
                                    id={item.id}
                                    assets={item.asset}
                                    t={t}
                                    overrideTitle={title}
                                    overrideDesc={desc}
                                    overrideCategory={category}
                                />
                            );
                        })}
                    </AnimatePresence>
                )}
            </motion.div>

            {/* Empty State */}
            {!isLoading && filteredItems.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="w-full py-32 text-center border border-dashed border-ink/10 rounded-sm flex flex-col items-center justify-center bg-paper"
                >
                    <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mb-4">
                        <Filter className="w-6 h-6 text-ink/30" />
                    </div>
                    <p className="font-serif text-ink/40 text-xl italic">
                        {t('project.empty') || "No records match this classification."}
                    </p>
                </motion.div>
            )}
        </>
    );
}
