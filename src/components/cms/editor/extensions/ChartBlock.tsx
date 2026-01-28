
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { Node } from '@tiptap/core';
import AlphaOptimizer from '@/components/lab/alpha/AlphaOptimizer'; // Reuse existing chart
import { cn } from '@/lib/utils';
import { Database } from 'lucide-react';

const ChartComponent = (props: any) => {
    return (
        <NodeViewWrapper className="my-10 relative group">
            {/* Editor Overlay: Shows some info when not selected */}
            <div className={cn(
                "absolute -top-6 left-0 text-[10px] font-mono uppercase tracking-widest text-ink/30 transition-opacity",
                props.selected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
            )}>
                Interactive Chart: Alpha Optimizer
            </div>

            {/* Wrapper for the chart itself */}
            <div className={cn(
                "transition-all duration-300",
                props.selected ? "ring-2 ring-accent ring-offset-4 ring-offset-paper rounded-xl" : ""
            )}>
                {/* Pointer events disabled in editor to prevent chart interaction form capturing focus awkwardly? 
                    Actually, we WANT it interactive. But dragging might be tricky. 
                    Let's allow interaction for now. */}
                <AlphaOptimizer />
            </div>
        </NodeViewWrapper>
    );
};

export default Node.create({
    name: 'chartBlock',

    group: 'block',

    atom: true, // It's a single unit, content is not editable text

    addAttributes() {
        return {
            type: {
                default: 'alpha-optimizer',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'chart-block',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['chart-block', HTMLAttributes];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ChartComponent);
    },
});
