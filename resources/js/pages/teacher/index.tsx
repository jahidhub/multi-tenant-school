import { Head, Link } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Teacher = {
    id: number;
    first_name: string;
    last_name: string;
    subject: string;
};

type Props = {
    teachers: Teacher[];
};

export default function Teacher({ teachers }: Props) {
    return (
        <>
            <Head title="Teacher" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="breadcrumb flex items-center justify-between">
                    <div>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="#">
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Teacher</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button>
                            <Link className="" href="/teacher/create">
                                Add Teacher
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="teacher-table">
                    <Card>
                        <CardHeader>Teacher</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead className="flex justify-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {teachers && teachers.length > 0 ? (
                                        teachers.map((teacher, index) => (
                                            <TableRow key={teacher.id}>
                                                <TableCell>
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.first_name}{' '}
                                                    {teacher.last_name}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.subject}
                                                </TableCell>
                                                <TableCell className="flex justify-center">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button variant="outline">
                                                                <Ellipsis />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            className="w-40"
                                                            align="end"
                                                        >
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem>
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`teacher/${teacher.id}/edit`}
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    Update
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableRow>
                                                <TableCell
                                                    colSpan={4}
                                                    className="text-center text-muted-foreground"
                                                >
                                                    No teachers found.
                                                </TableCell>
                                            </TableRow>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Teacher.layout = {
    breadcrumbs: [
        {
            title: 'Teacher',
            href: '/teacher',
        },
    ],
};
