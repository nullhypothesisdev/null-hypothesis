
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft, ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative z-10 max-w-lg w-full text-center">

                {/* Icon / Graphic */}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-ink/5 border border-ink/10 mb-8 animate-pulse-slow">
                    <FileQuestion className="w-10 h-10 text-ink/40" />
                </div>

                {/* 404 Display */}
                <div className="font-mono text-accent text-sm tracking-[0.3em] uppercase mb-4">
                    Error 404
                </div>

                {/* Main Title */}
                <h1 className="font-serif text-5xl md:text-6xl text-ink font-bold mb-6 leading-tight">
                    Observation Only<br />
                    <span className="italic font-normal text-ink/40">Not Found.</span>
                </h1>

                {/* Description */}
                <p className="font-serif text-xl text-ink/60 mb-12 leading-relaxed">
                    The data point you are looking for lies outside our known confidence interval. It may have been rejected or never existed.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                    <Link
                        href="/courses"
                        className="flex items-center gap-2 px-8 py-3 border border-ink/10 text-ink rounded-full font-mono text-xs uppercase tracking-widest hover:bg-ink/5 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Courses
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-2 px-8 py-3 bg-ink text-paper rounded-full font-mono text-xs uppercase tracking-widest hover:bg-accent transition-colors shadow-lg shadow-ink/10"
                    >
                        <Home className="w-4 h-4" />
                        Return Home
                    </Link>

                    <Link
                        href="/lab"
                        className="flex items-center gap-2 px-8 py-3 border border-ink/10 text-ink rounded-full font-mono text-xs uppercase tracking-widest hover:bg-ink/5 transition-colors"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Laboratory
                    </Link>
                </div>

            </div>

            {/* Decorative footer */}
            <div className="absolute bottom-8 text-[10px] font-mono text-ink/20 uppercase tracking-widest">
                The Null Hypothesis | Calculated Uncertainty
            </div>

        </div>
    );
}
