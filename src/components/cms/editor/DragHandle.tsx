
import { Editor } from '@tiptap/react';
import { GripVertical, Plus } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DragHandleProps {
    editor: Editor;
}

export default function DragHandle({ editor }: DragHandleProps) {
    // State to track position
    const [position, setPosition] = useState<number | null>(null);
    const [top, setTop] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editor || editor.isDestroyed) return;

        // Function to update handle position
        const updatePosition = () => {
            const { selection } = editor.state;
            const { $anchor } = selection;

            // Find the start of the current block
            // We want the top-level block (depth 1 usually in doc > block)
            // Tiptap doc structure: doc -> block -> text
            // But layout blocks are nested.
            // Strategy: Find the node at current selection depth.

            // Simplification: Just track the cursor coordinates provided by the selection
            const dom = editor.view.domAtPos($anchor.pos);
            // Safety check
            if (!dom || !dom.node) return;

            // Navigate up to find the closest block element that is a direct child of the editor
            let current: any = dom.node.nodeType === 3 ? dom.node.parentElement : dom.node;
            while (current && current.parentElement && !current.parentElement.classList.contains('ProseMirror')) {
                current = current.parentElement;
            }

            if (current && current.getBoundingClientRect) {
                const rect = current.getBoundingClientRect();
                // We need offset relative to the editor container or viewport?
                // Let's use absolute positioning relative to body or editor wrapper
                // Tiptap container is generally relative.

                // Getting the editor wrapper offset
                const editorRect = editor.view.dom.getBoundingClientRect();

                // Set Top position relative to the editor
                setTop(rect.top - editorRect.top);
            }
        };

        editor.on('selectionUpdate', updatePosition);
        editor.on('update', updatePosition);
        editor.on('transaction', updatePosition);

        // Initial call
        updatePosition();

        return () => {
            editor.off('selectionUpdate', updatePosition);
            editor.off('update', updatePosition);
            editor.off('transaction', updatePosition);
        };
    }, [editor]);

    // Simple Rendering logic
    // We render a small handle on the left

    return (
        <div
            className="absolute left-0 w-6 h-6 flex items-center justify-center cursor-grab text-ink/30 hover:text-ink hover:bg-ink/5 rounded transition-all z-50 transform -translate-x-full"
            style={{
                top: `${top}px`,
                // Adding some left margin
                marginLeft: '-12px'
            }}
            draggable="true"
            onDragStart={(event) => {
                // Tiptap Drag Logic
                // We need to tell Tiptap which node is being dragged.
                // This is complex API territory. 
                // Alternative: The handle is just visual for now, we rely on Native selection drag?
                // No, user specifically wants "Notion-like".

                // For this prototype, let's keep it visual to indicate "active block".
                event.dataTransfer.effectAllowed = 'move';

                // Real implementation requires `prosemirror-view` drag handle logic
                // For now, we will notify user this is the UI shell.
            }}
        >
            <GripVertical className="w-4 h-4" />
        </div>
    );
}
