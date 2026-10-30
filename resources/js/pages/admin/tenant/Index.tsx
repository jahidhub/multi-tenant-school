import { Head, Link, router } from '@inertiajs/react';
import { AlertTriangle, ShieldAlert, Trash2 } from 'lucide-react';
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
                            Add School
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Schools</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Admin Email</TableHead>
                                    <TableHead>Domain/Slug</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tenants.data.map((tenant: any) => (
                                    <TableRow key={tenant.id}>
                                        <TableCell className="font-medium">{tenant.name}</TableCell>
                                        <TableCell>{tenant.admin_email}</TableCell>
                                        <TableCell>{tenant.domain || tenant.slug}</TableCell>
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
                                                        Login as School
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button size="sm" variant="outline" disabled className="h-8 gap-1.5 text-xs font-medium opacity-50 cursor-not-allowed text-muted-foreground" title="Cannot enter a suspended school">
                                                    <ShieldAlert className="h-3 w-3" />
                                                    Suspended
                                                </Button>
                                            )}
                                            <Button asChild size="sm" variant="outline" className="h-8 text-xs font-medium">
                                                <Link href={`/admin/tenants/${tenant.id}/edit`}>Edit</Link>
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="destructive" 
                                                className="h-8 text-xs font-medium gap-1"
                                                onClick={() => {
                                                    setSelectedTenant(tenant);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {tenants.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                            No schools found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[440px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            Delete School
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-foreground">
                            Are you sure you want to permanently delete <strong className="text-destructive font-semibold">{selectedTenant?.name}</strong>?
                            <br /><br />
                            <span className="text-sm text-muted-foreground">
                                This action cannot be undone. All associated records including administrator accounts, students, faculty, courses, enrollments, exams, and invoices will be permanently erased.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" disabled={isDeleting} onClick={handleDelete}>
                            {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Schools',
            href: '/admin/tenants',
        },
    ],
};
