import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Copy,
    Check,
    ExternalLink,
    LinkIcon,
} from 'lucide-react';
import { dashboard, links as linksRoute } from '@/routes';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type LinkItem = {
    id: number;
    user_id: number;
    original_url: string;
    code: string;
    clicks_count: number;
    created_at: string;
};

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            });
        } else {
            // Fallback for HTTP / older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText =
                'position:fixed;opacity:0;pointer-events:none';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 1800);
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100"
            onClick={handleCopy}
        >
            {copied ? (
                <Check className="h-3 w-3 text-emerald-500" />
            ) : (
                <Copy className="h-3 w-3" />
            )}
        </Button>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function truncateUrl(url: string, max = 52) {
    try {
        const { hostname, pathname } = new URL(url);
        const full = hostname + pathname;
        return full.length > max ? full.slice(0, max) + '…' : full;
    } catch {
        return url.length > max ? url.slice(0, max) + '…' : url;
    }
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
                <LinkIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No links yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
                Your shortened links will appear here once you create them.
            </p>
        </div>
    );
}

export default function Links({ links }: { links: LinkItem[] }) {
    const shortBase = typeof window !== "undefined" ?  window.location.origin + '/' : "localhost";

    return (
        <>
            <Head title="My Links" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">My Links</h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {links.length}{' '}
                            {links.length === 1 ? 'link' : 'links'} total
                        </p>
                    </div>
                </div>

                {links.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-hidden rounded-xl border border-border">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-44 pl-4">
                                        Short URL
                                    </TableHead>
                                    <TableHead>Original URL</TableHead>
                                    <TableHead className="w-24 text-center">
                                        Clicks
                                    </TableHead>
                                    <TableHead className="w-32 pr-4 text-right">
                                        Created
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {links.map((link) => (
                                    <TableRow
                                        key={link.id}
                                        className="group/row cursor-pointer"
                                        onClick={() =>
                                            router.visit(`/links/${link.id}`)
                                        }
                                    >
                                        {/* Short code */}
                                        <TableCell className="pl-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-mono text-xs font-medium text-foreground">
                                                    {link.code}
                                                </span>
                                                <CopyButton
                                                    text={shortBase + link.code}
                                                />
                                            </div>
                                        </TableCell>

                                        {/* Original URL */}
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <span
                                                    className="font-mono text-xs text-muted-foreground"
                                                    title={link.original_url}
                                                >
                                                    {truncateUrl(
                                                        link.original_url,
                                                    )}
                                                </span>
                                                <a
                                                    href={link.original_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100"
                                                >
                                                    <ExternalLink className="h-3 w-3 text-muted-foreground transition-colors hover:text-foreground" />
                                                </a>
                                            </div>
                                        </TableCell>

                                        {/* Clicks */}
                                        <TableCell className="text-center">
                                            <Badge
                                                variant={
                                                    link.clicks_count > 0
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                className="tabular-nums"
                                            >
                                                {link.clicks_count.toLocaleString()}
                                            </Badge>
                                        </TableCell>

                                        {/* Created */}
                                        <TableCell className="pr-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        link.created_at,
                                                    )}
                                                </span>
                                                {/* <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover/row:opacity-100 transition-opacity" /> */}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}

Links.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'My Links',
            href: linksRoute(),
        },
    ],
};
