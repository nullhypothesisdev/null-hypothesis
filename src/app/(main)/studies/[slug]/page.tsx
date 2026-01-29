import fs from 'fs';
import path from 'path';
import { notFound } from "next/navigation";
import { fetchStudies, fetchStudyBySlug } from "@/lib/data-new";
import { CompileMDX } from "@/components/mdx/CompileMDX";
import { MDXComponents } from "@/components/mdx/MDXComponents";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// Force dynamic rendering (since we want to fetch fresh data)
// OR use ISG with revalidate

export async function generateStaticParams() {
    const projects = await fetchStudies({ publishedOnly: true });

    // Automatically identify custom routes by scanning the studies directory
    const studiesDir = path.join(process.cwd(), 'src', 'app', '(main)', 'studies');

    // Get all subdirectories in studies folder that are not dynamic routes (starting with brackets)
    // We wrap this in a try-catch to be safe during build if directory doesn't exist for some reason
    let customRoutes: string[] = [];
    try {
        if (fs.existsSync(studiesDir)) {
            customRoutes = fs.readdirSync(studiesDir)
                .filter(file => {
                    const stat = fs.statSync(path.join(studiesDir, file));
                    return stat.isDirectory() && !file.startsWith('[') && !file.startsWith('(');
                });
        }
    } catch (error) {
        console.warn('Could not scan studies directory for custom routes:', error);
    }

    return projects
        .filter((p) => !customRoutes.includes(p.slug))
        .map(({ slug }) => ({ slug }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
    const project = await fetchStudyBySlug(slug, 'en');
    return project;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);
    if (!project) return { title: 'Project Not Found' };

    return {
        title: `${project.title} | The Null Hypothesis`,
        description: project.tagline || '',
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-32 pb-24 px-6 bg-paper relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <article className="max-w-4xl mx-auto relative z-10">

                {/* Back Link */}
                <Link href="/studies" className="inline-flex items-center gap-2 text-ink/50 hover:text-accent mb-8 transition-colors font-mono text-xs uppercase tracking-widest group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Return to Archive
                </Link>

                {/* Header */}
                <header className="mb-12 border-b border-ink/10 pb-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                        {project.metadata?.tech_stack?.map((tech: string) => (
                            <span key={tech} className="px-3 py-1 rounded-full border border-ink/10 text-xs font-mono text-ink/60">
                                {tech}
                            </span>
                        ))}
                        {/* Fallback if no metadata */}
                        {!project.metadata?.tech_stack && (
                            <span className="px-3 py-1 rounded-full border border-ink/10 text-xs font-mono text-ink/60 flex items-center gap-2">
                                <Tag className="w-3 h-3" /> Case Study
                            </span>
                        )}
                    </div>

                    <h1 className="font-serif text-3xl md:text-4xl text-ink mb-6 leading-tight">
                        {project.title}
                    </h1>

                    <div className="flex items-center gap-6 text-ink/40 font-mono text-xs uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(project.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                        </span>
                        <span>//</span>
                        <span>ID: {project.slug.toUpperCase()}</span>
                    </div>
                </header>

                {/* Content Body */}
                <div className="bg-paper border border-ink/5 p-8 md:p-12 rounded-sm shadow-sm">
                    {project.content_en ? (
                        <CompileMDX source={project.content_en} components={MDXComponents} />
                    ) : (
                        <p className="text-ink/40 italic">No content available.</p>
                    )}
                </div>

            </article>
        </main>
    )
}
