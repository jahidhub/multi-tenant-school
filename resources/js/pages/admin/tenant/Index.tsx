import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ShieldAlert, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function Index({ tenants }: any) {
    const [selectedTenant, setSelectedTenant] = useState<any>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        if (!selectedTenant) return;
        setIsDeleting(true);
        router.delete(`/admin/tenants/${selectedTenant.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteOpen(false);
                setSelectedTenant(null);
            },
        });
    };

    return (
        <>
            <Head title="Tenants" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div></div>
                    <Button asChild>
                        <Link href="/admin/tenants/create">
                            Add Institute
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Institutes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Admin Email</TableHead>
                                    <TableHead>Domain/Slug</TableHead>
                                    <TableHead>Site</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tenants.data.map((tenant: any) => (
                                    <TableRow key={tenant.id}>
                                        <TableCell className="font-medium">{tenant.institute_name}</TableCell>
                                        <TableCell>{tenant.admin_email}</TableCell>
                                        <TableCell>{tenant.domain || tenant.slug}</TableCell>
                                        <TableCell>
                                            <a
                                                href={tenant.domain ? `https://${tenant.domain}` : `http://${tenant.slug}.sehrixedu.test`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                            >
                                                {tenant.domain ?? `${tenant.slug}.sehrixedu.test`}
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </TableCell>
                                        <TableCell className="capitalize">{tenant.plan}</TableCell>
                                        <TableCell className="capitalize">
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${tenant.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-950/60 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'}`}>
                                                {tenant.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end gap-2 items-center">
                                            {tenant.status === 'active' ? (
                                                <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-medium border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950/50">
                                                    <Link
                                                        href={`/admin/tenants/${tenant.id}/impersonate`}
                                                        method="post"
                                                        as="button"
                                                    >
                                                        <ShieldAlert className="h-3 w-3" />
                                                        Login as Institute
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" disabled className="h-8 gap-1.5 text-xs font-medium opacity-50 cursor-not-allowed text-muted-foreground" title="Cannot enter a suspended Institute">
                                                    <ShieldAlert className="h-3 w-3" />
                                                    Suspended
                                                </Button>
                                            )}
                                            <Button asChild size="sm" variant="outline" className="h-8 text-xs font-medium">
                                                <Link href={`/admin/tenants/${tenant.id}/edit`}>Edit</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {tenants.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                            No Institutes found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>


        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Institutes',
            href: '/admin/tenants',
        },
    ],
};
