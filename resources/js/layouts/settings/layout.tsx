import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { ChevronRight, User, Brush, Link2 } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: <User className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: <Brush className="w-4 h-4 text-muted-foreground" />,
    },
    {
        title: 'Integrations',
        href: '/settings/integrations',
        icon: <Link2 className="w-4 h-4 text-muted-foreground" />,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') return null;

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="Settings" description="Manage your profile and account settings" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-64">
                    {/* iOS-style settings group */}
                    <div className="rounded-xl border bg-background shadow-sm divide-y">
                        {sidebarNavItems.map((item, index) => {
                            const isActive = currentPath === item.href;

                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    prefetch
                                    className={cn(
                                        'flex items-center px-4 py-3 space-x-4 transition hover:bg-muted/50',
                                        isActive && 'bg-muted', index == 0 ? 'rounded-t-xl' : '',
                                        index === sidebarNavItems.length - 1 ? 'rounded-b-xl' : ''
                                    )}
                                >
                                    <div className="flex items-center justify-center bg-muted rounded-md w-8 h-8">
                                        {item.icon}
                                    </div>
                                    <span className="flex-1 text-sm">{item.title}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </Link>
                            );
                        })}
                    </div>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
