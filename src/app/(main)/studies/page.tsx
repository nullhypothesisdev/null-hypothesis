import { Archive } from "lucide-react";
import StudiesGrid from "@/components/studies/StudiesGrid";
import { fetchStudies } from "@/lib/data-new";
import { supabase } from "@/lib/supabase";
import PageHeaderClient from "@/components/layout/PageHeaderClient";

// Enable revalidation for fresh content
export const revalidate = 86400;

export default async function ProjectsPage() {

  // Fetch Page Content
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'studies')
    .single();

  // Fetch projects from new schema
  const projects = await fetchStudies({ publishedOnly: true });

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
          iconNode={<Archive className="w-4 h-4" />}
          categoryLabel={page?.category_label || "Investigation Log"}
          categoryLabelAr={page?.meta?.category_label_ar}
          title={page?.title || "The Case Files."}
          titleAr={page?.meta?.title_ar}
          subtitle={page?.subtitle}
          subtitleAr={page?.meta?.subtitle_ar}
          description={page?.description || "A collection of systems, analyses, and artifacts."}
          descriptionAr={page?.meta?.description_ar}
        />

        <StudiesGrid dynamicProjects={projects} />

      </div>
    </main>
  );
}