"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function CodeBlock({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-lg overflow-hidden border border-ink/10 shadow-inner bg-[#2b2b2b] text-white/90 my-4 font-mono text-sm">
            {/* Header / Mac-like dots or just label */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <div className="flex gap-1.5 opacity-50 text-white hover:opacity-100 transition-opacity">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-widest opacity-40">Python</span>
                    <button
                        onClick={handleCopy}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Copy Code"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 opacity-50" />}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto custom-scrollbar">
                <pre className="font-mono text-xs md:text-sm leading-relaxed whitespace-pre">
                    <code>
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
}
