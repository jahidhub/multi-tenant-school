import { Head, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface TenantData {
    id: number;
    school_name: string;
    slug: string | null;
    status: string;
    address: string | null;
}

export default function TenantSettings({ tenant }: { tenant: TenantData }) {
    const { data, setData, patch, processing, errors } = useForm({
        school_name: tenant.school_name || '',
        slug: tenant.slug || '',
        status: tenant.status || 'active',
        address: tenant.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/school', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="School settings" />

            <h1 className="sr-only">School settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="School information"
                    description="Update your school profile details"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="school_name">School Name</Label>
                        <Input
                            id="school_name"
                            className="mt-1 block w-full"
                            value={data.school_name}
                            onChange={(e) => setData('school_name', e.target.value)}
                            required
                            placeholder="School name"
                        />
                        <InputError message={errors.school_name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            className="mt-1 block w-full"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="school-slug"
                        />
                        <InputError message={errors.slug} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={data.status}
                            onValueChange={(val) => setData('status', val)}
                        >
                            <SelectTrigger className="w-full mt-1">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            className="mt-1 block w-full"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="School address"
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TenantSettings.layout = {
    breadcrumbs: [
        {
            title: 'School settings',
            href: '/settings/school',
        },
    ],
};
