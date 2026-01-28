import { FlaskConical } from "lucide-react";
import LabClient from "@/components/lab/LabClient";
import { fetchLabs } from "@/lib/data-new";
import { supabase } from "@/lib/supabase";
import PageHeaderClient from "@/components/layout/PageHeaderClient";

// Enable revalidation for fresh content
export const revalidate = 86400;

// Legacy IDs that exist as hardcoded maps in the Client
const LEGACY_IDS = ["inference", "estimation", "alpha", "beta", "sampling"];

export default async function LabIndex() {

  // Fetch Page Content
  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'lab')
    .single();

  // Fetch labs from new schema
  const labs = await fetchLabs({ publishedOnly: true });

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 bg-paper font-serif relative">

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">



        <PageHeaderClient
          iconNode={<FlaskConical className="w-4 h-4" />}
          categoryLabel={page?.category_label || "R&D Department"}
          categoryLabelAr={page?.meta?.category_label_ar}
          title={page?.title || "The Laboratory."}
          titleAr={page?.meta?.title_ar}
          subtitle={page?.subtitle}
          subtitleAr={page?.meta?.subtitle_ar}
          description={page?.description || "Instruments of intuition."}
          descriptionAr={page?.meta?.description_ar}
        />

        <LabClient
          dynamicExperiments={labs}
          legacyIds={LEGACY_IDS}
          legacyAssets={{}}
        />

      </div>
    </main>
  );
}