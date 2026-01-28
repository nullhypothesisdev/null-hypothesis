import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export type ProjectAsset = {
    icon: LucideIcon;
    iconColor: string;
    bg: string;
    link: string;
    defaultCategory: string;
};

interface FolioCardProps {
    id: string;
    assets: ProjectAsset;
    t: any;
    overrideTitle?: string;
    overrideDesc?: string;
    overrideCategory?: string;
}

export function FolioCardSkeleton() {
    return (
        <div className="relative bg-paper border border-ink/10 rounded-sm p-6 h-full flex flex-col shadow-sm">
            {/* Folder Tab Fake */}
            <div className="absolute -top-3 left-0 w-24 h-4 bg-paper border-t border-l border-r border-ink/10 rounded-t-sm" />

            <div className="flex justify-between items-start mb-8 border-b border-ink/5 pb-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-2 flex-grow">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="mt-8 pt-4 border-t border-ink/5 flex justify-between items-center">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
    );
}

export default function FolioCard({ id, assets, t, overrideTitle, overrideDesc, overrideCategory }: FolioCardProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    // Use overrides from new schema first, then fall back to translations
    const title = overrideTitle || t(`project.${id}.title`) || (id.charAt(0).toUpperCase() + id.slice(1));
    const desc = overrideDesc || t(`project.${id}.description`) || "Description unavailable.";
    const category = overrideCategory || t(`project.${id}.category`) || assets.defaultCategory;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="h-full pt-3" // Padding top for tab offset
        >
            <Link
                href={assets.link}
                className="group relative block h-full bg-paper border border-ink/10 rounded-sm hover:shadow-xl transition-all duration-500 overflow-visible"
                onMouseMove={handleMouseMove}
            >
                {/* Hover Highlight (Subtle) */}
                <motion.div
                    className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 z-10 transition duration-500"
                    style={{
                        background: useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, var(--color-ink-10), transparent 80%)`,
                    }}
                />

                {/* Folder Tab Visual */}
                <div className="absolute -top-3 left-0 w-auto min-w-[120px] px-4 h-4 bg-paper border-t border-l border-r border-ink/10 rounded-t-lg z-20 group-hover:bg-ink/5 transition-colors duration-300">
                    <div className="absolute top-1 left-3 text-[9px] font-mono text-ink/40 uppercase tracking-widest rtl:right-3 rtl:left-auto whitespace-nowrap">
                        {category}
                    </div>
                </div>

                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply dark:mix-blend-screen" />

                {/* Main Content Area */}
                <div className="p-8 relative z-20 flex flex-col h-full">

                    {/* Header: Icon Only (Simplified) */}
                    <div className="flex justify-end mb-4">
                        <assets.icon className={`w-8 h-8 ${assets.iconColor} opacity-70`} />
                    </div>

                    {/* Title & Arrow */}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-serif text-3xl text-ink group-hover:text-accent transition-colors duration-300 leading-tight">
                            {title}
                        </h3>
                        <ArrowUpRight className="w-5 h-5 text-ink/30 group-hover:text-accent transition-colors transform group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0 mt-1" />
                    </div>

                    {/* Description */}
                    <div className="flex-grow mb-6">
                        <p className="text-ink/60 text-sm leading-relaxed font-serif line-clamp-3 italic">
                            {desc}
                        </p>
                    </div>
                </div>

                {/* Decorative Watermark Icon (Big, faded in background) */}
                <assets.icon className={`absolute -bottom-8 -right-8 w-48 h-48 opacity-[0.03] text-ink pointer-events-none transform -rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-0`} />

            </Link>
        </motion.div>
    );
}
