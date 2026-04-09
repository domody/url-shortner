import { useMemo } from 'react';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

type ClickItem = {
    id: number;
    link_id: number;
    ip_address: string | null;
    referrer: string | null;
    user_agent: string | null;
    created_at: string;
};

const chartConfig = {
    count: {
        label: 'Count',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

export function ActivityChart({ clicks }: { clicks: ClickItem[] }) {
    const days = useMemo(() => {
        const arr: string[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i + 1);
            arr.push(d.toISOString().split('T')[0]);
        }
        const counts: Record<string, number> = {};
        clicks.forEach((c) => {
            const day = new Date(c.created_at).toISOString().split('T')[0];
            counts[day] = (counts[day] ?? 0) + 1;
        });
        return arr.map((date) => ({
            date: new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            }),
            count: counts[date] ?? 0,
        }));
    }, [clicks]);

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
