import { Link, usePage } from '@inertiajs/react';
import { SVGProps } from 'react'
import { JSX } from 'react/jsx-runtime'
import { Calendar, ChartBar, User } from 'lucide-react';

export default function BottomBar() {

    const { url } = usePage();

    const isActive = (href: string) => url.startsWith(href);

    return (
        <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 flex h-14 w-full items-center justify-around shadow-[0_-2px_4px_rgba(0,0,0,0.1)] md:h-16">
            <Link
                href={route('dashboard')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium
                    ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <HomeIcon className="h-6 w-6" />
                Asosiy
            </Link>

            <Link
                href={route('calendar')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium
                    ${isActive('/calendar') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <Calendar className="h-6 w-6" />
                Kalendar
            </Link>

            <Link
                href={route('rating')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium
                    ${isActive('/rating') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <ChartBar className="h-6 w-6" />
                Reyting
            </Link>

            <Link
                href={route('integrations.edit')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium
                    ${isActive('/settings/integrations') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <User className="h-6 w-6" />
                Profil
            </Link>
        </nav>
    );
}

function HomeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}
