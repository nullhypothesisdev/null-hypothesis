"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Course } from "@/lib/types";
import { Clock } from "lucide-react";
import Image from "next/image";
import { getLocalizedDifficulty } from "@/lib/localization-utils";

interface CourseHeaderClientProps {
    course: Course;
}

export default function CourseHeaderClient({ course }: CourseHeaderClientProps) {
    const { language, t } = useLanguage();
    const isAr = language === 'ar';

    const title = (isAr && course.title_ar) ? course.title_ar : course.title;
    const description = (isAr && course.description_ar) ? course.description_ar : course.description;

    // Difficulty Label Localization
    const difficulty = getLocalizedDifficulty(course.difficulty, t);

    return (
        <header className="mb-12 border-b border-ink/10 pb-12">

            {/* Cover Image (Mobile Only) */}
            {course.cover_image_url && (
                <div className="relative w-full h-48 md:h-64 mb-8 rounded-sm overflow-hidden border border-ink/10 lg:hidden">
                    <Image
                        src={course.cover_image_url}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-ink/10 mix-blend-multiply" />
                </div>
            )}

            <div className="flex flex-wrap gap-4 mb-6">
                <span className="px-3 py-1 rounded-full border border-ink/10 text-xs font-mono text-ink/60 uppercase tracking-widest bg-paper">
                    {difficulty}
                </span>
                <span className="px-3 py-1 rounded-full border border-ink/10 text-xs font-mono text-ink/60 flex items-center gap-2 bg-paper">
                    <Clock className="w-3 h-3" /> {course.estimated_hours} {isAr ? 'ساعة' : 'Hours'}
                </span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-[1.1]">
                {title}
            </h1>

            <p className="font-serif text-xl text-ink/70 leading-relaxed max-w-2xl">
                {description}
            </p>
        </header>
    );
}
