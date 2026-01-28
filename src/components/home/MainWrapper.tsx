"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function MainWrapper({ children }: { children: React.ReactNode }) {
    const { dir } = useLanguage();

    return (
        <main className="min-h-screen pt-24 pb-20 bg-paper relative" dir={dir}>
            {children}
        </main>
    );
}
