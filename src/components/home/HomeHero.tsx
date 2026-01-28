"use client";

import Link from "next/link";
import dynamic from 'next/dynamic';
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Dynamic Imports
const DataStreamHero = dynamic(() => import('@/components/home/DataStreamHero'), {
    loading: () => <div className="absolute inset-0 z-0 opacity-10" />
});

interface HomeHeroProps {
    heroTitleHtml: string;
    heroTitleHtmlAr?: string;
    subtitle: string;
    subtitleAr?: string;
    description: string;
    descriptionAr?: string;
}

export default function HomeHero({
    heroTitleHtml,
    heroTitleHtmlAr,
    subtitle,
    subtitleAr,
    description,
    descriptionAr
}: HomeHeroProps) {
    const { language, t, dir } = useLanguage();
    const isAr = language === 'ar';

    // Select content based on language
    const titleHtml = (isAr && heroTitleHtmlAr) ? heroTitleHtmlAr : heroTitleHtml;
    const sub = (isAr && subtitleAr) ? subtitleAr : subtitle;
    const desc = (isAr && descriptionAr) ? descriptionAr : description;

    return (
        <>
            {/* 1. HERO - LCP OPTIMIZED */}
            <section className="w-full mb-0 flex flex-col items-center justify-center text-center px-6 relative z-10 min-h-[35vh]">

                {/* HERO BACKGROUND: DATA STREAM (Client Side, Non-Blocking) */}
                <div className="absolute inset-x-0 -top-20 bottom-0 z-0 opacity-100 pointer-events-auto">
                    <DataStreamHero className="w-full h-full" />
                </div>

                {/* HERO TEXT */}
                <div className="relative z-10 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both">
                    <h1
                        className="font-serif text-4xl md:text-6xl text-ink leading-tight tracking-tight mb-4 mix-blend-difference"
                        dangerouslySetInnerHTML={{ __html: titleHtml }}
                    />
                    <div className="w-16 h-px bg-ink/20 mx-auto mb-4" />
                    <p className="font-mono text-xs md:text-sm text-ink/60 uppercase tracking-[0.25em] max-w-xl mx-auto mb-6">
                        {sub}
                    </p>
                    <p className="font-serif text-base md:text-lg text-ink/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {desc}
                    </p>
                </div>
            </section>

            {/* 2. CTA BAR */}
            <section className="w-full border-y border-ink/10 bg-ink/[0.02] backdrop-blur-sm mb-32">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                        <Link
                            href="/courses"
                            className="group flex items-center gap-3 px-8 py-4 bg-ink text-paper hover:bg-accent transition-all duration-300 rounded-sm shadow-md"
                        >
                            <span className="font-mono text-xs uppercase tracking-widest">{t('home.explore_courses')}</span>
                            <ArrowRight className={`w-4 h-4 transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                        </Link>

                        <Link href="/studies">
                            <button className="px-8 py-4 rounded-full border border-ink/10 text-ink/60 font-mono text-sm uppercase tracking-widest hover:bg-ink/5 hover:text-ink transition-all">
                                Case Files
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
