import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

import { usePage, Link } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { auth } = usePage<any>().props;
    const isImpersonating = auth.is_impersonating;

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden flex flex-col h-screen">
                {isImpersonating && (
                    <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium text-sm">
                                You are currently impersonating a school admin. All actions taken will be audited.
                            </span>
                        </div>
                        <Button asChild variant="secondary" size="sm" className="h-8">
                            <Link href="/impersonation/leave" method="post" as="button">
                                Return to Super Admin
                            </Link>
                        </Button>
                    </div>
                )}
                <div className="flex-1 overflow-auto">
                    <AppSidebarHeader breadcrumbs={breadcrumbs} />
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
