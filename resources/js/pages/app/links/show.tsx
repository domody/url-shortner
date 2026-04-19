import { Head } from '@inertiajs/react';
import {
    ExternalLink,
    Globe,
    MousePointerClickIcon,
    LucideIcon,
    Logs,
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard, links as linksRoute } from '@/routes';
import { Progress } from '@/components/ui/progress';
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import {
    formatDate,
    formatRelative,
    parseUserAgent,
    formatReferrer,
} from '@/lib/helpers';
import { CopyButton } from '@/components/copy-button';
import { ActivityChart } from '@/components/activity-chart';
import { StatCard } from '@/components/stat-card';
import { DeleteLink } from '@/components/delete-link';
import { EditLink } from '@/components/edit-link';

type ReferrerItem = {
    source: string;
    count: number;
};

type Stats = {
    clicks_today: number;
    clicks_this_week: number;
    last_click: string | null;
};

type Props = {
    link: Link;
    stats: Stats;
    chartData: Record<string, number>;
    referrers: ReferrerItem[];
    recentClicks: Click[];
};

function EmptyState({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon;
    title: string;
    description: string;
}) {
    return (
        <Empty className="h-full border bg-muted/30">
            <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                    <Icon />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

export default function LinkShow({ link, stats, chartData, referrers, recentClicks }: Props) {
    const shortBase =
        typeof window !== 'undefined' ? window.location.origin + '/' : '';
    const shortUrl = shortBase + link.code;

    return (
        <>
            <Head title={`/${link.code}`} />

            <div className="flex w-full flex-col gap-6 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-2xl font-semibold tracking-tight">
                                /{link.code}
                            </span>
                            <Badge
                                variant={
                                    link.clicks_count > 0
                                        ? 'default'
                                        : 'outline'
                                }
                                className="text-xs tabular-nums"
                            >
                                {link.clicks_count.toLocaleString()} click
                                {link.clicks_count !== 1 ? 's' : ''}
                            </Badge>
                        </div>
                        <div className="flex max-w-lg items-center gap-1.5">
                            <span
                                className="truncate font-mono text-sm text-muted-foreground"
                                title={link.original_url}
                            >
                                {link.original_url}
                            </span>
                            <a
                                href={link.original_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0"
                            >
                                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground transition-colors hover:text-foreground" />
                            </a>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Created {formatDate(link.created_at)}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <CopyButton text={shortUrl} label="Copy link" />
                        <EditLink link={link} />
                        <DeleteLink link={link} />
                    </div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard label="Total clicks" value={link.clicks_count} />
                    <StatCard
                        label="Clicks today"
                        value={stats.clicks_today}
                        accent={stats.clicks_today > 0 ? 'text-emerald-500' : ''}
                    />
                    <StatCard label="Clicks this week" value={stats.clicks_this_week} />
                    <StatCard
                        label="Last click"
                        value={
                            stats.last_click
                                ? formatRelative(stats.last_click)
                                : 'N/A'
                        }
                        sub={
                            stats.last_click
                                ? formatDate(stats.last_click)
                                : 'No clicks yet'
                        }
                    />
                </div>

                {/* Activity Chart */}
                <Card>
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-base">
                                    Click activity
                                </CardTitle>
                                <CardDescription>Last 30 days</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {link.clicks_count === 0 ? (
                            <EmptyState
                                icon={MousePointerClickIcon}
                                title="No clicks yet"
                                description="Clicks will appear here once your link starts getting traffic"
                            />
                        ) : (
                            <ActivityChart chartData={chartData} />
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-4 lg:grid-cols-3">
                    {/* Referrers */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                Referrers
                            </CardTitle>
                            <CardDescription>
                                Sites that directed traffic to your link
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {referrers.length === 0 ? (
                                <EmptyState
                                    icon={Globe}
                                    title="No referrers yet"
                                    description="Referring sites will show up here after visitors arrive through external sources."
                                />
                            ) : (
                                <div className="no-scrollbar max-h-[400px] space-y-3 overflow-y-auto">
                                    {referrers.map(({ source, count }) => {
                                        const pct =
                                            link.clicks_count > 0
                                                ? Math.round(
                                                      (count /
                                                          link.clicks_count) *
                                                          100,
                                                  )
                                                : 0;
                                        return (
                                            <div
                                                key={source}
                                                className="space-y-1"
                                            >
                                                <div className="flex items-center justify-between text-xs">
                                                    <span
                                                        className="max-w-[140px] truncate font-medium"
                                                        title={source}
                                                    >
                                                        {source}
                                                    </span>
                                                    <span className="text-muted-foreground tabular-nums">
                                                        {count}{' '}
                                                        <span className="opacity-60">
                                                            ({pct}%)
                                                        </span>
                                                    </span>
                                                </div>
                                                <Progress value={pct} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Click log */}
                    <Card className="overflow-hidden lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Click log
                            </CardTitle>
                            <CardDescription>
                                Latest {recentClicks.length} of{' '}
                                {link.clicks_count.toLocaleString()} event
                                {link.clicks_count !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent
                            className={`h-full ${recentClicks.length === 0 ? '' : 'px-0'}`}
                        >
                            {recentClicks.length === 0 ? (
                                <EmptyState
                                    icon={Logs}
                                    title="No clicks yet"
                                    description="Each visit to your link will be logged here with full details."
                                />
                            ) : (
                                <div className="no-scrollbar max-h-[400px] overflow-y-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="w-28 pl-6">
                                                    Browser
                                                </TableHead>
                                                <TableHead>Referrer</TableHead>
                                                <TableHead className="w-28 pr-6 text-right">
                                                    When
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentClicks.map((click) => {
                                                const { browser, os } =
                                                    parseUserAgent(
                                                        click.user_agent,
                                                    );
                                                return (
                                                    <TableRow
                                                        key={click.id}
                                                        className="group/row"
                                                    >
                                                        <TableCell className="pl-6">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium">
                                                                    {browser}
                                                                </span>
                                                                <span className="text-[11px] text-muted-foreground">
                                                                    {os}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell
                                                            className="max-w-[180px] truncate text-xs text-muted-foreground"
                                                            title={
                                                                click.referrer ??
                                                                undefined
                                                            }
                                                        >
                                                            {formatReferrer(
                                                                click.referrer,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="pr-6 text-right">
                                                            <div className="flex flex-col items-end">
                                                                <span className="text-[11px] text-muted-foreground">
                                                                    {formatRelative(
                                                                        click.created_at,
                                                                    )}
                                                                </span>
                                                                <span className="text-[10px] text-muted-foreground/60">
                                                                    {formatDate(
                                                                        click.created_at,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

LinkShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'My Links', href: linksRoute() },
        { title: 'Link' },
    ],
};
