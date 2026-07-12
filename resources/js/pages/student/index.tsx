import { Head, Link, usePage } from '@inertiajs/react';
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

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react';


interface Student  {
    id: number;
    name: string;
    email: string;
    father_name: string;
    mother_name: string;
    phone_number: string;
    address: string;
    class: string;
}

type Props = {
    students: {
        data: Student[];
        links:any[];
    }
}

const emptyForm = {
    name: '',
    email: '',
    father_name: '',
    mother_name: '',
    phone_number: '',   
    address: '',
    class: '',
};

type FormState = typeof emptyForm & {id?:number};


export default function Student() {

    const { students } = usePage<{ students?: Student[]}>().props;
    const studentLists = students?? [];
    // console.log(studentLists);

    const [open , setOpen ] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [isEdit , setIsEdit ] = useState(false);


    const handleOpenAdd = ()=> {
        setForm(emptyForm);
        setIsEdit(false);
        setOpen(true);
    }

const handleOpenEdit = ()=>{

// 1:20 min


}


const handleClose = ()=> {
    setForm(emptyForm);
    setOpen(false);
    setIsEdit(false);
}




    
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


                {/* Student Model */}

                <Dialog>
                    <form>
                        <DialogTrigger asChild>
                            <Button variant="outline">Open Dialog</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you&apos;re
                                    done.
                                </DialogDescription>
                            </DialogHeader>
                            <FieldGroup>
                                <Field>
                                    <Label htmlFor="name-1">Name</Label>
                                    <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
                                </Field>
                                <Field>
                                    <Label htmlFor="username-1">Username</Label>
                                    <Input id="username-1" name="username" defaultValue="@peduarte" />
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>

                {/* Student Model */}


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
