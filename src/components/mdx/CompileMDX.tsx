// src/components/mdx/CompileMDX.tsx
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

export function CompileMDX({ source, components, className = "latex-prose" }: { source: string, components: any, className?: string }) {

  try {
    return (
      <div className={className}>
        <MDXRemote
          source={source}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath, remarkGfm],
              // Plugins that crash Vercel are disabled. We use custom components instead.
              rehypePlugins: [rehypeKatex], // Enable Math, keep Highlight disabled
            },
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("MDX Compilation Error:", error);
    return (
      <div className="p-4 border border-red-500 bg-red-50 text-red-700 rounded-lg my-4">
        <h3 className="font-bold mb-2">MDX Rendering Error</h3>
        <pre className="text-xs overflow-auto whitespace-pre-wrap">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    );
  }
}