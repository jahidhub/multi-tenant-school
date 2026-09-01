import { Head, useForm } from '@inertiajs/react';
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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        domain: '',
        plan: 'basic',
        admin_name: '',
        admin_email: '',
        admin_password: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        post('/admin/tenants');
    };

    return (
        <>
            <Head title="Create School" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Onboard New School</CardTitle>
                        <CardDescription>Enter the details to create a new school tenant and its initial administrator account.</CardDescription>
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
                                        <Label htmlFor="slug">Slug <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                        <Input 
                                            id="slug" 
                                            value={data.slug} 
                                            onChange={e => setData('slug', e.target.value)} 
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
                                        <Label htmlFor="admin_password">Admin Password</Label>
                                        <Input 
                                            id="admin_password" 
                                            type="password"
                                            value={data.admin_password} 
                                            onChange={e => setData('admin_password', e.target.value)} 
                                            required 
                                            minLength={8}
                                        />
                                        {errors.admin_password && <div className="text-red-500 text-sm mt-1">{errors.admin_password}</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" disabled={processing}>
                                    Create School & Admin
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Schools',
            href: '/admin/tenants',
        },
        {
            title: 'Create School',
            href: '/admin/tenants/create',
        },
    ],
};
