import { supabase } from '@/lib/supabase';
import { PageRow, SupabasePage } from '@/lib/types';
import HomeClient from "@/components/home/HomeClient";

// --- SERVER COMPONENT ---
export default async function Home() {

  // FETCH DATA
  // Cache this query for 1 hour to prevent constant DB hits if not already cached by page segment
  const { data: pagesData } = await supabase
    .from('pages')
    .select('slug, title, category_label, icon_name, published_at, meta')
    .or('slug.like.lab/%,slug.like.studies/%')
    .order('published_at', { ascending: false });

  // Fetch featured courses
  const { data: coursesData } = await supabase
    .from('courses')
    .select('slug, title, title_ar, description, description_ar, difficulty, estimated_hours, cover_image_url')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const labs: PageRow[] = [];
  const projects: PageRow[] = [];

  if (pagesData) {
    let labCount = 1;
    let projCount = 1;

    (pagesData as unknown as SupabasePage[]).forEach((page) => {
      const isLab = page.slug.startsWith('lab/');
      const isProj = page.slug.startsWith('studies/');

      const row: PageRow = {
        id: isLab ? `MOD-0${labCount}` : `CASE-0${projCount}`,
        slug: `/${page.slug}`,
        title: page.title,
        titleAr: page.meta?.title_ar,
        category: page.category_label || (isLab ? "Core Module" : "Application"),
        categoryAr: page.meta?.category_label_ar,
        year: new Date(page.published_at).getFullYear().toString(),
        status: "LIVE",
        icon_name: page.icon_name || (isLab ? "Microscope" : "Activity")
      };

      if (isLab && labCount <= 4) { // Show 4 labs
        labs.push(row);
        labCount++;
      } else if (isProj && projCount <= 2) { // Show 2 projects
        let cleanSlug = page.slug;
        if (cleanSlug.startsWith('studies/')) {
          cleanSlug = cleanSlug.replace('studies/', '');
        } else if (cleanSlug.startsWith('/studies/')) {
          cleanSlug = cleanSlug.replace('/studies/', '');
        }

        row.slug = `/studies/${cleanSlug}`;

        projects.push(row);
        projCount++;
      }
    });
  }

  // Fetch Home Page content
  const { data: homePage } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'home')
    .single();

  const hero = {
    heroTitleHtml: homePage?.meta?.hero_title_html || "Theory<span class=\"text-accent italic\"> Comes First</span><span class=\"text-accent\">.</span>",
    heroTitleHtmlAr: homePage?.meta?.hero_title_html_ar,
    subtitle: homePage?.subtitle || "Tools change. Thinking endures.",
    subtitleAr: homePage?.meta?.subtitle_ar,
    description: homePage?.description || "Learn statistical thinking that transcends tools. Interactive labs, real-world projects, and structured courses.",
    descriptionAr: homePage?.meta?.description_ar
  };

  return (
    <HomeClient
      hero={hero}
      coursesData={coursesData || []}
      labs={labs}
      projects={projects}
    />
  );
}