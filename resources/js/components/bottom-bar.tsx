import { Link, usePage } from '@inertiajs/react';
import { SVGProps } from 'react'
import { JSX } from 'react/jsx-runtime'
import { Calendar, ChartBar, Droplet, Droplets, User } from 'lucide-react';

export default function BottomBar() {

    const { url } = usePage();

    const isActive = (href: string) => url.startsWith(href);

    return (
        <nav className="bg-background fixed right-0 bottom-0 left-0 z-50 flex h-16 w-full items-end justify-around shadow-[0_-2px_4px_rgba(0,0,0,0.1)] md:h-18 pb-2">
            <Link
                href={route('dashboard')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium pt-2
                    ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <HomeIcon className="h-6 w-6" />
                <span className="text-xs">Asosiy</span>
            </Link>

            <Link
                href={route('calendar')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium pt-2
                    ${isActive('/calendar') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <Calendar className="h-6 w-6" />
                <span className="text-xs">Kalendar</span>
            </Link>

            {/* Pomodoro Focus Button - Circular and Prominent */}
            <Link
                href={route('pomodoro')}
                className="flex flex-col items-center justify-start gap-0 relative -mt-6"
                prefetch={false}
            >
                <div className={`h-14 w-14 rounded-full flex items-center justify-center transform transition-all duration-200 hover:scale-105 border-4 border-background
                    ${isActive('/pomodoro') ? 'bg-primary text-primary-foreground' : 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground'}`}>
                    <Droplets  className="h-8 w-8" />
                </div>
                <span className={`text-xs font-medium mt-1
                    ${isActive('/pomodoro') ? 'text-primary' : 'text-muted-foreground'}`}>
                    Fokus
                </span>
            </Link>

            <Link
                href={route('rating')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium pt-2
                    ${isActive('/rating') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <ChartBar className="h-6 w-6" />
                <span className="text-xs">Reyting</span>
            </Link>

            <Link
                href={route('integrations.edit')}
                className={`flex flex-col items-center justify-center gap-1 text-sm font-medium pt-2
                    ${isActive('/settings/integrations') ? 'text-primary' : 'text-muted-foreground hover:text-primary focus:text-primary'}`}
                prefetch={false}
            >
                <User className="h-6 w-6" />
                <span className="text-xs">Profil</span>
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

function PomodoroIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Tomato shape */}
            <path d="M12 2C8.5 2 6 5.5 6 9.5C6 14.5 9 18.5 12 22C15 18.5 18 14.5 18 9.5C18 5.5 15.5 2 12 2Z" />
            {/* Stem */}
            <path d="M12 2C12 2 10.5 0.5 9 1.5C9.5 2 10 2.5 10.5 2.5" fill="none" strokeWidth="1.5" />
            <path d="M12 2C12 2 13.5 0.5 15 1.5C14.5 2 14 2.5 13.5 2.5" fill="none" strokeWidth="1.5" />
            {/* Clock hands */}
            <line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="12" x2="14" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            {/* Center dot */}
            <circle cx="12" cy="12" r="1" fill="white" />
        </svg>
    );
}
