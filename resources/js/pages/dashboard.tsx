import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react'

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

export default function Dashboard({ integrationData }: {
    integrationData: any
}) {
    const { auth } = usePage().props as any;
    const [filter, setFilter] = useState<'today' | 'weekly' | 'monthly'>('today');

    const filteredData = useMemo(() => {
        if (!integrationData) return null;

        // Extract data for current filter with consistent structure
        return {
            fitbit: {
                isConnected: integrationData.fitbit?.isConnected || false,
                profile: integrationData.fitbit?.profile || null,
                stats: integrationData.fitbit?.stats?.[filter] || null
            },
            github: {
                isConnected: integrationData.github?.isConnected || false,
                profile: integrationData.github?.profile || null,
                stats: integrationData.github?.stats?.[filter] || null
            },
            wakapi: {
                isConnected: integrationData.wakapi?.isConnected || false,
                profile: integrationData.wakapi?.profile || null,
                stats: integrationData.wakapi?.stats?.[filter] || null
            },
            leetcode: {
                isConnected: integrationData.leetcode?.isConnected || false,
                profile: integrationData.leetcode?.profile || null,
                stats: integrationData.leetcode?.stats?.[filter] || null
            }
        };
    }, [integrationData, filter]);

    const originalOrder: CardItem[] = [
        {
            id: 'fitbit',
            component: <FitbitCard
                isConnected={filteredData?.fitbit?.isConnected || false}
                profile={filteredData?.fitbit?.profile || null}
                stats={filteredData?.fitbit?.stats || null}
            />,
            title: 'Fitbit',
            isIntegrated: filteredData?.fitbit?.isConnected || false
        },
        {
            id: 'github',
            component: <GitHubCard
                isConnected={filteredData?.github?.isConnected || false}
                profile={filteredData?.github?.profile || null}
                stats={filteredData?.github?.stats || null}
            />,
            title: 'GitHub',
            isIntegrated: filteredData?.github?.isConnected || false
        },
        {
            id: 'wakapi',
            component: <WakapiCard
                dateFilter={filter}
                isConnected={filteredData?.wakapi?.isConnected || false}
                profile={filteredData?.wakapi?.profile || null}
                stats={filteredData?.wakapi?.stats || null}
            />,
            title: 'WakaTime',
            isIntegrated: filteredData?.wakapi?.isConnected || false
        },
        {
            id: 'leetcode',
            component: <LeetCodeCard
                dateFilter={filter}
                isConnected={filteredData?.leetcode?.isConnected || false}
                profile={filteredData?.leetcode?.profile || null}
                stats={filteredData?.leetcode?.stats || null}
            />,
            title: 'LeetCode',
            isIntegrated: filteredData?.leetcode?.isConnected || false
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
                                onClick={() => setFilter('today')}
                                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
                                    filter === 'today'
                                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                            >
                                📅 Bugun
                            </button>
                            <button
                                onClick={() => setFilter('weekly')}
                                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
                                    filter === 'weekly'
                                        ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                                }`}
                            >
                                📊 Hafta
                            </button>
                            <button
                                onClick={() => setFilter('monthly')}
                                className={`flex-1 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
                                    filter === 'monthly'
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
                                    className="transition-all duration-200 ease-in-out"
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
