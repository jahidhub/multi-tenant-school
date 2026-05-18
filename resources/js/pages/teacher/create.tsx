import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
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
import {
    FieldGroup,
    Field,
    FieldDescription,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function Dashboard() {
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
                                    <BreadcrumbPage>Create</BreadcrumbPage>
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
                        <CardHeader className='bold'>New Teacher</CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="f_name">
                                        First Name
                                    </FieldLabel>
                                    <Input id="f_name" type="text" />
                                    <FieldDescription></FieldDescription>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="l_name">
                                        Last Name
                                    </FieldLabel>
                                    <Input id="l_name" type="text" />
                                    <FieldDescription></FieldDescription>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="subject">
                                        Subject
                                    </FieldLabel>
                                    <Input id="subject" type="text" />
                                    <FieldDescription></FieldDescription>
                                </Field>
                                <Field orientation="horizontal">
                                    <Button type="submit">Add Teacher</Button>
                                    <Button type="reset" variant="outline">
                                        Reset
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Teacher',
            href: '/teacher',
        },
    ],
};
