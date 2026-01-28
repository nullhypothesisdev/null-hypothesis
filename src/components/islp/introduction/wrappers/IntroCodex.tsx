"use client";

import CodexTable from "../CodexTable";
import ch1Data from "@/data/islp/ch1.json";
import { Chapter1Data } from "@/data/islp/types";
import { BookOpen } from "lucide-react"; // Import icon
import { useLanguage } from "@/contexts/LanguageContext"; // Import context

const data = ch1Data as unknown as Chapter1Data;

export default function IntroCodex() {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <section className="bg-ink/[0.02] p-8 -mx-8 sm:rounded-2xl sm:mx-0 border border-ink/5 my-12">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-medium text-ink flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        {isAr ? 'الرموز المستخدمة' : 'Notation'}
                    </h2>
                    <p className="text-sm text-ink/40 font-mono mt-1">
                        {isAr ? 'مصطلحات موحدة' : 'Standardized Terminology'}
                    </p>
                </div>
            </div>
            <CodexTable notation={data.notation} />
        </section>
    );
}
