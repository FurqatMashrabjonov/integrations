import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react'

import FitbitCard from '@/components/integration-cards/FitbitCard'
import GitHubCard from '@/components/integration-cards/GitHubCard'
import WakapiCard from '@/components/integration-cards/WakapiCard'
import LeetCodeCard from '@/components/integration-cards/LeetCodeCard'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DateFilter = 'today' | 'weekly' | 'monthly'

export default function Dashboard() {
    const [dateFilter, setDateFilter] = useState<DateFilter>('today')
    const {steps_of_today} = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-6">
                    {/* Date Filter Buttons */}
                    <div className="flex gap-2 justify-center">
                        <button
                            onClick={() => setDateFilter('today')}
                            className={`px-4 py-2 rounded-full border transition-colors ${
                                dateFilter === 'today'
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-background text-foreground border-border hover:bg-muted'
                            }`}
                        >
                            Kunlik
                        </button>
                        <button
                            onClick={() => setDateFilter('weekly')}
                            className={`px-4 py-2 rounded-full border transition-colors ${
                                dateFilter === 'weekly'
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-background text-foreground border-border hover:bg-muted'
                            }`}
                        >
                            Haftalik
                        </button>
                        <button
                            onClick={() => setDateFilter('monthly')}
                            className={`px-4 py-2 rounded-full border transition-colors ${
                                dateFilter === 'monthly'
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-background text-foreground border-border hover:bg-muted'
                            }`}
                        >
                            Oylik
                        </button>
                    </div>

                    {/* Integration Cards */}
                    <div className="space-y-6">
                        <FitbitCard
                            steps={12847}
                            distance={8.2}
                        />

                        <GitHubCard
                            username="furqat-dev"
                            title="Full Stack Developer"
                            prs={24}
                            commits={156}
                        />

                        <WakapiCard
                            todayHours="6h 42m"
                            weekHours="38h 15m"
                            languages={[
                                { name: "TypeScript", percentage: 45, color: "#3178c6" },
                                { name: "PHP", percentage: 35, color: "#777bb4" }
                            ]}
                        />

                        <LeetCodeCard
                            easy={127}
                            medium={89}
                            hard={23}
                            todaySubmissions={3}
                            streak={7}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
