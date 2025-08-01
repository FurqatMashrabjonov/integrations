'use client'

import { useState } from 'react'

import FitbitCard from '@/components/integration-cards/FitbitCard'
import GitHubCard from '@/components/integration-cards/GitHubCard'
import WakapiCard from '@/components/integration-cards/WakapiCard'
import LeetCodeCard from '@/components/integration-cards/LeetCodeCard'

type DateFilter = 'today' | 'weekly' | 'monthly'

export default function StepsSection({
}: {
    steps: string
    distance: number
    calories: number
}) {
    const [dateFilter, setDateFilter] = useState<DateFilter>('today')

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
                <FitbitCard />

                <GitHubCard />

                <WakapiCard />

                <LeetCodeCard
                    easy={127}
                    medium={89}
                    hard={23}
                    todaySubmissions={3}
                    streak={7}
                />
            </div>
        </div>
    )
}
