'use client'

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import {
    SortableContext,
    useSortable,
    arrayMove,
    rectSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { useState } from 'react'

type StatCardType = {
    id: string
    label: string
    value: string
    unit?: string
    icon: string
    width: 0.5 | 1
    order: number
}

function SortableCard({ card }: { card: StatCardType }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const colSpan = card.width === 1 ? 'col-span-2' : 'col-span-1'

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${colSpan} w-full cursor-grab active:cursor-grabbing`}
            {...attributes}
            {...listeners}
        >
            <Card className="rounded-3xl w-full shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base font-medium text-muted-foreground">
                        <div className="flex justify-between items-center">
                            <p className="text-muted-foreground text-md m-0">{card.label}</p>
                            <span className="rounded-full px-2 py-1 bg-muted text-xl">{card.icon}</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-start font-semibold text-foreground">
                    <span className="text-3xl font-semibold">{card.value}</span>
                    {card.unit && (
                        <span className="text-muted-foreground text-xl font-light ml-1">{card.unit}</span>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

type DateFilter = 'today' | 'weekly' | 'monthly'

export default function StepsSection({
    steps,
    distance,
    calories
}: {
    steps: string
    distance: number
    calories: number
}) {
    const [dateFilter, setDateFilter] = useState<DateFilter>('today')
    const [items, setItems] = useState<StatCardType[]>([
        {
            id: 'steps',
            label: 'Qadamlar',
            value: steps,
            icon: '🚶‍♂️',
            width: 0.5,
            order: 1
        },
        {
            id: 'calories',
            label: 'Kaloriya',
            value: calories.toLocaleString(),
            unit: 'cal',
            icon: '🔥',
            width: 0.5,
            order: 2
        }
    ])

    const sensors = useSensors(useSensor(PointerSensor))

    function handleDragEnd(event: any) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex).map((item, idx) => ({
            ...item,
            order: idx + 1
        }))

        setItems(newItems)
    }

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
                    Today
                </button>
                <button
                    onClick={() => setDateFilter('weekly')}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                        dateFilter === 'weekly'
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background text-foreground border-border hover:bg-muted'
                    }`}
                >
                    Weekly
                </button>
                <button
                    onClick={() => setDateFilter('monthly')}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                        dateFilter === 'monthly'
                            ? 'bg-foreground text-background border-foreground'
                            : 'bg-background text-foreground border-border hover:bg-muted'
                    }`}
                >
                    Monthly
                </button>
            </div>

            {/* Fitbit Integration Card */}
            <Card className="rounded-3xl w-full shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="w-8 h-8 bg-[#00B2CA] rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">F</span>
                        </div>
                        Fitbit Integration
                    </CardTitle>
                    <CardDescription>Daily activity tracking</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">12,847</span>
                            <p className="text-sm text-muted-foreground">Steps Today</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">8.2</span>
                            <p className="text-sm text-muted-foreground">km Distance</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GitHub Integration Card */}
            <Card className="rounded-3xl w-full shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">⚡</span>
                        </div>
                        GitHub Activity
                    </CardTitle>
                    <CardDescription>Development contributions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                        <img
                            src="https://avatars.githubusercontent.com/u/12345678?v=4"
                            alt="GitHub Profile"
                            className="w-12 h-12 rounded-full border-2 border-gray-200"
                        />
                        <div>
                            <p className="font-semibold text-foreground">@furqat-dev</p>
                            <p className="text-sm text-muted-foreground">Full Stack Developer</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">24</span>
                            <p className="text-sm text-muted-foreground">PRs This Month</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">156</span>
                            <p className="text-sm text-muted-foreground">Commits</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Wakapi Integration Card */}
            <Card className="rounded-3xl w-full shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="w-8 h-8 bg-[#6366f1] rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm">⏰</span>
                        </div>
                        Wakapi Coding Time
                    </CardTitle>
                    <CardDescription>Weekly coding activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">6h 42m</span>
                            <p className="text-sm text-muted-foreground">Today</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">38h 15m</span>
                            <p className="text-sm text-muted-foreground">This Week</p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>TypeScript</span>
                            <span className="text-muted-foreground">45%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>PHP</span>
                            <span className="text-muted-foreground">35%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{width: '35%'}}></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* LeetCode Integration Card */}
            <Card className="rounded-3xl w-full shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="w-8 h-8 bg-[#FFA116] rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">LC</span>
                        </div>
                        LeetCode Progress
                    </CardTitle>
                    <CardDescription>Problem solving activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-lg font-bold text-green-600">127</span>
                            <p className="text-xs text-green-600">Easy</p>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <span className="text-lg font-bold text-yellow-600">89</span>
                            <p className="text-xs text-yellow-600">Medium</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                            <span className="text-lg font-bold text-red-600">23</span>
                            <p className="text-xs text-red-600">Hard</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">3</span>
                            <p className="text-sm text-muted-foreground">Today</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                            <span className="text-2xl font-bold text-foreground">🔥 7</span>
                            <p className="text-sm text-muted-foreground">Day Streak</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
