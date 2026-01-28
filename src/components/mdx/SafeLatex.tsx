
"use client";

import React, { ReactNode } from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

export default function SafeLatex({ children }: { children: ReactNode }) {
    if (typeof children === 'string') {
        return <Latex>{children}</Latex>;
    }

    // In case MDX passes parsed elements (because we forgot to wrap in string in the seed),
    // we return the children as-is to prevent a crash. 
    // The Latex processing will fail for this block, but the page will load.
    return <>{children}</>;
}
