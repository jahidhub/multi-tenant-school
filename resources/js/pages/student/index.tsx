import { Head, Link, useForm } from '@inertiajs/react';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";

interface StudentData {
    id: number;
    name: string;
    class: string;
    roll_number: string | null;
    date_of_birth: string | null;
    gender: string | null;
    father_name: string | null;
    guardian_phone: string | null;
    address: string | null;
}

export default function Student({ students = [] }: { students?: any }) {
    // Pagination data comes in as a paginator object from Laravel
    const studentsList = students?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        class: '',
        roll_number: '',
        date_of_birth: '',
        gender: '',
        father_name: '',
        guardian_phone: '',
        address: '',
    });

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedStudent(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (student: StudentData) => {
        setModalMode('edit');
        setSelectedStudent(student);
        setData({
            name: student.name || '',
            class: student.class || '',
            roll_number: student.roll_number || '',
            date_of_birth: student.date_of_birth || '',
            gender: student.gender || '',
            father_name: student.father_name || '',
            guardian_phone: student.guardian_phone || '',
            address: student.address || '',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (student: StudentData) => {
        setSelectedStudent(student);
        setIsDeleteOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/student/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            put(`/student/${selectedStudent?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedStudent?.id) {
            destroy(`/student/${selectedStudent.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedStudent(null);
                },
            });
        }
    };

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
                        <Button onClick={openCreateModal}>
                            Add Student
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead>Roll</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Father Name</TableHead>
                                        <TableHead>Guardian Phone</TableHead>
                                        <TableHead className="flex justify-end">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {studentsList && studentsList.length > 0 ? (
                                        studentsList.map((student: StudentData, index: number) => (
                                            <TableRow key={student.id}>
                                                <TableCell>
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </TableCell>
                                                <TableCell>
                                                    {student.name}
                                                </TableCell>
                                                <TableCell>
                                                    {student.class}
                                                </TableCell>
                                                <TableCell>
                                                    {student.roll_number}
                                                </TableCell>
                                                <TableCell className="capitalize">
                                                    {student.gender}
                                                </TableCell>
                                                <TableCell>
                                                    {student.father_name}
                                                </TableCell>
                                                <TableCell>
                                                    {student.guardian_phone}
                                                </TableCell>
                                                <TableCell className="flex justify-end gap-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline">
                                                                <Ellipsis />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-40" align="end">
                                                            <DropdownMenuGroup>
                                                                <DropdownMenuItem onClick={() => openEditModal(student)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteModal(student)}>
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
                                            <TableCell
                                                colSpan={7}
                                                className="text-center text-muted-foreground py-8"
                                            >
                                                No students found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[90vh]">
                    <form onSubmit={handleModalSubmit}>
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Student' : 'Edit Student'}</DialogTitle>
                            <DialogDescription>
                                {modalMode === 'create' ? 'Add a new student to the system.' : 'Update the student details.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                {errors.name && <span className="text-sm text-red-500">{errors.name}</span>}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    value={data.date_of_birth}
                                    onChange={(e) => setData('date_of_birth', e.target.value)}
                                />
                                {errors.date_of_birth && <span className="text-sm text-red-500">{errors.date_of_birth}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={data.gender} onValueChange={(val) => setData('gender', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.gender && <span className="text-sm text-red-500">{errors.gender}</span>}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="class">Class</Label>
                                <Input
                                    id="class"
                                    value={data.class}
                                    onChange={(e) => setData('class', e.target.value)}
                                />
                                {errors.class && <span className="text-sm text-red-500">{errors.class}</span>}
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="roll_number">Roll Number</Label>
                                <Input
                                    id="roll_number"
                                    value={data.roll_number}
                                    onChange={(e) => setData('roll_number', e.target.value)}
                                />
                                {errors.roll_number && <span className="text-sm text-red-500">{errors.roll_number}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="father_name">Father Name</Label>
                                <Input
                                    id="father_name"
                                    value={data.father_name}
                                    onChange={(e) => setData('father_name', e.target.value)}
                                />
                                {errors.father_name && <span className="text-sm text-red-500">{errors.father_name}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="guardian_phone">Guardian Phone</Label>
                                <Input
                                    id="guardian_phone"
                                    value={data.guardian_phone}
                                    onChange={(e) => setData('guardian_phone', e.target.value)}
                                />
                                {errors.guardian_phone && <span className="text-sm text-red-500">{errors.guardian_phone}</span>}
                            </div>
                            
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                {errors.address && <span className="text-sm text-red-500">{errors.address}</span>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={processing}>
                                {modalMode === 'create' ? 'Save' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button type="button" variant="destructive" disabled={processing} onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
