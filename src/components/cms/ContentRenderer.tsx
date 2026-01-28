"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Markdown } from 'tiptap-markdown';
import TextAlign from '@tiptap/extension-text-align';
import Youtube from '@tiptap/extension-youtube';
import ChartExtension from '../admin/extensions/ChartExtension';
import SimulationExtension from '../admin/extensions/SimulationExtension';
import PythonExtension from '../admin/extensions/PythonExtension';
import MathExtension from '../admin/extensions/MathExtension';
import { CodeBlockExtension } from '../admin/extensions/CodeBlockExtension';
import { LayoutSection, LayoutColumn } from '../admin/extensions/LayoutExtension';
import { useEffect } from 'react';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { useLanguage } from "@/contexts/LanguageContext";

// Table Extensions
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

// --- REF: MDX COMPONENTS FOR SIMULATIONS ---
import BetaShaper from "@/components/lab/beta/BetaShaper";
import PowerAnalysis from "@/components/lab/inference/PowerAnalysis";
import MSERace from "@/components/lab/estimation/MSERace";
import ReservoirSimulation from "@/components/lab/sampling/ReservoirSimulation";
import AlphaOptimizer from "@/components/lab/alpha/AlphaOptimizer";
import GammaPlayground from "@/components/lab/estimation/GammaPlayground";
import ConsistencySimulator from "@/components/lab/estimation/ConsistencySimulator";
import IntervalAnalysis from "@/components/lab/estimation/IntervalAnalysis";
import DistributionGraph from "@/components/lab/inference/DistributionGraph";
import PValueDistribution from "@/components/lab/inference/PValueDistribution";
import HackSimulation from "@/components/lab/inference/HackSimulation";

// Intro Wrappers
import IntroCaseStudies from "@/components/islp/introduction/wrappers/IntroCaseStudies";
import IntroCodex from "@/components/islp/introduction/wrappers/IntroCodex";
import IntroTimeline from "@/components/islp/introduction/wrappers/IntroTimeline";

const SIM_MAP: Record<string, any> = {
    BetaShaper,
    PowerAnalysis,
    MSERace,
    ReservoirSimulation,
    AlphaOptimizer,
    GammaPlayground,
    ConsistencySimulator,
    IntervalAnalysis,
    DistributionGraph,
    PValueDistribution,
    HackSimulation,
    IntroCaseStudies,
    IntroCodex,
    IntroTimeline
};

// --- RENDERER COMPONENT ---
const SimulationRenderer = (props: any) => {
    const { component } = props.node.attrs;
    const Component = SIM_MAP[component];

    if (!Component) return <div className="p-4 bg-red-50 text-red-500 font-mono text-xs">Sim Component Not Found: {component}</div>;

    return (
        <NodeViewWrapper className="my-12 not-prose">
            <Component />
        </NodeViewWrapper>
    );
};

interface ContentRendererProps {
    contentEn?: string;
    contentAr?: string;
    className?: string;
}

const ContentRenderer = ({ contentEn, contentAr, className }: ContentRendererProps) => {
    const { language } = useLanguage();
    const isAr = language === 'ar';
    const activeContent = (isAr && contentAr) ? contentAr : (contentEn || "");

    const editor = useEditor({
        editable: false, // Read-only mode
        extensions: [
            StarterKit,
            Image,
            Markdown,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Youtube.configure({
                controls: true,
                nocookie: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            ChartExtension,
            SimulationExtension.configure({
                addNodeView() {
                    return ReactNodeViewRenderer(SimulationRenderer);
                }
            }),
            PythonExtension,
            MathExtension,
            CodeBlockExtension,
            LayoutSection,
            LayoutColumn,
        ],
        content: activeContent,
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none dark:prose-pre:bg-neutral-900 prose-img:rounded-lg prose-headings:font-display prose-headings:font-medium prose-p:font-serif prose-p:text-neutral-300 prose-td:border prose-td:border-ink/20 prose-td:p-2 prose-th:border prose-th:border-ink/20 prose-th:p-2 prose-th:bg-ink/5',
            },
        },
        immediatelyRender: false,
    });

    useEffect(() => {
        if (editor && activeContent) {
            // Update content when language changes
            editor.commands.setContent(activeContent);
        }
    }, [activeContent, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className={className}>
            <EditorContent editor={editor} />
        </div>
    );
};

export default ContentRenderer;
