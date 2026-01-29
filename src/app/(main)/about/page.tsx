import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, BookOpen, FlaskConical, Archive } from 'lucide-react';
import MainWrapper from '@/components/home/MainWrapper';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
    title: 'About | The Null Hypothesis',
    description: 'Teaching timeless statistical thinking that transcends tools and frameworks.',
};

interface Contributor {
    id: string;
    name: string;
    role: string;
    title: string;
    bio: string;
    photo_url: string | null;
    website_url: string | null;
    linkedin_url: string | null;
    portfolio_url: string | null;
    display_order: number;
}

export default async function AboutPage() {
    // Fetch 'about' page content
    const { data: aboutPage } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'about')
        .single();

    // Fetch contributors from database
    const { data: contributors } = await supabase
        .from('contributors')
        .select('*')
        .order('display_order', { ascending: true });

    // Parse Sections from Meta
    const sections = (aboutPage?.meta?.sections || []) as any[];
    const featuresSection = sections.find((s: any) => s.title === "What You'll Find Here");
    const approachSection = sections.find((s: any) => s.title === "The Approach");

    // Icon Map for dynamic rendering
    const ICONS: Record<string, any> = {
        FlaskConical, Archive, BookOpen
    };

    return (
        <MainWrapper>
            <div className="min-h-screen py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Back Link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-ink/60 hover:text-ink transition-colors mb-12 font-mono text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to Home
                    </Link>

                    {/* Header */}
                    <header className="mb-16 border-b border-ink/10 pb-8">
                        <h1 className="font-serif text-3xl md:text-5xl text-ink mb-6 leading-tight">
                            {aboutPage?.title || "About The Null Hypothesis."}
                        </h1>
                        <p className="font-serif text-xl text-ink/70 leading-relaxed">
                            {aboutPage?.description || "A place for rigorous statistical thinking."}
                        </p>
                    </header>

                    {/* Philosophy (From content_en) */}
                    <section className="mb-16">
                        <h2 className="font-serif text-2xl text-ink mb-6">{aboutPage?.meta?.philosophy_title || "Philosophy"}</h2>
                        <div className="space-y-4 text-ink/80 leading-relaxed font-serif text-lg whitespace-pre-wrap">
                            {/* Render as simple text for now, preserving line breaks if any, though DB has single line */}
                            {aboutPage?.content_en}
                        </div>
                    </section>

                    {/* What You'll Find Here (Dynamic Grid) */}
                    {featuresSection && (
                        <section className="mb-16">
                            <h2 className="font-serif text-2xl text-ink mb-8">{featuresSection.title}</h2>

                            <div className="grid gap-8">
                                {featuresSection.items.map((item: any, idx: number) => {
                                    const IconComp = ICONS[item.icon] || BookOpen;
                                    return (
                                        <div key={idx} className="border border-ink/10 p-6 rounded-sm bg-paper">
                                            <div className="flex items-center gap-3 mb-4">
                                                <IconComp className="w-5 h-5 text-accent" />
                                                <h3 className="font-serif text-xl text-ink">{item.title}</h3>
                                            </div>
                                            <p className="font-mono text-sm text-ink/70 leading-relaxed">
                                                {item.text}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Approach (Dynamic List) */}
                    {approachSection && (
                        <section className="mb-16">
                            <h2 className="font-serif text-2xl text-ink mb-6">{approachSection.title}</h2>
                            <div className="border-l-2 border-accent/30 pl-6 space-y-4">
                                {approachSection.items.map((item: any, idx: number) => (
                                    <p key={idx} className="font-mono text-sm text-ink/70 leading-relaxed">
                                        <strong className="text-ink">{item.strong}</strong> {item.text}
                                    </p>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Contributors - Dynamically loaded from database */}
                    {contributors && contributors.length > 0 && (
                        <section className="mb-16">
                            <h2 className="font-serif text-2xl text-ink mb-8">Contributors</h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                {contributors.map((contributor: Contributor) => (
                                    <div key={contributor.id} className="group relative overflow-hidden border border-ink/10 rounded-sm bg-paper hover:border-accent/30 transition-all duration-500">
                                        {/* Photo */}
                                        <div className="relative h-64 overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-paper/80 z-10" />
                                            {contributor.photo_url ? (
                                                <Image
                                                    src={contributor.photo_url}
                                                    alt={contributor.name}
                                                    fill
                                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-ink/5 flex items-center justify-center">
                                                    <span className="font-mono text-ink/20 text-sm">Photo</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5">
                                            <h3 className="font-serif text-lg text-ink mb-1">{contributor.name}</h3>
                                            <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-3">{contributor.role}</p>
                                            <p className="font-mono text-xs text-ink/70 leading-relaxed mb-4">
                                                {contributor.bio}
                                            </p>
                                            <div className="flex gap-3 flex-wrap">
                                                {contributor.website_url && (
                                                    <a href={contributor.website_url} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] text-ink/60 hover:text-accent uppercase tracking-widest border-b border-ink/20 hover:border-accent transition-colors">
                                                        Website
                                                    </a>
                                                )}
                                                {contributor.portfolio_url && (
                                                    <a href={contributor.portfolio_url} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] text-ink/60 hover:text-accent uppercase tracking-widest border-b border-ink/20 hover:border-accent transition-colors">
                                                        Portfolio
                                                    </a>
                                                )}
                                                {contributor.linkedin_url && (
                                                    <a href={contributor.linkedin_url} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] text-ink/60 hover:text-accent uppercase tracking-widest border-b border-ink/20 hover:border-accent transition-colors">
                                                        LinkedIn
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Footer CTA */}
                    <div className="text-center pt-8 border-t border-ink/10">
                        <p className="font-mono text-xs text-ink/40 uppercase tracking-widest mb-6">
                            Ready to begin?
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/lab"
                                className="px-6 py-3 border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all rounded-sm font-mono text-xs uppercase tracking-widest"
                            >
                                Explore the Laboratory
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
}
