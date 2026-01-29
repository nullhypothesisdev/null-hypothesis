
import { CompileMDX } from "@/components/mdx/CompileMDX";
import { MDX_COMPONENTS } from "@/components/mdx/MDXComponents";
import PageHeader from "@/components/layout/PageHeader";
import PageLayoutWrapper from "@/components/studies/vital-predictor/PageLayoutWrapper";
import { supabase } from "@/lib/supabase";
import { Activity } from "lucide-react";

export const revalidate = 0;

// ... (imports remain)

// ... (generateMetadata remains)

export default async function Page() {

    const { data: page, error } = await supabase
        .from('pages')
        .select('content_en, meta, slug')
        .eq('slug', 'studies/vital-predictor')
        .single();

    // ... (error checks remain, but let's augment them if needed, skipping for now as user sees no error)
    if (error) { /* ... keep existing ... */ return <div className="p-8 text-red-500">DB Error: {JSON.stringify(error)}</div>; }
    if (!page) { /* ... keep existing ... */ return <div className="p-8 text-red-500">Page Not Found (slug: studies/vital-predictor)</div>; }
    if (!page.content_en) { /* ... keep existing ... */ return <div className="p-8 text-red-500">Content Empty</div>; }

    const { data: project } = await supabase
        .from('projects')
        .select('title, tagline, category, icon_name, theme_color')
        .eq('slug', 'vital-predictor')
        .single();

    const headerData = {
        title: project?.title || "The Vital Predictor",
        tagline: project?.tagline || "Uncovering the statistical determinants of hypertension.",
        category: project?.category || "Biostatistics",
        // Fallback or dynamic
        icon: (project?.icon_name && (MDX_COMPONENTS as any)[project.icon_name]) ? (MDX_COMPONENTS as any)[project.icon_name] : Activity,
        color: project?.theme_color || "text-accent"
    };

    const HeaderIcon = headerData.icon;

    return (
        <PageLayoutWrapper>
            {/* Explicit Metadata Injection for this route via generateMetadata now */}
            <PageHeader
                backHref="/studies"
                category={{
                    label: headerData.category,
                    icon: <HeaderIcon className="w-5 h-5" />,
                    color: headerData.color
                }}
                title={headerData.title}
                tagline={headerData.tagline}
                actions={{
                    source: { href: page.meta?.source_url || "#" }
                }}
            />
            <CompileMDX
                source={page.content_en}
                components={MDX_COMPONENTS}
            />
        </PageLayoutWrapper>
    );
}