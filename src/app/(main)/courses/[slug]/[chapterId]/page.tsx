import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import CourseSidebar from "@/components/islp/layout/CourseSidebar";

import { CompileMDX } from "@/components/mdx/CompileMDX";
import { MDXComponents } from "@/components/mdx/MDXComponents";
import { CourseComponents } from "@/components/mdx/CourseComponents";

export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
    params: Promise<{ slug: string; chapterId: string }>;
}

async function getCourse(slug: string) {
    const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
    return data;
}

async function getChapter(courseId: string, chapterSlug: string) {
    const { data } = await supabase
        .from('course_chapters')
        .select('*')
        .eq('course_id', courseId)
        .eq('slug', chapterSlug)
        .eq('published', true)
        .single();
    return data;
}

async function getAllChapters(courseId: string) {
    const { data } = await supabase
        .from('course_chapters')
        .select('*')
        .eq('course_id', courseId)
        .eq('published', true)
        .order('chapter_number', { ascending: true });

    return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug, chapterId } = await params;
    const course = await getCourse(slug);
    const chapter = course ? await getChapter(course.id, chapterId) : null;

    if (!chapter) return { title: 'Chapter Not Found' };

    return {
        title: `${chapter.title} | ${course?.title || 'Course'} | The Null Hypothesis`,
    };
}

export default async function ChapterPage({ params }: PageProps) {
    const { slug, chapterId } = await params;
    const course = await getCourse(slug);

    if (!course) {
        notFound();
    }

    const chapter = await getChapter(course.id, chapterId);

    if (!chapter) {
        notFound();
    }

    const allChapters = await getAllChapters(course.id);

    // Find prev/next chapters
    const currentIndex = allChapters.findIndex(ch => ch.id === chapter.id);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    return (
        <main className="min-h-screen pt-32 pb-24 bg-paper relative">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Sidebar: Navigation */}
                    <div className="hidden lg:block lg:col-span-3">
                        <CourseSidebar
                            chapters={allChapters}
                            currentChapterId={chapter.id}
                            courseSlug={course.slug}
                        />
                    </div>

                    {/* Center: Main Content */}
                    <main className="lg:col-span-9 space-y-12">
                        {/* Breadcrumb */}
                        <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-ink/50 hover:text-accent mb-4 transition-colors font-mono text-xs uppercase tracking-widest group">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {course.title}
                        </Link>

                        {/* Chapter Header */}
                        <header className="border-b border-ink/10 pb-8">
                            <span className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-4 block">
                                Chapter {String(chapter.chapter_number).padStart(2, '0')}
                            </span>
                            <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 leading-tight">
                                {chapter.title}
                            </h1>
                        </header>

                        {/* Interactive Content Area */}
                        {(chapter.content_en || chapter.content_ar) ? (
                            <CompileMDX
                                // Default to English if current locale context isn't available server-side (handling client-side language toggle is harder with RSC MDX)
                                // For now, we pass the English content or fallback to Arabic if English is missing.
                                // Ideally, we'd use a server-side locale detection or pass both and let client pick, but CompileMDX is RSC.
                                // Given the constraints, let's use English for now as the primary source, or check if we can pass language param.
                                source={chapter.content_en || chapter.content_ar || ""}
                                components={CourseComponents}
                                className="" // Disable generic latex-prose to use our bespoke CourseComponents styles
                            />
                        ) : (
                            <div className="bg-paper border border-ink/5 p-8 rounded-sm shadow-sm text-center py-12">
                                <BookOpen className="w-12 h-12 text-ink/20 mx-auto mb-4" />
                                <p className="font-serif text-ink/40 italic">
                                    Interactive content coming soon...
                                </p>
                            </div>
                        )}

                        {/* Footer Navigation */}
                        <div className="flex justify-between items-center pt-8 border-t border-ink/10">
                            {prevChapter ? (
                                <Link
                                    href={`/courses/${course.slug}/${prevChapter.slug}`}
                                    className="group flex items-center gap-2 text-ink/60 hover:text-accent transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    <div>
                                        <div className="font-mono text-[10px] uppercase tracking-widest mb-1">Previous</div>
                                        <div className="font-serif text-sm max-w-[150px] truncate">{prevChapter.title}</div>
                                    </div>
                                </Link>
                            ) : (
                                <div />
                            )}

                            {nextChapter ? (
                                <Link
                                    href={`/courses/${course.slug}/${nextChapter.slug}`}
                                    className="group flex items-center gap-2 text-ink/60 hover:text-accent transition-colors text-right"
                                >
                                    <div>
                                        <div className="font-mono text-[10px] uppercase tracking-widest mb-1">Next</div>
                                        <div className="font-serif text-sm max-w-[150px] truncate">{nextChapter.title}</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ) : (
                                <div />
                            )}
                        </div>
                    </main>

                </div>
            </div>
        </main>
    );
}
