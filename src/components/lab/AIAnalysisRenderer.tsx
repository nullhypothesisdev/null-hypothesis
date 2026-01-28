"use client";

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIAnalysisRendererProps {
    content: string | null;
}

export default function AIAnalysisRenderer({ content }: AIAnalysisRendererProps) {
    if (!content) return null;

    // Clean JSON-escaped newlines
    const cleanContent = content.replace(/\\n/g, '\n');

    return (
        <div className="prose prose-invert max-w-none 
            /* Base Typography - Enhanced readability */
            prose-p:font-serif prose-p:text-ink/90 prose-p:leading-[1.8] prose-p:text-[15px] prose-p:my-6
            
            /* Headings - Clear visual hierarchy */
            prose-headings:font-sans prose-headings:text-ink prose-headings:font-semibold prose-headings:tracking-tight prose-headings:transition-colors
            
            /* H1 - Major sections with strong separation */
            prose-h1:text-2xl prose-h1:mt-10 prose-h1:mb-5 prose-h1:pb-3 
            prose-h1:border-b-2 prose-h1:border-accent/20 prose-h1:font-bold
            
            /* H2 - Subsections with breathing room */
            prose-h2:text-xl prose-h2:mt-9 prose-h2:mb-4 prose-h2:text-ink/95
            
            /* H3 - Task headers with distinct style */
            prose-h3:text-[11px] prose-h3:text-accent/90 prose-h3:uppercase 
            prose-h3:tracking-[0.2em] prose-h3:mt-8 prose-h3:mb-4 
            prose-h3:font-extrabold prose-h3:pb-2 prose-h3:border-b prose-h3:border-accent/10
            
            /* Lists - Enhanced spacing and visual flow */
            prose-ul:text-ink/90 prose-ul:marker:text-accent prose-ul:my-5 
            prose-ul:list-disc prose-ul:pl-7 prose-ul:space-y-3
            
            prose-ol:text-ink/90 prose-ol:marker:text-accent/80 
            prose-ol:marker:font-bold prose-ol:marker:text-sm
            prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-7 prose-ol:space-y-3
            
            /* List items with proper line height */
            prose-li:leading-[1.75] prose-li:pl-2
            
            /* Nested lists */
            prose-li>ul:mt-2 prose-li>ul:mb-2 prose-li>ol:mt-2 prose-li>ol:mb-2
            
            /* Inline Formatting - Subtle but clear */
            prose-strong:text-ink prose-strong:font-semibold prose-strong:tracking-wide
            prose-em:text-ink/95 prose-em:italic prose-em:font-serif
            
            /* Inline Code - Refined appearance */
            prose-code:text-accent prose-code:bg-accent/10 prose-code:px-2 prose-code:py-1 
            prose-code:rounded-md prose-code:font-mono prose-code:text-[13px] 
            prose-code:before:content-none prose-code:after:content-none 
            prose-code:font-medium prose-code:border prose-code:border-accent/20
            
            /* Block Code - Reset for custom styling */
            prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0 prose-pre:my-8 
            prose-pre:border-none prose-pre:shadow-none
            
            /* Blockquotes - Academic feel */
            prose-blockquote:border-l-4 prose-blockquote:border-accent/40 
            prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:italic 
            prose-blockquote:text-ink/75 prose-blockquote:my-6 
            prose-blockquote:py-3 prose-blockquote:bg-accent/5 prose-blockquote:rounded-r-md
            
            /* Links - Subtle interaction */
            prose-a:text-accent prose-a:no-underline prose-a:font-medium
            hover:prose-a:underline hover:prose-a:text-accent/80 prose-a:transition-all
            
            /* Horizontal Rules - Section dividers */
            prose-hr:border-ink/15 prose-hr:my-10 prose-hr:border-t-2
            
            /* Tables - Clean appearance */
            prose-table:border-collapse prose-table:w-full prose-table:my-6
            prose-th:bg-accent/10 prose-th:text-ink prose-th:font-semibold 
            prose-th:text-left prose-th:py-3 prose-th:px-4 prose-th:border-b-2 prose-th:border-accent/30
            prose-td:py-2.5 prose-td:px-4 prose-td:border-b prose-td:border-ink/10
            prose-tr:transition-colors hover:prose-tr:bg-ink/5
        ">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code(props: any) {
                        const { children, className, node, ...rest } = props;
                        const match = /language-(\w+)/.exec(className || '');

                        // Check if it's a block code (has language class or contains newlines)
                        const isBlock = match || (String(children).includes('\n'));

                        if (isBlock) {
                            return (
                                <div className="rounded-lg overflow-hidden border border-ink/15 my-8 shadow-xl bg-[#1e1e1e] transition-shadow hover:shadow-2xl">
                                    {match && (
                                        <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-[#252526]">
                                            <span className="text-[10px] text-gray-400 uppercase tracking-[0.12em] font-mono font-semibold">
                                                {match[1]}
                                            </span>
                                        </div>
                                    )}
                                    <SyntaxHighlighter
                                        {...rest}
                                        style={vscDarkPlus}
                                        language={match ? match[1] : 'text'}
                                        PreTag="div"
                                        customStyle={{
                                            margin: 0,
                                            padding: '1.5rem 1.75rem',
                                            fontSize: '13.5px',
                                            lineHeight: '1.75',
                                            backgroundColor: '#1e1e1e',
                                            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace",
                                        }}
                                        showLineNumbers={String(children).split('\n').length > 5}
                                        lineNumberStyle={{
                                            minWidth: '3em',
                                            paddingRight: '1.5em',
                                            color: '#6e7681',
                                            userSelect: 'none',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                </div>
                            );
                        }

                        // Inline code
                        return (
                            <code className={className} {...rest}>
                                {children}
                            </code>
                        );
                    },
                    // Custom paragraph rendering
                    p({ children }) {
                        // Check if paragraph only contains an image
                        const hasOnlyImage = React.Children.toArray(children).every(
                            child => typeof child === 'object' && child !== null && 'type' in child && child.type === 'img'
                        );

                        if (hasOnlyImage) {
                            return <div className="my-8">{children}</div>;
                        }

                        return <p>{children}</p>;
                    },
                    // Enhanced list rendering with better spacing
                    ul({ children }) {
                        return <ul className="space-y-3">{children}</ul>;
                    },
                    ol({ children }) {
                        return <ol className="space-y-3">{children}</ol>;
                    },
                    // Table rendering
                    table({ children }) {
                        return (
                            <div className="overflow-x-auto my-6 rounded-lg border border-ink/10">
                                <table>{children}</table>
                            </div>
                        );
                    }
                }}
            >
                {cleanContent}
            </ReactMarkdown>
        </div>
    );
}