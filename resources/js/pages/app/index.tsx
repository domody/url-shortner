import { Head, router } from '@inertiajs/react';
import { formatDate } from '@/lib/helpers';
import { dashboard } from '@/routes';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>Recent Clicks</CardTitle>
                        <CardDescription>
                            The latest activity across your shortened links.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="pl-6">
                                        Short URL
                                    </TableHead>
                                    <TableHead>Referrer</TableHead>
                                    <TableHead>User Agent</TableHead>
                                    <TableHead className="pr-6 text-right">
                                        Created
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stats.recent.map((link) => (
                                    <TableRow
                                        key={link.id}
                                        className="group/row cursor-pointer"
                                        onClick={() =>
                                            router.visit(
                                                `/links/${link.link_id}`,
                                            )
                                        }
                                    >
                                        <TableCell className="pl-6">
                                            <span className="font-mono font-medium text-foreground">
                                                {link.link?.code ??
                                                    link.link_id}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {link.referrer ?? 'No referrer'}
                                        </TableCell>

                                        <TableCell className="max-w-[240px] truncate text-muted-foreground">
                                            {link.user_agent}
                                        </TableCell>

                                        <TableCell className="pr-6 text-right text-muted-foreground">
                                            {formatDate(link.created_at)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
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
