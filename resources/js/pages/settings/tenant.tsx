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
    name: string;
    address: string | null;
}

export default function TenantSettings({ tenant }: { tenant: TenantData }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: tenant.institute_name || '',
        address: tenant.address || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/Institute', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Institute settings" />

            <h1 className="sr-only">Institute settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Institute information"
                    description="Update your Institute profile details"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Institute Name</Label>
                        <Input
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            placeholder="Institute name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            className="mt-1 block w-full"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder="Institute address"
                        />
                        <InputError message={errors.address} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>
                            Save
                        </Button>
                        {recentlySuccessful && (
                            <p className="text-sm text-green-600 font-medium">Saved successfully.</p>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

TenantSettings.layout = {
    breadcrumbs: [
        {
            title: 'Institute settings',
            href: '/settings/Institute',
        },
    ],
};

