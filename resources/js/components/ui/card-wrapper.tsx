import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

interface CardWrapperProps {
    children: ReactNode;
    viewMode: 'big' | 'normal' | 'small' | 'list';
    className?: string;
    dragHandleProps?: any;
    showDragHandle?: boolean;
}

export function CardWrapper({ children, viewMode, className, dragHandleProps, showDragHandle = true }: CardWrapperProps) {
    const getWrapperClasses = () => {
        const baseClasses = "transition-all duration-200 ease-in-out relative";
        
        switch (viewMode) {
            case 'big':
                return cn(
                    baseClasses, 
                    "hover:shadow-md", // big = normal view
                    className
                );
            case 'small':
                return cn(
                    baseClasses, 
                    "transform scale-90", // slightly smaller scale
                    "[&_>_div]:!py-1 [&_>_div]:!px-3", // reduced vertical padding
                    "[&_.card-header]:!pb-1 [&_.card-header]:!pt-2", // minimal header padding
                    "[&_.card-content]:!pt-1 [&_.card-content]:!pb-2", // minimal content padding
                    "[&_h3]:!text-sm [&_h4]:!text-sm [&_p]:!text-sm", // slightly smaller text
                    "max-h-20 overflow-hidden", // limit height to make cards shorter
                    className
                );
            case 'list':
                return cn(
                    baseClasses, 
                    "border rounded-lg bg-card shadow-sm hover:shadow-md hover:border-border/60",
                    "transform scale-90", // smaller list items
                    "[&_>_div]:!py-2 [&_>_div]:!px-3", // compact padding
                    "[&_.card-header]:!pb-1", // minimal header
                    "[&_.card-content]:!pt-1", // minimal content
                    className
                );
            default:
                return cn(baseClasses, "hover:shadow-md", className);
        }
    };

    return (
        <div className={getWrapperClasses()}>
            {/* Drag Handle Inside Card */}
            {showDragHandle && (
                <div 
                    className={`absolute z-10 cursor-grab active:cursor-grabbing transition-all duration-200 group ${
                        viewMode === 'list' 
                            ? 'top-1/2 left-2 -translate-y-1/2 opacity-70 hover:opacity-100 p-3 -m-3' 
                            : 'top-2 right-2 opacity-0 hover:opacity-100 bg-background/90 hover:bg-background p-2 rounded-lg shadow-sm'
                    } touch-manipulation`}
                    {...dragHandleProps}
                    style={{ touchAction: 'none' }}
                >
                    <GripVertical className={`${viewMode === 'list' ? 'w-5 h-5' : 'w-5 h-5'} text-muted-foreground group-hover:text-foreground`} />
                </div>
            )}
            {children}
        </div>
    );
}
