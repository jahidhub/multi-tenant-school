import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function Edit({ tenant, adminUser }: any) {
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain || '',
        plan: tenant.plan,
        status: tenant.status,
        admin_name: adminUser?.name || '',
        admin_email: adminUser?.email || '',
        admin_password: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        put(`/admin/tenants/${tenant.id}`);
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(`/admin/tenants/${tenant.id}`, {
            onFinish: () => {
                setIsDeleting(false);
                setIsDeleteOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={`Edit ${tenant.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Edit {tenant.name}</CardTitle>
                        <CardDescription>Update the details and status of this school and its administrator.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">School Details</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">School Name</Label>
                                        <Input 
                                            id="name" 
                                            value={data.name} 
                                            onChange={e => setData('name', e.target.value)} 
                                            required 
                                        />
                                        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="plan">Plan</Label>
                                        <Select value={data.plan} onValueChange={(value) => setData('plan', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Plan" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="basic">Basic</SelectItem>
                                                <SelectItem value="premium">Premium</SelectItem>
                                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.plan && <div className="text-red-500 text-sm mt-1">{errors.plan}</div>}
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input 
                                            id="slug" 
                                            value={data.slug} 
                                            onChange={e => setData('slug', e.target.value)} 
                                            required 
                                        />
                                        {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="domain">Domain <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                        <Input 
                                            id="domain" 
                                            value={data.domain} 
                                            onChange={e => setData('domain', e.target.value)} 
                                        />
                                        {errors.domain && <div className="text-red-500 text-sm mt-1">{errors.domain}</div>}
                                    </div>
                                </div>
                                
                                <div className="grid gap-2 sm:max-w-[50%] pr-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="suspended">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                                </div>
                            </div>
                            
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="text-lg font-medium">Administrator Details</h3>
                                <div className="grid gap-2">
                                    <Label htmlFor="admin_name">Admin Full Name</Label>
                                    <Input 
                                        id="admin_name" 
                                        value={data.admin_name} 
                                        onChange={e => setData('admin_name', e.target.value)} 
                                        required 
                                    />
                                    {errors.admin_name && <div className="text-red-500 text-sm mt-1">{errors.admin_name}</div>}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="admin_email">Admin Email Address</Label>
                                        <Input 
                                            id="admin_email" 
                                            type="email"
                                            value={data.admin_email} 
                                            onChange={e => setData('admin_email', e.target.value)} 
                                            required 
                                        />
                                        {errors.admin_email && <div className="text-red-500 text-sm mt-1">{errors.admin_email}</div>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="admin_password">Admin Password <span className="text-muted-foreground font-normal">(Leave empty to keep current)</span></Label>
                                        <div className="relative">
                                            <Input 
                                                id="admin_password" 
                                                type={showPassword ? "text" : "password"}
                                                value={data.admin_password} 
                                                onChange={e => setData('admin_password', e.target.value)} 
                                                minLength={8}
                                                className="pr-10"
                                                placeholder='new password'
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.admin_password && <div className="text-red-500 text-sm mt-1">{errors.admin_password}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 flex items-center gap-4">
                                <Button type="submit" disabled={processing}>
                                    Update School
                                </Button>
                                {recentlySuccessful && (
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">School updated successfully.</p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/30">
                    <CardHeader>
                        <CardTitle className="text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Danger Zone
                        </CardTitle>
                        <CardDescription>
                            Permanently delete this school and all of its associated records from the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-foreground">Delete this School</p>
                            <p className="text-xs text-muted-foreground">Once deleted, all students, staff, exams, courses, and financial records cannot be recovered.</p>
                        </div>
                        <Button 
                            type="button" 
                            variant="destructive"
                            onClick={() => setIsDeleteOpen(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-1.5" />
                            Delete School
                        </Button>
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
                            Are you sure you want to permanently delete <strong className="text-destructive font-semibold">{tenant.name}</strong>?
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

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Schools',
            href: '/admin/tenants',
        },
        {
            title: 'Edit School',
            href: '#',
        },
    ],
};
