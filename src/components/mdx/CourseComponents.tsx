import { MDX_COMPONENTS as BaseComponents } from "./MDXComponents";

import CaseStudyGrid from "@/components/islp/introduction/CaseStudyGrid";
import CodexTable from "@/components/islp/introduction/CodexTable";
import HistoricalTimeline from "@/components/islp/introduction/HistoricalTimeline";

export const CourseComponents = {
    ...BaseComponents,

    // ISLP Components
    CaseStudyGrid,
    CodexTable,
    HistoricalTimeline,

    // Header 2 (Major Section Headers) - Matches "The Prologue" / "The Three Problems" style
    h2: (props: any) => (
        <h2
            className="text-3xl font-heading font-medium text-ink mb-6 mt-12 first:mt-0"
            {...props}
        />
    ),

    // Header 3 - For sub-sections
    h3: (props: any) => (
        <h3
            className="text-2xl font-heading font-medium text-ink mb-4 mt-8"
            {...props}
        />
    ),

    // Paragraphs - Premium reading experience (EB Garamond)
    p: (props: any) => (
        <p
            className="text-lg text-ink/60 leading-relaxed mb-6 font-body"
            {...props}
        />
    ),

    // Unordered Lists
    ul: (props: any) => (
        <ul className="list-disc list-inside mb-6 space-y-2 text-lg text-ink/60 font-body" {...props} />
    ),

    // Ordered Lists
    ol: (props: any) => (
        <ol className="list-decimal list-inside mb-6 space-y-2 text-lg text-ink/60 font-body" {...props} />
    ),
};
