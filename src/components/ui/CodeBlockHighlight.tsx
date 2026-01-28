
'use client';

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register languages to keep bundle small
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);

export default function CodeBlockHighlight({
    code,
    language = "python",
    filename
}: {
    code: string;
    language?: string;
    filename?: string
}) {
    return (
        <div
            dir="ltr"
            className="my-8 rounded-lg overflow-hidden border border-ink/10 bg-[#1e1e1e] shadow-2xl text-sm text-left"
        >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-white/5">
                <span className="font-mono text-xs text-white/40">{filename || language}</span>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
            </div>

            {/* Code Area with Syntax Highlighting */}
            <div className="overflow-x-auto">
                <SyntaxHighlighter
                    language={language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.5rem',
                        backgroundColor: 'transparent',
                        fontSize: '0.875rem',
                        lineHeight: '1.7',
                    }}
                    wrapLines={true}
                >
                    {code}
                </SyntaxHighlighter>
            </div>
        </div>
    );
}
