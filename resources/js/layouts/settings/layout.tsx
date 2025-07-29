import Heading from '@/components/heading';
import { type PropsWithChildren } from 'react';

export default function SettingsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') return null;

    return (
        <div className="px-2 py-4 max-w-md mx-auto">
            <Heading title="Settings" description="Manage your profile and account settings" />

                <div className="flex-1">
                    <section className="max-w-2xl space-y-6">{children}</section>
                </div>
            </div>
    );
}
