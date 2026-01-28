"use client";

import Link from "next/link";
import { PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { CourseChapter } from "@/lib/types";

interface ChapterListProps {
    chapters: CourseChapter[];
    courseSlug: string;
}

export default function ChapterList({ chapters, courseSlug }: ChapterListProps) {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    if (chapters.length === 0) {
        return (
            <div className="border border-dashed border-ink/10 rounded-sm p-12 text-center">
                <p className="font-serif text-ink/40 italic">
                    {isAr ? "الفصول قادمة قريبًا..." : "Chapters coming soon..."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {chapters.map((chapter) => {
                const isLocked = !chapter.is_free;
                const ChapterCard = isLocked ? 'div' : Link;

                const title = (isAr && chapter.title_ar) ? chapter.title_ar : chapter.title;
                const desc = (isAr && chapter.description_ar) ? chapter.description_ar : chapter.description;

                return (
                    <ChapterCard
                        key={chapter.id}
                        href={!isLocked ? `/courses/${courseSlug}/${chapter.slug}` : "#"}
                        className={cn(
                            "relative group block border rounded-sm p-6 transition-all duration-300",
                            isLocked
                                ? "bg-paper/50 border-ink/5 cursor-not-allowed opacity-70"
                                : "bg-paper border-ink/10 hover:border-accent/40 hover:shadow-md cursor-pointer"
                        )}
                        dir={isAr ? "rtl" : "ltr"}
                    >
                        {/* Status Icon (Absolute) */}
                        <div className={cn("absolute top-6 text-ink/20", isAr ? "left-6" : "right-6")}>
                            {isLocked ? <Lock className="w-5 h-5" /> : <PlayCircle className="w-5 h-5 group-hover:text-accent transition-colors" />}
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center gap-4 pr-10 rtl:pr-0 rtl:pl-10">

                            {/* Chapter Number Badge */}
                            <div className="flex-shrink-0">
                                <span className={cn(
                                    "font-mono text-xs uppercase tracking-widest px-2 py-1 rounded border",
                                    isLocked
                                        ? "text-ink/30 border-ink/10"
                                        : "text-ink/60 border-ink/20 group-hover:border-accent/40 group-hover:text-ink/80"
                                )}>
                                    {isAr ? 'فصل' : 'Ch.'} {String(chapter.chapter_number).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-1">
                                <h3 className={cn(
                                    "font-serif text-xl transition-colors duration-300",
                                    isLocked ? "text-ink/50" : "text-ink group-hover:text-accent"
                                )}>
                                    {title}
                                </h3>
                                {desc && (
                                    <p className="text-sm text-ink/40 font-serif leading-relaxed line-clamp-2 md:line-clamp-1">
                                        {desc}
                                    </p>
                                )}
                            </div>

                            {/* Duration (Optional) */}
                            {chapter.estimated_minutes && (
                                <div className="flex-shrink-0 font-mono text-[10px] text-ink/30 hidden md:block">
                                    {~~(chapter.estimated_minutes / 60)}h {chapter.estimated_minutes % 60}m
                                </div>
                            )}
                        </div>
                    </ChapterCard>
                );
            })}
        </div>
    );
}

