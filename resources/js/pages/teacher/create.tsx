import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import InputError from '@/components/input-error';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function TeacherCreate() {
    const { data, setData, post, errors, processing } = useForm<{
        name: string;
        phone: string;
        subject_specialty: string;
        address: string;
        profile_photo: File | null;
    }>({
        name: '',
        phone: '',
        subject_specialty: '',
        address: '',
        profile_photo: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_photo', file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setData('profile_photo', null);
            setPreviewUrl(null);
        }
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post('/teacher/store');
    }

    return (
        <>
            <Head title="Teacher" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="breadcrumb flex items-center justify-between">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/dashboard">Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/teachers">Teacher</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Create</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button variant="secondary" asChild>
                            <Link
                                href="/teachers"
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft /> Back
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="teacher-table">
                    <Card>
                        <CardHeader className="bold">New Teacher</CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="name">
                                            Name
                                        </FieldLabel>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            
                                        />
                                        <InputError message={errors.name} />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="phone">
                                            Phone
                                        </FieldLabel>
                                        <Input
                                            id="phone"
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData(
                                                    'phone',
                                                    e.target.value,
                                                )
                                            }
                                           
                                        />
                                        <InputError message={errors.phone} />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="subject_specialty">
                                            Subject
                                        </FieldLabel>
                                        <Input
                                            id="subject_specialty"
                                            type="text"
                                            value={data.subject_specialty}
                                            onChange={(e) =>
                                                setData(
                                                    'subject_specialty',
                                                    e.target.value,
                                                )
                                            }
                                           
                                        />
                                        <InputError message={errors.subject_specialty} />
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="address">
                                            Address
                                        </FieldLabel>
                                        <Input
                                            id="address"
                                            type="text"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    'address',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.address} />
                                    </Field>
                                    
                                    <Field>
                                        <FieldLabel htmlFor="profile_photo">
                                            Profile Photo
                                        </FieldLabel>
                                        <div className="flex items-center gap-4">
                                            {previewUrl && (
                                                <img src={previewUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                                            )}
                                            <Input
                                                id="profile_photo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                            />
                                        </div>
                                        <InputError message={errors.profile_photo} />
                                    </Field>
                                    <Field orientation="horizontal">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Loader2 className="animate-spin" />
                                            )}
                                            Add Teacher
                                        </Button>
                                        <Button
                                            type="reset"
                                            variant="outline"
                                            disabled={processing}
                                            onClick={() =>
                                                window.location.reload()
                                            }
                                        >
                                            Reset
                                        </Button>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

TeacherCreate.layout = {
    breadcrumbs: [
        {
            title: 'Teacher',
            href: '/teacher',
        },
    ],
};
