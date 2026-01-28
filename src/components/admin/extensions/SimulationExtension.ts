import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import SimulationNodeView from '../nodes/SimulationNodeView';

export default Node.create({
    name: 'simulation',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            component: {
                default: null,
                parseHTML: element => {
                    if (typeof element === 'string') return null;
                    return element.getAttribute('data-component') || element.getAttribute('component');
                },
            },
            props: {
                default: null,
                parseHTML: element => {
                    if (typeof element === 'string') return null;
                    return element.getAttribute('data-props') || element.getAttribute('props');
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'simulation-component',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['simulation-component', {
            'data-component': HTMLAttributes.component,
            'data-props': HTMLAttributes.props, // Optional
            ...mergeAttributes(HTMLAttributes)
        }];
    },

    addNodeView() {
        return ReactNodeViewRenderer(SimulationNodeView);
    },
});
