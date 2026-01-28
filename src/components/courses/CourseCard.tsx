"use client";

import Link from "next/link";
import { Clock, BookOpen, TrendingUp } from "lucide-react";

import Image from "next/image";

import { useLanguage } from "@/contexts/LanguageContext";

import { getLocalizedDifficulty } from "@/lib/localization-utils";

interface Course {
    slug: string;
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    difficulty: string;
    estimated_hours: number;
    cover_image_url?: string;
}

interface CourseCardProps {
    course: Course;
}

const DIFFICULTY_COLORS = {
    beginner: "text-emerald-700 bg-emerald-900/10 border-emerald-700/20",
    intermediate: "text-amber-700 bg-amber-900/10 border-amber-700/20",
    advanced: "text-rose-700 bg-rose-900/10 border-rose-700/20"
};

export default function CourseCard({ course }: CourseCardProps) {
    const { language, t } = useLanguage();
    const isAr = language === 'ar';
    const difficultyClass = DIFFICULTY_COLORS[course.difficulty as keyof typeof DIFFICULTY_COLORS] || DIFFICULTY_COLORS.beginner;

    // Localization Logic
    const title = (isAr && course.title_ar) ? course.title_ar : course.title;
    const description = (isAr && course.description_ar) ? course.description_ar : course.description;

    const difficultyLabel = getLocalizedDifficulty(course.difficulty, t);

    return (
        <Link href={`/courses/${course.slug}`} className="group relative block h-full" dir={isAr ? "rtl" : "ltr"}>

            {/* CARD CONTAINER */}
            <div className="relative z-10 h-full flex flex-col bg-paper border border-ink/10 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 group-hover:-translate-y-1">

                {/* COVER IMAGE - Masked & Blended */}
                <div className="relative h-48 w-full overflow-hidden border-b border-ink/10">
                    <div className="absolute inset-0 bg-ink/10 z-10 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-0" />
                    <div className="absolute inset-0 bg-sepia-[.3] z-20 pointer-events-none mix-blend-color" />

                    {course.cover_image_url ? (
                        <Image
                            src={course.cover_image_url}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[50%] group-hover:grayscale-0"
                        />
                    ) : (
                        <div className="w-full h-full bg-ink/5 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-ink/20" />
                        </div>
                    )}

                    {/* Difficulty Badge (Overlaid) */}
                    <div className={`absolute top-3 z-30 ${isAr ? 'left-3' : 'right-3'}`}>
                        <span className={`px-2 py-1 rounded bg-paper/90 backdrop-blur border text-[10px] font-mono uppercase tracking-widest ${difficultyClass}`}>
                            {difficultyLabel}
                        </span>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow relative">
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                    <h3 className="font-serif text-xl text-ink leading-tight mb-3 group-hover:text-accent transition-colors duration-300">
                        {title}
                    </h3>

                    <p className="font-serif text-sm text-ink/60 leading-relaxed mb-6 flex-grow line-clamp-3">
                        {description}
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-ink/10 font-mono text-[10px] text-ink/40 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.estimated_hours}{isAr ? ' ساعة' : 'h'}
                        </span>
                        <span className="flex items-center gap-1 group-hover:text-accent transition-colors">
                            <TrendingUp className="w-3 h-3" />
                            {isAr ? 'ابدأ الدورة' : 'Start Course'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
