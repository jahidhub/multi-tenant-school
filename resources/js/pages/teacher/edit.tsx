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
    first_name: string;
    last_name: string;
    subject: string;
};

type Props = {
    teacher: Teacher[];
    id: [];
};

export default function TeacherCreate({ teacher, id }: Props) {
    const { data, setData, post, errors, processing } = useForm<{
        first_name: string;
        last_name: string;
        subject: string;
    }>({
        first_name: teacher.first_name,
        last_name: teacher.last_name,
        subject: teacher.subject,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(`/teacher/${id}`);
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
                                    <BreadcrumbLink>
                                        <Link href="/dashboard">Home</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink>
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
                        <Button variant="secondary">
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
                                        <FieldLabel htmlFor="first_name">
                                            First Name
                                        </FieldLabel>
                                        <Input
                                            id="first_name"
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    'first_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.first_name}
                                        />
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="last_name">
                                            Last Name
                                        </FieldLabel>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    'last_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <InputError
                                            message={errors.last_name}
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
