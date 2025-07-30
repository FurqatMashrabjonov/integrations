import { ExampleGithubCalendar } from '@/components/example-github-calendar';
import { Calendar } from '@/components/ui/calendar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import 'react-calendar/dist/Calendar.css';

interface Event {
    date: string;
    title: string;
}

export default function CalendarPage() {
    const breadcrumbs: BreadcrumbItem[] = [{ title: 'Calendar', href: '/calendar' }];
    const [date, setDate] = useState<Date | undefined>(new Date(2025, 5, 12));
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="bg-card rounded-lg p-2 shadow">
                        <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow-sm" captionLayout="dropdown" />
                    </div>
                    <div className="bg-card rounded-lg p-2 shadow">
                        <ExampleGithubCalendar />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
