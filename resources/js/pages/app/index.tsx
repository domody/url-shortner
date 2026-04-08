import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';



type Stats = {
    total_links: number;
    total_clicks: number;
    todays_clicks: number;
    recent: Click[];
};

export default function Dashboard({ stats }: { stats: Stats }) {

    const statCards = [
    {
        title: 'Total Links',
        value: stats.total_links,
    },
    {
        title: 'Total Clicks',
        value: stats.total_clicks,
    },
    {
        title: 'Clicks Today',
        value: stats.todays_clicks,
    },
];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {statCards.map((stat) => {
                        return (
                            <Card key={stat.title}>
                                {/* <CardHeader></CardHeader> */}
                                <CardContent>
                                    <div className="flex flex-col gap-1">
                                        <CardDescription>
                                            {stat.title}
                                        </CardDescription>
                                        <CardTitle className="text-4xl font-semibold">
                                            {stat.value}
                                        </CardTitle>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
