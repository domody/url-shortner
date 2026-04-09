import { Card, CardContent } from '@/components/ui/card';

export function StatCard({
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
