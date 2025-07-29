import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import BottomBar from '@/components/bottom-bar';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <AppShell>

            {/*<AppHeader breadcrumbs={breadcrumbs}/>*/}

            <AppContent>{children}</AppContent>

            <BottomBar />
        </AppShell>
    );
}
