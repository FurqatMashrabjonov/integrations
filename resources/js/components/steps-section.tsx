'use client'

import { useState } from 'react'
import { usePage } from '@inertiajs/react'
import { SharedData } from '@/types'

import FitbitCard from '@/components/integration-cards/FitbitCard'
import GitHubCard from '@/components/integration-cards/GitHubCard'
import WakapiCard from '@/components/integration-cards/WakapiCard'
import LeetCodeCard from '@/components/integration-cards/LeetCodeCard'

type DateFilter = 'today' | 'weekly' | 'monthly'

export default function StepsSection({
    steps,
    distance,
    calories
}: {
    steps: string;
    distance: number;
    calories: number;
}) {
    const { integrationData } = usePage<SharedData>().props;
    const [dateFilter, setDateFilter] = useState<DateFilter>('today');

    return (
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
                    isConnected={(integrationData as any)?.fitbit?.isConnected || false}
                    profile={(integrationData as any)?.fitbit?.profile || null}
                />

                <GitHubCard 
                    isConnected={(integrationData as any)?.github?.isConnected || false}
                    profile={(integrationData as any)?.github?.profile || null}
                />

                <WakapiCard 
                    dateFilter={dateFilter}
                    isConnected={(integrationData as any)?.wakapi?.isConnected || false}
                    stats={(integrationData as any)?.wakapi?.stats || null}
                />

                <LeetCodeCard
                    dateFilter={dateFilter}
                    isConnected={(integrationData as any)?.leetcode?.isConnected || false}
                    stats={(integrationData as any)?.leetcode?.stats || null}
                />
            </div>
        </div>
    )
}
