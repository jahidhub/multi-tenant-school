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



export default function Student(){
    return (
        <>
            <Head title="Student" />
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
                                    <BreadcrumbPage>Student</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button asChild>
                            <Link className="" href="">
                                Add Student
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="Student-table">
                    <Card>
                        <CardHeader>Student</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead> Email</TableHead>
                                        <TableHead> Father Name</TableHead>
                                        <TableHead> Mother Name</TableHead>
                                        <TableHead> Phone Number</TableHead>
                                        <TableHead> Address</TableHead>
                                        <TableHead className="flex justify-end">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            01
                                        </TableCell>
                                        <TableCell>
                                            Jahid hassan
                                        </TableCell>
                                        <TableCell>
                                            jahid@gmail.com
                                        </TableCell>
                                        <TableCell>
                                            Abul Kasham
                                        </TableCell>
                                        <TableCell>
                                            Taslima Bagum
                                        </TableCell>
                                        <TableCell>
                                            01989619006
                                        </TableCell>
                                        <TableCell>
                                            Navaron
                                        </TableCell>
                                        <TableCell className="flex justify-end gap-4">
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
                                                            <Link>
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link>
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                method="delete"
                                                                as="button"
                                                                className="w-full"
                                                                onClick={(e) => {
                                                                    if (!confirm('Are you sure you want to delete this Student?')) {
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
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Student.layout = {
    breadcrumbs: [
        {
            title: 'Student',
            href: '/students',
        },
    ],
};
