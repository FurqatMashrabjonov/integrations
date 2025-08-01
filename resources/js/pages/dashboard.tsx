import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react'

import FitbitCard from '@/components/integration-cards/FitbitCard'
import GitHubCard from '@/components/integration-cards/GitHubCard'
import WakapiCard from '@/components/integration-cards/WakapiCard'
import LeetCodeCard from '@/components/integration-cards/LeetCodeCard'
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type DateFilter = 'today' | 'weekly' | 'monthly'

interface CardItem {
    id: string;
    component: React.ReactNode;
    title: string;
    isIntegrated?: boolean; // Add integration status
}

export default function Dashboard() {
    const [dateFilter, setDateFilter] = useState<DateFilter>('today')
    
    const originalOrder: CardItem[] = [
        {
            id: 'fitbit',
            component: <FitbitCard />,
            title: 'Fitbit',
            isIntegrated: true // You can make this dynamic based on actual integration status
        },
        {
            id: 'github',
            component: <GitHubCard />,
            title: 'GitHub',
            isIntegrated: true // This will be dynamic based on actual connection status
        },
        {
            id: 'wakapi',
            component: <WakapiCard />,
            title: 'WakaTime',
            isIntegrated: false
        },
        {
            id: 'leetcode',
            component: <LeetCodeCard />,
            title: 'LeetCode',
            isIntegrated: false
        }
    ];
    
    // Sort cards: integrated first, then non-integrated
    const sortedCards = useMemo(() => {
        return [...originalOrder].sort((a, b) => {
            if (a.isIntegrated && !b.isIntegrated) return -1;
            if (!a.isIntegrated && b.isIntegrated) return 1;
            return 0;
        });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex flex-col gap-6">
                    {/* Date Filter Only - Single Line */}
                    <div className="flex items-center justify-center">
                        {/* Enhanced Date Filter - Compact Tab Format */}
                        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border/50 max-w-md w-full">
                            <button
                                onClick={() => setDateFilter('today')}
                                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
                                    dateFilter === 'today'
                                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                            >
                                📅 Bugun
                            </button>
                            <button
                                onClick={() => setDateFilter('weekly')}
                                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
                                    dateFilter === 'weekly'
                                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                            >
                                📊 Hafta
                            </button>
                            <button
                                onClick={() => setDateFilter('monthly')}
                                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
                                    dateFilter === 'monthly'
                                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                            >
                                📈 Oy
                            </button>
                        </div>
                    </div>

                    {/* Integration Cards - Auto-sorted by integration status */}
                    <div className="space-y-4">
                        {/* Integration Cards - Simple Display */}
                        <div className="space-y-6">
                            {sortedCards.map((card) => (
                                <div 
                                    key={card.id}
                                    className="transition-all duration-200 ease-in-out hover:shadow-md"
                                >
                                    {card.component}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
