import { Head, Link, useForm } from '@inertiajs/react';
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

type Teacher = {
    name: string;
    phone: string;
    subject: string;
    address: string;
};

type Props = {
    teacher: Teacher;
    id: string | number;
};

export default function TeacherEdit({ teacher, id }: Props) {
    const { data, setData, put, errors, processing } = useForm<{
        name: string;
        phone: string;
        subject: string;
        address: string;
    }>({
        name: teacher.name || '',
        phone: teacher.phone || '',
        subject: teacher.subject || '',
        address: teacher.address || '',
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(`/teacher/${id}`);
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
                                    <BreadcrumbPage>Edit</BreadcrumbPage>
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
                        <CardHeader className="bold">Edit Teacher</CardHeader>
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
                                        <InputError
                                            message={errors.name}
                                        />
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
                                        <InputError
                                            message={errors.phone}
                                        />
                                    </Field>
                                    
                                    <Field>
                                        <FieldLabel htmlFor="subject">
                                            Subject
                                        </FieldLabel>
                                        <Input
                                            id="subject"
                                            type="text"
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    'subject',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError message={errors.subject} />
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
                                    
                                    <Field orientation="horizontal">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && (
                                                <Loader2 className="animate-spin" />
                                            )}
                                            Save Changes
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

TeacherEdit.layout = {
    breadcrumbs: [
        {
            title: 'Teacher',
            href: '/teacher',
        },
    ],
};
