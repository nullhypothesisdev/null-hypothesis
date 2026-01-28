import { BookOpen } from "lucide-react";
import CoursesGrid from "@/components/courses/CoursesGrid";
import { supabase } from "@/lib/supabase";
import PageHeaderClient from "@/components/layout/PageHeaderClient";

// Enable revalidation for fresh content
export const revalidate = 86400;

export default async function CoursesPage() {

    // Fetch Page Content
    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'courses')
        .single();

    // Fetch Dynamic Courses
    const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 relative bg-paper overflow-x-hidden">

            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto relative z-10">

                <PageHeaderClient
                    iconNode={<BookOpen className="w-4 h-4" />}
                    categoryLabel={page?.category_label || "Learning Curriculum"}
                    categoryLabelAr={page?.meta?.category_label_ar}
                    title={page?.title || "Interactive Courses."}
                    titleAr={page?.meta?.title_ar}
                    subtitle={page?.subtitle}
                    subtitleAr={page?.meta?.subtitle_ar}
                    description={page?.description || "Deep-dive into statistical concepts."}
                    descriptionAr={page?.meta?.description_ar}
                />

                <CoursesGrid courses={courses || []} />

            </div>
        </main>
    );
}
