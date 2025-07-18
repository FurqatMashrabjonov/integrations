"use client"

import { Bar, BarChart } from "recharts"

import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig

export function ExampleChart() {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <Bar
                    dataKey="desktop"
                    fill="currentColor"
                    radius={4}
                    className="text-primary"
                />
                <Bar
                    dataKey="mobile"
                    fill="currentColor"
                    radius={4}
                    className="text-accent"
                />
            </BarChart>
        </ChartContainer>

    )
}
