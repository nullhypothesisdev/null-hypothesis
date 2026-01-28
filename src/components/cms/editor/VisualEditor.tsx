"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { cn } from "@/lib/utils";
import { useState } from 'react';
import {
    Bold, Italic, Strikethrough,
    Heading1, Heading2, Heading3,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Quote, List, ListOrdered,
    LayoutTemplate, AreaChart // New Icons
} from 'lucide-react';

// Custom Extensions
import ChartBlock from './extensions/ChartBlock';
import { TwoColumn, Column } from './extensions/TwoColumn';
import DragHandle from './DragHandle';

interface VisualEditorProps {
    content?: any;
    onChange?: (content: any) => void;
}

export default function VisualEditor({ content, onChange }: VisualEditorProps) {
    // Header State (Mocking metadata for now)
    const [title, setTitle] = useState("Maximum Likelihood.");
    const [tagline, setTagline] = useState(`"Finding the specific parameters that make our observed data most probable."`);
    const [category, setCategory] = useState("Parameter Estimation");

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: 'Type "/" for commands...',
                emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-ink/20 before:float-left before:pointer-events-none before:h-0',
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            // Custom Blocks
            ChartBlock,
            TwoColumn,
            Column,
        ],
        // Default content matching the "Generating Process" section of the lab
        content: content || `
            <h2>1. The Generating Process</h2>
            <p>Before we estimate, we must model. In this project, we assume our data follows a Gamma Distribution.</p>
            <p>In the real world, Gamma models waiting times—the time until the next packet arrives at a server, or the time until a component fails.</p>
            <p>We assume there is a true generating process with parameters <strong>α=9.0</strong> and <strong>β=2.0</strong> (meaning events occur every 0.5s on average). Our goal is to recover these parameters using only the observed data.</p>
        `,
        editorProps: {
            attributes: {
                // MATCHING: prose prose-ink text-xl text-ink/80 latex-prose
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] font-serif selection:bg-accent/20 text-xl text-ink/80 [&>h2]:text-3xl [&>h2]:md:text-4xl [&>h2]:text-ink [&>h2]:font-bold [&>h2]:mt-16 [&>h2]:mb-8 [&>p]:leading-relaxed [&>p]:mb-6',
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON());
        },
    });

    if (!editor) {
        return null;
    }

    const ToolbarButton = ({ onClick, isActive, icon: Icon, label }: any) => (
        <button
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()} // Prevent editor from losing focus
            className={cn(
                "p-1.5 rounded hover:bg-ink/5 transition-colors text-ink/70",
                isActive && "bg-ink/10 text-accent"
            )}
            title={label}
        >
            <Icon className="w-4 h-4" />
        </button>
    );

    const Divider = () => <div className="h-4 w-px bg-ink/10 mx-1" />;

    return (
        <div className="w-full min-h-screen bg-paper relative flex flex-col items-center pb-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                style={{
                    backgroundImage: `linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Toolbar (Floating) */}
            <div className="sticky top-6 z-50 bg-paper/90 backdrop-blur border border-ink/10 shadow-sm px-6 py-2 rounded-full flex items-center gap-1 mb-8 overflow-x-auto max-w-[90vw] hide-scrollbar">
                <span className="text-[10px] font-mono text-ink/40 uppercase tracking-widest mr-4 whitespace-nowrap">
                    Visual Builder
                </span>

                {/* Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold} label="Bold"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic} label="Italic"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive('strike')}
                    icon={Strikethrough} label="Strikethrough"
                />

                <Divider />

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    icon={Heading1} label="H1"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2} label="H2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    icon={Heading3} label="H3"
                />

                <Divider />

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    icon={AlignLeft} label="Left"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    icon={AlignCenter} label="Center"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    icon={AlignRight} label="Right"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    isActive={editor.isActive({ textAlign: 'justify' })}
                    icon={AlignJustify} label="Justify"
                />

                <Divider />

                {/* Lists & Quote */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={Quote} label="Blockquote"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List} label="Bullet List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered} label="Ordered List"
                />

                <Divider />

                {/* Blocks */}
                <button
                    onClick={() => editor.chain().focus().insertContent({
                        type: 'twoColumn',
                        content: [
                            { type: 'column', content: [{ type: 'paragraph' }] },
                            { type: 'column', content: [{ type: 'paragraph' }] }
                        ]
                    }).run()}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-ink/5 transition-colors text-xs font-mono uppercase tracking-widest text-ink/70"
                >
                    <LayoutTemplate className="w-4 h-4" /> 2-Col
                </button>
                <button
                    onClick={() => editor.chain().focus().insertContent({ type: 'chartBlock' }).run()}
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-ink/5 transition-colors text-xs font-mono uppercase tracking-widest text-ink/70"
                >
                    <AreaChart className="w-4 h-4" /> Chart
                </button>

            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="w-full max-w-6xl mx-auto px-6 relative z-10">

                {/* HEADER REPLICA (Matches PageHeader.tsx) - NOW EDITABLE */}
                <header className="mb-16 border-b border-ink/10 pb-10 group/header">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                        {/* Mock Back Link */}
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-ink/50 uppercase tracking-widest cursor-not-allowed">
                            ← Laboratory Index
                        </div>

                        {/* Mock Actions */}
                        <div className="flex gap-3 w-full md:w-auto opacity-50 pointer-events-none">
                            <span className="px-4 py-2 rounded-full border border-ink/10 text-xs font-mono uppercase tracking-widest text-ink/70">
                                Source Code
                            </span>
                            <span className="px-4 py-2 rounded-full bg-ink text-paper text-xs font-mono uppercase tracking-widest">
                                Download Paper
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="w-full">
                            <div className="font-mono text-xs text-accent uppercase tracking-widest flex items-center gap-2 mb-4">
                                {/* Target Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="bg-transparent border-none outline-none text-accent uppercase tracking-widest w-full placeholder:text-accent/50 focus:bg-accent/5 rounded px-1 -ml-1"
                                    placeholder="CATEGORY NAME"
                                />
                            </div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-serif text-5xl md:text-7xl text-ink leading-[0.9] bg-transparent border-none outline-none w-full placeholder:text-ink/20 focus:bg-ink/5 rounded px-2 -ml-2"
                                placeholder="Page Title"
                            />
                        </div>
                        <div className="w-full md:w-auto md:max-w-md">
                            <textarea
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                className="w-full font-serif italic text-lg md:text-xl text-left md:text-right bg-transparent border-l-2 md:border-l-0 md:border-r-2 border-accent pl-6 md:pr-6 md:pl-0 outline-none resize-none field-sizing-content min-h-[4rem] focus:bg-ink/5 rounded py-2"
                                placeholder="Enter a tagline quote..."
                                rows={3}
                            />
                        </div>
                    </div>
                </header>

                {/* Editor Content - Matches 'prose-ink text-xl' from SplitLayout */}
                <div className="max-w-none relative">
                    <DragHandle editor={editor} />
                    <EditorContent editor={editor} />
                </div>

            </div>
        </div>
    );
}
