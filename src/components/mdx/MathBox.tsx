
"use client";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function MathBox({ latex }: { latex: string }) {
    return (
        <div className="my-6 p-6 bg-paper border border-ink/10 rounded-xl overflow-x-auto text-center text-lg">
            <Latex>{latex}</Latex>
        </div>
    );
}
