'use client'

import { Card, CardContent } from "@/components/ui/card"

interface StepProgressProps {
    steps: number
    goal?: number
}

export default function StepProgress({ steps, goal = 10000 }: StepProgressProps) {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const progress = Math.min((steps / goal) * 100, 100)
    const offset = circumference - (progress / 100) * circumference

    return (
        <Card className="w-[240px] h-[280px] flex items-center justify-center">
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="relative w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke="#E5E7EB"
                            strokeWidth="10"
                            fill="none"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            stroke="#047857"
                            strokeWidth="10"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                        />
                    </svg>

                    {/* Shoe Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="#047857"
                            className="w-8 h-8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 4l4 4 4-2 6 6v2H4V4z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Step Count */}
                <div className="mt-6 text-center">
                    <div className="text-2xl font-semibold">{steps.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Steps</div>
                </div>
            </CardContent>
        </Card>
    )
}
