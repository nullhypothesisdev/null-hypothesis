
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// --- CONFIG ---
const SUPABASE_URL = "https://gefqshdrgozkxdiuligl.supabase.co";
// NOTE: Ideally this should be an env var, but for this script we will use the one found in inspection script
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZnFzaGRyZ296a3hkaXVsaWdsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQ2ODI0MywiZXhwIjoyMDU5MDQ0MjQzfQ.4izUF5gnNueGzjfHkaCKA3PvBq9qbUCRyhxY9V4FgWM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const CHAPTER_SLUG = 'introduction';
const COURSE_SLUG = 'islp';

// Paths
const DATA_PATH = path.join(process.cwd(), 'src/data/islp/ch1.json');

async function migrate() {
    console.log("Starting migration...");

    // 1. Read Data
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    // 2. Construct MDX Content
    // We recreate the structure from page.tsx.bak but using MDX syntax
    const mdxContent = `
<h2>The Three Problems</h2>

<p>
    Statistical learning is not an abstract exercise. It is the art of extracting signal from noise. We begin with three real-world datasets that define the primary categories of our work: Regression, Classification, and Clustering.
</p>

<CaseStudyGrid cases={${JSON.stringify(data.cases)}} />

<Section>
    <div className="bg-ink/[0.02] p-8 -mx-8 sm:rounded-2xl sm:mx-0 border border-ink/5">
        <div className="mb-8 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-display font-medium text-ink flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Notation
                </h2>
                <p className="text-sm text-ink/40 font-mono mt-1">Standardized Terminology</p>
            </div>
        </div>
        <CodexTable notation={${JSON.stringify(data.notation)}} />
    </div>
</Section>

<h2>A History of Learning</h2>

<p>
    We stand on the shoulders of giants. The tools we use today—from simple regression to modern deep learning—are the result of two centuries of mathematical evolution.
</p>

<HistoricalTimeline events={${JSON.stringify(data.timeline)}} />
    `.trim();

    console.log("Generated MDX Content. Length:", mdxContent.length);

    // 3. Find Chapter ID
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', COURSE_SLUG)
        .single();

    if (courseError || !course) {
        console.error("Course not found:", courseError);
        return;
    }

    const { data: chapter, error: chapterError } = await supabase
        .from('course_chapters')
        .select('id')
        .eq('course_id', course.id)
        .eq('slug', CHAPTER_SLUG)
        .single();

    if (chapterError || !chapter) {
        console.error("Chapter not found:", chapterError);
        return;
    }

    // 4. Update Database
    const { error: updateError } = await supabase
        .from('course_chapters')
        .update({
            content_en: mdxContent,
            published: true // Ensure it's published
        })
        .eq('id', chapter.id);

    if (updateError) {
        console.error("Update failed:", updateError);
    } else {
        console.log("Successfully updated chapter content!");
    }
}

migrate();
