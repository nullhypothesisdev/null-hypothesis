import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Metadata } from "next";
import Image from "next/image";
import ChapterList from "@/components/courses/ChapterList";
import CourseHeaderClient from "@/components/courses/CourseHeaderClient";
import { BackToCoursesLink, CurriculumHeader, CourseResources, CourseScope } from "@/components/courses/CourseUI";

export const revalidate = 86400; // Revalidate daily
export const dynamicParams = true;

// Type for the resources JSONB column
interface Resource {
    label: string;
    url: string;
    type: 'external_link' | 'download';
    icon?: string;
}

export async function generateStaticParams() {
    const { data: courses } = await supabase
        .from('courses')
        .select('slug')
        .eq('published', true);

    return courses?.map(({ slug }) => ({ slug })) || [];
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getCourse(slug: string) {
    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

    if (error || !data) return null;
    return data;
}

async function getChapters(courseId: string) {
    const { data } = await supabase
        .from('course_chapters')
        .select('*')
        .eq('course_id', courseId)
        .order('chapter_number', { ascending: true });

    return data || [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourse(slug);
    if (!course) return { title: 'Course Not Found' };

    return {
        title: `${course.title} | The Null Hypothesis`,
        description: course.description,
    };
}

export default async function CoursePage({ params }: PageProps) {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        notFound();
    }

    const chapters = await getChapters(course.id);
    const resources = (course.resources as unknown as Resource[]) || [];

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 bg-paper relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <article className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* LEFT: Main Content (Header + Chapters) */}
                <div className="lg:col-span-8">
                    {/* Back Link */}
                    <BackToCoursesLink />

                    {/* HERO HEADER */}
                    <CourseHeaderClient course={course} />

                    {/* CHAPTERS */}
                    <section>
                        <CurriculumHeader />
                        <ChapterList chapters={chapters} courseSlug={course.slug} />
                    </section>
                </div>

                {/* RIGHT: Sidebar (Desktop) */}
                <aside className="lg:col-span-4 space-y-8">

                    {/* Cover Image (Desktop) */}
                    {course.cover_image_url && (
                        <div className="hidden lg:block relative w-full aspect-[4/3] rounded-sm overflow-hidden border border-ink/10 shadow-sm rotate-1 hover:rotate-0 transition-transform duration-500">
                            <Image
                                src={course.cover_image_url}
                                alt={course.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-ink/10 mix-blend-multiply" />
                            <div className="absolute inset-0 bg-sepia-[.2] mix-blend-color pointer-events-none" />
                        </div>
                    )}

                    {/* Scope / Syllabus Box */}
                    <CourseScope slug={course.slug} />

                    {/* Resources Box */}
                    <CourseResources resources={resources} />

                </aside>

            </article>
        </main>
    );
}
