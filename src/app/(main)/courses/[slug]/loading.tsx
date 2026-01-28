import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Loading() {
    return (
        <main className="min-h-screen pt-32 pb-24 px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 animate-pulse">
                    <div className="h-4 w-32 bg-ink/5 rounded mb-8"></div>
                    <div className="h-12 w-3/4 bg-ink/10 rounded mb-4"></div>
                    <div className="h-6 w-1/2 bg-ink/5 rounded"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-8">
                        <div className="h-64 bg-ink/5 rounded w-full animate-pulse"></div>
                        <div className="h-32 bg-ink/5 rounded w-full animate-pulse"></div>
                        <div className="h-32 bg-ink/5 rounded w-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
