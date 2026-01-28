
import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from '@tiptap/react';

// 1. CheckBox Component (just a wrapper for the CSS Grid)
const TwoColumnComponent = (props: any) => {
    return (
        <NodeViewWrapper className= "grid grid-cols-1 md:grid-cols-2 gap-8 my-8 relative group border border-dashed border-transparent hover:border-ink/10 rounded-xl p-4 transition-colors" >
        <div className="absolute -top-3 left-4 bg-paper px-2 text-[10px] font-mono text-ink/30 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity select-none" >
            2 - Column Layout
                </div>
                < NodeViewContent />
                </NodeViewWrapper>
    )
}

// 2. The Column Wrapper Node
export const TwoColumn = Node.create({
    name: 'twoColumn',
    group: 'block',
    content: 'column column', // Exactly two columns
    isolating: true,

    parseHTML() {
        return [{ tag: 'div[data-type="two-column"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'two-column', class: 'grid grid-cols-1 md:grid-cols-2 gap-8' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(TwoColumnComponent);
    }
});

// 3. The Individual Column Node
export const Column = Node.create({
    name: 'column',
    content: 'block+', // Can contain any blocks
    isolating: true,

    parseHTML() {
        return [{ tag: 'div[data-type="column"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'column', class: 'border border-dashed border-ink/5 min-h-[100px] rounded-lg p-4' }), 0];
    },
});
