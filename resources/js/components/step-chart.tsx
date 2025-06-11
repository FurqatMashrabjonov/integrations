"use client"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const chartConfig = {
} satisfies ChartConfig
export function StepChart() {

    const { steps } = usePage<SharedData>().props;

    return (
        <Card className="border-0 w-100">
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={Array.isArray(steps) ? steps : []}
                        margin={{
                            top: 10,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(5)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="steps" label="steps_formatted" fill="currentColor" radius={1000}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="text-accent"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
