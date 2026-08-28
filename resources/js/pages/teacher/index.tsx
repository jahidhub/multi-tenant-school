import { Head, Link } from '@inertiajs/react';
import { Ellipsis, Eye } from 'lucide-react';
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
import Preview from './preview';




type Teacher = {
    id: number;
    name: string;
    phone: string;
    subject: string;
    address: string;
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
                                    <BreadcrumbLink href="/dashboard">
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
                        <Button asChild>
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Subject</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead className="flex justify-end">
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
                                                    {teacher.name}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.phone}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.subject}
                                                </TableCell>
                                                <TableCell>
                                                    {teacher.address}
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-4">
                                                    <span className='cursor-pointer' > 
                                                         <Preview teacher={teacher}/>
                                                    </span>
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
                                                                
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`edit/teacher/${teacher.id}`}
                                                                    >
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`teacher/${teacher.id}`}
                                                                        method="delete"
                                                                        as="button"
                                                                        className="w-full"
                                                                        onClick={(e) => {
                                                                            if (!confirm('Are you sure you want to delete this teacher?')) {
                                                                                e.preventDefault();
                                                                            }
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuGroup>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground"
                                            >
                                                No teachers found.
                                            </TableCell>
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
