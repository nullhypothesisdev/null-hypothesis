"use client";

import Link from "next/link";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";

interface Chapter {
    id: string;
    slug: string;
    title: string;
    order: number;
}

interface ChapterNavProps {
    chapters: Chapter[];
    currentChapterId: string;
    courseSlug: string;
    courseTitle: string;
}

export default function ChapterNav({ chapters, currentChapterId, courseSlug, courseTitle }: ChapterNavProps) {
    return (
        <nav className="sticky top-24 bg-paper border border-ink/10 rounded-sm p-6 shadow-sm">

            {/* Course Title */}
            <div className="mb-6 pb-4 border-b border-ink/10">
                <Link href={`/courses/${courseSlug}`} className="group">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-ink/40" />
                        <span className="font-mono text-[10px] text-ink/40 uppercase tracking-widest">Course</span>
                    </div>
                    <h3 className="font-serif text-sm text-ink group-hover:text-accent transition-colors">
                        {courseTitle}
                    </h3>
                </Link>
            </div>

            {/* Chapter List */}
            <div className="space-y-1">
                {chapters.map((chapter, index) => {
                    const isActive = chapter.id === currentChapterId;
                    return (
                        <Link
                            key={chapter.id}
                            href={`/courses/${courseSlug}/${chapter.slug}`}
                            className={`
                                block px-3 py-2 rounded-sm text-sm transition-all duration-200
                                ${isActive
                                    ? 'bg-accent/10 text-accent font-medium'
                                    : 'text-ink/60 hover:bg-ink/5 hover:text-ink'}
                            `}
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-xs w-8 flex-shrink-0">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span className="flex-grow font-serif text-xs leading-tight">
                                    {chapter.title}
                                </span>
                                {isActive && (
                                    <Circle className="w-2 h-2 fill-accent text-accent flex-shrink-0" />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Progress Indicator (Placeholder) */}
            <div className="mt-6 pt-4 border-t border-ink/10">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] text-ink/40 uppercase tracking-widest">Progress</span>
                    <span className="font-mono text-[10px] text-ink/60">0%</span>
                </div>
                <div className="h-1 bg-ink/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-300" style={{ width: '0%' }} />
                </div>
            </div>

        </nav>
    );
}
