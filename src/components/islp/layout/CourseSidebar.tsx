"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Circle, Lock } from "lucide-react";
import { CourseChapter } from "@/lib/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface CourseSidebarProps {
    chapters: CourseChapter[];
    courseSlug: string;
    currentChapterId: string;
}

export default function CourseSidebar({ chapters, courseSlug, currentChapterId }: CourseSidebarProps) {
    const pathname = usePathname();
    const { language } = useLanguage();
    const isAr = language === 'ar';

    return (
        <aside className="space-y-8 sticky top-32">
            <div>
                <h3 className="text-xs font-mono font-bold text-ink/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {isAr ? 'المحتويات' : 'Table of Contents'}
                </h3>

                <nav className="space-y-1 relative border-l border-ink/10 ml-2">
                    {chapters.map((chapter, index) => {
                        const path = `/courses/${courseSlug}/${chapter.slug}`;
                        const isActive = chapter.id === currentChapterId;
                        const isLocked = !chapter.published && !chapter.is_free; // Simple logic for now

                        return (
                            <div key={chapter.id} className="relative pl-6">
                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary border-2 border-paper" />
                                )}

                                <Link
                                    href={isLocked ? '#' : path}
                                    className={cn(
                                        "block text-sm py-1.5 transition-colors duration-200",
                                        isActive ? "text-primary font-medium" : "text-ink/60 hover:text-ink/90",
                                        isLocked && "text-ink/30 cursor-not-allowed hover:text-ink/30 flex items-center justify-between"
                                    )}
                                >
                                    <span>
                                        {String(chapter.chapter_number).padStart(2, '0')}. {isAr ? (chapter.title_ar || chapter.title) : chapter.title}
                                    </span>
                                    {isLocked && <Lock className="w-3 h-3 opacity-50" />}
                                </Link>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

