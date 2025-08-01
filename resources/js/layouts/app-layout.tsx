import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import TelegramAutoAuth from '@/components/TelegramAutoAuth';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        <TelegramAutoAuth 
            onSuccess={() => {
                console.log('User automatically authenticated via Telegram');
            }}
            onError={(error) => {
                console.log('Telegram auto-auth failed:', error);
            }}
        />
        {children}
        <Toaster />
    </AppLayoutTemplate>
);
