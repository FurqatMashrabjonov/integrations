import React, { ReactNode } from 'react';
import { useSortable, UseSortableArguments } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps extends UseSortableArguments {
    id: string | number;
    children?: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function SortableItem({ id, children, className, style: customStyle, ...rest }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id, ...rest });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...customStyle,
    };

    return (
        <div ref={setNodeRef} style={{height: '20px'}} className="border" {...attributes} {...listeners}>
            {children}
        </div>
    );
}
