
"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ReactNode } from "react";

export default function PageLayoutWrapper({ children }: { children: ReactNode }) {
    const { dir } = useLanguage();

    return (
        <main className="min-h-screen pt-24 md:pt-32 pb-20 px-6 bg-paper font-serif relative overflow-hidden transition-colors duration-700 ease-in-out" dir={dir}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            <div className="max-w-4xl mx-auto relative z-10">
                {children}
            </div>
        </main>
    );
}
