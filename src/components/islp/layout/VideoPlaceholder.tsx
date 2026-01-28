"use client";

import { Play, Tv, Youtube } from "lucide-react";

interface YouTubeEmbedProps {
    videoId?: string;
    title?: string;
}

export default function YouTubeEmbed({ videoId, title = "Chapter Introduction" }: YouTubeEmbedProps) {
    if (!videoId) {
        return (
            <div className="sticky top-32 space-y-6">
                <div className="rounded-xl border border-ink/10 bg-paper overflow-hidden shadow-sm group cursor-not-allowed">
                    {/* Placeholder State */}
                    <div className="relative aspect-video bg-ink/5 flex flex-col items-center justify-center text-ink/40">
                        <div className="p-4 rounded-full bg-paper border border-ink/10 mb-2 group-hover:scale-110 transition-transform duration-300">
                            <Youtube className="w-6 h-6 fill-ink/20" />
                        </div>
                        <span className="text-xs font-mono uppercase tracking-widest">Lecture Unavailable</span>

                        {/* TV Scanlines effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.02)_50%)] bg-[size:100%_4px] pointer-events-none" />
                    </div>

                    <div className="p-4 border-t border-ink/10">
                        <div className="flex items-center gap-2 text-xs font-mono text-ink/40 mb-2">
                            <Tv className="w-3 h-3" />
                            <span>Lecture 01</span>
                        </div>
                        <h4 className="text-sm font-medium text-ink/70">{title}</h4>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-ink/5 border border-ink/5 text-ink/60 text-xs leading-relaxed font-mono">
                    <span className="font-bold block mb-1 text-primary">STATUS: RECORDING</span>
                    Lecture modules are currently in post-production. This slot is reserved for the YouTube integration.
                </div>
            </div>
        );
    }

    return (
        <div className="sticky top-32 space-y-4">
            <div className="rounded-xl border border-ink/10 bg-black overflow-hidden shadow-md">
                <iframe
                    width="100%"
                    height="100%"
                    className="aspect-video"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-ink/40">
                <span>SOURCE: YOUTUBE</span>
                <span>ID: {videoId}</span>
            </div>
        </div>
    );
}
