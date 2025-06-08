import { cn } from '@/lib/utils';
import { ChromeIcon, CodeIcon, Github, LucideIcon, TimerIcon } from 'lucide-react';
import { HTMLAttributes, useState } from 'react';

export default function IntegrationToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const [selected, setSelected ] = useState();

    const tabs: { value: string; icon: LucideIcon; label: string }[] = [
        { value: 'github', icon: Github, label: 'Github' },
        { value: 'fitbit', icon: ChromeIcon, label: 'Fitbit' },
        { value: 'leetcode', icon: CodeIcon, label: 'Leetcode' },
        { value: 'wakapi', icon: TimerIcon, label: 'Wakapi' },
    ];

    return (
        <div
            className={cn(
                'grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800 w-full',
                className,
            )}
            {...props}
        >
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setSelected(value)}
                    className={cn(
                        'flex items-center justify-center rounded-md px-3.5 py-2 transition-colors w-full',
                        selected === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <Icon className="h-4 w-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
