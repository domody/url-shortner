import { useMemo } from 'react';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const chartConfig = {
    count: {
        label: 'Count',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

export function ActivityChart({ chartData }: { chartData: Record<string, number> }) {
    const days = useMemo(() => {
        const arr: string[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i + 1);
            arr.push(d.toISOString().split('T')[0]);
        }
        return arr.map((date) => ({
            date: new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
            count: chartData[date] ?? 0,
        }));
    }, [chartData]);

    return (
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart accessibilityLayer data={days}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={'date'}
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={0} />
            </BarChart>
        </ChartContainer>
    );
}
