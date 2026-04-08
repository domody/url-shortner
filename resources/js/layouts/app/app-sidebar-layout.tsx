import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';
import { toast } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    });

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <Toaster />
        </AppShell>
    );
}
