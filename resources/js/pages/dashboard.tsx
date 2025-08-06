import { useState, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import FitbitCard from '@/components/integration-cards/FitbitCard';
import WakapiCard from '@/components/integration-cards/WakapiCard';
import LeetCodeCard from '@/components/integration-cards/LeetCodeCard';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({ integrationData }: { integrationData: any }) {
    const [filter, setFilter] = useState<'today' | 'weekly' | 'monthly'>('today');

    const filteredData = useMemo(() => {
        if (!integrationData) return null;
        const extract = (provider: string) => ({
            isConnected: integrationData[provider]?.isConnected || false,
            profile: integrationData[provider]?.profile || null,
            stats: integrationData[provider]?.stats?.[filter] || null
        });
        return {
            fitbit: extract('fitbit'),
            wakapi: extract('wakapi'),
            leetcode: extract('leetcode')
        };
    }, [integrationData, filter]);

    const cards = useMemo(() => [
        {
            id: 'fitbit',
            title: 'Fitbit',
            isIntegrated: filteredData?.fitbit?.isConnected,
            component: (
                <FitbitCard
                    isConnected={filteredData?.fitbit?.isConnected}
                    profile={filteredData?.fitbit?.profile}
                    stats={filteredData?.fitbit?.stats}
                />
            )
        },
        {
            id: 'wakapi',
            title: 'WakaTime',
            isIntegrated: filteredData?.wakapi?.isConnected,
            component: (
                <WakapiCard
                    dateFilter={filter}
                    isConnected={filteredData?.wakapi?.isConnected}
                    profile={filteredData?.wakapi?.profile}
                    stats={filteredData?.wakapi?.stats}
                />
            )
        },
        {
            id: 'leetcode',
            title: 'LeetCode',
            isIntegrated: filteredData?.leetcode?.isConnected,
            component: (
                <LeetCodeCard
                    dateFilter={filter}
                    isConnected={filteredData?.leetcode?.isConnected}
                    profile={filteredData?.leetcode?.profile}
                    stats={filteredData?.leetcode?.stats}
                />
            )
        }
    ].sort((a, b) => Number(b.isIntegrated) - Number(a.isIntegrated)), [filteredData, filter]);

    const tabClass = (type: string) =>
        `flex-1 px-2 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
            filter === type
                ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
        }`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-center">
                    <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border max-w-md w-full">
                        <button className={tabClass('today')} onClick={() => setFilter('today')}>📅 Bugun</button>
                        <button className={tabClass('weekly')} onClick={() => setFilter('weekly')}>📊 Hafta</button>
                        <button className={tabClass('monthly')} onClick={() => setFilter('monthly')}>📈 Oy</button>
                    </div>
                </div>
                <div className="space-y-6">
                    {cards.map(card => (
                        <div key={card.id} className="transition-all">{card.component}</div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
