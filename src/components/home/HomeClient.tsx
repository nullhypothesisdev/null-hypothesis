"use client";

import Link from "next/link";
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { ArrowRight, Clock } from "lucide-react";
import { ICON_MAP } from "@/components/ui/IconMap";
import { getLocalizedDifficulty } from "@/lib/localization-utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageRow } from "@/lib/types";

// Dynamic Imports
const DataStreamHero = dynamic(() => import('@/components/home/DataStreamHero'), {
    loading: () => <div className="absolute inset-0 z-0 opacity-10" />
});

import CodexCard from "@/components/home/CodexCard";
import MainWrapper from "@/components/home/MainWrapper";

interface HomeClientProps {
    hero: {
        heroTitleHtml: string;
        heroTitleHtmlAr?: string;
        subtitle: string;
        subtitleAr?: string;
        description: string;
        descriptionAr?: string;
    };
    labs: PageRow[];
    projects: PageRow[];
}

export default function HomeClient({ hero, labs, projects }: HomeClientProps) {
    const { language, t, dir } = useLanguage();
    const isAr = language === 'ar';

    // Hero Content selection
    const titleHtml = (isAr && hero.heroTitleHtmlAr) ? hero.heroTitleHtmlAr : hero.heroTitleHtml;
    const sub = (isAr && hero.subtitleAr) ? hero.subtitleAr : hero.subtitle;
    const desc = (isAr && hero.descriptionAr) ? hero.descriptionAr : hero.description;

    return (
        <MainWrapper>
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* 1. HERO - LCP OPTIMIZED */}
            <section className="w-full mb-0 flex flex-col items-center justify-center text-center px-6 relative z-10 min-h-[35vh]">
                <div className="absolute inset-x-0 -top-20 bottom-0 z-0 opacity-100 pointer-events-auto">
                    <DataStreamHero className="w-full h-full" />
                </div>

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
                            href="/lab"
                            className="group flex items-center gap-3 px-8 py-4 bg-ink text-paper hover:bg-accent transition-all duration-300 rounded-sm shadow-md"
                        >
                            <span className="font-mono text-xs uppercase tracking-widest">{t('home.browse_labs')}</span>
                            <ArrowRight className={`w-4 h-4 transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                        </Link>

                        <Link
                            href="/studies"
                            className="group flex items-center gap-3 px-8 py-4 border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all duration-300 rounded-sm"
                        >
                            <span className="font-mono text-xs uppercase tracking-widest">{t('nav.case_files')}</span>
                            <ArrowRight className={`w-4 h-4 transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1 rotate-180' : 'group-hover:translate-x-1'}`} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 3. POPULAR LABS */}
            <section className="w-full max-w-7xl mx-auto px-6 mb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="font-serif text-3xl text-ink mb-2">{t('home.popular_labs') || "Popular Labs"}</h2>
                        <p className="font-mono text-xs text-ink/40 uppercase tracking-widest">{t('home.labs_subtitle') || "Interactive Experiments"}</p>
                    </div>
                    <Link href="/lab" className="text-xs font-mono text-ink/40 hover:text-accent border-b border-transparent hover:border-accent transition-all uppercase tracking-widest pb-1 flex items-center gap-2">
                        {t('home.full_index') || "Full Index"} <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {labs.map((lab) => {
                        const IconComp = ICON_MAP[lab.icon_name] || ICON_MAP.Microscope;
                        return (
                            <CodexCard
                                key={lab.id}
                                iconNode={<IconComp className="w-12 h-12 text-ink" strokeWidth={1} />}
                                href={lab.slug}
                                {...lab}
                            />
                        );
                    })}
                </div>
            </section>

            {/* 4. CASE STUDIES */}
            <section className="w-full max-w-7xl mx-auto px-6 mb-32">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="font-serif text-3xl text-ink mb-2">{t('home.case_studies') || "Case Studies"}</h2>
                        <p className="font-mono text-xs text-ink/40 uppercase tracking-widest">{t('home.cases_subtitle') || "Applied Real-World Analysis"}</p>
                    </div>
                    <Link href="/studies" className="text-xs font-mono text-ink/40 hover:text-accent border-b border-transparent hover:border-accent transition-all uppercase tracking-widest pb-1 flex items-center gap-2">
                        {t('home.all_files') || "All Files"} <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {projects.map((proj) => {
                        const IconComp = ICON_MAP[proj.icon_name] || ICON_MAP.Activity;
                        return (
                            <CodexCard
                                key={proj.id}
                                iconNode={<IconComp className="w-12 h-12 text-ink" strokeWidth={1} />}
                                href={proj.slug}
                                {...proj}
                            />
                        );
                    })}
                </div>
            </section>

        </MainWrapper>
    );
}
