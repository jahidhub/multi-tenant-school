import { Head, useForm } from '@inertiajs/react';
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
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Badge } from '@/components/ui/badge';
import { Pagination } from '@/components/pagination';

interface StudentData {
    id: number;
    name: string;
}

interface CourseData {
    id: number;
    course_name: string;
}

interface EnrollmentData {
    id: number;
    student_id: number;
    course_id: number;
    enrollment_date: string;
    status: 'active' | 'inactive';
    student?: StudentData | null;
    course?: CourseData | null;
}

interface EnrollmentProps {
    enrollments: {
        data: EnrollmentData[];
        links: any[];
    };
    students: StudentData[];
    courses: CourseData[];
}

export default function Enrollment({ enrollments, students = [], courses = [] }: EnrollmentProps) {
    const enrollmentsList = enrollments?.data || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentData | null>(null);

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        course_id: '',
        enrollment_date: getTodayDate(),
        status: 'active',
    });

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedEnrollment(null);
        reset();
        setData({
            student_id: '',
            course_id: '',
            enrollment_date: getTodayDate(),
            status: 'active',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (enrollment: EnrollmentData) => {
        setModalMode('edit');
        setSelectedEnrollment(enrollment);
        setData({
            student_id: enrollment.student_id ? enrollment.student_id.toString() : '',
            course_id: enrollment.course_id ? enrollment.course_id.toString() : '',
            enrollment_date: enrollment.enrollment_date || getTodayDate(),
            status: enrollment.status || 'active',
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const openDeleteModal = (enrollment: EnrollmentData) => {
        setSelectedEnrollment(enrollment);
        setIsDeleteOpen(true);
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/enrollment/store', {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            put(`/enrollment/${selectedEnrollment?.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (selectedEnrollment?.id) {
            destroy(`/enrollment/${selectedEnrollment.id}`, {
                onSuccess: () => {
                    setIsDeleteOpen(false);
                    setSelectedEnrollment(null);
                },
            });
        }
    };

    return (
        <>
            <Head title="Enrollment" />
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
                                    <BreadcrumbPage>Enrollment</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <Button onClick={openCreateModal}>
                            Add Enrollment
                        </Button>
                    </div>
                </div>

                <div className="enrollment-table">
                    <Card>
                        <CardHeader>Enrollment</CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Course Name</TableHead>
                                        <TableHead>Enrollment Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="flex justify-end">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enrollmentsList && enrollmentsList.length > 0 ? (
                                        enrollmentsList.map((enrollment: EnrollmentData, index: number) => (
                                            <TableRow key={enrollment.id}>
                                                <TableCell>
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </TableCell>
                                                <TableCell>
                                                    {enrollment.student ? enrollment.student.name : <span className="text-muted-foreground italic">No Student</span>}
                                                </TableCell>
                                                <TableCell>
                                                    {enrollment.course ? enrollment.course.course_name : <span className="text-muted-foreground italic">No Course</span>}
                                                </TableCell>
                                                <TableCell>
                                                    {enrollment.enrollment_date}
                                                </TableCell>
                                                <TableCell>
                                                    {enrollment.status === 'active' ? (
                                                        <span 
                                                            style={{ backgroundColor: '#16a34a', color: '#ffffff' }}
                                                            className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium"
                                                        >
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span 
                                                            style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                                                            className="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium"
                                                        >
                                                            Inactive
                                                        </span>
                                                    )}
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
                                                                <DropdownMenuItem onClick={() => openEditModal(enrollment)}>
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => openDeleteModal(enrollment)}>
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
                                                colSpan={6}
                                                className="text-center text-muted-foreground py-8"
                                            >
                                                No enrollments found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <Pagination links={enrollments.links} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleModalSubmit}>
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'create' ? 'Add Enrollment' : 'Edit Enrollment'}</DialogTitle>
                            <DialogDescription>
                                {modalMode === 'create' ? 'Create a new enrollment by selecting a student and course.' : 'Update the enrollment details.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="student_id">Student</Label>
                                <Select
                                    value={data.student_id}
                                    onValueChange={(val) => setData('student_id', val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {students.map((student) => (
                                            <SelectItem key={student.id} value={student.id.toString()}>
                                                {student.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.student_id && <span className="text-sm text-red-500">{errors.student_id}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="course_id">Course</Label>
                                <Select
                                    value={data.course_id}
                                    onValueChange={(val) => setData('course_id', val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.course_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && <span className="text-sm text-red-500">{errors.course_id}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="enrollment_date">Enrollment Date</Label>
                                <Input
                                    id="enrollment_date"
                                    type="date"
                                    value={data.enrollment_date}
                                    onChange={(e) => setData('enrollment_date', e.target.value)}
                                    required
                                />
                                {errors.enrollment_date && <span className="text-sm text-red-500">{errors.enrollment_date}</span>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(val) => setData('status', val)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && <span className="text-sm text-red-500">{errors.status}</span>}
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
                            Are you sure you want to delete this enrollment? This action cannot be undone.
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

Enrollment.layout = {
    breadcrumbs: [
        {
            title: 'Enrollment',
            href: '/enrollments',
        },
    ],
};
