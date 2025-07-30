import { type PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';

import { SharedData } from '@/types';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    if (typeof window === 'undefined') return null;

    return (
        <div className="max-w-md px-2 py-6">
            <div className="flex flex-col items-center space-y-2 mb-6">
                <img
                    src="https://avatars.githubusercontent.com/u/61729454?v=4"
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover"
                />
                <h2 className="text-lg font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <section className="space-y-6">{children}</section>
        </div>
    );
}
