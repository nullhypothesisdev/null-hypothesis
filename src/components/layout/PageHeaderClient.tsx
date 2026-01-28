"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

interface PageHeaderClientProps {
    iconNode: ReactNode;
    categoryLabel: string;
    categoryLabelAr?: string;
    title: string;
    titleAr?: string;
    subtitle?: string;
    subtitleAr?: string;
    description?: string;
    descriptionAr?: string;
}

export default function PageHeaderClient({
    iconNode,
    categoryLabel,
    categoryLabelAr,
    title,
    titleAr,
    subtitle,
    subtitleAr,
    description,
    descriptionAr
}: PageHeaderClientProps) {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    const cat = (isAr && categoryLabelAr) ? categoryLabelAr : categoryLabel;
    const t = (isAr && titleAr) ? titleAr : title;
    const sub = (isAr && subtitleAr) ? subtitleAr : subtitle;
    const desc = (isAr && descriptionAr) ? descriptionAr : description;

    const displayDesc = sub || desc;

    return (
        <header className="mb-12 border-b border-ink/10 pb-12">
            <span className="font-mono text-xs text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                {iconNode} {cat}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl text-ink mb-6 leading-tight tracking-tight">
                {t}
            </h1>
            {displayDesc && (
                <p className="font-serif text-xl text-ink/70 max-w-2xl leading-relaxed">
                    {displayDesc}
                </p>
            )}
        </header>
    );
}
