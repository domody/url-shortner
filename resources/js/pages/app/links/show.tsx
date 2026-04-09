import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ArrowLeft,
    Check,
    Copy,
    ExternalLink,
    MousePointerClick,
    TrendingUp,
    CalendarDays,
    Clock,
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
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard, links as linksRoute } from '@/routes';
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Progress } from '@/components/ui/progress';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';

type ClickItem = {
    id: number;
    link_id: number;
    ip_address: string | null;
    referrer: string | null;
    user_agent: string | null;
    created_at: string;
};

type LinkItem = {
    id: number;
    user_id: number;
    original_url: string;
    code: string;
    clicks_count: number;
    clicks: ClickItem[];
    created_at: string;
    updated_at: string;
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function formatRelative(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function parseUserAgent(ua: string | null): { browser: string; os: string } {
    if (!ua) return { browser: 'Unknown', os: 'Unknown' };
    let browser = 'Other';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/OPR\//.test(ua)) browser = 'Opera';
    else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if (/curl\//.test(ua)) browser = 'cURL';
    let os = 'Other';
    if (/Windows/.test(ua)) os = 'Windows';
    else if (/iPhone|iPad/.test(ua)) os = 'iOS';
    else if (/Mac OS X/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/Linux/.test(ua)) os = 'Linux';
    return { browser, os };
}

function formatReferrer(ref: string | null): string {
    if (!ref) return 'Direct';
    try {
        const { hostname } = new URL(ref);
        return hostname.replace(/^www\./, '');
    } catch {
        return ref;
    }
}

function CopyButton({ text, label }: { text: string; label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            });
        } else {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            } finally {
                document.body.removeChild(ta);
            }
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-xs"
        >
            {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
            ) : (
                <Copy className="h-3 w-3" />
            )}
            {label && <span>{copied ? 'Copied!' : label}</span>}
        </Button>
    );
}

// Reusable empty state

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

// Activity chart

const chartConfig = {
    count: {
        label: 'Count',
        color: 'var(--chart-4)',
    },
} satisfies ChartConfig;

function ActivityChart({ clicks }: { clicks: ClickItem[] }) {
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
        return arr.map((date, i) => ({
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

// Stat card

function StatCard({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: string | number;
    sub?: string;
    accent?: string;
}) {
    return (
        <Card>
            <CardContent>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {label}
                        </p>
                        <p
                            className={`text-3xl font-semibold tracking-tight tabular-nums ${accent ?? ''}`}
                        >
                            {typeof value === 'number'
                                ? value.toLocaleString()
                                : value}
                        </p>
                        {sub && (
                            <p className="text-xs text-muted-foreground">
                                {sub}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// main

export default function LinkShow({ link }: { link: LinkItem }) {
    const shortBase =
        typeof window !== 'undefined' ? window.location.origin + '/' : '';
    const shortUrl = shortBase + link.code;

    const today = new Date().toISOString().split('T')[0];
    const clicksToday = link.clicks.filter(
        (c) => new Date(c.created_at).toISOString().split('T')[0] === today,
    ).length;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const clicksThisWeek = link.clicks.filter(
        (c) => new Date(c.created_at) >= weekAgo,
    ).length;

    const lastClick = link.clicks[0] ?? null;

    const referrerBreakdown = useMemo(() => {
        const counts: Record<string, number> = {};
        link.clicks.forEach((c) => {
            const key = formatReferrer(c.referrer);
            counts[key] = (counts[key] ?? 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]);
    }, [link.clicks]);

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
                    </div>
                </div>

                {/* stats */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard label="Total clicks" value={link.clicks_count} />
                    <StatCard
                        label="Clicks today"
                        value={clicksToday}
                        accent={clicksToday > 0 ? 'text-emerald-500' : ''}
                    />
                    <StatCard label="Clicks this week" value={clicksThisWeek} />
                    <StatCard
                        label="Last click"
                        value={
                            lastClick
                                ? formatRelative(lastClick.created_at)
                                : 'N/A'
                        }
                        sub={
                            lastClick
                                ? formatDate(lastClick.created_at)
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
                        {link.clicks.length === 0 ? (
                            <EmptyState
                                icon={MousePointerClickIcon}
                                title="No clicks yet"
                                description="Clicks will appear here once your link
                                        starts getting traffic"
                            />
                        ) : (
                            <ActivityChart clicks={link.clicks} />
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
                            {referrerBreakdown.length === 0 ? (
                                <EmptyState
                                    icon={Globe}
                                    title="No referrers yet"
                                    description="Referring sites will show up here after visitors arrive through external sources."
                                />
                            ) : (
                                <div className="no-scrollbar max-h-[400px] space-y-3 overflow-y-auto">
                                    {referrerBreakdown.map(
                                        ([source, count]) => {
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
                                        },
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Clicks */}
                    <Card className="overflow-hidden lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Click log
                            </CardTitle>
                            <CardDescription>
                                {link.clicks.length} event
                                {link.clicks.length !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent
                            className={`h-full ${link.clicks.length === 0 ? '' : 'px-0'}`}
                        >
                            {link.clicks.length === 0 ? (
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
                                            {link.clicks.map((click) => {
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
