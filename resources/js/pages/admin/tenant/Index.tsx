import { Head, Link } from '@inertiajs/react';
import { ShieldAlert } from 'lucide-react';
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

export default function Index({ tenants }: any) {
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
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {tenant.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right flex justify-end gap-3 items-center">
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
                                            <Link href={`/admin/tenants/${tenant.id}/edit`} className="text-indigo-600 hover:text-indigo-900 font-medium text-sm">Edit</Link>
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
